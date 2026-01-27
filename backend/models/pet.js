'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pet extends Model {
    static associate(models) {
      // A Pet belongs to a Shelter
      Pet.belongsTo(models.Shelter, {
        foreignKey: 'shelterId', // Link to Shelter's id
        as: 'shelter',           // Optional alias
        onDelete: 'CASCADE',     // Removes pets when shelter is deleted
        onUpdate: 'CASCADE',     // Updates shelterId if shelter id changes
      });
      // Association with User
      Pet.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  Pet.init(
    {
      types: {
        type: DataTypes.ENUM('Dog', 'Cat', 'Bird', 'Rabbits', 'Fish'),
        allowNull: false,
      },
      breed: {
        type: DataTypes.STRING,
        allowNull: true,  // Conditional, can be null for types like Fish
      },
      color: {
        type: DataTypes.ENUM('Black', 'White', 'Brown', 'Mixed', 'Other'),
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female'),
        allowNull: false,
      },
      adoptionFee: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      availability: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      sizePreference: {
        type: DataTypes.ENUM('Small', 'Medium', 'Large'),
        allowNull: true,  // Optional
      },
      exerciseAmount: {
        type: DataTypes.ENUM('Little to none', '30 minutes', '1 hour', 'More than an hour'),
        allowNull: true,  // Optional
      },
      homeFrequency: {
        type: DataTypes.ENUM('Rarely', 'Sometimes', 'Often', 'Always'),
        allowNull: true,  // Optional
      },
      otherPets: {
        type: DataTypes.STRING,
        allowNull: true,  // Optional
      },
      specialCareNeed: {
        type: DataTypes.STRING,
        allowNull: true,  // Optional
      },
      petAgePreference: {
        type: DataTypes.STRING,
        allowNull: true,  // Optional
      },
      imageUrl: {
        type: DataTypes.STRING(1024),  // For large URLs
        allowNull: true,
      },
      imageBlob: {
        type: DataTypes.BLOB,  // For storing binary image
        allowNull: true,
      },
      shelterId: {
        type: DataTypes.INTEGER,
        allowNull: false, // ShelterId is mandatory for pet creation
        references: {
          model: 'Shelters',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null to signify that the pet is not yet adopted
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      interestedUsers: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,  // Defaults to the current timestamp
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,  // Defaults to the current timestamp
      },
    },
    {
      sequelize,
      modelName: 'Pet',
    }
  );

  return Pet;
};