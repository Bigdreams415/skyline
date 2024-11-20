const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const morgan = require('morgan');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const validator = require('validator');
const fs = require('fs');
  

const jwtSecret = process.env.JWT_SECRET;
const app = express();
const PORT = process.env.PORT || 3000;
// Middlewares

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging
app.use(morgan('combined'));

 

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home2.html'));
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/admin-login.html'));
});


// MongoDB Config
const db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Middleware to protect routes with JWT authentication
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Authorization Header:", authHeader); // Log the header for debugging
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("Token missing"); // Debug log
        return res.status(403).json({ message: 'Access denied, token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Token validation error:", err.message); // Debug log
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        console.log("Decoded User:", user); // Debug log for decoded payload
        next();
    });
};


// Function to generate a JWT token
function generateAuthToken(user) {
    const payload = {
        userId: user._id,
        username: user.username,
        email: user.email
    };

    const options = {
        expiresIn: '1d',
    };

    return jwt.sign(payload, jwtSecret, options);
}

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    nationality: { type: String, required: true },
    residentialAddress: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    employmentStatus: { type: String, required: true },
    occupation: { type: String, required: true },
    incomeRange: { type: String, required: true },
    sourceOfFunds: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pin: { type: String, required: true },
    accountType: { type: String, required: true },
    currencyType: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    photoID: { type: String, default: null },
    totalBalance: {type: Number, default: 0},
    loan: {type: Number, default: 0},
    Expenses: {type: Number, default: 0},
    PaymentToday: {type: Number, default: 0},
    newLoans: {type: Number, default: 0},
    Transactions: {type: Number, default: 0},
    creditAt: { type: Date, default: Date.now }
     
});

// Pre-save hook to hash the password and PIN before saving the user
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isModified('pin')) {
        const salt = await bcrypt.genSalt(10);
        this.pin = await bcrypt.hash(this.pin, salt);
    }

    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;



// Create uploads folder if it doesn't exist
const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// Set storage engine for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory); // Store files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + fileExtension); // Unique filename
    }
});

// Initialize multer
const upload = multer({ storage: storage });

