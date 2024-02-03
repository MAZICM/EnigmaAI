import socket
import cv2
import pickle
import struct
from ultralytics import YOLO
import supervision as sv

SERVER_IP = "0.0.0.0"  # Listen on all available interfaces
SERVER_PORT = 12345  # Choose a port number

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((SERVER_IP, SERVER_PORT))
server_socket.listen(1)  # Listen for only 1 incoming connection

print("Server listening on {}:{}".format(SERVER_IP, SERVER_PORT))


client_socket, addr = server_socket.accept()
print("Connection established with {}".format(addr))

def perform_object_detection(frame):
    # Initialize YOLO model (Make sure to provide the correct model path)
    model_path = "./Train/train-e20-i256-w8-v8n/weights/best.pt"
    model = YOLO(model_path)

    # Perform object detection
    results = model(frame)[0]
    detections = sv.Detections.from_ultralytics(results)
    detected_objects = []

    for result in results.boxes.data.tolist():
        x1, y1, x2, y2, score, class_id = result
        if not detections.class_id.any() == 0:
            class_name = results.names[int(class_id)].upper()
            detected_objects.append({
                "label": class_name,
                "confidence": score,
                "x": int(x1),
                "y": int(y1),
                "width": int(x2 - x1),
                "height": int(y2 - y1)
            })

    return detected_objects

while True:
    # Receive frame size and frame data
    data = b""
    payload_size = struct.calcsize(">L")
    while len(data) < payload_size:
        data += client_socket.recv(4096)

    packed_msg_size = data[:payload_size]
    data = data[payload_size:]
    msg_size = struct.unpack(">L", packed_msg_size)[0]

    while len(data) < msg_size:
        data += client_socket.recv(4096)

    frame_data = data[:msg_size]

    # Deserialize the frame
    frame = pickle.loads(frame_data, fix_imports=True, encoding="bytes")

    # Perform object detection on the received frame
    detected_objects = perform_object_detection(frame)

    # Send back the detected_objects to the client
    client_socket.send(pickle.dumps(detected_objects))

# Close the connection with the client
client_socket.close()

server_socket.close()
