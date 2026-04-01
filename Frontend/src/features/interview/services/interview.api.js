import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.PROD 
        ? import.meta.env.VITE_API_BASE_URL 
        : "http://localhost:3000",
    withCredentials: true,
});

/**
 * @route POST /api/interview/
 * @description Generate new interview report on the basis of user self description , resume and job description
 * @access Private
 */

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    try {
        const formData = new FormData()
        formData.append("jobDescription", jobDescription)
        formData.append("selfDescription", selfDescription)
        formData.append("resume", resumeFile)
        const response = await api.post("/api/interview/", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }   
        })
        return response.data
    } catch (error) {
        console.error("Error generating interview report:", error)
        throw error
    }
}     

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by ID
 * @access Private
 */

export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`)
        return response.data
    } catch (error) {
        console.error("Error fetching interview report:", error)
        throw error
    }
}

/**
 * @route GET /api/interview/
 * @description Get all interview reports
 * @access Private
 */

export const getAllInterviewReports = async () => {
    try {
        const response = await api.get("/api/interview/")
        return response.data
    } catch (error) {
        console.error("Error fetching interview reports:", error)
        throw error
    }
}

/**
 * @route GET /api/interview/:interviewReportId/resume
 * @description Get resume PDF
 * @access Private
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    try {
        const response = await api.get(`/api/interview/${interviewReportId}/resume`, {
            responseType: 'blob' // CRITICAL for parsing PDF data natively!
        })
        return response.data
    } catch (error) {
        console.error("Error fetching resume PDF:", error)
        throw error
    }
}