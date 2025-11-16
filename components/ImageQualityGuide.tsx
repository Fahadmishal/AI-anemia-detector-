
import React from 'react';

interface ImageQualityGuideProps {
  onClose: () => void;
}

const InfoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ImageQualityGuide: React.FC<ImageQualityGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-bold text-slate-800">Tips for an Accurate Analysis</h2>
          <button onClick={onClose} className="text-3xl text-slate-500 hover:text-slate-800 leading-none">&times;</button>
        </div>
        <p className="text-slate-600 mb-6">For the AI to provide the best possible analysis, please follow these guidelines when taking your photo:</p>
        <ul className="space-y-4">
          <li className="flex items-start">
            <InfoIcon className="h-6 w-6 text-blue-500 mr-3 shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-slate-700">Use Bright, Natural Light</h4>
              <p className="text-sm text-slate-500">Avoid shadows and dark rooms. Daylight near a window works best.</p>
            </div>
          </li>
          <li className="flex items-start">
            <InfoIcon className="h-6 w-6 text-blue-500 mr-3 shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-slate-700">Ensure Sharp Focus</h4>
              <p className="text-sm text-slate-500">Tap your phone screen on your eyelid to focus the camera. Blurry photos cannot be analyzed accurately.</p>
            </div>
          </li>
          <li className="flex items-start">
            <InfoIcon className="h-6 w-6 text-blue-500 mr-3 shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-slate-700">Gently Pull Down Eyelid</h4>
              <p className="text-sm text-slate-500">Use one finger to gently pull your lower eyelid down to clearly expose the inner red/pink tissue (conjunctiva).</p>
            </div>
          </li>
          <li className="flex items-start">
            <InfoIcon className="h-6 w-6 text-blue-500 mr-3 shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-slate-700">Get Close to the Camera</h4>
              <p className="text-sm text-slate-500">The inner eyelid should fill most of the photo frame.</p>
            </div>
          </li>
           <li className="flex items-start">
            <InfoIcon className="h-6 w-6 text-red-500 mr-3 shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-slate-700">Avoid Using Camera Flash</h4>
              <p className="text-sm text-slate-500">Flash can cause glare and wash out the natural color, leading to an incorrect analysis.</p>
            </div>
          </li>
        </ul>
        <div className="mt-8 pt-4 border-t text-center">
            <button
                onClick={onClose}
                className="px-8 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Got It
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageQualityGuide;
