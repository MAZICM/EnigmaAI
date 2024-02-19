from roboflow import Roboflow
import time
import os
import sys

def roboflow_dataset(api_key, workspace, project, version, download):
    start_time = time.time()

    try:
        print("\nDOWNLOAD START")
        print("\n")
        current_directory = os.getcwd()
        print("Current Working Directory:", current_directory)
        os.chdir("src")
        new_directory_path = "./datasets"
        # Check if the directory was created
        if os.path.exists(new_directory_path):
            print(f"Directory '{new_directory_path}' created successfully.")
        else:
            os.makedirs(new_directory_path, exist_ok=True)
        os.chdir("./datasets/")
        start_time = time.time()

        rf = Roboflow(api_key=api_key)
        project = rf.workspace(workspace).project(project)
        dataset = project.version(version).download(download)

    except Exception as e:
        end_time = time.time()
        print(f"\nAn error occurred: {e}\nExecution time: %.2f seconds", end_time - start_time)
        sys.exit(1)
    else:
        end_time = time.time()
        print("\nNo errors occurred DONE SUCCESS\nExecution time: %.2f seconds", end_time - start_time)
    finally:
        print("\nDatasetDownload EXIT\n")
        os.chdir("../../")

# Uncomment the following lines if you want to run the script standalone
# api_key = input("Enter your API_key: ")
# workspace = input("Enter your workspace: ")
# project = input("Enter your project: ")
# version = input("Enter your version: ")
# download = input("Enter your Download: ")
# roboflow_dataset(api_key, workspace, project, version, download)
