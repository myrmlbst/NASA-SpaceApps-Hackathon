
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

function roundToDecimal(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

function ForResearchers() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [additionalData, setAdditionalData] = useState({});
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

      // Send to backend for prediction
      const response = await axios.post('http://20.187.48.226:5050/predict', {
        data: formattedData,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.probability !== undefined) {
        setPrediction(response.data.probability * 100);
        const data = response.data.additionalParams;

        console.log(data);

        setAdditionalData(data);

        console.log(additionalData);
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
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 md:p-8 pt-16 sm:pt-20">
      <div className="container mx-auto">
        <BackButton />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-test-500">For Researchers</h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">Upload and analyze your light curve data</p>
            <div className="w-full max-w-3xl h-1 bg-test-500 mx-auto my-6"></div>
          </div>
          
          <div className="space-y-8">
            <section className="bg-gray-900/30 p-6 sm:p-8 rounded-xl border border-gray-800/50">
              <h2 className="text-2xl sm:text-3xl font-bold text-test-400 mb-6">Upload Light Curve Data</h2>
              <p className="mb-6">Make sure the file has enough datapoints, if it doesn't, the model may return an error.</p>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-test-500 bg-gray-800/50' : 'border-gray-700 hover:border-test-400'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-3">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-test-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV file with light curve data (max 10MB)</p>
                  {file && (
                    <p className="mt-2 text-sm text-gray-300">
                      Selected: <span className="font-mono">{file.name}</span>
                    </p>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                  onClick={downloadTemplate}
                  type="button"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-test-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Template
                </button>
                {file && (
                  <div className="text-sm text-gray-300">
                    Selected file: <span className="font-mono text-test-300">{file.name}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              {error && (
                <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
              
              {fileData && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 text-sm">Successfully loaded {fileData.length} data points</p>
                </div>
              )}
              
              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!fileData || isLoading}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                    !fileData || isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-test-500 hover:bg-test-600'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Analyze Data'}
                </button>
              </div>
            </section>
            
            {/* Results Section */}
            {prediction !== null && (
              <section className="bg-gray-900/30 p-6 sm:p-8 rounded-xl border border-gray-800/50">
                <h2 className="text-2xl sm:text-3xl font-bold text-test-400 mb-6">Analysis Results</h2>
                <div className="p-6 bg-gray-800/50 rounded-lg">
                  <p className="text-lg text-gray-300 mb-4">The probability of this star having an exoplanet is:</p>
                  <div className="text-5xl font-bold text-test-400 my-6 text-center">
                    {prediction.toFixed(2)}%
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mt-6">
                    <div 
                      className="bg-gradient-to-r from-test-500 to-test-700 h-3 rounded-full"
                      style={{ width: `${prediction}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-3 text-center">
                    Confidence: <span className="font-medium">{prediction > 70 ? 'High' : prediction > 30 ? 'Medium' : 'Low'}</span>
                  </p>
                </div>

                <div className="p-6 bg-gray-800/50 rounded-lg mt-4">
                  <p className="text-lg text-gray-300 mb-4">
                    Assuming there is only one exoplanet orbitting around this star, these are its characteristics:  
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-2 rounded-lg bg-gray-700/50 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p className='font-semibold'>Orbital Velocity
                        <span className='m-2 font-light text-accent'>(km/s)</span>
                      </p>
                      <p>{additionalData['orbital_velocity']}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-700/50 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p className='font-semibold'>Inclination
                        <span className='m-2 font-light text-accent'>(i)</span>
                      </p>
                      <p>{roundToDecimal(additionalData['inclination'],5)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-2 rounded-lg bg-gray-700/50 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p className='font-semibold'>Planetary Radius
                        <span className='m-2 font-light text-accent'>(R⊕)</span>
                      </p>
                      <p>{roundToDecimal(additionalData['planetary_radius'][1], 10)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-700/50 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p className='font-semibold'>Orbital Period
                        <span className='m-2 font-light text-accent'>(i)</span>
                      </p>
                      <p>{roundToDecimal(additionalData['orbital_period'],5)}</p>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-700/50 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className='font-semibold'>Semi-Major Axis
                      <span className='m-2 font-light text-accent'>(m)</span>
                    </p>
                    <p>{roundToDecimal(additionalData['semimajor_axis'],5)}</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForResearchers;
