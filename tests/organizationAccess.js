const { UserOrganisation } = require('../models');

async function checkOrganisationAccess(req, res, next) {
  const { userId } = req.user; // Assuming user ID is set in req.user by authentication middleware
  const { orgId } = req.params; // Assuming orgId is passed as a route parameter

  const userOrg = await UserOrganisation.findOne({ where: { userId, orgId } });
  if (!userOrg) {
    return res.status(403).json({ message: 'Access denied' });
  }

  next();
}

module.exports = checkOrganisationAccess;
