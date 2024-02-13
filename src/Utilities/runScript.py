import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS
from roboFlowDataSet import roboflow_dataset  # Replace 'your_module' with the actual module name

app = Flask(__name__)
CORS(app)

@app.route('/run_python_script', methods=['POST'])
def run_python_script():
    data = request.get_json()
    script_path = data.get('script_path', '')
    args = data.get('args', [])

    if not script_path:
        return jsonify({"result": None, "error": "Script path not provided"}), 400

    try:
        # Call the roboflow_dataset function with the provided parameters
        roboflow_dataset(*args)

        return jsonify({"result": "Success", "error": None}), 200
    except Exception as e:
        return jsonify({"result": None, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001, use_reloader=False)
