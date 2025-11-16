import React from 'react';

const ApiKeyPrompt: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg border border-slate-200">
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.629 5.629l-2.37 2.37a2 2 0 01-2.828 0L7 14.5M15 7A2 2 0 0013 5M15 7v3m-5 4H7a2 2 0 01-2-2V7a2 2 0 012-2h2.5" />
          </svg>
          <h2 className="text-2xl font-bold text-slate-800">API Key Required</h2>
        </div>
        <div className="text-slate-600 space-y-4">
          <p>
            To use this application, you need a Google Gemini API key.
          </p>
          <div>
            <h3 className="font-semibold text-slate-700 mb-2">How to set your API key:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm bg-slate-100 p-4 rounded-md">
              <li>
                Get your API key from{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Google AI Studio
                </a>.
              </li>
              <li>
                In your project, open the <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-xs">index.html</code> file.
              </li>
              <li>
                Find the line <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-xs">API_KEY: "PASTE_YOUR_GEMINI_API_KEY_HERE"</code>.
              </li>
              <li>
                Replace <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-xs">PASTE_YOUR_GEMINI_API_KEY_HERE</code> with your actual API key.
              </li>
            </ol>
          </div>
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
            This application runs entirely in your browser. Your API key is not stored or sent anywhere except to the Google API.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
