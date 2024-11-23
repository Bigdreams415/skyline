document.addEventListener("DOMContentLoaded", function() {
    const cryptoTypeSelect = document.getElementById("crypto-type");
    const walletAddressInput = document.getElementById("wallet-address");
    const depositMethodForm = document.querySelector('.deposit-form');
    const depositMethodsList = document.getElementById("deposit-methods-list");

    // Fetch all deposit methods when the page loads
    async function fetchDepositMethods() {
        try {
            const response = await fetch('/admin/deposit', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            });
            const data = await response.json();
            depositMethodsList.innerHTML = '';
            data.forEach((method) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${method.method}</strong>: ${method.details}`;
                depositMethodsList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching deposit methods:', error);
        }
    }

    // Add or Update Deposit Method
    depositMethodForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const method = cryptoTypeSelect.value;
        const details = walletAddressInput.value;

        const depositData = { method, details };

        try {
            const response = await fetch('/admin/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(depositData)
            });

            const result = await response.json();
            alert(result.message);

            // Clear form and refresh the deposit methods list
            walletAddressInput.value = '';
            fetchDepositMethods();
        } catch (error) {
            console.error('Error saving deposit method:', error);
        }
    });

    // Fetch deposit methods when the page loads
    fetchDepositMethods();
});


// Managing balance related field

// Handle search and update functionality
document.getElementById('search-button').addEventListener('click', async () => {
    const accountNumber = document.getElementById('search-account-blc').value;
    if (!accountNumber) {
        alert("Please enter an account number to search.");
        return;
    }

    try {
        // Fetch user details by account number
        const response = await fetch(`/api/get-user/${accountNumber}`);
        const user = await response.json();

        if (response.ok) {
            // Populate the fields with the user's existing balance data
            document.getElementById('totalBalance').value = user.data.totalBalance || '';
            document.getElementById('loan-balance').value = user.data.loan || '';
            document.getElementById('expenses').value = user.data.Expenses || '';
            document.getElementById('payments-today').value = user.data.PaymentToday || '';
            document.getElementById('new-loans').value = user.data.newLoans || '';
            document.getElementById('transactions').value = user.data.Transactions || '';
        } else {
            alert(user.message);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to fetch user data');
    }
});

// Update balance-related fields (BLC)
document.getElementById('update-blc-btn').addEventListener('click', async () => {
    const accountNumber = document.getElementById('search-account-blc').value;
    if (!accountNumber) {
        alert("Please search for a user before updating the balance.");
        return;
    }

    const data = {
        totalBalance: document.getElementById('totalBalance').value,
        loan: document.getElementById('loan-balance').value,
        Expenses: document.getElementById('expenses').value,
        PaymentToday: document.getElementById('payments-today').value,
        newLoans: document.getElementById('new-loans').value,
        Transactions: document.getElementById('transactions').value
    };

    try {
        const response = await fetch(`/api/update-blc/${accountNumber}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert('BLC updated successfully!');
            console.log(result.user);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error updating BLC:', error);
        alert('Failed to update BLC');
    }
});

const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// Toggle sidebar visibility
function toggleSidebar() {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}

// Close sidebar when clicking outside
function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

// Event listeners
hamburger.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", closeSidebar);
