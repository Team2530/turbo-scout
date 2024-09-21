"""
turbo-qr

This is a script for quickly storing QR code data.

Requirements: python 3, opencv2, a camera
"""

import time
import os
import hashlib

import cv2

capture = cv2.VideoCapture(0)
detector = cv2.QRCodeDetector()

os.makedirs("./qr", exist_ok=True)

while True:
    _, image = capture.read()
    data, bbox, _ = detector.detectAndDecode(image)

    if data:
        #TODO: Instead of saving all received QR data to the 'qr' folder, 
        #      output it in the proper turbo_server folder.
        with open(f"qr/scan-{time.time()}.json", "w") as fp:
            fp.write(data)

            # The hash can be used to manually verify that the data transferred.
            print("Data saved (hash=%s)" % hashlib.md5(data.encode('utf-8')).hexdigest())
        break
