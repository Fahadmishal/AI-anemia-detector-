
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ConfidenceLevel, ImageQuality, PallorGrade } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

export async function analyzeImageForAnemia(base64Image: string, mimeType: string): Promise<AnalysisResult> {
  const imagePart = fileToGenerativePart(base64Image, mimeType);
  
  const prompt = `Act as an advanced AI diagnostic assistant, specialized in ophthalmological image analysis for hematological indicators. Your knowledge base is equivalent to being trained on thousands of annotated images from clinical datasets for anemia detection.

  Your task is to perform a step-by-step analysis of the provided image of a lower eyelid conjunctiva:
  1.  **Assess Image Quality**: Evaluate the lighting, focus, and framing. State if it's 'Good', 'Poor', or 'Uncertain'. A poor image is blurry, too dark, has significant glare, or the conjunctiva is not the primary focus.
  2.  **Grade Conjunctival Pallor**: Classify the pallor using the following clinical grading system:
      *   'Grade 0 (Normal)': Healthy, vibrant pink or red conjunctiva.
      *   'Grade 1 (Mild)': Slightly pale, less vibrant pink.
      *   'Grade 2 (Moderate)': Noticeably pale pink or whitish-pink.
      *   'Grade 3 (Severe)': Very pale, whitish, or porcelain-like appearance.
      *   'Not Assessable': If image quality is 'Poor'.
  3.  **Analyze Vascularity**: Note the visibility of the small blood vessels (capillary network). In cases of pallor, these vessels become less distinct.
  4.  **Provide a Summary**: Give a concise summary of your findings, mentioning the key indicators.
  5.  **Determine Confidence Level**: Your confidence level for the presence of anemia signs must be strongly correlated with the pallor grade.
      *   Grade 0 or 1 should result in 'Low' confidence.
      *   Grade 2 should result in 'Medium' confidence.
      *   Grade 3 should result in 'High' confidence.
      *   If the image quality is 'Poor' or the pallor is 'Not Assessable', confidence must be 'Indeterminate'.
  6.  **Explain Reasoning**: Briefly explain your conclusion, linking the pallor grade and vascularity to the final summary and confidence level.

  Your analysis is for informational purposes ONLY and is NOT a medical diagnosis. Do not provide medical advice.
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A concise summary of the analysis for signs of anemia like pallor."
            },
            confidence: {
              type: Type.STRING,
              description: "The confidence level (Low, Medium, High, Indeterminate) for the presence of anemia signs."
            },
            imageQuality: {
              type: Type.STRING,
              description: "Assessment of the image quality (Good, Poor, Uncertain)."
            },
            reasoning: {
              type: Type.STRING,
              description: "A step-by-step reasoning for the analysis, confidence level, and image quality assessment."
            },
            pallorGrade: {
              type: Type.STRING,
              description: "The clinical pallor grade (e.g., 'Grade 0 (Normal)', 'Grade 1 (Mild)', etc.)."
            }
          },
          required: ["summary", "confidence", "imageQuality", "reasoning", "pallorGrade"],
        }
      }
    });

    const responseJson = result.text;
    const parsedResult = JSON.parse(responseJson) as AnalysisResult;
    
    // Validate confidence level
    const validConfidences: ConfidenceLevel[] = ['Low', 'Medium', 'High', 'Indeterminate'];
    if (!validConfidences.includes(parsedResult.confidence)) {
        parsedResult.confidence = 'Indeterminate';
    }

    // Validate image quality
    const validQualities: ImageQuality[] = ['Good', 'Poor', 'Uncertain'];
     if (!validQualities.includes(parsedResult.imageQuality)) {
        parsedResult.imageQuality = 'Uncertain';
    }
    
    // Validate pallor grade
    const validPallorGrades: PallorGrade[] = ['Grade 0 (Normal)', 'Grade 1 (Mild)', 'Grade 2 (Moderate)', 'Grade 3 (Severe)', 'Not Assessable'];
    if (!validPallorGrades.includes(parsedResult.pallorGrade)) {
        parsedResult.pallorGrade = 'Not Assessable';
    }

    // Enforce logic: if image quality is poor, confidence must be indeterminate and grade not assessable
    if (parsedResult.imageQuality === 'Poor') {
        parsedResult.confidence = 'Indeterminate';
        parsedResult.pallorGrade = 'Not Assessable';
    }

    return parsedResult;
  } catch (error) {
    console.error("Error analyzing image with Gemini API:", error);
    throw new Error("Failed to analyze the image. The AI model could not process the request. Please try again with a clear, well-lit photo.");
  }
}
