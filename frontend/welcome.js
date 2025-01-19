// Function to verify the entered PIN
async function verifyPin(pin) {
    if (!pin || pin.length !== 4) {
        alert('Please enter a valid 4-digit PIN');
        return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('No auth token found. Redirecting to login.');
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch('https://skyline-m7ka.onrender.com/verify-pin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ pin })
        });

        const result = await response.json();

        if (result.success) {
            window.location.href = "App.html";  
        } else {
            alert('Invalid PIN. Please try again.');
        }
    } catch (error) {
        alert('An error occurred while verifying the PIN. Please try again later.');
    }
}

// Display the username and set up the keyboard
document.addEventListener('DOMContentLoaded', function () {
    const pinInput = document.getElementById('pin');
    const keys = document.querySelectorAll('.key');

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('No auth token found. Redirecting to login.');
        window.location.href = "login.html";
        return;
    }

    const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
    const username = tokenPayload.username;

    document.getElementById('username').textContent = username;

    keys.forEach(key => {
        key.addEventListener('click', function () {
            const keyValue = this.getAttribute('data-key');

            if (keyValue === 'clear') {
                pinInput.value = '';  // Clearing PIN input
            } else if (keyValue === 'submit') {
                if (pinInput.value.length === 4) {
                    verifyPin(pinInput.value);  // Verify PIN if it's 4 digits
                } else {
                    alert('Please enter a 4-digit PIN.');
                }
            } else {
                if (pinInput.value.length < 4) {
                    pinInput.value += keyValue;  // Add digit to PIN input
                }
            }
        });
    });
});
