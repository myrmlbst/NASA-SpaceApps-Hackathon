import React, { useState, useRef, useCallback } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import BackButton from '../components/ui/BackButton';
import { Button } from '../components/ui/button';

// template CSV content
const templateCSV = `star_id,time,flux,flux_err
12345,0.0,1.000,0.001
12345,0.02,0.999,0.001
12345,0.04,0.998,0.001
12345,0.06,0.997,0.001
12345,0.08,0.996,0.001
12345,0.10,0.995,0.001
12345,0.12,0.994,0.001
12345,0.14,0.993,0.001
12345,0.16,0.994,0.001
12345,0.18,0.995,0.001
12345,0.20,0.996,0.001
12345,0.22,0.997,0.001
12345,0.24,0.998,0.001
12345,0.26,0.999,0.001
12345,0.28,1.000,0.001`;

function ForResearchers() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const fileInputRef = useRef(null);
  const [fileData, setFileData] = useState(null);

  const requiredColumns = ['star_id', 'time', 'flux', 'flux_err'];
  
  const downloadTemplate = useCallback(() => {
    const blob = new Blob([templateCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'lightcurve_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileData || fileData.length === 0) {
      setError('Please upload a valid CSV file first');
      return;
    }

    setIsLoading(true);
    setError('');
    setPrediction(null);

    try {
      // Ensure all required fields are present and have valid numbers
      const formattedData = fileData.map(row => {
        const star_id = Number(row.star_id);
        const time = Number(row.time);
        const flux = Number(row.flux);
        const flux_err = Number(row.flux_err);

        if (isNaN(star_id) || isNaN(time) || isNaN(flux) || isNaN(flux_err)) {
          throw new Error('Invalid data format in CSV');
        }

        return { star_id, time, flux, flux_err };
      });

      console.log('Sending data to backend:', formattedData);

      // Send to backend for prediction
      const response = await axios.post('http://localhost:5000/predict', {
        data: formattedData
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.probability !== undefined) {
        setPrediction(response.data.probability);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError(`Error: ${err.response?.data?.error || err.message || 'Failed to process the file. Please check the format and try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

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

    // Read the file as text first
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target.result;
      
      // Parse the CSV text
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const headers = results.meta.fields || [];
          const missingColumns = requiredColumns.filter(column => !headers.includes(column));
          
          if (missingColumns.length > 0) {
            setError(`Missing required columns: ${missingColumns.join(', ')}`);
            setFile(null);
            setFileData(null);
          } else {
            // Filter out any empty rows that might have been parsed
            const validData = results.data.filter(row => 
              row.star_id !== undefined && 
              row.time !== undefined && 
              row.flux !== undefined && 
              row.flux_err !== undefined
            );
            
            if (validData.length === 0) {
              setError('No valid data found in the CSV file');
              setFile(null);
              setFileData(null);
            } else {
              console.log(`Successfully loaded ${validData.length} data points`);
              setFileData(validData);
              setError('');
            }
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          setError('Error parsing CSV file. Please check the file format.');
          setFile(null);
          setFileData(null);
        }
      });
    };
    
    reader.onerror = () => {
      setError('Error reading the file');
      setFile(null);
      setFileData(null);
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8 pt-16 sm:pt-20">
      <div className="container mx-auto">
        <BackButton />
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-test-500">For Researchers</h1>
            <p className="text-xl text-gray-300 mt-2">Upload and analyze your light curve data</p>
            <div className="w-full max-w-3xl h-1 bg-test-500 mx-auto my-4"></div>
          </div>
          
          {/* CSV Template Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-test-400 mb-1">CSV Template</h2>
                <p className="text-test-400">Download our template to ensure proper data formatting</p>
              </div>
              <Button 
                onClick={downloadTemplate}
                variant="default"
                className="gap-2 text-gray-300 bg-gray-700 hover:bg-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Template
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-test-400"></div>
                  <h3 className="font-mono text-test-400">Required Columns</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <code className="text-sm bg-gray-800 px-2 py-1 rounded">star_id</code>
                    <span className="text-xs text-gray-400">(number)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <code className="text-sm bg-gray-800 px-2 py-1 rounded">time</code>
                    <span className="text-xs text-gray-400">(number)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <code className="text-sm bg-gray-800 px-2 py-1 rounded">flux</code>
                    <span className="text-xs text-gray-400">(number)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <code className="text-sm bg-gray-800 px-2 py-1 rounded">flux_err</code>
                    <span className="text-xs text-gray-400">(number)</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-900/30 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <h3 className="text-sm font-mono text-gray-300">Example Data</h3>
                </div>
                <div className="overflow-x-auto">
                  <pre className="text-xs text-gray-300 font-mono">
                    <code>
                      {templateCSV.split('\n').slice(0, 6).map((line, i) => (
                        <div key={i} className="flex hover:bg-gray-800/50 px-1">
                          <span className="text-gray-500 w-6 flex-shrink-0 select-none">{i + 1}</span>
                          <span>{line}</span>
                        </div>
                      ))}
                      {templateCSV.split('\n').length > 6 && (
                        <div className="text-center text-gray-500 py-1">...</div>
                      )}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-test-500 bg-gray-750' : 'border-gray-600'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium">
                  {file ? file.name : 'Drag and drop your CSV file here, or click to browse'}
                </p>
                <p className="text-sm text-gray-400">
                  Only CSV files with star_id, time, flux, and flux_err columns are accepted
                </p>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded">
                {error}
              </div>
            )}
            
            {fileData && (
              <div className="mt-4 p-3 bg-green-900/30 border border-green-500 text-green-200 rounded">
                Successfully loaded {fileData.length} data points
              </div>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={!fileData || isLoading}
              className={`mt-6 w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                !fileData || isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-test-600 hover:bg-test-700'
              }`}
            >
              {isLoading ? 'Processing...' : 'Analyze Data'}
            </button>
          </div>
          
          {/* Results Section */}
          {prediction !== null && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-test-400">Analysis Results</h2>
              <div className="text-center p-8 bg-gray-700/50 rounded-lg">
                <p className="text-lg mb-2">The probability of this star having an exoplanet is:</p>
                <div className="text-5xl font-bold text-test-400 my-4">
                  {prediction.toFixed(2)}%
                </div>
                <div className="w-full bg-gray-600 rounded-full h-4 mt-6">
                  <div 
                    className="bg-gradient-to-r from-test-500 to-test-700 h-4 rounded-full"
                    style={{ width: `${prediction}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Confidence: {prediction > 70 ? 'High' : prediction > 30 ? 'Medium' : 'Low'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForResearchers;

