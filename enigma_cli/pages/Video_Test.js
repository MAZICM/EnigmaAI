import React, { useState, useRef } from 'react';
import Layout from './components/Layout';
import axios from 'axios';

const Video_Test = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [threshold, setThreshold] = useState(0.5);
  const [videoFile, setVideoFile] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);

  const videoInputRef = useRef(null);

  const models = ['yolov8n.pt', 'yolov8s.pt', 'yolov8m.pt', 'yolov8l.pt', 'yolov8x.pt'];

  const handleSelectModel = (model) => {
    setSelectedModel(model);
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
      if (!selectedModel || !threshold || !videoFile) {
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
        model: selectedModel,
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

        {/* Select Model Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => handleSelectModel(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:border-primary"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Detection Threshold Input */}
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

        {/* Video Upload */}
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

        {/* Run Video Test Button */}
        <button
          onClick={handleRunVideoTest}
          className="w-full bg-primary text-white p-4 rounded-md hover:bg-opacity-80 focus:outline-none"
        >
          Run Video Test
        </button>

        {/* Display or Download Result URL */}
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
