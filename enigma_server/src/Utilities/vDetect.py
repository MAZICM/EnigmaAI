import cv2
from ultralytics import YOLO
import os
import time
from src.Utilities import log
from src.Utilities import flexMenu

def video_detect(video_path, model_name, weight_name, threshold):
    try:
        video_dir = os.path.join(os.getcwd(), 'runs', 'Videos')
        model_path = os.path.join(os.getcwd(), 'Train', model_name, 'weights', weight_name)

        log.logger.info("\nDetection START")
        start_time = time.time()

        filename = os.path.splitext(os.path.basename(video_path))[0]
        output_filename = f"{filename}-{model_name}-{weight_name}-{threshold}_out.mp4"
        output_folder = os.path.join('videoOutput')
        output_path = os.path.join(output_folder, output_filename)

        # Create the 'videoOutput' folder if it doesn't exist
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        cap = cv2.VideoCapture(video_path)
        ret, frame = cap.read()
        h, w, _ = frame.shape
        out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'MP4V'), int(cap.get(cv2.CAP_PROP_FPS)), (w, h))

        model = YOLO(model_path)

        while ret:
            results = model(frame)[0]
            for result in results.boxes.data.tolist():
                x1, y1, x2, y2, score, class_id = result
                if score > float(threshold):
                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 4)
                    cv2.putText(frame, results.names[int(class_id)].upper(), (int(x1), int(y1 - 10)),
                                cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3, cv2.LINE_AA)
            out.write(frame)
            ret, frame = cap.read()

        cap.release()
        out.release()
        cv2.destroyAllWindows()

        end_time = time.time()
        log.logger.info("\nNo errors occurred DONE SUCCESS\nExecution time: %.2f seconds", end_time - start_time)
        log.logger.info(f"\nOutput path: {output_path}")
        return output_path
    except Exception as e:
        end_time = time.time()
        log.logger.error(f"\nAn error occurred: {e}\nExecution time: %.2f seconds", end_time - start_time)
        return str(e), 500
