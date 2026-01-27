module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Shelters', [
      {
        name: 'Happy Paws Shelter',
        email: 'happypaws@example.com',
        password: 'happypawsshelter',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cozy Companions Shelter',
        email: 'cozycompanions@example.com',
        password: 'cozycompanionsshelter',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Safe Haven Animal Shelter',
        email: 'safehaven@example.com',
        password: 'safehaven123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Furry Friends Rescue',
        email: 'furryfriends@example.com',
        password: 'furryfriendsrescue',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pet Paradise',
        email: 'petparadise@example.com',
        password: 'petparadise456',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cuddle Care Shelter',
        email: 'cuddlecare@example.com',
        password: 'cuddlecareshelter',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Shelters', null, {});
  }
};