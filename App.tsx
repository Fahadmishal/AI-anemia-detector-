import React, { useState, useCallback, useEffect } from 'react';
import { analyzeImageForAnemia } from './services/geminiService';
import { AnalysisResult } from './types';
import ImageUpload from './components/ImageUpload';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import Disclaimer from './components/Disclaimer';
import ImageQualityGuide from './components/ImageQualityGuide';
import ApiKeyPrompt from './components/ApiKeyPrompt';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false);

  useEffect(() => {
    // Check for API key on initial render
    const apiKey = process.env.API_KEY;
    if (apiKey && apiKey !== 'PASTE_YOUR_GEMINI_API_KEY_HERE') {
      setIsApiKeyValid(true);
    }
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Clean up the object URL on component unmount or when file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!selectedFile) {
        return;
    };

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const base64Image = await fileToBase64(selectedFile);
      const result = await analyzeImageForAnemia(base64Image, selectedFile.type);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  if (!isApiKeyValid) {
    return <ApiKeyPrompt />;
  }

  return (
    <>
      {isGuideOpen && <ImageQualityGuide onClose={() => setIsGuideOpen(false)} />}
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center p-4 sm:p-6">
        <header className="text-center my-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-700">Anemia Detection AI</h1>
          <p className="mt-2 text-lg text-slate-600">Get an AI-powered analysis of potential anemia signs.</p>
        </header>

        <main className="w-full flex-grow flex flex-col items-center">
          <ImageUpload 
            onImageSelect={handleImageSelect} 
            previewUrl={previewUrl}
            onShowGuide={() => setIsGuideOpen(true)}
          />
          
          {selectedFile && (
              <button
                  onClick={handleAnalyzeClick}
                  disabled={isLoading}
                  className="mt-6 px-8 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                  {isLoading ? 'Analyzing...' : 'Analyze Image'}
              </button>
          )}

          <div className="mt-8 w-full max-w-md">
              {isLoading && <Loader />}
              {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" role="alert">
                      <strong className="font-bold">Error: </strong>
                      <span className="block sm:inline">{error}</span>
                  </div>
              )}
              {analysisResult && <ResultDisplay result={analysisResult} />}
          </div>
        </main>
        
        <footer className="w-full mt-auto pt-8">
          <Disclaimer />
        </footer>
      </div>
    </>
  );
};

export default App;
