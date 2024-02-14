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
            <div className="flex items-center justify-center min-h-screen   ">
                <div className=' p-20 px-40 bg-sec rounded-xl '>
                <form onSubmit={handleDownload} className=" p-8  rounded-md shadow-md w-96 ">
                    <h1 className="text-2xl font-semibold mb-6 text-center text-sec">Roboflow Dataset Download</h1>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-primary text-xl">API Key:</label>
                        <input
                            type="text"
                            value={api_key}
                            onChange={(e) => setApiKey(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-primary text-xl">Workspace:</label>
                        <input
                            type="text"
                            value={workspace}
                            onChange={(e) => setWorkspace(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-primary text-xl">Project:</label>
                        <input
                            type="text"
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-primary text-xl">Version:</label>
                        <input
                            type="text"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-primary text-xl">Download Type:</label>
                        <input
                            type="text"
                            value={download}
                            onChange={(e) => setDownload(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-xl text-gray-800 p-4 rounded-l"
                    >
                        {loading ? 'Downloading...' : 'Download Dataset'}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
                </div>
                
            </div>
        </Layout>
    );
};

export default Dataset;
