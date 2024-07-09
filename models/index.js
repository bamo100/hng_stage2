const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import the User model
db.User = require('./user')(sequelize, DataTypes);
db.Organization = require('./organization')(sequelize, DataTypes);
db.UserOrganization = require('./userOrganization')(sequelize, DataTypes);


// Define associations
db.User.belongsToMany(db.Organization, { through: db.UserOrganization, foreignKey: 'userId' });
db.Organization.belongsToMany(db.User, { through: db.UserOrganization, foreignKey: 'orgId' });

module.exports = db;
