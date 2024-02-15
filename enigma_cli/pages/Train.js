import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import axios from 'axios';

const Train = () => {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [epochs, setEpochs] = useState(10);
  const [imgsz, setImgsz] = useState(416);
  const [workers, setWorkers] = useState(4);
  const [datasets, setDatasets] = useState([]);
  const models = ['yolov8n.pt', 'yolov8s.pt', 'yolov8m.pt', 'yolov8l.pt', 'yolov8x.pt'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/get_datasets');
        setDatasets(response.data.datasets);

        if (response.data.datasets.length > 0) {
          setSelectedDataset(response.data.datasets[0]);
        }
      } catch (error) {
        console.error('Error fetching datasets:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelectModel = (model) => {
    setSelectedModel(model);

    if (datasets.length > 0) {
      setSelectedDataset(datasets[0]);
    }
  };

  const handleSelectDataset = (dataset) => {
    setSelectedDataset(dataset);
  };

  const handleTrainModel = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      if (!selectedModel || !selectedDataset || !epochs || !imgsz || !workers) {
        alert('Please fill in all the required fields');
        return;
      }

      const epochsInt = parseInt(epochs, 10);
      const workersInt = parseInt(workers, 10);
      const imgszInt = parseInt(imgsz, 10);
      const scriptPath = 'C:\\Users\\pc\\Github\\EnigmaAI\\enigma_serversrc\\Utilities\\modelTrain.py';

      const response = await axios.post('http://localhost:5001/run_python_script', {
        script_path: scriptPath,
        args: [selectedModel, selectedDataset, epochsInt, imgszInt, workersInt],
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-gray-100 rounded-md shadow-md">
          <form onSubmit={handleTrainModel} className="space-y-4">
            <h1 className="text-2xl font-semibold text-center text-gray-800">Model Training</h1>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Model:</label>
              <select
                value={selectedModel}
                onChange={(e) => handleSelectModel(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
              >
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {selectedModel && <p className="text-lg mb-2">Selected Model: {selectedModel}</p>}
            {selectedDataset && <p className="mt-4">Selected Dataset: {selectedDataset}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Dataset:</label>
              <select
                value={selectedDataset}
                onChange={(e) => handleSelectDataset(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
              >
                {datasets.map((dataset, index) => (
                  <option key={index} value={dataset}>
                    {dataset}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Epochs:</label>
                <input
                  type="number"
                  value={epochs}
                  onChange={(e) => setEpochs(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image Size (imgsz):</label>
                <input
                  type="number"
                  value={imgsz}
                  onChange={(e) => setImgsz(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Workers:</label>
                <input
                  type="number"
                  value={workers}
                  onChange={(e) => setWorkers(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white p-4 rounded-md hover:bg-opacity-80 focus:outline-none"
            >
              Train Model
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Train;
