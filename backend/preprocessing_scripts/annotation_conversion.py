import shutil
import json
import os
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--input', dest='input', type=str, help='Specify input location of images')
parser.add_argument('--output', dest='output', type=str, help='Specify output location of labels / pre-processed images')
parser.add_argument('--annotations', dest='annotations', type=str, help='Specify location of annotations JSON file')
args = parser.parse_args()
    
categories = [
    {"id": 0, "name": "Impacted", "supercategory": "Impacted"},
    {"id": 1, "name": "Caries", "supercategory": "Caries"},
    {"id": 2, "name": "Periapical Lesion", "supercategory": "Periapical Lesion"},
    {"id": 3, "name": "Deep Caries", "supercategory": "Deep Caries"},
]

# Helper function to convert box from
# coco format to a normalized yolo format (x, y, w, h) between 0-1
def normalizeToYOLO(img_size, bbox):
    
    # Normalize image size
    dw = 1.0 / (img_size[0])
    dh = 1.0 / (img_size[1])

    # Format is (x, y, w, h) so add W to X and add H to Y to get the opposite corner of bbox
    cx = bbox[0] + bbox[2] / 2.0
    cy = bbox[1] + bbox[3] / 2.0
    w = bbox[2]
    h = bbox[3]

    # normalize (rescale to be between 0-1)
    cx = round(cx * dw, 8)
    w = round(w * dw, 8)
    cy = round(cy * dh, 8)
    h = round(h * dh, 8)

    return (cx, cy, w, h)

def generateCOCOAnnotations():

    dataset_json = json.load(open(args.annotations))

    for annotation in dataset_json["annotations"]:
        
        # extract disease label from quadrant_enumeration_disease label
        annotation["category_id"] = annotation["category_id_3"]

        # Get rid of irrelevant labels since we don't need them for disease detection
        annotation.pop("category_id_1")
        annotation.pop("category_id_2")
        annotation.pop("category_id_3")

    output = {
        "images":       dataset_json["images"],
        "annotations":  dataset_json["annotations"],
        "categories":   categories,
    }

    # Move xray images into train set
    shutil.copytree(
        args.input + "\\xrays",
        args.output + "\\coco\\train2017",
    )

    # Move xray images into val set
    shutil.copytree(
        args.input + "\\xrays",
        args.output + "\\coco\\val2017",
    )

    json.dump(output, open(args.output + "\\coco\\instances_train2017.json", "w"), indent=4)
    json.dump(output, open(args.output + "\\coco\\instances_val2017.json", "w"), indent=4)

def generateYOLOAnnotations():
    dataset_json = json.load(open(args.output + "\\coco\\instances_train2017.json"))

    coco_image_dir = args.output + "\\coco\\train2017"

    yolo_image_dir_train = args.output + "\\yolo\\images\\train2017"
    yolo_image_dir_val = args.output + "\\yolo\\images\\val2017"
    yolo_label_dir_train = args.output + "\\yolo\\labels\\train2017"
    yolo_label_dir_val = args.output + "\\yolo\\labels\\val2017"

    os.makedirs(yolo_image_dir_train, exist_ok=True)
    os.makedirs(yolo_image_dir_val, exist_ok=True)
    os.makedirs(yolo_label_dir_train, exist_ok=True)
    os.makedirs(yolo_label_dir_val, exist_ok=True)

    category_names = [
        "Impacted",
        "Caries",
        "Periapical Lesion",
        "Deep Caries",
    ]

    # Create categories file required for YOLO, each class label on its own line
    with open(f"{yolo_label_dir_train}/classes.txt", "w") as f:
        f.write("\n".join(category_names))

    # Copy categories file to both train and validation sets
    shutil.copy(
        f"{yolo_label_dir_train}\\classes.txt",
        f"{yolo_label_dir_val}\\classes.txt",
    )

    # For all images in the annotations list
    for image in dataset_json["images"]:
        image_filename = image["file_name"]

        # Copy image from coco training data to yolo training data
        shutil.copy(
            f"{coco_image_dir}\\{image_filename}",
            f"{yolo_image_dir_train}\\{image_filename}",
        )

        # Copy image from coco validation data to yolo validation data
        shutil.copy(
            f"{coco_image_dir}\\{image_filename}",
            f"{yolo_image_dir_val}\\{image_filename}",
        )

        # Create label file with identical name to image but with .txt
        label_filename = image_filename[:-4] + ".txt"

        # Open new label file
        with open(f"{yolo_label_dir_train}\\{label_filename}", "w") as f:
            # Add annotations on each line
            for annotation in dataset_json["annotations"]:
                if annotation["image_id"] == image["id"]:
                    box = annotation["bbox"]
                    box = normalizeToYOLO((image["width"], image["height"]), box)
                    f.write(f"{annotation['category_id']} {' '.join(map(str, box))}\n")

        # Duplicate label in train and val set
        shutil.copy(
            f"{yolo_label_dir_train}\\{label_filename}",
            f"{yolo_label_dir_val}\\{label_filename}",
        )


if __name__ == "__main__":
    # Generate COCO annotations
    generateCOCOAnnotations()
    
    # Generate YOLO annotations
    generateYOLOAnnotations()