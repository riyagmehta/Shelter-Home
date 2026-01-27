"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,  // Use Sequelize.DataTypes
      },
      types: {
        type: Sequelize.DataTypes.ENUM("Dog", "Cat", "Bird", "Rabbits", "Fish"),
        allowNull: false,
      },
      breed: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true, // Breeds are conditional, e.g., not applicable to Fish
      },
      color: {
        type: Sequelize.DataTypes.ENUM("Black", "White", "Brown", "Mixed", "Other"),
        allowNull: false,
      },
      age: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      gender: {
        type: Sequelize.DataTypes.ENUM("Male", "Female"),
        allowNull: false,
      },
      adoptionFee: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
      },
      availability: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      sizePreference: {
        type: Sequelize.DataTypes.ENUM("Small", "Medium", "Large"),
        allowNull: true, // Optional
      },
      exerciseAmount: {
        type: Sequelize.DataTypes.ENUM(
          "Little to none",
          "30 minutes",
          "1 hour",
          "More than an hour"
        ),
        allowNull: true, // Optional
      },
      homeFrequency: {
        type: Sequelize.DataTypes.ENUM("Rarely", "Sometimes", "Often", "Always"),
        allowNull: true, // Optional
      },
      otherPets: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true, // Optional
      },
      specialCareNeed: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true, // Optional
      },
      petAgePreference: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true, // Optional
      },
      imageUrl: {
        type: Sequelize.DataTypes.STRING(1024), // Store the URL as a string
        allowNull: true, // Optional field for image URLs
      },
      imageBlob: {
        type: Sequelize.DataTypes.BLOB, // Store the image as binary
        allowNull: true, // Optional field for binary images
      },
      shelterId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Shelters',  // This refers to the Shelters table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true, // This can be null initially, meaning the pet is not yet adopted
        references: {
          model: 'Users', // Assumes you have a Users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Optional: Defines what happens when the associated user is deleted
      },
      interestedUsers: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Pets");
  },
};