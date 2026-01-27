module.exports = (sequelize, DataTypes) => {
  const Shelter = sequelize.define('Shelter', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Shelter.associate = function(models) {
    // A Shelter can have many Pets
    Shelter.hasMany(models.Pet, { foreignKey: 'shelterId', as: 'pets' });
  };

  return Shelter;
};