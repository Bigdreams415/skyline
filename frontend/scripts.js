let currentStep = 1;
const steps = document.querySelectorAll('.step');

function showStep(step) {
    steps.forEach((stepElement, index) => {
        if (index === step - 1) {
            stepElement.classList.add('active');
        } else {
            stepElement.classList.remove('active');
        }
    });
}

function nextStep(step) {
    if (step < steps.length) {
        // If we're on the last step, populate the review summary
        if (step === steps.length - 1) {
            populateReviewSummary();
        }
        currentStep = step + 1;
        showStep(currentStep);
    }
}

function prevStep(step) {
    if (step > 1) {
        currentStep = step - 1;
        showStep(currentStep);
    }
}

// Function to populate the review summary on the last step
function populateReviewSummary() {
    const reviewSummary = document.getElementById('reviewSummary');
    
    const formData = new FormData(document.getElementById('signupForm'));
    const data = Object.fromEntries(formData.entries());
    let summaryHTML = '<ul>';
    for (const [key, value] of Object.entries(data)) {
        const label = document.querySelector(`label[for="${key}"]`);
        summaryHTML += `<li><strong>${label ? label.textContent : key}:</strong> ${value}</li>`;
    }
    summaryHTML += '</ul>';
    reviewSummary.innerHTML = summaryHTML;
}

// Handle form submission for backend integration
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();


    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');

    
    emailInput.value = emailInput.value.trim().toLowerCase();
    usernameInput.value = usernameInput.value.trim().toLowerCase();

     
    const formData = new FormData(document.getElementById('signupForm'));
    const data = Object.fromEntries(formData.entries());

     
    if (data.password !== data.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

     
    try {
        const response = await fetch('https://skyline-m7ka.onrender.com/signup', {
            method: 'POST',
            body: formData,  
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
            return;
        }

        const result = await response.json();
        alert(`Account created successfully! Account Number: ${result.accountNumber}`);
        
        // Redirect to the login page
        window.location.href = 'login.html';
        // Reset the form after successful submission
        document.getElementById('signupForm').reset();
        steps[0].style.display = 'block'; // Reset to step 1
        steps[steps.length - 1].style.display = 'none'; // Hide the final step
    } catch (error) {
        console.error("Error occurred while signing up:", error);
        alert('An error occurred. Please try again later.');
    }
});


 
showStep(currentStep);
