import { useState } from 'react';

// Sample data to mock the backend response during development
const mockReportData = {
  "matchScore": 88,
  "technicalQuestions": [
    {
      "question": "Explain the concept of middleware in Express.js and provide an example of how you've used it in your projects.",
      "intention": "Assess understanding of Express.js architecture and practical application of middleware for tasks like authentication or logging.",
      "answer": "Middleware functions in Express.js have access to the request object (req), the response object (res), and the next middleware function. They can execute code, make changes to the request/response, end the cycle, or call the next middleware. In my Blog project, I used an auth middleware to verify JWTs."
    },
    {
      "question": "You mentioned using MongoDB in your projects. How would you model a 'many-to-many' relationship between users and groups in MongoDB?",
      "intention": "Evaluate database modeling skills specific to NoSQL (MongoDB) and understanding of design trade-offs.",
      "answer": "For a many-to-many relationship, I'd typically use reference-based modeling. A `User` document might have an array of `groupIds`, and a `Group` document might have an array of `userIds`. This requires an additional query or `$lookup` aggregation but avoids severe data duplication."
    },
    {
      "question": "Describe how you would design a REST API for a 'Task Management' system following RESTful principles.",
      "intention": "Assess understanding of RESTful API design principles, resource modeling, and practical endpoint structuring.",
      "answer": "`POST /users/{userId}/tasks` to create; `GET /users/{userId}/tasks` to list; `GET /users/{userId}/tasks/{taskId}` to fetch one; `PUT /users/{userId}/tasks/{taskId}` to update; `DELETE /users/{userId}/tasks/{taskId}` to delete. I'd use standard HTTP status codes and validation middleware."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a time you faced a significant technical challenge in one of your projects.",
      "intention": "Problem-solving, perseverance, and ability to articulate complex technical issues.",
      "answer": "In my Blog Platform, I struggled with secure file uploads integrated with MongoDB. Storing images as Base64 strings was inefficient. I researched and pivoted to `multer` for local uploads, storing only the path in MongoDB, vastly improving performance."
    },
    {
      "question": "Tell me about a time when you received difficult feedback on your work. How did you react?",
      "intention": "Receptiveness to feedback, humility, growth mindset.",
      "answer": "During a project review, a peer pointed out inconsistent error handling in my API. Initially defensive, I recognized the validity, researched best practices, and refactored to centralized error middleware. The API became much more robust."
    }
  ],
  "skillGaps": [
    { "skill": "Database Query Optimization (MongoDB)", "severity": "high" },
    { "skill": "Advanced System Design for Scalability", "severity": "medium" }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "MongoDB Query Optimization & Indexing",
      "tasks": [
        "Read MongoDB docs on indexing strategies.",
        "Practice using `explain()` for query analysis.",
        "Learn the aggregation pipeline."
      ]
    },
    {
      "day": 2,
      "focus": "System Design Basics & Scalability Concepts",
      "tasks": [
        "Review load balancing, caching, sharding.",
        "Study architectural patterns for scalable apps.",
        "Focus on how to scale Node.js/Express apps."
      ]
    },
    {
      "day": 3,
      "focus": "Node.js/Express Advanced Topics",
      "tasks": [
        "Deepen understanding of the Node.js event loop.",
        "Explore process management tools like PM2.",
        "Review Express.js security best practices."
      ]
    }
  ]
};

export const useInterview = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock fetching the report
    const getReportById = async (interviewId) => {
        setLoading(true);
        // Simulate a network request delay
        setTimeout(() => {
            setReport(mockReportData);
            setLoading(false);
        }, 800);
    };

    // Mock downloading the resume
    const getResumePdf = async (interviewId) => {
        alert("Downloading resume for interview: " + interviewId);
    };

    return {
        report,
        loading,
        getReportById,
        getResumePdf
    };
};
