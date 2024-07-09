const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const UserOrganisation = sequelize.define('UserOrganisation', {
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
          model: 'Organisations', // This should match the table name of the Organisation model
          key: 'orgId'
        }
      }
    });
  
    return UserOrganisation;
  };
  