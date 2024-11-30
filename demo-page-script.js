// Text to Audio Conversion
const textInput = document.getElementById('text-input');
const convertTextToAudioBtn = document.getElementById('convert-text-to-audio');
const audioPlayer = document.getElementById('audio-player');

convertTextToAudioBtn.addEventListener('click', () => {
    const text = textInput.value;
    if (!text) {
        alert('Please enter some text to convert.');
        return;
    }
    
    const API_URL = `https://api.elevenlabs.io/v1/text-to-speech`; // Replace with actual API URL
    const API_KEY = 'YOUR_API_KEY'; // Replace with your API key

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: text,
            voice: 'en_us_male', // Or choose a different voice ID
        })
    })
    .then(response => response.blob())
    .then(blob => {
        const audioUrl = URL.createObjectURL(blob);
        audioPlayer.src = audioUrl;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to convert text to audio.');
    });
});

// Audio to Text
const startRecordingBtn = document.getElementById('start-recording');
const stopRecordingBtn = document.getElementById('stop-recording');
const audioToTextResult = document.getElementById('audio-to-text-result');

let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    startRecordingBtn.addEventListener('click', () => {
        recognition.start();
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
    });

    stopRecordingBtn.addEventListener('click', () => {
        recognition.stop();
        startRecordingBtn.disabled = false;
        stopRecordingBtn.disabled = true;
    });

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        audioToTextResult.textContent = transcript;
    };

    recognition.onerror = (error) => {
        console.error('Error:', error);
        audioToTextResult.textContent = 'Error occurred while recording.';
    };
} else {
    alert('Speech Recognition is not supported in your browser.');
}

// Image to Text
const imageUpload = document.getElementById('image-upload');
const extractTextFromImageBtn = document.getElementById('extract-text-from-image');
const imageTextResult = document.getElementById('image-text-result');

extractTextFromImageBtn.addEventListener('click', () => {
    const file = imageUpload.files[0];
    if (!file) {
        alert('Please upload an image first.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const API_URL = 'https://api.ocr.space/parse/image'; // Replace with OCR API URL

    fetch(API_URL, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.OCRExitCode === 1) {
            imageTextResult.textContent = data.ParsedResults[0].ParsedText;
        } else {
            imageTextResult.textContent = 'Error extracting text from image.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        imageTextResult.textContent = 'Error processing the image.';
    });
});

// Live Audio Translation
const startLiveRecordingBtn = document.getElementById('start-live-recording');
const stopLiveRecordingBtn = document.getElementById('stop-live-recording');
const liveAudioTranslationResult = document.getElementById('live-audio-translation-result');

let liveRecognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    liveRecognition = new SpeechRecognition();
    liveRecognition.lang = 'en-US';
    liveRecognition.interimResults = true;
    liveRecognition.continuous = true;

    startLiveRecordingBtn.addEventListener('click', () => {
        liveRecognition.start();
        startLiveRecordingBtn.disabled = true;
        stopLiveRecordingBtn.disabled = false;
    });

    stopLiveRecordingBtn.addEventListener('click', () => {
        liveRecognition.stop();
        startLiveRecordingBtn.disabled = false;
        stopLiveRecordingBtn.disabled = true;
    });

    liveRecognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        liveAudioTranslationResult.textContent = transcript;
    };

    liveRecognition.onerror = (error) => {
        console.error('Error:', error);
        liveAudioTranslationResult.textContent = 'Error occurred during live recording.';
    };
} else {
    alert('Live Audio Translation is not supported in your browser.');
}
