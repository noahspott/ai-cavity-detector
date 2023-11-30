import cv2
import numpy as np
import argparse
import os
from skimage.draw import polygon
import itertools
import json
from matplotlib.path import Path

parser = argparse.ArgumentParser()
parser.add_argument('--input', dest='input', type=str, help='Specify input location of images')
parser.add_argument('--output', dest='output', type=str, help='Specify output location of images')
parser.add_argument('--annotations', dest='annotations', type=str, help='Specify location of annotations JSON file')
args = parser.parse_args()

# Open JSON file
f = open(args.annotations)

# Parse JSON into an object we can use
data = json.load(f)

# Keep training data consistent, resize to the average size of all samples in the data
average_width = 0
average_height = 0

for j in data["images"]:
	# Read Image
	img = cv2.imread(args.input + "\\xrays\\" + j["file_name"])

	print("Adding [" + args.input + "\\xrays\\" + j["file_name"] + "]")

	# Add to x, y
	average_width = average_width + img.shape[1]
	average_height = average_height + img.shape[0]

average_width = int(average_width / len(data["images"]))
average_height = int(average_height / len(data["images"]))

print("Average Width: " + str(average_width))
print("Average Height: " + str(average_height))

for j in data["images"]:
	# Read Image
	img = cv2.imread(args.input + "\\xrays\\" + j["file_name"])

	# Resize to average so we have a consistent dataset
	print("Resizing to width: " + str(average_width) + " and height: " + str(average_height))
	img = cv2.resize(img, (average_width, average_height))

	# DEBUG ONLY -- REMOVE ME
	cv2.imwrite(args.input + "\\resized\\" + j["file_name"] + "_resized.png", img)

	# Create black mask with same size as img
	mask = np.zeros((img.shape[0], img.shape[1]),dtype=np.uint8)

	# MT: TODO: Debug Only
	img_changed = False

	# For each provided annotation
	for i in data["annotations"]:

		# Check if this annotation is relevant to the current image
		if(i["image_id"] == j["id"]):

			# For each segmentation entry, generate a polygon mask
			for s in i["segmentation"]:
				# Use list comprehension to make the 2D list into pairs of two
				pairs = [(s[i], s[i + 1]) for i in range(0, len(s), 2)]

				# Define the vertices of a polygon
				polygon_vertices = np.array(pairs)

				# MT: TODO: Debug Only
				img_changed = True

				print("Applying mask to: " + str(i["image_id"]))

			
				# Green if diagnosis is caries
				if (i["category_id_3"] == 0):
					col = (1)

				# Blue if impacted
				if (i["category_id_3"] == 1):
					col = (2)
				
				# Red if diagnosis is periapical lesions
				if (i["category_id_3"] == 2):
					col = (3)

				# White if diagnosis is deep caries
				if (i["category_id_3"] == 3):
					col = (4)

				# Draw filled polygons
				cv2.fillPoly(mask, np.int32([polygon_vertices]), col)

	if img_changed:
		cv2.imwrite(args.input + "\\masks\\" + j["file_name"] + "_mask.png", mask)