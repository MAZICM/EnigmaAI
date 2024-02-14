import os
import time
import torch

from ultralytics import YOLO
from src.Utilities import log

def m_train(model_name, dataset_name, epochs, imgsz, workers):
    start_time = time.time()
    try:
        # Set device based on GPU availability
        device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

        # Define model paths
        model_dir = os.path.join(os.getcwd(), 'src', 'yolov8DefaultModels')
        model_path = os.path.join(model_dir, model_name)

        # Define data path
        data_path = os.path.join(os.getcwd(), 'src', 'datasets', dataset_name, 'data.yaml')

        # Map model_name to its corresponding letter
        model_mapping = {'yolov8n.pt': 'n', 'yolov8s.pt': 's', 'yolov8m.pt': 'm', 'yolov8l.pt': 'l', 'yolov8x.pt': 'x'}
        m = model_mapping.get(model_name, '')

        # Set project name
        project = "Train"

        # Define a unique name for this training run
        name = f'train-e{epochs}-i{imgsz}-w{workers}-v8{m}'

        # Initialize YOLO model
        model = YOLO(model_path)

        # Log training start
        log.logger.info('\nTraining START')
        print('\n')

        # Start training
        model.train(data=data_path, epochs=epochs, imgsz=imgsz, device=device,
                    workers=workers, project=project, name=name, show_labels=True,
                    lr0=0.1)

    except Exception as e:
        # Handle exceptions
        end_time = time.time()
        log.logger.error(f'\nAn error occurred: {e}\nExecution time: %.2f seconds', end_time - start_time)
    else:
        # Log success if no exceptions occurred
        end_time = time.time()
        log.logger.info('\nNo errors occurred. DONE SUCCESS\nExecution time: %.2f seconds', end_time - start_time)
    finally:
        # Log training exit
        log.logger.critical('\nTraining EXIT')
        print('\n')
