import socket
import pickle
import cv2
import datetime
import os
from ultralytics import YOLO
import argparse
import supervision as sv
from src.Utilities import flexMenu

def create_video_writer(video_cap, output_filename):
    # grab the width, height, and fps of the frames in the video stream.
    frame_width = int(video_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(video_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(video_cap.get(cv2.CAP_PROP_FPS))

    # initialize the FourCC and a video writer object
    fourcc = cv2.VideoWriter_fourcc(*'MP4V')
    writer = cv2.VideoWriter(output_filename, fourcc, fps, (frame_width, frame_height))

    return writer

def stream():
    current_time = datetime.datetime.now()
    desired_format = "%Y-%m-%d_%H-%M-%S_"
    formatted_time = current_time.strftime(desired_format)

    model_path = "./Train/"
    x = os.listdir(model_path)
    train = flexMenu.display_options(x)
    model_path = model_path + train + "/weights/"
    x = os.listdir(model_path)
    m = flexMenu.display_options(x)
    model_path = model_path + "/" + m
    m = m.rsplit(".", 1)[0]
    model = YOLO(model_path)

    cap = cv2.VideoCapture(0)  # Change the argument to the appropriate video source if needed
    detections_list = []

    while True:
        ret, frame = cap.read()
        results = model(frame)[0]
        detections = sv.Detections.from_ultralytics(results)

        # Process the detections and add them to the list
        detections_data = results.boxes.data.tolist()
        detections_list.append(detections_data)

        # Optionally, visualize the detections on the frame
        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = result
            if not detections.class_id.any() == 0:
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 4)
                class_name = results.names[int(class_id)].upper()
                cv2.putText(frame, class_name, (int(x1), int(y1 - 10)),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3, cv2.LINE_AA)

        # Display the frame (optional)
        cv2.imshow("yolov8", frame)

        if cv2.waitKey(30) == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

    return detections_list

def main():
    # Server configuration
    SERVER_IP = "10.200.6.17"
    SERVER_PORT = 12345

    # Create a socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((SERVER_IP, SERVER_PORT))
    server_socket.listen(5)
    print("Server listening on {}:{}".format(SERVER_IP, SERVER_PORT))

    while True:
        client_socket, client_address = server_socket.accept()
        print("Client connected: {}".format(client_address))

        # Process the video stream and get detection results
        detections = stream()

        # Send detection results back to the client
        detections_pickle = pickle.dumps(detections)
        client_socket.send(detections_pickle)

        client_socket.close()
        print("Detection results sent to client: {}".format(client_address))

if __name__ == "__main__":
    main()
