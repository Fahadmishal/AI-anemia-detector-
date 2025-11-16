import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ConfidenceLevel, ImageQuality, PallorGrade } from '../types';

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

export async function analyzeImageForAnemia(base64Image: string, mimeType: string): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imagePart = fileToGenerativePart(base64Image, mimeType);
  
  const systemInstruction = `You are a world-class AI medical analysis engine. Your sole purpose is to analyze images of the human lower eyelid conjunctiva for signs of anemia. Your knowledge base has been augmented with a comprehensive synthesis of all major ophthalmology textbooks, hematology research papers, and anonymized clinical trial data from WHO and NIH studies. You have been specifically fine-tuned on a massive, diverse dataset, including all relevant Kaggle datasets, the NHANES conjunctival photograph library, and proprietary clinical imagery from multiple global demographics to achieve superhuman accuracy in assessing conjunctival pallor. You employ a multi-layered analytical approach, considering factors like hue, saturation, vascularity, and texture. You MUST follow all instructions precisely and output ONLY a valid JSON object matching the provided schema. Do not output any other text, markdown, or explanations.`;

  const prompt = `Perform a rigorous, step-by-step analysis of the provided image of a lower eyelid conjunctiva. Adhere strictly to the following protocol:

1.  **Image Quality Assessment**: Critically evaluate the image for clinical usability.
    *   **Lighting**: Is it bright, even, and without glare? (e.g., diffuse daylight).
    *   **Focus**: Is the capillary network of the conjunctiva sharp and clear? Or is it blurry/pixelated?
    *   **Framing**: Is the conjunctiva the main subject, filling a significant portion of the frame?
    *   **Conclusion**: Based on the above, classify the quality as 'Good', 'Poor', or 'Uncertain'. If 'Poor', you MUST set pallor to 'Not Assessable' and confidence to 'Indeterminate'.

2.  **Conjunctival Pallor Grading**: This is the most critical step. Based on the color and vascularity, assign a grade from this clinical scale:
    *   'Grade 0 (Normal)': Deep, healthy pink/red color. Rich, clearly visible vascular network.
    *   'Grade 1 (Mild)': Noticeably less pink, but still clearly pink. Vascular network is slightly less prominent.
    *   'Grade 2 (Moderate)': Whitish-pink. The conjunctiva is pale. The vascular network is difficult to see.
    *   'Grade 3 (Severe)': Extreme pallor. The conjunctiva appears white, off-white, or porcelain-like. The vascular network is almost invisible.
    *   'Not Assessable': Use this ONLY if Image Quality is 'Poor'.

3.  **Confidence Level Determination**: Your confidence in detecting anemia signs MUST be directly and exclusively derived from the Pallor Grade.
    *   Grade 0 or Grade 1 -> 'Low' confidence.
    *   Grade 2 -> 'Medium' confidence.
    *   Grade 3 -> 'High' confidence.
    *   'Not Assessable' grade -> 'Indeterminate' confidence.
    *   There are NO exceptions to this rule.

4.  **Summary and Reasoning Generation**:
    *   **Summary**: Write a one-sentence summary stating the primary finding (e.g., "The analysis indicates a normal conjunctiva with no signs of pallor." or "The analysis reveals significant conjunctival pallor, suggestive of moderate anemia.").
    *   **Reasoning**: Synthesize your findings. Start with the image quality assessment, then describe the observed color and vascularity that led to the specific pallor grade. Mention any other observations, such as inflammation or jaundice, that could affect the analysis. Finally, state how the pallor grade determined the confidence level.

5.  **Final Review**: Before outputting, double-check that your Pallor Grade and Confidence Level strictly follow the rules defined in steps 2 and 3. Your output must be a single, valid JSON object.
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
        systemInstruction: systemInstruction,
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
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
       throw new Error("The application's API Key is invalid or missing. Please contact the administrator.");
    }
    throw new Error("Failed to analyze the image. The AI model could not process the request. Please try again with a clear, well-lit photo.");
  }
}