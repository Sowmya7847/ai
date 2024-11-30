// Your AssemblyAI API key (should ideally be in a secure backend in production)
const API_KEY = "50a4fa7da6b04dc18eacb46dfd9c36f9"; // Replace with your actual API key

document.getElementById("video-file").addEventListener("change", handleFileUpload);
document.getElementById("transcribe-btn").addEventListener("click", transcribeVideo);

let videoBlob;

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const videoPlayer = document.getElementById("video-player");
        const fileURL = URL.createObjectURL(file);
        videoPlayer.src = fileURL;

        const reader = new FileReader();
        reader.onload = () => {
            videoBlob = new Blob([reader.result], { type: file.type });
        };
        reader.readAsArrayBuffer(file);
    }
}

async function transcribeVideo() {
    if (!videoBlob) {
        alert("Please upload a video file first!");
        return;
    }

    const transcriptionOutput = document.getElementById("transcription-output");
    transcriptionOutput.textContent = "Uploading video...";

    const API_URL = "https://api.assemblyai.com/v2/transcript";

    try {
        // Step 1: Upload the video file to AssemblyAI
        const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
            method: "POST",
            headers: { Authorization: API_KEY },
            body: videoBlob,
        });

        const uploadData = await uploadResponse.json();
        const videoUrl = uploadData.upload_url;

        transcriptionOutput.textContent = "Video uploaded. Processing transcription...";

        // Step 2: Request transcription
        const transcriptionResponse = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ audio_url: videoUrl }),
        });

        const transcriptionData = await transcriptionResponse.json();
        const transcriptID = transcriptionData.id;

        // Step 3: Poll for transcription status
        const pollInterval = 2000; // Poll every 2 seconds
        while (true) {
            const pollResponse = await fetch(`${API_URL}/${transcriptID}`, {
                headers: { Authorization: API_KEY },
            });

            const pollData = await pollResponse.json();

            if (pollData.status === "completed") {
                transcriptionOutput.textContent = pollData.text;
                break;
            } else if (pollData.status === "failed") {
                transcriptionOutput.textContent = "Transcription failed. Please try again.";
                return;
            }

            transcriptionOutput.textContent = "Processing transcription...";
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
        }
    } catch (error) {
        transcriptionOutput.textContent = "An error occurred during transcription.";
        console.error(error);
    }
}
