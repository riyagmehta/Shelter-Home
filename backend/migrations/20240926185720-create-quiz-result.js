'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QuizResults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,  // Make sure userId is required
        references: {
          model: 'Users',  // Name of the referenced table (Users)
          key: 'id'        // Column in Users table to reference (id)
        },
        onUpdate: 'CASCADE',  // Automatically update QuizResults if Users is updated
        onDelete: 'CASCADE'   // Automatically delete QuizResults if Users is deleted
      },
      sizePreference: {
        type: Sequelize.STRING
      },
      exerciseAmount: {
        type: Sequelize.STRING
      },
      homeFrequency: {
        type: Sequelize.STRING
      },
      otherPets: {
        type: Sequelize.STRING
      },
      specialCareNeed: {
        type: Sequelize.STRING
      },
      petAgePreference: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('QuizResults');
  }
};