import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import axios from 'axios';

const LiveTest = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [threshold, setThreshold] = useState(0.5);
  const [datasets, setDatasets] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
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

  const handleRunLiveTest = async () => {
    try {
      // Verification checks
      if (!selectedModel || !selectedDataset || !threshold || !videoUrl) {
        alert('Please fill in all the required fields');
        return;
      }

      // Convert 'threshold' to float
      const thresholdFloat = parseFloat(threshold);
      const scriptPath = 'C:\\Users\\marom\\Desktop\\Enigma\\EnigmaAI\\src\\Utilities\\runLiveTest.py';

      // Make a POST request to the server-side script
      const response = await axios.post('http://localhost:5001/run_python_script', {
        script_path: scriptPath,
        args: [selectedModel, selectedDataset, thresholdFloat, videoUrl],
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
        <div className="p-8 ml-40 bg-gray-100 rounded-md shadow-md flex-grow">
          <form onSubmit={handleRunLiveTest} className="space-y-4">
            <h1 className="text-2xl font-semibold text-center text-gray-800">Live Model Testing</h1>

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

            {/* Video URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Video URL:</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            {/* Run Live Test Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white p-4 rounded-md hover:bg-opacity-80 focus:outline-none"
            >
              Run Live Test
            </button>
          </form>
        </div>

        <div className="flex-shrink-0 ml-60 mr-40 border p-80 rounded-md">
  {/* You can add your video preview component or embed code here */}
  {/* For example: */}
  <div className="relative aspect-w-16 aspect-h-9">
    <iframe
      title="Video Preview"
      className="absolute inset-0 w-full h-full rounded-md"
      src={"https://www.youtube.com/watch?v=wbh5f0XCw5I"} // Use the video URL or embed code here
      allowFullScreen
    ></iframe>
  </div>
</div>
      </div>
    </Layout>
  );
};

export default LiveTest;
