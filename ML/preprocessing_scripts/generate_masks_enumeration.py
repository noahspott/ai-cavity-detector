# Name: 	Mask Image Generator
# Author: 	Mason Ticehurst
# Purpose: 	CPMSC445 : Final Project

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

	# Create black mask with same size as img
	mask = np.zeros((img.shape[0], img.shape[1]),dtype=np.uint8)

	# MT: TODO: Debug Only
	img_changed = False

	# For each provided annotation
	for i in data["annotations"]:

		# Make sure this annotation does have categories that are above range, ignore if so
		if (i["category_id_1"] > 3 or i["category_id_2"] > 7):
			continue

		# Make sure this annotation does have categories that are below range, ignore if so
		if (i["category_id_1"] < 0 or i["category_id_2"] < 0):
			continue

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

				# category_id_1 is the quadrant (4 possible quadrants)
				# category_id_2 is the tooth in said quadrant (8 possible teeth per quadrant)

				toothNumber = -1

				# calculation for 4th quadrant (category_id_1 == 3)
				if (i["category_id_1"] == 3):
					toothNumber = 32 - (8 - i["category_id_2"] - 1)

				# calculation for 3rd quadrant (category_id_1 == 2)
				if (i["category_id_1"] == 2):
					toothNumber = 24 - i["category_id_2"]

				# calculation for 2nd quadrant (category_id_1 == 1)
				if (i["category_id_1"] == 1):
					toothNumber = 8 + i["category_id_2"] + 1

				# calculation for 1st quadrant (category_id_1 == 0)
				if (i["category_id_1"] == 0):
					toothNumber = 8 - i["category_id_2"]

				# Draw filled polygons
				cv2.fillPoly(mask, np.int32([polygon_vertices]), (toothNumber))

	if img_changed:
		# Resize to average so we have a consistent dataset
		img = cv2.resize(img, (average_width, average_height))
		mask = cv2.resize(mask, (average_width, average_height))

		# DEBUG ONLY -- REMOVE ME
		cv2.imwrite(args.input + "\\resized\\" + j["file_name"] + ".tif", img)
		cv2.imwrite(args.input + "\\masks\\" + j["file_name"] + ".tif", mask)