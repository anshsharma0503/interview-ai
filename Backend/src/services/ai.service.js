const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    jobDescription: z.string(),
    resume: z.string(),
    selfDescription: z.string(),
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The exact technical question to ask the candidate."),
        intention: z.string().describe("Why you are asking this question and what signal you are looking for."),
        answer: z.string().describe("A great example answer from the candidate.")
    })).min(3).describe("A mandatory list of at least 3 technical questions. DO NOT leave this empty."),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The exact behavioral question to ask."),
        intention: z.string().describe("The core soft skill or trait being evaluated."),
        answer: z.string().describe("A great STAR method example answer.")
    })).min(2).describe("A mandatory list of at least 2 behavioral questions. DO NOT leave this empty."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The name of the missing skill."),
        severity: z.enum(["low", "medium", "high"]).describe("How critical this missing skill is.")
    })).describe("A list of missing skills. Provide at least one noticeable gap if any exist."),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number, e.g., 1, 2, 3."),
        focus: z.string().describe("The main topic to focus on for this day."),
        tasks: z.array(z.string()).describe("List of concrete tasks to complete.")
    })).min(3).describe("A mandatory 3-day minimum preparation plan schedule.")
})  

async function generateInterviewReport({resume , selfDescription , jobDescription}) {

    const prompt = `
    You are an expert technical interviewer and recruiter. Generate a comprehensive interview report based on the following candidate information:
    
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}

    You MUST strictly provide the following in your JSON response:
    1. matchScore: A number from 0 to 100 evaluating how well the resume matches the job description.
    2. technicalQuestions: Generate exactly 5 technical questions based on the Job Description and the candidate's skills. Include the intention behind the question and how to answer it.
    3. behavioralQuestions: Generate exactly 3 behavioral questions based on the candidate's self description and resume. Include the intention and how to answer.
    4. skillGaps: Identify any missing skills required by the job but missing from the resume. Rate severity as low, medium, or high.
    5. preparationPlan: Provide a day-by-day plan with specific focus areas and tasks to help them prepare for this specific interview.
    `   

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema)
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        if (error.status === 429) {
            console.error("⚠️ Rate Limit Exceeded: You have hit the Gemini API quota. Please wait before making more requests.");
        } else {
            console.error("❌ Error generating interview report:", error.message || error);
        }
    }
}   

//invokeGeminiAi()

module.exports = generateInterviewReport 