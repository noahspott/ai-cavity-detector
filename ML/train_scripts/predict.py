import torch
from PIL import Image
from copy import deepcopy
from ultralytics import YOLO
from ultralytics.utils.plotting import Annotator, colors

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


def plot(
    disease_result,
    enum_result,
    line_width=4,
    font_size=2,
    font='Arial.ttf',
    pil=False,
    ):

    # Check if orig_img is in tensor format
    if isinstance(disease_result.orig_img, torch.Tensor):
        img = (disease_result.orig_img[0].detach().permute(1, 2, 0).contiguous() * 255).to(torch.uint8).cpu().numpy()

    # Names and labels for disease
    disease_names = disease_result.names
    disease_boxes = disease_result.boxes

    # Names and labels for tooth numbers
    enum_names = enum_result.names
    enum_boxes = enum_result.boxes

    annotator = Annotator(
        deepcopy(disease_result.orig_img),
        line_width,
        font_size,
        font,
        pil,
        example=disease_names)

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

        c, conf, id = int(highestIOU.cls), float(highestIOU.conf), None if highestIOU.id is None else int(highestIOU.id.item())
        should_detect.append(enum_names[c])
        disease_enum[c] = disease_names[int(box.cls)] + " - " + str(enum_names[c])
        print("Matched " + disease_names[int(box.cls)] + " to " + str(enum_names[c]) + " with IOU " + str(highest))
    
    # Plot Detect results
    for d in reversed(enum_boxes):
        c, conf, id = int(d.cls), float(d.conf), None if d.id is None else int(d.id.item())
        
        # Skip labeling this tooth if there is no disease detection on it
        if not (enum_names[c] in should_detect):
            continue

        name = ('' if id is None else f'id:{id} ') + disease_enum[c]
        label = (f'{name} ({conf:.2f})')
        annotator.box_label(d.xyxy.squeeze(), label, color=colors(c, True))
    
    return annotator.result()

def runPrediction(input):
    model_disease = YOLO('models/Disease_Model_3.pt')
    results_disease = model_disease(input, imgsz=1280, conf=0.5)

    model_enum = YOLO('models/Enumeration_Model.pt')
    results_enum = model_enum(input, imgsz=1280, conf=0.5)

    im_array = plot(results_disease[0], results_enum[0])

    im = Image.fromarray(im_array[..., ::-1])
    return im