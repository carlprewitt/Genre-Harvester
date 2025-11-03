import { GoogleGenAI } from "@google/genai";
import { MurekaBrief } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are an expert musicologist and data normalization engine. Your task is to research a given music genre using web search and then generate a single JSON object with the findings.

**Normalization Rules:**
1.  **BPM Inference:** If the exact BPM is not found, infer a typical range. Examples: Trap: 120-160, Drill: 120-150, House: 118-126, Shoegaze: 70-115, Lo-fi: 65-90.
2.  **Instrument Inference:** If not specified, infer common instrumentation. Examples: rock/punk -> "distorted guitars, bass, drums", trap/hip-hop -> "808s, hi-hat rolls, snappy snare, atmospheric pads", afro -> "syncopated percussion, shakers, deep bass groove".
3.  **Content Requirements:** You must provide 3-6 mood words and 2-4 artist references.
4.  **Formatting:** The 'title' field must be 'Mureka [Genre Name] Brief (Male Vocal)'. The 'core_sound' should be a descriptive paragraph.
5.  **Output:** Your response MUST be a single, raw JSON object and nothing else. Do not wrap it in markdown backticks or add any explanatory text.

**JSON Schema to follow:**
{
  "title": "string (e.g., 'Mureka Shoegaze Brief (Male Vocal)')",
  "genre_name": "string (The canonical name of the genre.)",
  "tagline": "string (A short, catchy one-sentence description of the genre.)",
  "bpm": "string (Typical BPM range for the genre, e.g., '120-140 BPM')",
  "core_sound": "string (A detailed paragraph explaining the overall style, key instruments, and production techniques.)",
  "vocal_style": "string (Description of the typical vocal approach for a male singer in this genre.)",
  "mood": "string[] (An array of 3-6 adjectives describing the mood.)",
  "artists": "string[] (An array of 2-4 notable artists or producers.)",
  "overlaps_with": "string[] (An array of genres that this style overlaps with or is similar to.)",
  "prompt_version": "string (Set to '1.0')"
}`;

/**
 * Extracts a JSON object from a string. It looks for the first '{' and last '}'
 * to robustly handle responses that might include markdown or other text.
 * @param text The text to extract JSON from.
 * @returns The parsed JSON object.
 */
function extractJson(text: string): any {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
        throw new Error("No valid JSON object found in the response.");
    }

    const jsonString = text.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonString);
}

export async function generateGenreBrief(genreName: string): Promise<MurekaBrief> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Please research the music genre: "${genreName}"`,
    config: {
      systemInstruction: systemInstruction,
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text.trim();
  
  try {
    const parsedJson = extractJson(text);
    return parsedJson as MurekaBrief;
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", text, e);
    throw new Error("The AI returned an invalid format. Please try regenerating.");
  }
}
