import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from src.Utilities.roboFlowDataSet import roboflow_dataset
from src.Utilities.modelTrain import m_train  # Import your training function

app = Flask(__name__)
CORS(app)

# Assume datasets are located in the 'src/datasets' directory
dataset_path = os.path.join(os.getcwd(), 'src', 'datasets')

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

if __name__ == '__main__':
    app.run(debug=True, port=5001, threaded=True)
