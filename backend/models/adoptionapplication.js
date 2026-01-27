'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdoptionApplication extends Model {
    static associate(models) {
      // An AdoptionApplication belongs to a User
      AdoptionApplication.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // An AdoptionApplication is for a specific Pet
      AdoptionApplication.belongsTo(models.Pet, {
        foreignKey: 'petId',
        as: 'pet',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  AdoptionApplication.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      petType: {
        type: DataTypes.STRING,
      },
      breedPreference: {
        type: DataTypes.STRING,
      },
      reasonForAdoption: {
        type: DataTypes.TEXT,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // References the User model
          key: 'id',
        },
      },
      petId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Pets', // References the Pet model
          key: 'id',
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'AdoptionApplication',
    }
  );

  return AdoptionApplication;
};
