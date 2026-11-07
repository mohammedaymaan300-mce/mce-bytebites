import cv2
import numpy as np
from ultralytics import YOLO

# Load a lightweight pre-trained YOLOv8 model (detects people, chairs, etc.)
model = YOLO("yolov8n.pt")

# Connect to your webcam (use 0 for laptop webcam, or replace with your camera's RTSP stream URL later)
cap = cv2.VideoCapture(0)

print("Starting AI Monitoring... Press 'q' to quit.")

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("Ignoring empty camera frame.")
        break

    # Run YOLOv8 object detection on the frame
    results = model(frame, stream=True)

    # Process results
    for r in results:
        boxes = r.boxes
        for box in boxes:
            # Get class name (e.g., 'person', 'chair', etc.)
            cls_id = int(box.cls[0])
            class_name = model.names[cls_id]
            conf = float(box.conf[0])

            # Filter for people or specific objects you want to track
            if class_name == 'person' and conf > 0.5:
                # Get coordinates
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                
                # Draw bounding box and label on the video feed
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                cv2.putText(frame, f"Occupied / Person ({conf:.2f})", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

    # Display the live annotated video window
    cv2.imshow("AI Hotel/Table Monitor - Live", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()