import React, { useState, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import axios from 'axios';

const Video_Test = () => {
  const [trainingFolders, setTrainingFolders] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState('');
  const [weights, setWeights] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [threshold, setThreshold] = useState(0.5);
  const [videoFile, setVideoFile] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);

  const videoInputRef = useRef(null);

  useEffect(() => {
    // Fetch training folders when the component mounts
    const fetchTrainingFolders = async () => {
      try {
        const response = await axios.get('http://localhost:5001/get_T-Models');
        setTrainingFolders(response.data.Tmodels);
      } catch (error) {
        console.error('Error fetching training folders:', error);
      }
    };

    fetchTrainingFolders();
  }, []);

  const handleSelectTraining = async (training) => {
    setSelectedTraining(training);
    // Fetch weights for the selected training from the backend
    try {
      const response = await axios.get(`http://localhost:5001/get_weights/${training}`);
      const weights = response.data.weights;
      // Update selected weight to the first one in the list (you can change this behavior if needed)
      setSelectedWeight(weights.length > 0 ? weights[0] : '');
      setWeights(weights);
    } catch (error) {
      console.error('Error fetching weights:', error);
    }
  };

  const handleSelectWeight = (weight) => {
    setSelectedWeight(weight);
  };

  const handleThresholdChange = (e) => {
    setThreshold(e.target.value);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleRunVideoTest = async () => {
    try {
      // Verification checks
      if (!selectedTraining || !selectedWeight || !threshold || !videoFile) {
        alert('Please fill in all the required fields');
        return;
      }

      // Create a FormData object to append the video file
      const formData = new FormData();
      formData.append('video', videoFile);

      // Make a POST request to the server-side script to upload the video
      const uploadResponse = await axios.post('http://localhost:5001/upload_video', formData);

      // Get the uploaded video URL from the response
      const uploadedVideoUrl = uploadResponse.data.videoUrl;

      // Make another POST request to run the video test with model and threshold
      const runTestResponse = await axios.post('http://localhost:5001/run_video_test', {
        videoUrl: uploadedVideoUrl,
        training: selectedTraining,
        weight: selectedWeight,
        threshold: parseFloat(threshold),
      });

      // Get the result URL from the response
      const resultUrl = runTestResponse.data.resultUrl;

      // Set the result URL to display or download
      setResultUrl(resultUrl);

      console.log('Video test result:', resultUrl);
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Video Detection Test</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Training:</label>
          <select
            value={selectedTraining}
            onChange={(e) => handleSelectTraining(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:border-primary"
          >
            {trainingFolders.map((training) => (
              <option key={training} value={training}>
                {training}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Weight:</label>
          <select
            value={selectedWeight}
            onChange={(e) => handleSelectWeight(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          >
            {weights.map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>

        {selectedWeight && <p className="text-lg mb-2">Selected Weight: {selectedWeight}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Detection Threshold:</label>
          <input
            type="number"
            value={threshold}
            onChange={handleThresholdChange}
            step="0.01"
            className="w-full p-2 border rounded-md focus:outline-none focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Upload Video:</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            ref={videoInputRef}
            className="w-full p-2 border rounded-md focus:outline-none focus:border-primary"
          />
        </div>

        <button
          onClick={handleRunVideoTest}
          className="w-full bg-primary text-white p-4 rounded-md hover:bg-opacity-80 focus:outline-none"
        >
          Run Video Test
        </button>

        {resultUrl && (
          <div className="mt-4">
            <p className="text-lg mb-2">Test Result:</p>
            <a href={resultUrl} download className="text-blue-500 underline cursor-pointer">
              Download Result
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Video_Test;
