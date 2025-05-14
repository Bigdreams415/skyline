let currentStep = 1;
const steps = document.querySelectorAll('.step');
const progressSteps = document.querySelectorAll('.progress-step');
const progress = document.getElementById('progress');

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    showStep(currentStep);
    updateProgressBar();
    
    // Add PIN validation
    const pinInput = document.getElementById('pin');
    pinInput.addEventListener('input', validatePin);
});

function showStep(step) {
    steps.forEach((stepElement, index) => {
        if (index === step - 1) {
            stepElement.classList.add('active');
        } else {
            stepElement.classList.remove('active');
        }
    });
    
    updateProgressBar();
}

function updateProgressBar() {
    progressSteps.forEach((step, index) => {
        if (index < currentStep - 1) {
            step.classList.add('completed');
            step.classList.add('active');
        } else if (index === currentStep - 1) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active');
            step.classList.remove('completed');
        }
    });
    
    // Update progress bar width
    const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;
    progress.style.width = `${progressPercent}%`;
}

function nextStep(step) {
    // Validate current step before proceeding
    if (!validateStep(step)) {
        return;
    }
    
    if (step < steps.length) {
        if (step === steps.length - 1) {
            populateReviewSummary();
        }
        currentStep = step + 1;
        showStep(currentStep);
        
        // Scroll to top of form
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    }
}

function prevStep(step) {
    if (step > 1) {
        currentStep = step - 1;
        showStep(currentStep);
    }
}

function validateStep(step) {
    let isValid = true;
    const currentStepElement = document.getElementById(`step${step}`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
            
            // Add shake animation to highlight error
            input.classList.add('shake');
            setTimeout(() => {
                input.classList.remove('shake');
            }, 500);
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    // Additional validation for step 3 (password and PIN)
    if (step === 3) {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            document.getElementById('password').style.borderColor = '#e74c3c';
            document.getElementById('confirmPassword').style.borderColor = '#e74c3c';
            alert('Passwords do not match!');
            isValid = false;
        }
        
        if (!validatePin()) {
            isValid = false;
        }
    }
    
    return isValid;
}

function validatePin() {
    const pinInput = document.getElementById('pin');
    const pinError = document.getElementById('pin-error');
    const pin = pinInput.value;
    
    if (pin.length > 4) {
        pinInput.value = pin.substring(0, 4);
        pinError.textContent = 'PIN must be exactly 4 digits';
        pinError.style.display = 'block';
        pinInput.style.borderColor = '#e74c3c';
        return false;
    }
    
    if (pin.length === 4 && !/^\d+$/.test(pin)) {
        pinError.textContent = 'PIN must contain only numbers';
        pinError.style.display = 'block';
        pinInput.style.borderColor = '#e74c3c';
        return false;
    }
    
    pinError.style.display = 'none';
    pinInput.style.borderColor = '#ddd';
    return true;
}

function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function populateReviewSummary() {
    const reviewSummary = document.getElementById('reviewSummary');
    const formData = new FormData(document.getElementById('signupForm'));
    const data = Object.fromEntries(formData.entries());
    
    let summaryHTML = '<ul>';
    
    for (const [key, value] of Object.entries(data)) {
        if (key === 'terms' || key === 'photoID') continue;
        
        const label = document.querySelector(`label[for="${key}"]`);
        let displayValue = value;
        
        // Mask sensitive information
        if (key === 'password' || key === 'confirmPassword') {
            displayValue = '••••••••';
        } else if (key === 'pin') {
            displayValue = '••••';
        }
        
        // Handle file input
        if (key === 'photoID') {
            displayValue = value ? value.name : 'No file selected';
        }
        
        // Format date
        if (key === 'dateOfBirth' && value) {
            displayValue = new Date(value).toLocaleDateString();
        }
        
        summaryHTML += `
            <li>
                <strong>${label ? label.textContent.replace(':', '') : key}:</strong>
                <span>${displayValue || 'Not provided'}</span>
            </li>
        `;
    }
    
    summaryHTML += '</ul>';
    reviewSummary.innerHTML = summaryHTML;
}

// Handle form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate terms checkbox
    if (!document.getElementById('terms').checked) {
        alert('You must agree to the Terms & Conditions');
        return;
    }
    
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    
    // Trim and lowercase email and username
    emailInput.value = emailInput.value.trim().toLowerCase();
    usernameInput.value = usernameInput.value.trim().toLowerCase();
    
    const formData = new FormData(document.getElementById('signupForm'));
    
    // Validate password match
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    
    // Validate PIN
    if (!validatePin()) {
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        const response = await fetch('https://skyline-m7ka.onrender.com/signup', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        
        const result = await response.json();
        
        // Show success message
        alert(`Account created successfully! Account Number: ${result.accountNumber}`);
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        console.error("Error occurred while signing up:", error);
        alert(error.message || 'An error occurred. Please try again later.');
        
        // Reset submit button
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
    }
});