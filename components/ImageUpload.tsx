
import React, { useRef } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
  onShowGuide: () => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const HelpIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)


const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, previewUrl, onShowGuide }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload image"
      />
      <div 
        className="w-full h-64 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 hover:border-blue-500 transition-colors cursor-pointer"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Image upload area"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Eyelid preview" className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="text-center text-slate-500 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 font-semibold">Click to upload an image of your inner eyelid</p>
            <p className="text-xs text-slate-400 mt-1">For best results, use a clear, well-lit photo.</p>
          </div>
        )}
      </div>
       <div className="flex items-center justify-center w-full mt-4 space-x-4">
         <button
            onClick={onShowGuide}
            className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            <HelpIcon />
            Photo Tips
        </button>
        <button
            onClick={handleClick}
            className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            <UploadIcon />
            {previewUrl ? 'Change Image' : 'Select Image'}
        </button>
       </div>
    </div>
  );
};

export default ImageUpload;
