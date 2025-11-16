
import React from 'react';

const AlertIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
);

const Disclaimer: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-r-lg" role="alert">
      <div className="flex">
        <div className="py-1"><AlertIcon /></div>
        <div className="ml-3">
          <p className="font-bold">Important Medical Disclaimer</p>
          <p className="text-sm">This AI analysis is for informational purposes only and is NOT a medical diagnosis. It cannot replace a consultation with a qualified healthcare professional. Please consult a doctor for any health concerns.</p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
