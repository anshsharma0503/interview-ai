# AI Interview Assistant & Resume Tailoring System

A full-stack web application designed to help users prepare for technical and behavioral interviews. It leverages AI (Google Gemini) to analyze your resume and target job descriptions, generating tailored interview questions, skill gap analyses, and ATS-optimized PDF resumes.

## 🚀 Features

- **User Authentication:** Secure JWT-based registration and login system.
- **Resume Processing:** Upload a PDF resume and automatically parse its contents.
- **AI-Powered Insights:** Uses Google GenAI to evaluate your resume against a specific job description.
- **Interview Generation:** Dynamically generates technical questions, behavioral questions, and a structured preparation plan.
- **Tailored Resumes:** Automatically generates a customized PDF version of your resume tailored strictly to the targeted role using Puppeteer.
- **Modern Responsive UI:** Built specifically with React 19, Vite, and SCSS following a clean component architecture.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** Vanilla SCSS
- **HTTP Client:** Axios

### Backend
- **Framework:** Node.js + Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
- **AI Integration:** `@google/genai`
- **PDF Handling:** `pdf-parse` (v2) for reading, `puppeteer` for generating customized PDFs
- **File Uploads:** `multer`
- **Validation:** `zod`

---

## 🏗️ Project Structure

```text
├── Backend/
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── middlewares/      # Auth & file upload middlewares
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express API routes
│   │   └── services/         # Business logic (AI processing, PDF gen)
│   ├── server.js             # Entry point
│   └── package.json          # Backend dependencies
│
└── Frontend/
    ├── src/
    │   ├── features/         # Feature-based architecture (Auth, Interview)
    │   ├── shared/           # Reusable components & hooks
    │   └── app.routes.jsx    # React Router definitions
    ├── index.html            # Vite HTML template
    └── package.json          # Frontend dependencies
```

---

## 💻 Local Setup & Development

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [MongoDB](https://www.mongodb.com/) account (or local instance)
- [Google Gemini API Key](https://aistudio.google.com/)

### 2. Backend Setup
Navigate to the `Backend` directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory containing:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Run the development server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the `Frontend` directory and install dependencies:
```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:
```env
VITE_API_URL=http://localhost:3000/api
```

Run the Vite development server:
```bash
npm run dev
```

---

## 🌐 Deployment (Vercel)

This application is configured for deployment on [Vercel](https://vercel.com).
- A `vercel.json` file is included in the `Frontend` directory to ensure React Router gracefully handles Single Page Application (SPA) re-writes.
- Ensure that you configure the correct Environment Variables inside the Vercel dashboard prior to building.

---

## 📝 License
This project is open-source and available under the ISC License.
