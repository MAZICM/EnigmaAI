import socket
import cv2
import pickle
import struct

SERVER_IP = "SERVER_IP_ADDRESS"  # Replace with the server's IP address
SERVER_PORT = 12345  # Use the same port number as the server

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((SERVER_IP, SERVER_PORT))

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    # Serialize the frame
    frame_data = pickle.dumps(frame)
    frame_size = struct.pack(">L", len(frame_data))

    # Send frame size and frame data to the server
    client_socket.sendall(frame_size + frame_data)

    # Receive detected objects from the server
    data = b""
    payload_size = struct.calcsize(">L")
    while len(data) < payload_size:
        data += client_socket.recv(4096)

    packed_msg_size = data[:payload_size]
    data = data[payload_size:]
    msg_size = struct.unpack(">L", packed_msg_size)[0]

    while len(data) < msg_size:
        data += client_socket.recv(4096)

    detected_objects = pickle.loads(data)

    # Draw detected objects on the frame
    for obj in detected_objects:
        label = obj["label"]
        confidence = obj["confidence"]
        x, y, width, height = obj["x"], obj["y"], obj["width"], obj["height"]
        cv2.rectangle(frame, (x, y), (x + width, y + height), (0, 255, 0), 2)
        cv2.putText(frame, f"{label} ({confidence:.2f})", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    # Display the frame with detected objects
    cv2.imshow("Client", frame)

    # Press 'q' to quit the client
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
client_socket.close()
