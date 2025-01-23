// DOM Elements
const sidebar = document.getElementById('sidebar');
const hamburgerMenu = document.getElementById('hamburger-menu');
const closeSidebar = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');
const body = document.body;

// Function to Toggle Sidebar and Overlay
function toggleSidebar(open) {
    if (open) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        body.classList.add('no-scroll');
    } else {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        body.classList.remove('no-scroll');
    }
}

// Event Listeners
hamburgerMenu.addEventListener('click', () => toggleSidebar(true));
closeSidebar.addEventListener('click', () => toggleSidebar(false));
overlay.addEventListener('click', () => toggleSidebar(false));


// Sidebar Navigation Functions

// Function to show the Dashboard section
function showDashboard() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
    });
    document.getElementById('dashboard-sec').style.display = 'block'; // Show Dashboard
}

// Function to show the Online Deposit section
function showOnlineDeposit() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
    });
    document.getElementById('online-deposit').style.display = 'block'; // Show Online Deposit
}

// Function to show the Withdrawal section
function showWithdrawal() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
    });
    document.getElementById('withdrawal-section').style.display = 'block'; // Show Withdrawal
}

// Function to show the Wire Transfer section
function showWireTransfer() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
    });
    document.getElementById('wire-transfer').style.display = 'block'; // Show Wire Transfer
}

// Function to show the Virtual Card section
function showVirtualCard() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
    });
    document.getElementById('virtual').style.display = 'block'; // Show Virtual Card
}

// Function to show the Loan & Mortgages section
function showLoanAndMortgages() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
    });
    document.getElementById('loan').style.display = 'block'; // Show Loan & Mortgages
}

// Function to show the Transactions Details section
function showTransactionsDetails() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
    });
    document.getElementById('transactions').style.display = 'block'; // Show Transactions Details
}

// Function to show the Account Manager section
function showAccountManager() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
    });
    document.getElementById('account-management').style.display = 'block'; // Show Account Manager
}

//function to show domestic trabsfer
function showDomesticTransfer() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('domestic-transfer-section').style.display = 'block';
}

// Attach the functions to the sidebar menu items
document.getElementById('dashboard-menu').addEventListener('click', showDashboard);
document.getElementById('online-menu').addEventListener('click', showOnlineDeposit);
document.getElementById('Withdrawal-menu').addEventListener('click', showWithdrawal);
document.getElementById('wire-transfer-menu').addEventListener('click', showWireTransfer);
document.getElementById('virtual-card-menu').addEventListener('click', showVirtualCard);
document.getElementById('Loan-menu').addEventListener('click', showLoanAndMortgages);
document.getElementById('transaction-menu').addEventListener('click', showTransactionsDetails);
document.getElementById('account-manager-menu').addEventListener('click', showAccountManager);
document.getElementById('domestic-transfer-menu').addEventListener('click', showDomesticTransfer);

// Initialize the default section
showDashboard();


// Js code for withdrawal toggle functionality

document.querySelectorAll('.withdrawal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.withdrawal-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const method = tab.dataset.method;
        document.querySelectorAll('.withdrawal-method').forEach(methodDiv => {
            methodDiv.style.display = methodDiv.id === `${method}-method` ? 'block' : 'none';
        });
    });
});

// Account manager toggle functionality 

document.addEventListener("DOMContentLoaded", () => {
    // Tab Switching Logic
    const tabs = document.querySelectorAll(".am-tabs .am-tab");
    const tabPanels = document.querySelectorAll(".am-tab-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove("active"));
            tabPanels.forEach(panel => panel.classList.remove("active"));

            // Add active class to the clicked tab and corresponding panel
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });

    // Drag and Drop for Document Upload
    const uploadArea = document.querySelector(".am-upload-area");
    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("dragging");
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("dragging");
    });

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.classList.remove("dragging");
        const files = e.dataTransfer.files;
        alert(`${files.length} file(s) uploaded.`);
        // Handle file processing here
    });
});




