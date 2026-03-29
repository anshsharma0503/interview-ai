const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const InterviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req , res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required"
            });
        }
        
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        const { jobDescription , selfDescription } = req.body

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text || resumeContent,
            selfDescription,
            jobDescription
        })

        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text || resumeContent, // properly extract text string from the parsed object
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })
        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = { generateInterviewReportController }
    
