import time
from ultralytics import YOLO
from src.Utilities import log
from src.Utilities import flexMenu
import os

def m_valid(selectedTraining, selectedWeight):
    try:
        weights_path = os.path.join("Train", selectedTraining, "weights", selectedWeight)
        mod = os.path.abspath(weights_path)
        filename = selectedWeight.rsplit(".", 1)[0]
        name2 = f"{selectedTraining}_eval_{filename}"
        log.logger.info("\nValidation START")
        print("")
        start_time = time.time()
        
        model = YOLO(mod)
        results = model.val(project="Vaild", name=name2)

        end_time = time.time()
        log.logger.info("\nNo errors occurred DONE SUCCESS\nExecution time: %.2f seconds", end_time - start_time)
    except Exception as e:
        # Code to handle other exceptions
        end_time = time.time()
        log.logger.error(f"\nAn error occurred: {e}\nExecution time: %.2f seconds", end_time - start_time)
    finally:
        # Code that will run regardless of whether an exception occurred
        log.logger.warning("\nValidation EXIT\n")

# Run validation using command line arguments if this script is executed directly
if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python modelValid.py <selectedTraining> <selectedWeight>")
    else:
        m_valid(sys.argv[1], sys.argv[2])
