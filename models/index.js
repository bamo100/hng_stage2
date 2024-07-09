const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'production';
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
db.Organisation = require('./organisation.js')(sequelize, DataTypes);
db.UserOrganisation = require('./userOrganisation.js')(sequelize, DataTypes);


// Define associations
db.User.belongsToMany(db.Organisation, { through: db.UserOrganisation, foreignKey: 'userId' });
db.Organisation.belongsToMany(db.User, { through: db.UserOrganisation, foreignKey: 'orgId' });

module.exports = db;
