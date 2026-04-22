const { PDFParse } = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const InterviewReportModel = require("../models/interviewReport.model")

/**
 * @route POST /api/interview/
 * @description Generate new interview report on the basis of user self description , resume and job description
 * @access Private
 */

async function generateInterviewReportController(req , res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required"
            });
        }
        
        let textContent = "";
        if (req.file) {
            const parser = new PDFParse({ data: req.file.buffer });
            const result = await parser.getText();
            textContent = result.text;
            await parser.destroy();
        } // extract text from resume
        const { jobDescription , selfDescription } = req.body

        const interViewReportByAi = await generateInterviewReport({
            resume: textContent,
            selfDescription,
            jobDescription
        })

        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,
            resume: textContent,
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


/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interview ID
 * @access Private
 */ 
async function getInterviewReportByIdController(req , res) {
    try {
        const { interviewId } = req.params
        const interviewReport = await InterviewReportModel.findOne({ _id: interviewId , user: req.user.id})
        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }
        res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}   


/**
 * @route GET /api/interview/
 * @description Get all interview reoprt of logged in user
 * @access Private
 */
async function getAllInterviewReportsController(req , res) {
    try {
        const interviewReports = await InterviewReportModel.find({ user: req.user.id}).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
        if (!interviewReports) {
            return res.status(404).json({
                message: "Interview reports not found"
            })
        }
        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

/**
 * @route GET /api/interview/:interviewReportId/resume
 * @description Generate a tailored resume PDF for a given interview report
 * @access Private
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params
        const interviewReport = await InterviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" })
        }

        const resumeHtml = await generateResumePdf({
            resume: interviewReport.resume,
            selfDescription: interviewReport.selfDescription,
            jobDescription: interviewReport.jobDescription
        })

        const puppeteer = require("puppeteer")
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
        const page = await browser.newPage()
        await page.setContent(resumeHtml, { waitUntil: 'networkidle0' })
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })
        await browser.close()
        
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename=resume_${interviewReportId}.pdf`)
        res.status(200).send(pdfBuffer)
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
    
