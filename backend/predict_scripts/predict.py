import base64
from io import BytesIO
from PIL import Image
from ultralytics import YOLO

def bb_intersection_over_union(boxA, boxB):
    # determine the (x, y)-coordinates of the intersection rectangle
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    # compute the area of intersection rectangle
    interArea = abs(max((xB - xA, 0)) * max((yB - yA), 0))
    if interArea == 0:
        return 0
    # compute the area of both the prediction and ground-truth
    # rectangles
    boxAArea = abs((boxA[2] - boxA[0]) * (boxA[3] - boxA[1]))
    boxBArea = abs((boxB[2] - boxB[0]) * (boxB[3] - boxB[1]))

    # compute the intersection over union by taking the intersection
    # area and dividing it by the sum of prediction + ground-truth
    # areas - the interesection area
    iou = interArea / float(boxAArea + boxBArea - interArea)

    # return the intersection over union value
    return iou


def generate_results(
    image,
    disease_result,
    enum_result,
    ):

    # Names and labels for disease
    disease_names = disease_result.names
    disease_boxes = disease_result.boxes

    # Names and labels for tooth numbers
    enum_names = enum_result.names
    enum_boxes = enum_result.boxes

    results = {
        'disease_classes' : disease_names,
        'tooth_classes'   : enum_names,
        'detections'      : []
    }

    # List of tooth numbers that we want to actually show in detection
    should_detect = []
    disease_enum = {}

    # For each diseased tooth, compute IOU against enumeration so we can classify it to a specific tooth number
    for box in disease_boxes:
        highest = 0
        highestIOU = None
        for box2 in enum_boxes:
            val = bb_intersection_over_union(box.xyxy[0].tolist(), box2.xyxy[0].tolist())
            if val > highest:
                highest = val
                highestIOU = box2

        c, conf = int(highestIOU.cls), float(highestIOU.conf)
        should_detect.append(enum_names[c])

        disease_enum[c] = {
            'disease' : disease_names[int(box.cls)],
            'enum' : str(enum_names[c])
        }

        print("Matched " + disease_names[int(box.cls)] + " to " + str(enum_names[c]) + " with IOU " + str(highest))
    
    # Plot Detect results
    for d in reversed(enum_boxes):
        c, conf = int(d.cls), float(d.conf)
        
        # Skip labeling this tooth if there is no disease detection on it
        if not (enum_names[c] in should_detect):
            continue
            
        bbox_list = d.xywh.tolist()[0]

        results['detections'].append({
            'disease'   : disease_enum[c]['disease'],
            'tooth'     : disease_enum[c]['enum'],
            'confidence': conf,
            'coordinates' : {
                'x'         : bbox_list[0],
                'y'         : bbox_list[1],
                'width'     : bbox_list[2],
                'height'    : bbox_list[3]
            }
        })

    return results

def runPrediction(input):
    model_disease = YOLO('ML/models/Disease_Model_3.pt')
    results_disease = model_disease(input, imgsz=1280, conf=0.5)[0]

    model_enum = YOLO('ML/models/Enumeration_Model.pt')
    results_enum = model_enum(input, imgsz=1280, conf=0.5)[0]

    return generate_results(input, results_disease, results_enum)