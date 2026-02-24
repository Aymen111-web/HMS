const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Patient = require('./models/Patient');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await Patient.deleteMany();
        await User.deleteMany();

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await User.create({
            name: 'Admin User',
            email: 'admin@hms.com',
            password: hashedPassword,
            role: 'Admin'
        });

        // Create Sample Patients
        await Patient.create([
            { name: 'Sarah Johnson', age: 28, gender: 'Female', phone: '+1 234-567-8901', medicalHistory: ['Asthma'] },
            { name: 'Robert Smith', age: 45, gender: 'Male', phone: '+1 234-567-8902', medicalHistory: [] },
            { name: 'Maria Garcia', age: 32, gender: 'Female', phone: '+1 234-567-8903', medicalHistory: ['Hypertension'] }
        ]);

        console.log('Data seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
