import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import axios from 'axios';

const Validation = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [threshold, setThreshold] = useState(0.5);
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

  const handleRunValidation = async () => {
    try {
      // Verification checks
      if (!selectedModel || !selectedDataset || !threshold) {
        alert('Please fill in all the required fields');
        return;
      }

      // Convert 'threshold' to float
      const thresholdFloat = parseFloat(threshold);
      const scriptPath = 'C:\\Users\\marom\\Desktop\\Enigma\\EnigmaAI\\src\\Utilities\\runValidation.py';

      // Make a POST request to the server-side script
      const response = await axios.post('http://localhost:5001/run_python_script', {
        script_path: scriptPath,
        args: [selectedModel, selectedDataset, thresholdFloat],
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-gray-100 rounded-md shadow-md">
          <form onSubmit={handleRunValidation} className="space-y-4">
            <h1 className="text-2xl font-semibold text-center text-gray-800">Model Validation</h1>

            {/* Select Model Dropdown */}
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

            {/* Display Selected Model */}
            {selectedModel && <p className="text-lg mb-2">Selected Model: {selectedModel}</p>}

            {/* Select Dataset Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Dataset:</label>
              <div className="flex space-x-2">
                {datasets.map((dataset, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-md ${
                      selectedDataset === dataset
                        ? 'bg-primary text-white border border-primary'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleSelectDataset(dataset)}
                  >
                    {dataset}
                  </button>
                ))}
              </div>
            </div>

            {/* Validation Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Validation Threshold:</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                step="0.01"
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            {/* Run Validation Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white p-4 rounded-md hover:bg-opacity-80 focus:outline-none"
            >
              Run Validation
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Validation;
