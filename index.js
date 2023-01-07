const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
dotenv.config();

const configuration = new Configuration({
    organization: "org-TstK7AFz5l16qnie6GqYkCYm",
    //apiKey: process.env.OPENAI_API_KEY,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Add body parser and cors to express
const app  = express()
app.use(bodyParser.json())
app.use(cors())

const port = 3080

app.post('/', async (req, res) => {
    const { message, currentModel } = req.body;
    console.log(message, "message");
    console.log(currentModel, "currentModel");

    const response = await openai.createCompletion({
        model: `${currentModel}`,
        prompt: `${message}`,
        max_tokens: 100,
        temperature: 0.5,
      });

      res.json({
        message: response.data.choices[0].text
      })
      console.log(response.data.choices[0].text)
});

app.get('/models', async (req, res) => {
    const response = await openai.listEngines();
    console.log(response.data.data);
    res.json({
        models: response.data.data
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})