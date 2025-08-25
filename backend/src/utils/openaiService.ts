import { OpenAI } from "openai";
import dotenv from "dotenv";
import { db } from "../db";
import { aiCostLog } from "../schema/AiCost";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const analyzeResumeWithOpenAI = async (
  resumeText: string,
  jobDescription: string,
  ipAddress: string,
  userAgent: string
): Promise<any> => {
  const prompt = `
You are a resume evaluation assistant. Based on the following resume and job description, extract and return a valid JSON with the structure shown below. If any value is not clearly available, use "Not Available".

Resume:
"""${resumeText}"""

Job Description:
"""${jobDescription}"""

Return the JSON strictly in the following format:
{
  "name": "[Extract full name of the candidate]",
  "experience": [Total experience in years as a number, calculated from employment history if available],
  "email": "[Extracted email or mark as Not Available]",
  "phone": "[Extracted phone or mark as Not Available]",
  "currentRole": "[Most recent job title or Not Available]",
  "currentEmployer": "[Most recent company or Not Available]",
  "location": "[Current location or Not Available]",
  "score": [Overall resume fitment score out of 100],
  "resumeQuality": [Score out of 100 for resume hygiene, completeness, and structure],
  "jobStability": [Score out of 100 indicating how stable the career trajectory is],
  "jdFitment": [Score out of 100 based on fitment with the job description],
  "matchedSkills": [List of skills that are explicitly mentioned in the resume and also appear in the job description],
  "missingSkills": [List of important JD skills missing in resume],
  "suggestions": [List of suggestions to improve resume or profile for this role],
  "summary": "[A 2-3 line professional summary based on the resume]"
}

Ensure accuracy in extracted details based on the following:

- Extract "experience" by calculating employment duration from job history, ignoring internships if explicitly stated.
- For "currentRole" and "currentEmployer", use the most recent job title and company from work history.
- For "location", infer from contact section or employment location if mentioned.
- Ensure "matchedSkills" only includes skills that are explicitly written in the resume and are relevant to the JD.
- Provide practical, specific suggestions in "suggestions" based on missing elements, structure issues, or mismatch with JD.
- Make the "summary" sound professional, and reflective of the candidate’s core strengths aligned with the job role.
- Do not hallucinate skills or experience not present in the resume.
- If the resume has significant formatting issues or is missing important sections like work experience or education, deduct points in resumeQuality accordingly.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    // AI cost logging
    const usage = response.usage;
    const tokens = usage?.total_tokens || 0;
    const costInUSD = tokens * 0.001 / 1000; // Approx average cost for GPT-3.5 Turbo
    const costInINR = costInUSD * 90; // Approximate conversion rate
    await db.insert(aiCostLog).values([
      {
        feature: "resume-analysis",
        tokenSize: tokens.toString(),
        costUsd: costInUSD.toString(),
        costInr: costInINR.toString(),
        ipAddress: ipAddress === '::1' ? '127.0.0.1' : ipAddress || 'Unknown',
        userAgent: userAgent || 'Unknown',
      }
    ]);

    const resultText = response.choices[0].message.content;
    const resultJson = JSON.parse(resultText || '{}');
    return resultJson;
  } catch (error: any) {
    console.error("OpenAI API error:", error.message);
    throw new Error("Failed to analyze resume using OpenAI.");
  }
};