const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Organisation, UserOrganisation } = require('../models');

const router = express.Router();
const jwtsecret = process.env.JWT_SECRET



//User Registration
router.post('/register', async (req, res) => {
    const { userId, firstName, lastName, email, password, phone } = req.body;

    try {
        // Validate input fields
        const errors = [];
        if (!firstName) errors.push({ field: 'firstName', message: 'First name must be provided' });
        if (!lastName) errors.push({ field: 'lastName', message: 'Last name must be provided' });
        if (!email) errors.push({ field: 'email', message: 'Email must be provided' });
        if (!password) errors.push({ field: 'password', message: 'Password must be provided' });

        if (errors.length) {
            return res.status(422).json({ message: 'All fields are required', errors });
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const user = await User.create({ userId, firstName, lastName, email, password: hashedPassword, phone });

        const organisation = await Organisation.create({
            name: `${firstName}'s Organisation`,
            description: `${firstName}'s default organisation`
        });

        // Associate User with Organisation
        await UserOrganisation.create({
            userId: user.userId,
            orgId: organisation.orgId
        });

        // Generate JWT
        const token = jwt.sign({ userId: user.userId }, 'jwtsecret', { expiresIn: '1h' });

        return res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                accessToken: token,
                user: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
                }
            }
        });
    }catch (error) {
        // console.error('Error during registration:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(422).json({
                message: 'Email already exists',
                errors: [{ field: 'email', message: 'Email must be unique' }]
            });
        }

        return res.status(400).json({status: 'Bad Request', message: 'Registration unsuccessful'})
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
     // Find user by email
     const user = await User.findOne({ where: { email } });
  
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.userId }, 'jwtsecret', { expiresIn: '1h' });

    return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: token,
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
          }
        }
    });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(401).json({ status: "Bad request", message: 'Authentication failed' });
    }
});

// Protected Route Example
router.get('/protected', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'jwtsecret');
        return res.status(200).json({ message: 'You have accessed a protected route!', userId: decoded.userId });
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});


  


module.exports = router;