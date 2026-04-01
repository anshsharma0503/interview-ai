const { GoogleGenAI, Type } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        jobDescription: { type: Type.STRING },
        resume: { type: Type.STRING },
        selfDescription: { type: Type.STRING },
        matchScore: { type: Type.NUMBER },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "A list of technical questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The exact technical question to ask the candidate." },
                    intention: { type: Type.STRING, description: "Why you are asking this question and what signal you are looking for." },
                    answer: { type: Type.STRING, description: "A great example answer from the candidate." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "A list of behavioral questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The exact behavioral question to ask." },
                    intention: { type: Type.STRING, description: "The core soft skill or trait being evaluated." },
                    answer: { type: Type.STRING, description: "A great STAR method example answer." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "A list of missing skills.",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The name of the missing skill." },
                    severity: { type: Type.STRING, description: "Severity of the gap: low, medium, or high." }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A day-by-day plan.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER, description: "The day number, e.g., 1, 2, 3." },
                    focus: { type: Type.STRING, description: "The main topic to focus on for this day." },
                    tasks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING, description: "A task to complete." }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["jobDescription", "resume", "selfDescription", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

async function generateInterviewReport({resume , selfDescription , jobDescription}) {

    const prompt = `
    You are an expert technical interviewer and recruiter. Generate a comprehensive interview report based on the following candidate information:
    
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}

    You MUST strictly provide the JSON response matching the required schema schema. 
    Ensure technicalQuestions and behavioralQuestions are an array of OBJECTS, each containing a 'question', 'intention', and 'answer'. Do NOT just return an array of strings.
    `   

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewReportSchema
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

module.exports = generateInterviewReport 