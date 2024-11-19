const mongoose = require('mongoose');
const User = require('./server'); // Path to the file where you defined the User model

mongoose.connect('mongodb://localhost:27017/')
    .then(async () => {
        console.log('[DEBUG] Connected to MongoDB successfully.');

        try {
            // Replace with your test _id
            const userId = '673892787e83cace69aac8c0';
            const user = await User.findById(userId);

            if (user) {
                console.log('[DEBUG] User from database:', user);
                console.log('[DEBUG] User PIN:', user.pin);
            } else {
                console.log('[WARN] User not found with ID:', userId);
            }
        } catch (error) {
            console.error('[ERROR] Error fetching user from database:', error);
        } finally {
            mongoose.connection.close(); // Close the connection after the operation
        }
    })
    .catch(error => {
        console.error('[ERROR] MongoDB connection error:', error);
    });
