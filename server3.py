import socket
from src.Utilities import roboFlowDataSet, vDetect, sDetect, modelValid, modelTrain, rTrain
import logging
from src.Utilities.log import ColoredFormatter, Colors

# Configure the server logger
server_logger = logging.getLogger(__name__)
server_handler = logging.StreamHandler()
server_handler.setFormatter(ColoredFormatter())
server_logger.addHandler(server_handler)

def handle_request(request):
    if request == "download_dataset":
        roboFlowDataSet.roboflow_dataset()
        return "Dataset downloaded successfully."
    elif request == "train":
        modelTrain.m_train()
        return "Training completed successfully."
    elif request == "resume_train":
        rTrain.r_train()
        return "Resume training completed successfully."
    elif request == "valid":
        modelValid.m_valid()
        return "Validation completed successfully."
    elif request == "live_test":
        sDetect.stream()
        return "Live test completed successfully."
    elif request == "video_detect":
        vDetect.video_detect()
        return "Video detection completed successfully."
    elif request == "quit":
        return "Quitting the server."
    else:
        return "Invalid request."

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('0.0.0.0', 12345))  # Use any available port
    server_socket.listen(1)

    server_logger.info("Server listening for incoming connections...")

    while True:
        client_socket, client_address = server_socket.accept()
        server_logger.info(f"Connection established with {client_address}")

        try:
            request = client_socket.recv(1024).decode()
            response = handle_request(request)
            client_socket.send(response.encode())
        except Exception as e:
            server_logger.error(f"Error: {e}")
        finally:
            client_socket.close()

if __name__ == "__main__":
    start_server()
