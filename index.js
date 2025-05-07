require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { default: axios } = require('axios');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are a Human. Your name is Kayes."
});

app.get('/romet-detector', async (req, res) => {

    const prompt = req.query?.prompt;

    if (!prompt) {
        res.send({ massage: 'Please Provide a prompt with query' })
        return
    }
    const chat = model.startChat({

        history: [
            {
                role: "user",
                parts: [ {
                    text: "There's a rumor going around that Apple is secretly working on a foldable iPhone that's also transparent when inactive. Insiders say it might even charge using solar energy and feature AI that can detect your mood and adjust the UI colors accordingly. While Apple hasn't confirmed anything, patents filed in early 2025 suggest something big is coming later this year."
                } ],
            },
            {
                role: "model",
                parts: [ { text: "rumar parsent 99%" } ],
            },
            {
                role: "user",
                parts: [ {
                    text: "Human Can Fly"
                } ],
            },
            {
                role: "model",
                parts: [ { text: "rumar parsent 109%" } ],
            },
        ],
    });
    let result = await chat.sendMessage(prompt)
    const ans = result.response.text()
    res.send({ rumarstatys: ans })
})

// this is something text
app.get('/test-ai', async (req, res) => {
    const prompt = req.query?.prompt;
    if (!prompt) {
        res.send({ massage: 'Please Provide a prompt with query' })
        return
    }
    const result = await model.generateContent(prompt);
    const response = result.response;
    // const text = response.text(); 
    res.send({ reply: response.text() });
})

// this is for json Data
app.get('/genarat-json', async (req, res) => {
    const prompt = req.query?.prompt;

    if (!prompt) {
        res.send({ massage: 'Please Provide a prompt with query' })
        return
    }
    const finalprompt = `genarate some data from this prompt   using this JSON schema:

    Recipe = {'recipeName': string}
    Return: Array<Recipe>`;



    const result = await model.generateContent(finalprompt)
    const output = result.response.text().slice(7, -4)
    const jsonData = JSON.parse(output)
    res.send(jsonData)
})

// this is for img
app.get('/gen', async (req, res) => {
    const prompt = req.query?.prompt;
    if (!prompt) {
        res.send({ massage: 'Please Provide a prompt with query' })
        return
    }
    const response = await axios.get(prompt, { responseType: 'arraybuffer' })


    const base64Image = Buffer.from(response.data).toString('base64');

    // Prepare inlineData for Gemini input
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: 'image/png', // or image/jpeg if that's the actual type
        },
    };
    const result = await model.generateContent([
        "Tell me the detail about this image",
        imagePart,
    ]);

    //   console.log(response.data)
    res.send({ detail: result.response.text() })
})

app.get('/', (req, res) => {
    res.send({ massage: 'Lets Crack the power of  ChatGPT_AI  ' })
})
app.listen(port, () => {
    console.log('ChatGPT_AI server is running on port', port)
})