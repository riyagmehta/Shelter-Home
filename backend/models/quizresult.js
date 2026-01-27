// models/quizresult.js
module.exports = (sequelize, DataTypes) => {
    const QuizResult = sequelize.define('QuizResult', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', 
                key: 'id'
            }
        },
        sizePreference: DataTypes.STRING,
        exerciseAmount: DataTypes.STRING,
        homeFrequency: DataTypes.STRING,
        otherPets: DataTypes.STRING,
        specialCareNeed: DataTypes.STRING,
        petAgePreference: DataTypes.STRING
    }, {});
    QuizResult.associate = function(models) {
        QuizResult.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };
    return QuizResult;
};
