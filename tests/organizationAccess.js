const { UserOrganization } = require('../models');

async function checkOrganizationAccess(req, res, next) {
  const { userId } = req.user; // Assuming user ID is set in req.user by authentication middleware
  const { orgId } = req.params; // Assuming orgId is passed as a route parameter

  const userOrg = await UserOrganization.findOne({ where: { userId, orgId } });
  if (!userOrg) {
    return res.status(403).json({ message: 'Access denied' });
  }

  next();
}

module.exports = checkOrganizationAccess;