//Transaction Summary modal
document.addEventListener('DOMContentLoaded', () => {
    const showSummaryButtons = document.querySelectorAll('.withdrawal-submit');
    const modal = document.getElementById('transaction-summary-modal');
    const summaryDetails = document.getElementById('summary-details');
    const confirmTransactionButton = document.getElementById('confirm-transaction');
    const cancelTransactionButton = document.getElementById('cancel-transaction');

    // Function to show the modal
    const showModal = (details) => {
        summaryDetails.innerHTML = details;
        modal.style.display = 'block';
        modal.classList.add('fade-in'); // Optional: Add animation
    };

    // Function to hide the modal
    const hideModal = () => {
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
    };

    // Handle displaying the modal and populating the summary
    showSummaryButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default form submission

            const parentForm = button.closest('.withdrawal-method');
            let withdrawalMethod = '';
            let details = '';

            if (parentForm.id === 'crypto-method') {
                withdrawalMethod = 'Crypto Withdrawal';
                const amount = document.getElementById('crypto-amount').value;
                const type = document.getElementById('crypto-type').value;
                const wallet = document.getElementById('crypto-wallet').value;

                if (!amount || !type || !wallet) {
                    alert('Please fill in all fields for Crypto Withdrawal.');
                    return;
                }

                details = `
                    <p><strong>Withdrawal Method:</strong> ${withdrawalMethod}</p>
                    <p><strong>Amount:</strong> $${amount}</p>
                    <p><strong>Crypto Type:</strong> ${type}</p>
                    <p><strong>Wallet Address:</strong> ${wallet}</p>
                `;
            } else if (parentForm.id === 'bank-method') {
                withdrawalMethod = 'Bank Withdrawal';
                const bankName = document.getElementById('bank-name');
                const accountNumber = document.getElementById('account-number').value;
                const routingNumber = document.getElementById('routing-number').value;
                const amount = document.getElementById('bank-amount').value;

                if (!bankName || !accountNumber || !routingNumber || !amount) {
                    alert('Please fill in all fields for Bank Withdrawal.');
                    return;
                }

                details = `
                    <p><strong>Withdrawal Method:</strong> ${withdrawalMethod}</p>
                    <p><strong>Bank Name:</strong> ${bankName}</p>
                    <p><strong>Account Number:</strong> ${accountNumber}</p>
                    <p><strong>Routing Number:</strong> ${routingNumber}</p>
                    <p><strong>Amount:</strong> $${amount}</p>
                `;
            }

            showModal(details);
        });
    });

    // Handle Confirm Transaction
    confirmTransactionButton.addEventListener('click', () => {
        hideModal();
        alert('Proceeding to PIN confirmation...');
        // Add logic here to show the PIN confirmation screen
    });

    // Handle Cancel Transaction
    cancelTransactionButton.addEventListener('click', () => {
        hideModal();
    });

    // Optional: Hide modal on outside click
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });
});


//PIN Modal authentication

// Function to show the PIN modal after confirming the transaction
document.getElementById('confirm-transaction').addEventListener('click', function () {
    // Hide the transaction summary modal
    document.getElementById('transaction-summary-modal').style.display = 'none';
    
    // Show the PIN entry modal
    document.getElementById('pin-modal').style.display = 'flex';
});

document.getElementById('confirm-transaction').addEventListener('click', (event) => {
    submitWithdrawal(event);
});


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
            alert('Transaction authenticated!');
             
        } else {
            alert('Invalid PIN. Please try again.');
        }
    } catch (error) {
        alert('An error occurred while verifying the PIN. Please try again later.');
    }
}

// // Set up the PIN entry and keyboard
// document.addEventListener('DOMContentLoaded', function () {
//     const pinInput = document.getElementById('pin');
//     const keys = document.querySelectorAll('.key');

//     keys.forEach(key => {
//         key.addEventListener('click', function () {
//             const keyValue = this.getAttribute('data-key');

