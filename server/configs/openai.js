import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Separate OpenAI client for image generation using DALL-E
let openaiImages = null;
if (process.env.OPENAI_API_KEY) {
    openaiImages = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

export default openai;
export { openaiImages };
