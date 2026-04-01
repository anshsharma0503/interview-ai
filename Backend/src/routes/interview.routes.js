const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")


const interviewRouter = express.Router()


/**
 * @route POST /api/interview/
 * @description Generate new interview report on the basis of user self description , resume and job description
 * @access Private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)


/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interview ID
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description Get all interview reports of logged in user
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * @route GET /api/interview/:interviewReportId/resume
 * @description Generate and download a tailored resume PDF for a given interview report
 * @access Private
 */
interviewRouter.get("/:interviewReportId/resume", authMiddleware.authUser, interviewController.generateResumePdfController)


module.exports = interviewRouter