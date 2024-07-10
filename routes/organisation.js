const express = require('express');
const { Organisation, User, UserOrganisation } = require('../models'); // Adjust the path
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/auth');
const jwtsecret = process.env.JWT_SECRET
const router = express.Router();


// Middleware to check authentication
// const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
  
//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, jwtsecret);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// };

// Get all organisations for logged-in user
router.get('/organisations/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const organisations = await Organisation.findAll({
        include: {
            model: User,
            through: UserOrganisation,
            where: { userId }
        }
    });
    return res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations
      }
    });
  } catch (error) {
    console.error('Error retrieving organisations:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single organisation by orgId
router.get('/organisations/:orgId', authenticate, async (req, res) => {
  try {
    const org = await Organisation.findByPk(req.params.orgId);
    if (!org) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Organisation retrieved successfully',
      data: org
    });
  } catch (error) {
    console.error('Error retrieving organisation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new organisation
router.post('/organisations/', authenticate, async (req, res) => {
  const { name, description } = req.body;

  try {
    if (!name) {
      return res.status(422).json({ message: 'Name is required and cannot be null' });
    }
    const organisation = await Organisation.create({ name, description });
    const user = await User.findByPk(req.user.userId);
    // await user.addOrganisation(organisation);
    await UserOrganisation.create({
        userId: user.userId,
        orgId: organisation.orgId
    });

    return res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: organisation
    });
  } catch (error) {
    // console.error('Error creating organisation:', error);
    return res.status(400).json({ status: "Bad Request",  message: "Client error" });
  }
});

// Add a user to an organisation
router.post('/organisations/:orgId/users', authenticate, async (req, res) => {
  const { userId } = req.body;

  if (!userId || !req.params.orgId) {
    return res.status(400).json({ message: 'User ID and Organisation ID are required' });
  }

  try {
    const organisation = await Organisation.findByPk(req.params.orgId);
    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the association already exists
    const existingAssociation = await UserOrganisation.findOne({
        where: {
          userId: user.userId,
          orgId: organisation.orgId
        }
      });
  
      if (existingAssociation) {
        return res.status(409).json({ message: 'User is already associated with this organisation' });
      }

    // await organisation.addUser(user);
    await UserOrganisation.create({
        userId: user.userId,
        orgId: organisation.orgId
    });

    return res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully'
    });
  } catch (error) {
    console.error('Error adding user to organisation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/users/:id', authenticate, async (req, res) => {
    const userId = req.params.id;
  
    // Ensure that the authenticated user can only access their own record
    if (req.user.userId !== userId) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
  
    try {
      const user = await User.findByPk(userId, {
        attributes: ['userId', 'firstName', 'lastName', 'email', 'phone']
      });
  
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
  
      return res.status(200).json({
        status: 'success',
        message: 'User record retrieved successfully',
        data: user
      });
    } catch (error) {
      console.error('Error retrieving user record:', error);
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

module.exports = router;
