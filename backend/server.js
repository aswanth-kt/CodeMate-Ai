import "dotenv/config"; 
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import OpenAI from "openai";

const app = express();
// console.log("Allowed origin:", process.env.FRONTEND_URL);

// Security middleware
app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || process.env.LOCAL_FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try after some time",
})
app.use(limiter);

app.use(express.json({limit: "10mb"}));

const API_KEY = process.env.NEBIUS_API_KEY;

const client = new OpenAI({
    baseURL: 'https://api.studio.nebius.com/v1/',
    apiKey: API_KEY,
});

app.post("api/explain-code", async (req, res) => {
    try {
        const { code, language } = req.body; 

        if (!code) {
            return res.status(400).json({ error: "Code is required" })
        };

        const messages = [
            {
                role: "user",
                content: `Please explain this ${
                    language || ""
                } code in simple terms:\n\n\`\`\`${language || ""}\n${code}
                \n\`\`\``
            }
        ]

        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages,
            temperature: 0.3,
            max_tokens: 800
        });

        const explanation = response?.choices[0]?.message?.content;

        if (!explanation) {
            res.status(500).json({ error: "Failed to explain code" });
        };

        res.json({ explanation, language: language || "unknown" });
        
    } catch (error) {
        console.error("Code Explain API Error:", error);
        res.status(500).json({ error: "Server error", deails: error.message });
    }
})

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`API server on http://localhost:${PORT}`)
});