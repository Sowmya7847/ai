// Function to handle navigation to different pages or external URLs
function navigate(destination) {
    window.location.href = destination; // Navigate to the provided URL or page
}

// Set up event listeners for clickable text elements (h4 tags)
document.getElementById("text-to-audio").addEventListener("click", function() {
    navigate("https://white-alleen-75.tiiny.site");
});

document.getElementById("audio-to-text").addEventListener("click", function() {
    navigate("https://lime-aigneis-41.tiiny.site");
});

document.getElementById("image-to-text").addEventListener("click", function() {
    navigate("https://itt.tiiny.site");
});

document.getElementById("multilingual-translation").addEventListener("click", function() {
    navigate("multilingual-translation");
});

// Back to the starting page
document.getElementById("back-button").addEventListener("click", function() {
    navigate("index.html");
});
