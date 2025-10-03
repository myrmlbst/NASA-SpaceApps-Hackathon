import React, { useState, useRef } from 'react';
import Papa from 'papaparse';

import BackButton from '../components/ui/BackButton';

function ForResearchers() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [fileData, setFileData] = useState(null);

  const requiredColumns = ['star_id','time', 'flux', 'flux_err'];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setError('');
    
    // Check file type
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setFile(file);

    // parse the CSV file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const missingColumns = requiredColumns.filter(column => !headers.includes(column));
        
        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}`);
          setFile(null);
        } else {
          setFileData(results.data);
          setError('');
        }
      },
      error: (error) => {
        setError('Error parsing CSV file');
        console.error('CSV parsing error:', error);
      }
    });
  };

  const downloadTemplate = () => {
    const csv = 'star_id,time,flux,flux_err\n1,0,1.0,0.1\n1,1,0.99,0.1\n1,2,0.98,0.1';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'lightcurve_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8 pt-16 sm:pt-20">
      <div className="container mx-auto">
        <BackButton />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-test-500">For Researchers</h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Upload your light curve data for analysis
            </p>
            <div className="w-full max-w-3xl h-1 bg-test-500 mx-auto my-4"></div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-test-400 bg-gray-700' : 'border-gray-600 hover:border-test-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-200">
                  {file ? file.name : 'Drag and drop your CSV file here, or click to browse'}
                </p>
                <p className="text-sm text-gray-400">
                  CSV files with time, flux, and flux error columns only
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700 text-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              {file && !error && (
                <button
                  type="button"
                  className="px-4 py-2 bg-test-500 text-white rounded-md hover:bg-test-600 transition-colors"
                  onClick={() => {
                    // Handle file submission here
                    console.log('File data:', fileData);
                    alert('File uploaded successfully! Rows: ' + fileData.length);
                  }}
                >
                  Process Data
                </button>
              )}
            </div>

            <h3 style={{marginTop: 20}} className="text-xl font-semibold mb-4">Data Template (how the data should be structured)</h3>
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                    star_id
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                    flux
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                    time
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                    flux_err
                  </th>
                </tr> 
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    1
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    0
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    1
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    0.1
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    1
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    1
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    0.99
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    0.1
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    1
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    2
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    0.98
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    0.1
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">

            <button
                type="button"
                onClick={downloadTemplate}
                className="px-4 py-2 border border-test-500 text-test-400 rounded-lg hover:bg-test-500/10 transition-colors"
              >
                Download Template
              </button>

              </div>
          </div>

          {fileData && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">File Preview (first 5 rows)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      {Object.keys(fileData[0] || {}).map((header) => (
                        <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {fileData.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex} className="px-4 py-2 text-sm text-gray-300">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Showing {Math.min(5, fileData.length)} of {fileData.length} rows
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForResearchers;

