import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import axios from 'axios';

const Train = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [epochs, setEpochs] = useState(10);
  const [imgsz, setImgsz] = useState(416);
  const [workers, setWorkers] = useState(4);
  const [datasets, setDatasets] = useState([]);
  const models = ['yolov8n.pt', 'yolov8s.pt', 'yolov8m.pt', 'yolov8l.pt', 'yolov8x.pt'];

  useEffect(() => {
    // Fetch datasets when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/get_datasets');
        setDatasets(response.data.datasets);
      } catch (error) {
        console.error('Error fetching datasets:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    // Optionally, set the default selected dataset for the chosen model
    setSelectedDataset(datasets[0]); // For example, selecting the first dataset by default
  };

  const handleSelectDataset = (dataset) => {
    setSelectedDataset(dataset);
  };

  const handleTrainModel = async () => {
    try {
      // Verification checks
      if (!selectedModel || !selectedDataset || !epochs || !imgsz || !workers) {
        alert('Please fill in all the required fields');
        return;
      }
  
      // Convert 'epochs' to integer
      const epochsInt = parseInt(epochs, 10);
      const workersInt = parseInt(workers, 10);
      const imgszInt = parseInt(imgsz, 10);
      const scriptPath = 'C:\\Users\\marom\\Desktop\\Enigma\\EnigmaAI\\src\\Utilities\\modelTrain.py';
  
      // Make a POST request to the server-side script
      const response = await axios.post('http://localhost:5001/run_python_script', {
        script_path: scriptPath,
        args: [selectedModel, selectedDataset, epochsInt, imgszInt, workersInt],
      });
  
      console.log(response.data);
  
      // Handle the response from the server-side script as needed
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
    }
  };
  

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        {/* Other components or content */}
        <div className="flex justify-center mt-8 text-2xl">
          {models.map((model) => (
            <button
              key={model}
              onClick={() => {
                handleSelectModel(model);
                // Removed handleTrainModel() from here
              }}
              className={`text-primary p-8 rounded-3xl bg-sec mx-2 hover:bg-white ${
                selectedModel === model ? 'border border-white' : ''
              }`}
            >
              {model}
            </button>
          ))}
        </div>
        {/* Display the selected model and dataset */}
        {selectedModel && <p className="mt-4">Selected Model: {selectedModel}</p>}
        {selectedDataset && <p className="mt-4">Selected Dataset: {selectedDataset}</p>}

        {/* Display datasets */}
        <div className="mt-8 flex space-x-4">
          {datasets.map((dataset, index) => (
            <div
              key={index}
              className={`cursor-pointer bg-primary text-white p-4 rounded-md ${
                selectedDataset === dataset ? 'border border-white' : ''
              }`}
              onClick={() => handleSelectDataset(dataset)}
            >
              {dataset}
            </div>
          ))}
        </div>

        {/* Training parameters input fields */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-primary text-xl">Epochs:</label>
          <input
            type="number"
            value={epochs}
            onChange={(e) => setEpochs(e.target.value)}
            className="mt-1 p-2 w-40 border rounded-md"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-primary text-xl">Image Size (imgsz):</label>
          <input
            type="number"
            value={imgsz}
            onChange={(e) => setImgsz(e.target.value)}
            className="mt-1 p-2 w-40 border rounded-md"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-primary text-xl">Workers:</label>
          <input
            type="number"
            value={workers}
            onChange={(e) => setWorkers(e.target.value)}
            className="mt-1 p-2 w-40 border rounded-md"
          />
        </div>

        {/* Button to trigger training */}
        <button
          onClick={handleTrainModel}
          className="mt-4 bg-primary text-xl text-gray-800 p-4 rounded-l"
        >
          Train Model
        </button>

        {/* Other components or content */}
      </div>
    </Layout>
  );
};

export default Train;
