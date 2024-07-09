const express = require('express');
const { Organization, User, UserOrganization } = require('../models'); // Adjust the path
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

// Get all organizations for logged-in user
router.get('/organisations/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const organizations = await Organization.findAll({
        include: {
            model: User,
            through: UserOrganization,
            where: { userId }
        }
    });
    return res.status(200).json({
      status: 'success',
      message: 'Organizations retrieved successfully',
      data: {
        organizations
      }
    });
  } catch (error) {
    console.error('Error retrieving organizations:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single organization by orgId
router.get('/organisations/:orgId', authenticate, async (req, res) => {
  try {
    const org = await Organization.findByPk(req.params.orgId);
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Organization retrieved successfully',
      data: org
    });
  } catch (error) {
    console.error('Error retrieving organization:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new organization
router.post('/organisations/', authenticate, async (req, res) => {
  const { name, description } = req.body;

  try {
    const organization = await Organization.create({ name, description });
    const user = await User.findByPk(req.user.userId);
    // await user.addOrganization(organization);
    await UserOrganization.create({
        userId: user.userId,
        orgId: organization.orgId
    });

    return res.status(201).json({
      status: 'success',
      message: 'Organization created successfully',
      data: organization
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return res.status(400).json({ status: "Bad Request",  message: "Client error" });
  }
});

// Add a user to an organization
router.post('/organisations/:orgId/users', authenticate, async (req, res) => {
  const { userId } = req.body;

  if (!userId || !req.params.orgId) {
    return res.status(400).json({ message: 'User ID and Organization ID are required' });
  }

  try {
    const organization = await Organization.findByPk(req.params.orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the association already exists
    const existingAssociation = await UserOrganization.findOne({
        where: {
          userId: user.userId,
          orgId: organization.orgId
        }
      });
  
      if (existingAssociation) {
        return res.status(409).json({ message: 'User is already associated with this organization' });
      }

    // await organization.addUser(user);
    await UserOrganization.create({
        userId: user.userId,
        orgId: organization.orgId
    });

    return res.status(200).json({
      status: 'success',
      message: 'User added to organization successfully'
    });
  } catch (error) {
    console.error('Error adding user to organization:', error);
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
