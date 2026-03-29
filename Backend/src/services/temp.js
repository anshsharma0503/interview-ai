const resume = `
{
  "personal_info": {
    "name": "Rahul Verma",
    "email": "rahul.verma@gmail.com",
    "phone": "9876543210",
    "location": "Delhi, India",
    "linkedin": "linkedin.com/in/rahulverma",
    "github": "github.com/rahulverma"
  },
  "education": [
    {
      "degree": "B.Tech in Computer Science",
      "institution": "ABC Institute of Technology",
      "year": "2025",
      "cgpa": "8.4"
    }
  ],
  "skills": {
    "languages": ["C++", "JavaScript", "Python"],
    "frameworks": ["React", "Node.js"],
    "tools": ["Git", "Docker", "VS Code"],
    "core_subjects": ["DSA", "Operating Systems", "DBMS"]
  },
  "experience": [
    {
      "role": "Software Intern",
      "company": "XYZ Tech",
      "duration": "Jan 2024 - June 2024",
      "description": [
        "Developed REST APIs using Node.js",
        "Improved query performance by 30%"
      ]
    }
  ],
  "projects": [
    {
      "title": "Interview AI Assistant",
      "tech_stack": ["React", "Node.js", "OpenAI API"],
      "description": [
        "Built AI-based mock interview system",
        "Generated dynamic questions based on resume"
      ]
    },
    {
      "title": "E-commerce Website",
      "tech_stack": ["MERN"],
      "description": [
        "Implemented user authentication",
        "Integrated payment gateway"
      ]
    }
  ],
  "achievements": [
    "Solved 500+ DSA problems on LeetCode",
    "Ranked top 5% in coding contest"
  ],
  "certifications": [
    "Data Structures and Algorithms - Coursera"
  ]
}
`;

const selfDescription = `
Hi, I am Rahul Verma, a final year computer science student with a strong background in software engineering. I am deeply passionate about web development, particularly using the MERN stack. Over the past few years, I have built several projects, including an AI-based mock interview system and an e-commerce website. During my recent internship at XYZ Tech, I gained practical experience in building REST APIs and optimizing database queries using Node.js. I am eager to apply my problem-solving skills and technical background to real-world software engineering challenges.
`;

const jobDescription = `
{
  "role": "Software Engineer Intern",
  "company": "TechNova Solutions",
  "location": "Bangalore, India",
  "type": "Internship",
  "duration": "6 months",
  "required_skills": [
    "Data Structures and Algorithms",
    "C++ or Java",
    "Problem Solving",
    "Basic System Design",
    "Git"
  ],
  "preferred_skills": [
    "React",
    "Node.js",
    "Database Management (SQL/NoSQL)",
    "Operating Systems"
  ],
  "responsibilities": [
    "Write clean and efficient code",
    "Solve algorithmic problems",
    "Collaborate with team on real-world projects",
    "Debug and optimize applications"
  ],
  "eligibility": {
    "degree": "B.Tech / B.E in Computer Science or related field",
    "year": "3rd or 4th year",
    "cgpa": "7.0+"
  }
}
`;



module.exports = { resume , selfDescription , jobDescription }