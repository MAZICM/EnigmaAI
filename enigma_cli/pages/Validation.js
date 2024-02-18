import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import axios from 'axios';

const Validation = () => {
  const [selectedTraining, setSelectedTraining] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [datasets, setDatasets] = useState([]);
  const [models, setModels] = useState([]);
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainedModelsResponse = await axios.get('http://localhost:5001/get_T-Models');
        console.log('Trained Models Response:', trainedModelsResponse.data);

        setModels(trainedModelsResponse.data.datasets);
      } catch (error) {
        console.error('Error fetching trained models:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        if (selectedTraining) {
          const weightsResponse = await axios.get(`http://localhost:5001/get_weights/${selectedTraining}`);
          console.log('Weights Response:', weightsResponse.data);

          setWeights(weightsResponse.data.weights);
        }
      } catch (error) {
        console.error('Error fetching weights:', error);
      }
    };

    fetchWeights();
  }, [selectedTraining]);

  const handleSelectTraining = (training) => {
    setSelectedTraining(training);
  };

  const handleSelectWeight = (weight) => {
    setSelectedWeight(weight);
  };

  const handleRunValidation = async (e) => {
    e.preventDefault();

    try {
      if (!selectedTraining || !selectedWeight) {
        alert('Please fill in all the required fields');
        return;
      }

      const response = await axios.post('http://localhost:5001/run_python_script', {
        script_path: 'C:\\Users\\pc\\Github\\EnigmaAI\\enigma_serversrc\\Utilities\\modelValid.py',
        args: [selectedTraining, selectedWeight],
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
          <form onSubmit={handleRunValidation} className="space-y-4">
            <h1 className="text-2xl font-semibold text-center text-gray-800">Model Validation</h1>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Training:</label>
              <select
                value={selectedTraining}
                onChange={(e) => handleSelectTraining(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
              >
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {selectedTraining && <p className="text-lg mb-2">Selected Training: {selectedTraining}</p>}

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
