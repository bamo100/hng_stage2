const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define('Organization', {
      orgId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
  
    return Organization;
  };
  