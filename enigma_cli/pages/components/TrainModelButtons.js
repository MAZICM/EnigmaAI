import React from 'react';
import axios from 'axios';

const TrainModelButtons = ({ onSelectModel }) => {
  const models = ['yolov8n.pt', 'yolov8s.pt', 'yolov8m.pt', 'yolov8l.pt', 'yolov8x.pt'];

  const handleTrainModel = async (model) => {
    try {
      const scriptPath = "../../enigma_server/server.py";

      // Make a POST request to the server-side script
      const response = await axios.post('http://localhost:5001/run_python_script', {
        script_path: scriptPath,
        args: [model], // Pass the selected model as an argument
      });

      console.log(response.data);

      // Handle the response from the server-side script as needed

      // Pass the selected model to the parent component
      onSelectModel(model);
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex justify-center mt-8 text-2xl">
      {models.map((model) => (
        <button
          key={model}
          onClick={() => {
            handleTrainModel(model);
          }}
          className="text-primary p-8 rounded-3xl bg-sec mx-2 hover:bg-white"
        >
          Train Model: {model}
        </button>
      ))}
    </div>
  );
};

export default TrainModelButtons;
