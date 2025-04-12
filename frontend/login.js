const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent form submission

        // Get form data (username/email and password)
        const loginInput = document.getElementById("usernameOrEmail").value.trim().toLowerCase(); // Convert to lowercase and trim
        const loginPassword = document.getElementById("password").value.trim(); // Trim any extra spaces

        // Prepare login data object
        const loginData = {
            usernameOrEmail: loginInput,  // Send this to backend
            password: loginPassword,
        };

        try {
            const response = await fetch("https://skyline-m7ka.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),  
            });

            const result = await response.json();  

            if (response.ok) {
                // Successful login
                alert('Login Successful! Redirecting...');

                // Store token in localStorage or proceed as needed
                localStorage.setItem("authToken", result.token);

                setTimeout(() => {
                    window.location.href = "welcome.html"; // Redirect after 2 seconds
                }, 2000);
            } else {
                // Login failed
                alert(result.message || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert('Failed to connect to the server. Please try again later.');
        }
    });
}
