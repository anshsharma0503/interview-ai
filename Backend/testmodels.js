const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
const fs = require('fs');

async function test() {
    try {
        // We will just test if a model works with a simple prompt
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash", 
            contents: "hi",
        });
        fs.writeFileSync("test_output.txt", "SUCCESS: " + response.text);
    } catch(e) {
        let modelsList = [];
        try {
            // let's try calling without specifying version 
            const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENAI_API_KEY}`);
            const data = await resp.json();
            modelsList = data.models.map(m => m.name);
        } catch(err) {}
        fs.writeFileSync("test_output.txt", "ERROR: " + e.message + "\nMODELS: " + JSON.stringify(modelsList));
    }
}
test();