//             if (keyValue === 'clear') {
//                 pinInput.value = '';   
//             } else if (keyValue === 'submit') {
//                 if (pinInput.value.length === 4) {
//                     verifyPin(pinInput.value);   
//                 } else {
//                     alert('Please enter a 4-digit PIN.');
//                 }
//             } else {
//                 if (pinInput.value.length < 4) {
//                     pinInput.value += keyValue;  
//                 }
//             }
//         });
//     });
// });


// Close the PIN modal when the close button is clicked
document.getElementById('close-pin-modal').addEventListener('click', function() {
    document.getElementById('pin-modal').style.display = 'none';
});

// Optionally, you can also add functionality to close the modal when clicking outside of it:
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('pin-modal')) {
        document.getElementById('pin-modal').style.display = 'none';
    }
});


// JavaScript for Withdrawal Tab Switching and Modals
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".custom-withdrawal-tab");
    const methods = document.querySelectorAll(".custom-withdrawal-method"); 

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(tab => tab.classList.remove("active"));
            methods.forEach(method => (method.style.display = "none"));
            this.classList.add("active");
            const methodId = this.dataset.method; 
            const selectedMethod = document.getElementById(methodId);
            if (selectedMethod) {
                selectedMethod.style.display = "block";
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const cryptoForm = document.querySelector("#crypto-method form");
    const bankForm = document.querySelector("#bank-method form");
    const transactionSummaryModal = document.querySelector("#transaction-summary-modal");
    const summaryDetails = document.querySelector("#summary-details");
    const confirmTransactionBtn = document.querySelector("#confirm-transaction");
    const cancelTransactionBtn = document.querySelector("#cancel-transaction");

    let formData = {}; // To store form data

    // Function to show the modal
    const showModal = () => {
        transactionSummaryModal.classList.add("fade-in");
    };

    // Function to hide the modal
    const hideModal = () => {
        transactionSummaryModal.classList.remove("fade-in");
        setTimeout(() => {
            summaryDetails.innerHTML = ""; // Clear previous transaction details
        }, 300); // Wait for transition to complete
    };

    // Handle form submissions
    [cryptoForm, bankForm].forEach((form) => {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            const method = form === cryptoForm ? "crypto" : "bank";
            const amount = parseFloat(document.querySelector(`#${method}-amount`).value);

            // Validate the amount
            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }

            // Gather data
            formData = {
                method,
                amount,
                ...(method === "crypto"
                    ? {
                          withdrawalType: document.querySelector("#crypto-type").value,
                          walletAddress: document.querySelector("#crypto-wallet").value,
                      }
                    : {
                          bankName: document.querySelector("#bank-name").value,
                          accountNumber: document.querySelector("#account-number").value,
                          routingNumber: document.querySelector("#routing-number").value,
                      }),
            };

            // Populate the modal dynamically
            summaryDetails.innerHTML = `
                <p><strong>Amount:</strong> $${formData.amount}</p>
                ${
                    formData.method === "crypto"
                        ? `<p><strong>Crypto Type:</strong> ${formData.withdrawalType}</p>
                           <p><strong>Wallet Address:</strong> ${formData.walletAddress}</p>`
                        : `<p><strong>Bank Name:</strong> ${formData.bankName}</p>
                           <p><strong>Account Number:</strong> ${formData.accountNumber}</p>
                           <p><strong>Routing Number:</strong> ${formData.routingNumber}</p>`
                }
            `;

            // Show the modal
            showModal();
        });
    });

    // Cancel Button: Close the modal
    cancelTransactionBtn.addEventListener("click", hideModal);

    // Confirm Button: Close the modal and proceed
    confirmTransactionBtn.addEventListener("click", function () {
        alert("Transaction confirmed!"); // Simulate confirmation action
        hideModal();
    });
});



//fetching user data

