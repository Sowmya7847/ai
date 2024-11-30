// JavaScript for Navigation to Main Page
document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to the navigation button (if using a button)
    const navigateButton = document.getElementById("navigate-main");
    if (navigateButton) {
        navigateButton.addEventListener("click", () => {
            window.location.href = "main-page.html"; // Navigate to main page
        });
    }
});
