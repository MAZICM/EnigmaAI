import socket
import pickle
import struct
from src.Utilities import features

# Create a socket object
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Get the local machine name and port number
host = socket.gethostname()
port = 12345

# Bind the socket to a specific address and port
server_socket.bind((host, port))

# Listen for incoming connections
server_socket.listen(5)

print("Server listening on {}:{}".format(host, port))

# Accept a client connection
client_socket, addr = server_socket.accept()
print("Connection from {}".format(addr))

while True:
    # Receive the client's choice
    choice = client_socket.recv(1024).decode('utf-8')
    
    # Perform corresponding action based on the choice
    if choice == '1':
        response = features.get_dataset()
    elif choice == '2':
        response = features.train()
    elif choice == '4':
        response = features.valid()
    elif choice == '5':
        response = features.stream()
    elif choice == '6':
        response = features.video_detect()
    elif choice == '3':
        response = features.resume_train()
    elif choice == '7':
        response = "\nThank you for Running me! Good bye! :)\n"
        client_socket.sendall(response.encode('utf-8'))
        break
    else:
        response = "\nInvalid choice. Please select a valid option!\n"

    # Send the response back to the client
    client_socket.sendall(response.encode('utf-8'))

# Close the connection
client_socket.close()
