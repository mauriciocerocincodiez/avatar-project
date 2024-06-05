require('dotenv').config();
const express = require('express');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
const app = express();
const port = 3000;

// Configurar OpenAI usando la variable de entorno
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ruta para manejar las consultas
app.post('/query', async (req, res) => {
    const { query } = req.body;

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "Eres un asistente que da información sobre Literatura"},
                {"role": "user", "content": query}
            ],
            temperature: 0,
            max_tokens: 60,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
        });

        const aiResponse = response.data.choices[0].message.content;
        res.json({ response: aiResponse });
    } catch (error) {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error('Error en la respuesta:', error.response.data);
            console.error('Código de estado:', error.response.status);
            console.error('Encabezados:', error.response.headers);
        } else if (error.request) {
            // La solicitud se hizo pero no se recibió respuesta
            console.error('Error en la solicitud:', error.request);
        } else {
            // Algo pasó al configurar la solicitud que desencadenó un error
            console.error('Error en la configuración:', error.message);
        }
        console.error('Configuración:', error.config);
        res.status(500).send('Error procesando la solicitud');
    }
    
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
