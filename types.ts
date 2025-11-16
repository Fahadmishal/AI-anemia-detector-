
export type ConfidenceLevel = 'Low' | 'Medium' | 'High' | 'Indeterminate';
export type ImageQuality = 'Good' | 'Poor' | 'Uncertain';
export type PallorGrade = 'Grade 0 (Normal)' | 'Grade 1 (Mild)' | 'Grade 2 (Moderate)' | 'Grade 3 (Severe)' | 'Not Assessable';

export interface AnalysisResult {
  summary: string;
  confidence: ConfidenceLevel;
  imageQuality: ImageQuality;
  reasoning: string;
  pallorGrade: PallorGrade;
}
