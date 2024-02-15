import { useState } from 'react';
import axios from 'axios';
import Layout from './components/Layout';

const Dataset = () => {
    const [api_key, setApiKey] = useState('');
    const [workspace, setWorkspace] = useState('');
    const [project, setProject] = useState('');
    const [version, setVersion] = useState('');
    const [download, setDownload] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDownload = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const scriptPath = 'roboFlowDataSet.py';

            // Make a POST request to the server-side script
            const response = await axios.post('http://localhost:5001/run_python_script', {
                script_path: scriptPath,
                args: [api_key, workspace, project, version, download],
            });

            console.log(response.data);

            // Handle the response from the server-side script as needed

        } catch (error) {
            // Handle errors
            setError(error.response?.data?.error || 'An error occurred');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen">
                <div className='p-8 bg-gray-100 rounded-md shadow-md'>
                    <form onSubmit={handleDownload} className="space-y-4">
                        <h1 className="text-2xl font-semibold text-center text-gray-800">
                            Roboflow Dataset Download
                        </h1>
                        {/* Input fields */}
                        {[{ label: 'API Key', state: api_key, onChange: setApiKey },
                          { label: 'Workspace', state: workspace, onChange: setWorkspace },
                          { label: 'Project', state: project, onChange: setProject },
                          { label: 'Version', state: version, onChange: setVersion },
                          { label: 'Download Type', state: download, onChange: setDownload }].map((input, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-gray-700">{input.label}:</label>
                                <input
                                    type="text"
                                    value={input.state}
                                    onChange={(e) => input.onChange(e.target.value)}
                                    required
                                    className="mt-1 p-2 w-full border rounded-md"
                                />
                            </div>
                        ))}
                        {/* Download button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white p-4 rounded-l"
                        >
                            {loading ? 'Downloading...' : 'Download Dataset'}
                        </button>
                        {/* Error message */}
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Dataset;
