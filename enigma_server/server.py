import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from src.Utilities.roboFlowDataSet import roboflow_dataset
from src.Utilities.modelTrain import m_train  # Import your training function
from src.Utilities.modelValid import m_valid
from src.Utilities.vDetect import video_detect

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

dataset_path = os.path.join(os.getcwd(), 'src', 'datasets')
TmodelsPath = os.path.join(os.getcwd(), 'Train')

@app.route('/run_python_script', methods=['POST'])
def run_python_script():
    data = request.get_json()
    script_path = data.get('script_path', '')
    args = data.get('args', [])

    if not script_path:
        return jsonify({"result": None, "error": "Script path not provided"}), 400

    try:
        if script_path.endswith('roboFlowDataSet.py'):
            roboflow_dataset(*args)
        elif script_path.endswith('modelTrain.py'):
            m_train(*args)
        elif script_path.endswith('modelValid.py'):
            m_valid(*args)
        elif script_path.endswith('modelValid.py'):
            video_detect(*args)   
        else:
            return jsonify({"result": None, "error": "Invalid script path"}), 400

        return jsonify({"result": "Success", "error": None}), 200
    except Exception as e:
        return jsonify({"result": None, "error": str(e)}), 500

@app.route('/get_datasets', methods=['GET'])
def get_datasets():
    try:
        datasets = os.listdir(dataset_path)
        return jsonify({"datasets": datasets})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_T-Models', methods=['GET'])
def get_Trained_models():
    try:
        Tmodels = os.listdir(TmodelsPath)
        return jsonify({"Tmodels": Tmodels})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_weights/<training>', methods=['GET'])
def get_weights(training):
    try:
        weights_path = os.path.join(TmodelsPath, training, 'weights')
        weights = os.listdir(weights_path)
        return jsonify({"weights": weights})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/upload_video', methods=['POST'])
def upload_video():
    try:
        # Handle video upload logic here and return the video URL
        # For simplicity, let's assume you have a video folder in the project root
        video_folder = os.path.join(os.getcwd(), 'videosUploads')
        if not os.path.exists(video_folder):
            os.makedirs(video_folder)

        uploaded_video = request.files['video']
        video_path = os.path.join(video_folder, uploaded_video.filename)
        uploaded_video.save(video_path)

        return jsonify({"videoUrl": video_path})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/run_video_test', methods=['POST'])
def run_video_test():
    try:
        data = request.get_json()
        video_url = data.get('videoUrl', '')
        training = data.get('training', '')
        weight = data.get('weight', '')
        threshold = data.get('threshold', 0.5)

        # Run the video detection script
        result_url = video_detect(video_url, training, weight, threshold)

        return jsonify({"resultUrl": result_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001, threaded=True)