// POST /signup route with file upload
app.post('/signup', upload.single('photoID'), async (req, res) => {
    try {
        console.log("Form data:", req.body);
        console.log("Uploaded file:", req.file);

        // Check for missing required fields (excluding photoID)
        const requiredFields = [
            'fullName', 'dateOfBirth', 'gender', 'nationality',
            'residentialAddress', 'emailAddress', 'phoneNumber', 'employmentStatus',
            'occupation', 'incomeRange', 'sourceOfFunds', 'username', 'password', 'pin',
            'accountType', 'currencyType'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `The following fields are required: ${missingFields.join(', ')}`
            });
        }

        // Process photoID only if provided
        const photoIDPath = req.file ? `uploads/${req.file.filename}` : null;

        // Create and save the new user
        const newUser = new User({
            ...req.body,
            photoID: photoIDPath, // Set photoID to null if not provided
            accountNumber: `ACC-${Math.floor(100000000 + Math.random() * 900000000)}`
        });

        await newUser.save();

        res.status(201).json({
            message: "User account created successfully.",
            accountNumber: newUser.accountNumber
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "An error occurred while creating the account." });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return res.status(400).json({ message: "Username or Email and Password are required" });
    }

    try {
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail.toLowerCase() }, { email: usernameOrEmail.toLowerCase() }]
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials. User not found." });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials. Incorrect password." });
        }

        // Generate JWT token
        const token = generateAuthToken(user);

        // Send the token to the client
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

 
// Route for Pin verification
app.post('/verify-pin', authenticateJWT, async (req, res) => {
    const { pin } = req.body;
    const { user } = req; // The authenticated user from JWT middleware

    if (!user) {
        console.error('[ERROR] User not authenticated.');
        return res.status(400).json({ message: 'User not authenticated', success: false });
    }

    try {
        // Fetch user details from the database
        const userFromDb = await User.findById(user.userId);

        if (!userFromDb) {
            console.error('[ERROR] User not found in database.');
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Compare the entered PIN with the stored hashed PIN
        const isPinValid = await bcrypt.compare(pin, userFromDb.pin);

        if (isPinValid) {
            return res.json({ message: 'PIN verified successfully', success: true });
        } else {
            console.warn('[ERROR] Invalid PIN entered.');
            return res.status(400).json({ message: 'Invalid PIN', success: false });
        }
    } catch (error) {
        console.error('[ERROR] Error during PIN verification:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});


//Withdrawal schema

const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  
    },
    transactionId: {
        type: String,
        required: true,
        unique: true  
    },
    amount: {
        type: Number,
        required: true,
        min: 0  
    },
    withdrawalType: {
        type: String,
        enum: ['crypto', 'bank'],  
        required: true
    },
    details: {
        type: Object,  
        default: {}
    },
    status: {
        type: String,
        enum: ['Pending', 'Successful', 'Failed'],  
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now  
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

 

// Route for processing withdrawals
app.post('/withdraw', authenticateJWT, async (req, res) => {
    const { user } = req; // Authenticated user from JWT middleware
    const { pin, amount, withdrawalType, details } = req.body;  

        // Check if the amount is a valid number and is greater than 0
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount entered." });
        }

    if (!user) {
        return res.status(400).json({ message: 'User not authenticated', success: false });
    }

    try {
        // Fetch user details from the database
        const userFromDb = await User.findById(user.userId);

        if (!userFromDb) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Step 1: Log the balance before withdrawal
        console.log('Balance before withdrawal:', userFromDb.balance);
        console.log('Amount requested:', amount);

        // Step 2: Verify PIN
        const isPinValid = await bcrypt.compare(pin, userFromDb.pin);
        if (!isPinValid) {
            return res.status(400).json({ message: 'Invalid PIN', success: false });
        }

        // Step 3: Check balance
        if (userFromDb.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance', success: false });
        }

        // Step 4: Deduct balance
        userFromDb.balance -= amount;
        await userFromDb.save();

        // Step 5: Record the transaction
        const transaction = new Withdrawal({
            userId: userFromDb._id,
            amount,
            withdrawalType,
            details,
            status: 'Successful',
            createdAt: new Date(),
            transactionId: `WD-${Date.now()}`  
        });
        await transaction.save();

        return res.json({ message: 'Withdrawal successful', success: true });
    } catch (error) {
        console.error('[ERROR] Withdrawal processing failed:', error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
});


//fetching users details

app.get('/api/user-info', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({
        username: user.username,
        accountNumber: user.accountNumber,
    });
});

// Deposit Method Schema
const DepositMethodSchema = new mongoose.Schema({
    method: { type: String, required: true },  
    details: { type: String, required: true }  
});

const DepositMethod = mongoose.model('DepositMethod', DepositMethodSchema);


// Fetch all deposit methods
app.get('/admin/deposit', authenticateJWT, async (req, res) => {
    try {
        const depositMethods = await DepositMethod.find();
        res.json(depositMethods);   
    } catch (error) {
        console.error('Error fetching deposit methods:', error);
        res.status(500).json({ message: 'Error fetching deposit methods' });
    }
});


// POST route to add or update deposit methods
app.post('/admin/deposit', authenticateJWT, async (req, res) => {
    const { method, details } = req.body;

    try {
        let depositMethod = await DepositMethod.findOne({ method });

        if (depositMethod) {
            // If the method exists, update the details
            depositMethod.details = details;
            await depositMethod.save();
            res.json({ message: `${method} details updated successfully` });
        } else {
            // If the method doesn't exist, create a new entry
            depositMethod = new DepositMethod({ method, details });
            await depositMethod.save();
            res.json({ message: `${method} details added successfully` });
        }
    } catch (error) {
        console.error('Error saving deposit method:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/api/get-deposit-method/:cryptoType', async (req, res) => {
    const { cryptoType } = req.params;

    // Map frontend cryptoType to database method
    const methodMap = {
        bitcoin: 'btc',
        ethereum: 'eth',
        litecoin: 'ltc',
    };

    const dbMethod = methodMap[cryptoType.toLowerCase()]; // Convert to lowercase for safety

    if (!dbMethod) {
        return res.status(400).json({ success: false, message: 'Invalid crypto type' });
    }

    try {
        const depositMethod = await DepositMethod.findOne({ method: dbMethod });
        if (depositMethod) {
            res.json({ success: true, address: depositMethod.details });
        } else {
            res.status(404).json({ success: false, message: 'Deposit method not found' });
        }
    } catch (error) {
        console.error('Error fetching deposit method:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


//Getting users data through account balance

// Route to get user details by account number
app.get('/api/get-user/:accountNumber', async (req, res) => {
    const { accountNumber } = req.params;

    try {
        // Find the user by account number
        const user = await User.findOne({ accountNumber });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Respond with the user's data
        res.status(200).json({
            success: true,
            data: {
                fullName: user.fullName,
                emailAddress: user.emailAddress,
                totalBalance: user.totalBalance,
                loan: user.loan,
                Expenses: user.Expenses,
                PaymentToday: user.PaymentToday,
                newLoans: user.newLoans,
                Transactions: user.Transactions,
                // You can include any other fields you need here
            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});



// Route to update balance-related fields (BLC)
app.post('/api/update-blc/:accountNumber', async (req, res) => {
    const { accountNumber } = req.params;
    const { totalBalance, loan, Expenses, PaymentToday, newLoans, Transactions } = req.body;

    try {
        // Find the user by account number
        const user = await User.findOne({ accountNumber });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's balance-related fields
        user.totalBalance = totalBalance || user.totalBalance;
        user.loan = loan || user.loan;
        user.Expenses = Expenses || user.Expenses;
        user.PaymentToday = PaymentToday || user.PaymentToday;
        user.newLoans = newLoans || user.newLoans;
        user.Transactions = Transactions || user.Transactions;

        // Save the updated user object
        await user.save();

        // Respond with the updated user data
        res.status(200).json({
            message: 'User BLC updated successfully',
            user: {
                totalBalance: user.totalBalance,
                loan: user.loan,
                Expenses: user.Expenses,
                PaymentToday: user.PaymentToday,
                newLoans: user.newLoans,
                Transactions: user.Transactions,
            }
        });
    } catch (error) {
        console.error('Error updating BLC:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


//Backend route to fetch user details and display  it on the Dashboard

app.get('/api/user-dashboard', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the token
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            fullName: user.fullName,
            totalBalance: user.totalBalance,
            loan: user.loan,
            Expenses: user.Expenses,
            PaymentToday: user.PaymentToday,
            newLoans: user.newLoans,
            Transactions: user.Transactions,
        });
    } catch (error) {
        console.error('Error fetching user dashboard details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin login route
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

     
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
         
        const token = generateAuthToken({ username });  

         
        return res.status(200).json({ token });
    } else {
         
        return res.status(401).json({ message: 'Invalid username or password' });
    }
});






// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
