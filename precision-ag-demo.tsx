import React, { useState, useEffect } from 'react';
import { Upload, Leaf, AlertCircle, CheckCircle, Clock, Image } from 'lucide-react';

export default function PrecisionAgricultureApp() {
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  // Mock backend API calls (replace with actual backend in production)
  const analyzeImage = async (file) => {
    setUploading(true);
    setAnalyzing(true);
    
    // Simulate image upload and AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const classifications = ['Healthy', 'Mild Infection', 'Severe Infection'];
    const classification = classifications[Math.floor(Math.random() * classifications.length)];
    
    const result = {
      id: Date.now(),
      filename: file.name,
      timestamp: new Date().toISOString(),
      classification: classification,
      imageUrl: URL.createObjectURL(file)
    };
    
    // In production, this would be a POST to your backend
    setResults(prev => [result, ...prev]);
    setCurrentResult(result);
    setUploading(false);
    setAnalyzing(false);
    
    return result;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      analyzeImage(file);
    } else {
      alert('Please upload an image file');
    }
  };

  const getClassificationColor = (classification) => {
    switch(classification) {
      case 'Healthy':
        return 'text-green-600 bg-green-50';
      case 'Mild Infection':
        return 'text-yellow-600 bg-yellow-50';
      case 'Severe Infection':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getClassificationIcon = (classification) => {
    switch(classification) {
      case 'Healthy':
        return <CheckCircle className="w-5 h-5" />;
      case 'Mild Infection':
        return <AlertCircle className="w-5 h-5" />;
      case 'Severe Infection':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Leaf className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Precision Agriculture with Drone + AI
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Tà Xùa Tea Fields Monitoring System - Sơn La, Vietnam
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upload Drone Image
          </h2>
          <p className="text-gray-600 mb-6">
            Upload an aerial image from drone surveillance to analyze tea plant health
          </p>
          
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {analyzing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Analyzing image with AI...</p>
                <p className="text-sm text-gray-500 mt-2">Detecting plant health conditions</p>
              </div>
            ) : (
              <>
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag and drop your image here
                </p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInput}
                    disabled={uploading}
                  />
                </label>
              </>
            )}
          </div>
        </div>

        {/* Current Result */}
        {currentResult && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Latest Analysis Result
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={currentResult.imageUrl}
                  alt="Analyzed tea field"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Filename</p>
                  <p className="font-medium text-gray-900">{currentResult.filename}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Analysis Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(currentResult.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Classification</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getClassificationColor(currentResult.classification)}`}>
                    {getClassificationIcon(currentResult.classification)}
                    {currentResult.classification}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Analysis History
          </h2>
          <p className="text-gray-600 mb-6">
            View all drone surveillance results and plant health classifications
          </p>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No analysis results yet. Upload an image to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Filename</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Classification</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <img
                          src={result.imageUrl}
                          alt={result.filename}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-800">{result.filename}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(result.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getClassificationColor(result.classification)}`}>
                          {getClassificationIcon(result.classification)}
                          {result.classification}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistics */}
        {results.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Scans</p>
                  <p className="text-3xl font-bold text-gray-900">{results.length}</p>
                </div>
                <Image className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Healthy Plants</p>
                  <p className="text-3xl font-bold text-green-600">
                    {results.filter(r => r.classification === 'Healthy').length}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Needs Attention</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {results.filter(r => r.classification !== 'Healthy').length}
                  </p>
                </div>
                <AlertCircle className="w-12 h-12 text-yellow-600 opacity-20" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Precision Agriculture System © 2025 - Tà Xùa Tea Fields Project
          </p>
        </div>
      </footer>
    </div>
  );
}