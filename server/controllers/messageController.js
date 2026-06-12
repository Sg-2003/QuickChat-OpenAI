import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";
import genAI from "../configs/gemini.js";


// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        // check for credits
        if (req.user.credits < 1) {
            return res.json({ success: false, message: "You don't have enough credits to use this feature" })
        }

        const { chatId, prompt } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.json({ success: false, message: "Chat not found" });
        }
        if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
            return res.json({ success: false, message: "AI service not configured" });
        }
        chat.messages.push({
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
        })
        const messages = chat.messages.slice(0, -1).map(msg => ({
            role: msg.role,
            content: msg.content,
        }));
        messages.push({ role: 'user', content: prompt });

        let text;
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
            });
            text = completion.choices[0].message.content;
        } catch (openaiError) {
            console.log("OpenAI text chat failed, falling back to Gemini:", openaiError.message);
            const geminiHistory = chat.messages.slice(0, -1).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })).filter(h => h.role === 'user' || h.role === 'model');

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const chatSession = model.startChat({
                history: geminiHistory,
            });
            const result = await chatSession.sendMessage(prompt);
            text = result.response.text();
        }

        const reply = { role: 'assistant', content: text, timestamp: Date.now(), isImage: false }
        res.json({ success: true, reply })
        chat.messages.push(reply);
        await chat.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Image Generation Message Controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        // check credits
        if (req.user.credits < 2) {
            return res.json({ success: false, message: "You don't have enough credits to use this feature" })
        }
        const { chatId, prompt, isPublished } = req.body;
        //Find chat
        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.json({ success: false, message: "Chat not found" });
        }

        // Push user messages
        chat.messages.push({
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })

        let uploadResponse;
        try {
            // Generate image using OpenAI DALL-E
            const aiImageResponse = await openai.images.generate({
                model: "dall-e-2",
                prompt: prompt,
                n: 1,
                size: "512x512",
            });

            const imageUrl = aiImageResponse.data[0].url;

            // Fetch the image from OpenAI URL
            const imageBufferResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

            // Convert to Base64
            const base64Image = `data:image/jpeg;base64,${Buffer.from(imageBufferResponse.data, 'binary').toString('base64')}`;

            // Upload to ImageKit Media Library
            uploadResponse = await imagekit.upload({
                file: base64Image,
                fileName: `${Date.now()}.jpg`,
                folder: 'quickgpt',
            });
        } catch (openaiError) {
            console.log("OpenAI Image generation failed, falling back to LoremFlickr:", openaiError.message);
            // Fallback to LoremFlickr matching search term
            const fallbackUrl = `https://loremflickr.com/512/512/${encodeURIComponent(prompt.trim())}`;
            
            // Fetch image from LoremFlickr URL
            const imageBufferResponse = await axios.get(fallbackUrl, { responseType: 'arraybuffer' });
            
            // Convert to Base64
            const base64Image = `data:image/jpeg;base64,${Buffer.from(imageBufferResponse.data, 'binary').toString('base64')}`;
            
            // Upload to ImageKit Media Library
            uploadResponse = await imagekit.upload({
                file: base64Image,
                fileName: `${Date.now()}.jpg`,
                folder: 'quickgpt',
            });
        }

        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished,
        }

        res.json({ success: true, reply });

        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
