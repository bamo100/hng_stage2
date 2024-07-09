const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Organisation = sequelize.define('Organisation', {
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
  
    return Organisation;
  };
  