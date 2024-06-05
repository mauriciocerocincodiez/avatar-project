async function sendQuery() {
    const query = document.getElementById('query').value;
    const responseTextElement = document.getElementById('responseText');

    try {
        const response = await fetch('/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        const aiResponse = data.response;
        responseTextElement.textContent = aiResponse;
        speakText(aiResponse);
    } catch (error) {
        console.error('Error:', error);
        responseTextElement.textContent = 'Error procesando la solicitud';
    }
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.onstart = function() {
            console.log('SpeechSynthesisUtterance started.');
        };
        utterance.onend = function() {
            console.log('SpeechSynthesisUtterance ended.');
        };
        utterance.onerror = function(event) {
            console.error('SpeechSynthesisUtterance error:', event.error);
        };
        window.speechSynthesis.speak(utterance);
    } else {
        console.error('Speech synthesis not supported in this browser.');
        document.getElementById('responseText').textContent += ' (El navegador no admite síntesis de voz)';
    }
}
