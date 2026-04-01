const { GoogleGenAI, Type } = require("@google/genai")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The professional title of the job the candidate is applying for." },
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
        },
        strengths: {
            type: Type.ARRAY,
            description: "A list of the candidate's core strengths.",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The name of the strength or verified skill." },
                    description: { type: Type.STRING, description: "Why this is a strong indicator for the role." }
                },
                required: ["skill", "description"]
            }
        },
        hiringVerdict: { 
            type: Type.STRING, 
            description: "The official hiring verdict: 'Strong Hire', 'Hire', 'Leaning Hire', 'Leaning No Hire', 'No Hire', or 'Strong No Hire'."
        },
        scoreExplanation: { 
            type: Type.STRING, 
            description: "A brutally honest, 2-3 sentence Recruiter-style explanation of why the candidate received this exact matchScore."
        }
    },
    required: ["title", "jobDescription", "resume", "selfDescription", "matchScore", "scoreExplanation", "hiringVerdict", "strengths", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

async function generateInterviewReport({resume , selfDescription , jobDescription}) {

    const prompt = `
    You are an expert, highly rigorous technical recruiter and Hiring Manager. Evaluate this candidate against the provided job description and deliver a comprehensive interview report.
    
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}

    Instructions:
    1. You MUST strictly provide the JSON response matching the required schema. DO NOT wrap with markdown code fences if unsupported.
    2. Be BRUTALLY HONEST. Do not give a 90% score unless the candidate is a near-perfect match. 
    3. The 'scoreExplanation' must clearly justify the 'matchScore' and 'hiringVerdict'.
    4. Provide clear 'strengths' to counterbalance the 'skillGaps'.
    5. Ensure technicalQuestions target both the candidate's stated skills AND the missing skills (to verify their limits).
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
            throw new Error("Gemini API rate limit exceeded");
        } else {
            console.error("❌ Error generating interview report:", error.message || error);
            throw error;
        }
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", 
        margin: {
            top: "10mm",
            bottom: "10mm",
            left: "10mm",
            right: "10mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = {
        type: Type.OBJECT,
        properties: {
            html: { type: Type.STRING, description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer" }
        },
        required: ["html"]
    }

    const prompt = `Generate a tailored, ATS-friendly resume in HTML format for the candidate below.

Candidate Resume: ${resume}
Self Description: ${selfDescription}
Target Job Description: ${jobDescription}

STRICT INSTRUCTIONS:
You MUST output ONLY valid HTML. Do not wrap in markdown blocks.
You MUST follow this exact structure and CSS styling to match the user's specific LaTeX-like academic template:

<style>
  body { font-family: 'Times New Roman', Times, serif; font-size: 11.5px; line-height: 1.35; margin: 0; padding: 20px 30px; color: #000; }
  .header { text-align: center; margin-bottom: 12px; }
  h1 { font-size: 26px; font-weight: normal; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1.5px; }
  .contact-info { font-size: 11px; margin-bottom: 4px; }
  .contact-links { font-size: 10.5px; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
  h2 { font-size: 14px; font-weight: bold; margin: 14px 0 6px 0; border-bottom: 1px solid #000; padding-bottom: 2px; text-transform: uppercase; }
  p { margin: 3px 0; }
  .project-bullets { margin: 4px 0 8px 0; padding-left: 20px; list-style-type: none; }
  .project-bullets li { position: relative; margin-bottom: 3px; }
  .project-bullets li::before { content: "-"; position: absolute; left: -12px; }
  .achievements-bullets { margin: 4px 0 8px 0; padding-left: 20px; list-style-type: disc; }
  .achievements-bullets li { margin-bottom: 4px; padding-left: 4px; }
  .item-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin-top: 8px; }
  .item-sub { display: flex; justify-content: space-between; font-style: italic; font-size: 11px; margin-bottom: 6px; }
  .project-header { font-size: 11.5px; margin-top: 8px; margin-bottom: 4px; }
  .skills-category { font-weight: bold; }
</style>

The HTML must follow exactly this layout pattern. DO NOT output a "Summary" section unless it is absolutely necessary:
<div>
  <div class="header">
    <h1>[CANDIDATE NAME]</h1>
    <div class="contact-info">[Location] e.g. Ghaziabad, India</div>
    <div class="contact-links">
      <span>✉ [Email]</span>
      <span>| in [LinkedIn Handle]</span>
      <span>| 🐙 [GitHub Handle]</span>
      <span>| &lt;/&gt; [Other Handles like LeetCode/Codeforces]</span>
    </div>
  </div>

  <h2>Education</h2>
  <div>
    <div class="item-header"><span>[University/College Name]</span> <span>[Dates e.g. 2023 – 2027]</span></div>
    <div class="item-sub"><span>[Degree e.g. Bachelor of Technology in Computer Science] — CGPA: [Score]</span> <span>[Location]</span></div>
  </div>

  <h2>Projects</h2>
  <div>
    <div class="project-header"><strong>[Project Name]</strong> — <strong>[Short Title]</strong> | [Tech Stack]</div>
    <ul class="project-bullets">
      <li>[Bullet point describing what was built, tailored to job]</li>
      <li>[Bullet point describing impact or technical depth, tailored to job]</li>
    </ul>
  </div>
  <!-- Repeat for max 3 most relevant projects -->

  <h2>Skills</h2>
  <p><span class="skills-category">Languages:</span> [Comma separated]</p>
  <p><span class="skills-category">Web Technologies:</span> [Comma separated]</p>
  <p><span class="skills-category">Databases:</span> [Comma separated]</p>
  <p><span class="skills-category">Tools:</span> [Comma separated]</p>
  <p><span class="skills-category">Core CS:</span> [Comma separated]</p>

  <h2>Achievements</h2>
  <ul class="achievements-bullets">
    <li>[Achievement 1 tailored to job. You can make key words <strong>bold</strong>]</li>
    <li>[Achievement 2 tailored to job]</li>
  </ul>
</div>

RULES:
1. FIT ON EXACTLY 1 PAGE (A4). Do not generate too many bullet points. Max 4 bullets per project.
2. Tailor the bullet points heavily toward the Target Job Description.
3. If information is missing from the candidate's resume, omit the section or field gracefully. DO NOT make up information.
`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema
        }
    })

    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }