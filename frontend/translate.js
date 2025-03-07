function googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');

    // Ensure stored language is applied after Google Translate loads
    setTimeout(() => {
        let savedLang = localStorage.getItem("selectedLanguage");
        if (savedLang) {
            applyGoogleTranslate(savedLang);
        }
    }, 1000);
}

// Function to apply stored language
function applyGoogleTranslate(lang) {
    let select = document.querySelector(".goog-te-combo");
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
    }
}

// Show/hide the translate dropdown when button is clicked
document.addEventListener("DOMContentLoaded", function () {
    let translateBtn = document.getElementById("translate-btn");
    let translateElement = document.getElementById("google_translate_element");

    if (translateBtn) {
        translateBtn.addEventListener("click", function () {
            translateElement.style.display = translateElement.style.display === "block" ? "none" : "block";
        });
    }

    // Listen for language change and store it
    setTimeout(() => {
        let select = document.querySelector(".goog-te-combo");
        if (select) {
            select.addEventListener("change", function () {
                let selectedLang = select.value;
                localStorage.setItem("selectedLanguage", selectedLang);
            });
        }
    }, 2000);
});

// Load Google Translate Script dynamically
(function () {
    let script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
})();