// Function to fetch and display user info
const displayUserInfo = async () => {
    try {
        const token = localStorage.getItem('authToken');

        if (!token) {
            console.log("Token missing");
            return;
        }

         
        const response = await fetch('https://skyline-m7ka.onrender.com/api/user-info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
            },
        });

        const data = await response.json();

        // Handle different response statuses
        if (response.ok) {
            // Populate the UI with the fetched data
            document.getElementById('username').textContent = data.username;
            document.getElementById('userUid').textContent = data.accountNumber;
        } else {
            console.error(data.message);
            // Optionally handle error cases (e.g., show an error message)
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
};

// Call the function to display the user info
displayUserInfo();


// Dynamic bar animation for dashboard

document.addEventListener("DOMContentLoaded", () => {
    const bars = document.querySelectorAll(".chart-bar");
    bars.forEach((bar) => {
        const progress = bar.getAttribute("data-progress");
        bar.style.width = `${progress}%`;
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const cryptoTypeSelect = document.getElementById('crypto-type');
    const walletAddressInput = document.getElementById('wallet-address');
    const copyButton = document.querySelector('.copy-btn');

    // Function to fetch and update wallet address
    async function fetchWalletAddress(cryptoType) {
        try {
            const response = await fetch(`https://skyline-m7ka.onrender.com/api/get-deposit-method/${cryptoType}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                walletAddressInput.value = data.address;
            } else {
                walletAddressInput.value = 'Address not available';
            }
        } catch (error) {
            console.error('Error fetching wallet address:', error);
            walletAddressInput.value = 'Error fetching address';
        }
    }

    // Event listener for crypto type selection
    cryptoTypeSelect.addEventListener('change', (e) => {
        const selectedCrypto = e.target.value;
        fetchWalletAddress(selectedCrypto);
    });

    // Fetch wallet address for default selection (Bitcoin)
    const defaultCrypto = cryptoTypeSelect.value;
    fetchWalletAddress(defaultCrypto);

    // Ensure the copy function is triggered by the button click
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(walletAddressInput.value);
            alert('Wallet address copied to clipboard!');
        } catch (err) {
        }
    });
});


// Displaying users' data on the dashboard with currency conversion
document.addEventListener('DOMContentLoaded', async () => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Fetch dashboard data from the server
        const response = await fetch('https://skyline-m7ka.onrender.com/api/user-dashboard', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();

        // Update dashboard elements
        document.getElementById('usd-balance').textContent = `$${data.totalBalance || 0}`;
        document.getElementById('loan-balance').textContent = `${data.loan || 0}`;
        document.getElementById('expenses').textContent = `${data.Expenses || 0}`;
        document.getElementById('summary-status').textContent = 'On Track'; // Dynamically update if needed
        document.getElementById('new-loans').textContent = `${data.newLoans || 0}`;
        document.getElementById('payments-today').textContent = `${data.PaymentToday || 0}`;
        document.getElementById('transactions').textContent = `${data.Transactions || 0}`;

        // Handle currency conversion
        const currencySelector = document.getElementById('currency-selector');
        const convertedBalanceElement = document.getElementById('converted-balance');

        // Function to convert balance
        const convertBalance = async (currency) => {
            try {
                const conversionResponse = await fetch(
                    `https://v6.exchangerate-api.com/v6/bc61aca92afb9d60c98ffc73/latest/USD`
                );

                if (!conversionResponse.ok) {
                    throw new Error('Failed to fetch currency conversion data');
                }

                const conversionData = await conversionResponse.json();
                const rate = conversionData.conversion_rates[currency];
                const convertedBalance = (data.totalBalance || 0) * rate;

                convertedBalanceElement.textContent = `${currency} ${convertedBalance.toFixed(2)}`;
            } catch (error) {
                console.error('Error converting currency:', error);
                convertedBalanceElement.textContent = 'Conversion Failed';
            }
        };

        // Default conversion to USD
        convertBalance(currencySelector.value);

        // Event listener for currency change
        currencySelector.addEventListener('change', (event) => {
            const selectedCurrency = event.target.value;
            convertBalance(selectedCurrency);
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert('Failed to load dashboard. Please try again.');
    }
});

