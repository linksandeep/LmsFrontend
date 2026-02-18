import React, { useState } from 'react';
import api from '../services/api';

const TestBackendPage: React.FC = () => {
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState('');

  const testBackend = async () => {
    try {
      setStatus('Testing...');
      const res = await api.get('/health');
      setStatus('Success! ✅');
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setStatus('Failed! ❌');
      setResponse(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Test Backend Connection</h2>
      
      <button
        onClick={testBackend}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Test Connection
      </button>
      
      {status && (
        <div className="mb-4">
          <strong>Status:</strong> {status}
        </div>
      )}
      
      {response && (
        <div className="bg-gray-100 p-4 rounded">
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Make sure your backend is running at: http://localhost:5000</p>
        <p className="mt-2">Expected response from /health:</p>
        <pre className="bg-gray-100 p-2 mt-1 rounded">
{`{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-..."
}`}
        </pre>
      </div>
    </div>
  );
};

export default TestBackendPage;
