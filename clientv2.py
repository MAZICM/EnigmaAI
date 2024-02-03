import socket
import pickle
import cv2
import struct

def send_frames_to_server(server_ip, server_port):
    # Create a socket
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((server_ip, server_port))

    # Open a connection to the webcam (assuming the default camera index is 0)
    cap = cv2.VideoCapture(0)

    while True:
        # Capture a frame from the webcam
        ret, frame = cap.read()

        # Serialize the frame
        frame_data = cv2.imencode('.jpg', frame)[1].tobytes()
        frame_size = struct.pack("!I", len(frame_data))  # Pack frame size as 4 bytes unsigned int (network byte order)

        # Send frame size and serialized frame to the server
        client_socket.sendall(frame_size + frame_data)

        # Receive detection results size from the server
        detections_size = client_socket.recv(4)  # Assuming detection results size is sent as a 4-byte integer
        detections_size = struct.unpack("!I", detections_size)[0]  # Unpack detection results size

        # Receive detection results data from the server
        detections_data = client_socket.recv(detections_size)

        # Deserialize the detection results
        detections = pickle.loads(detections_data)

        # Process detection results (example: print bounding box coordinates)
        for detection in detections:
            print("Detection:", detection)

        # Optionally, display the frame with detections (uncomment the following lines)
        for detection in detections:
            x1, y1, x2, y2, score, class_id = detection
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        cv2.imshow("Detections", frame)

        # Press 'q' to exit the loop and close the window
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the camera and close OpenCV windows
    cap.release()
    cv2.destroyAllWindows()

    # Close the client socket connection
    client_socket.close()

if __name__ == "__main__":
    SERVER_IP = "10.200.6.17"  # Update with the server's IP address
    SERVER_PORT = 12345  # Update with the server's port number
    send_frames_to_server(SERVER_IP, SERVER_PORT)
