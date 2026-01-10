import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import 'dotenv/config';

const hashExistingPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI + '/quickchat');
        const users = await User.find({});

        for (const user of users) {
            if (!user.password.startsWith('$2b$')) { // Check if not hashed
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                await user.save();
                console.log(`Hashed password for user ${user.email}`);
            }
        }

        console.log('All passwords hashed');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

hashExistingPasswords();
