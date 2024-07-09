const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const UserOrganization = sequelize.define('UserOrganization', {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users', // This should match the table name of the User model
          key: 'userId'
        }
      },
      orgId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Organizations', // This should match the table name of the Organization model
          key: 'orgId'
        }
      }
    });
  
    return UserOrganization;
  };
  