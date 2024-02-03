import socket
import pickle
import cv2
import numpy as np
from ultralytics import YOLO
import supervision as sv
from src.Utilities import flexMenu
import os

def main():
    # Server configuration
    SERVER_IP = "10.200.6.17"
    SERVER_PORT = 12345

    # Create a socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((SERVER_IP, SERVER_PORT))
    server_socket.listen(5)
    print("Server listening on {}:{}".format(SERVER_IP, SERVER_PORT))

    # Load YOLO model
    model_path = "./Train/"
    x = os.listdir(model_path)
    train = flexMenu.display_options(x)
    model_path = model_path + train + "/weights/"
    x = os.listdir(model_path)
    m = flexMenu.display_options(x)
    model_path = model_path + "/" + m
    m = m.rsplit(".", 1)[0]
    model = YOLO(model_path)

    while True:
        print("Waiting for client connection...")
        client_socket, client_address = server_socket.accept()
        print("Client connected: {}".format(client_address))

        # Receive frames from the client
        frames_data = b''
        while True:
            frame_chunk = client_socket.recv(4096)
            if not frame_chunk:
                break
            frames_data += frame_chunk

        # Deserialize frames and process them using YOLO
        frames = pickle.loads(frames_data)
        detections_list = []
        for frame in frames:
            np_frame = np.frombuffer(frame, dtype=np.uint8)
            decoded_frame = cv2.imdecode(np_frame, cv2.IMREAD_COLOR)
            results = model(decoded_frame)[0]
            detections = sv.Detections.from_ultralytics(results)
            detections_data = results.boxes.data.tolist()
            detections_list.append(detections_data)

        # Send detection results back to the client
        detections_pickle = pickle.dumps(detections_list)
        client_socket.send(detections_pickle)

        client_socket.close()
        print("Detection results sent to client: {}".format(client_address))

if __name__ == "__main__":
    main()
