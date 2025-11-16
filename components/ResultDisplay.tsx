
import React from 'react';
import { AnalysisResult, ConfidenceLevel, ImageQuality, PallorGrade } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult;
}

const confidenceStyles: { [key in ConfidenceLevel]: { text: string; bg: string; border: string; icon: React.ReactNode} } = {
  Low: {
    text: 'text-green-800',
    bg: 'bg-green-100',
    border: 'border-green-500',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  Medium: {
    text: 'text-yellow-800',
    bg: 'bg-yellow-100',
    border: 'border-yellow-500',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  },
  High: {
    text: 'text-red-800',
    bg: 'bg-red-100',
    border: 'border-red-500',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  Indeterminate: {
    text: 'text-slate-800',
    bg: 'bg-slate-100',
    border: 'border-slate-500',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  }
};

const pallorGradeStyles: { [key in PallorGrade]: string } = {
    'Grade 0 (Normal)': 'bg-green-200 text-green-800',
    'Grade 1 (Mild)': 'bg-lime-200 text-lime-800',
    'Grade 2 (Moderate)': 'bg-yellow-200 text-yellow-800',
    'Grade 3 (Severe)': 'bg-red-200 text-red-800',
    'Not Assessable': 'bg-slate-200 text-slate-800',
};

const ImageQualityWarning: React.FC<{ quality: ImageQuality }> = ({ quality }) => {
  if (quality === 'Good') return null;

  return (
    <div className="mt-4 p-3 bg-amber-100 border-l-4 border-amber-500 text-amber-800 rounded-r-md">
      <p className="font-bold text-sm">Image Quality: {quality}</p>
      <p className="text-xs">The analysis may be less accurate. For best results, please upload a new photo following the photo tips.</p>
    </div>
  );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const styles = confidenceStyles[result.confidence] || confidenceStyles.Indeterminate;
  const gradeStyle = pallorGradeStyles[result.pallorGrade] || pallorGradeStyles['Not Assessable'];
  
  return (
    <div className={`w-full max-w-md mx-auto mt-6 border-l-4 rounded-lg p-4 shadow-md ${styles.bg} ${styles.border}`}>
      <div className="flex items-center mb-3">
        {styles.icon}
        <h3 className={`ml-3 text-xl font-bold ${styles.text}`}>AI Analysis Result</h3>
      </div>
      <div className={`pl-9 ${styles.text} space-y-4`}>
        <div className="flex flex-wrap gap-y-2 justify-between items-baseline">
            <p className="font-semibold text-sm">Confidence:</p>
            <span className="font-bold text-base px-2 py-0.5 rounded-md">{result.confidence}</span>
        </div>
         <div className="flex flex-wrap gap-y-2 justify-between items-baseline">
            <p className="font-semibold text-sm">Pallor Grade:</p>
            <span className={`font-bold text-base px-2 py-0.5 rounded-md ${gradeStyle}`}>{result.pallorGrade}</span>
        </div>
        <div>
            <p className="font-semibold text-sm">Summary:</p>
            <p className="text-sm mt-1">{result.summary}</p>
        </div>
        <div className="pt-3 border-t border-slate-400/30">
            <p className="font-semibold text-sm">AI Reasoning:</p>
            <p className="mt-1 text-xs italic opacity-90">{result.reasoning}</p>
        </div>
      </div>
      <ImageQualityWarning quality={result.imageQuality} />
    </div>
  );
};

export default ResultDisplay;
