const seq = require("../utils/database").seq

const Sequelize = require("sequelize")

const QuizResult = seq.define(
  "quizresult",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userScore: {
      type: Sequelize.INTEGER,
      //allowNull: false,  // النقاط التي حصل عليها المستخدم
    },
    attempts: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    resultSchems: {
      type: Sequelize.DataTypes.JSON,
    },
    certificateUrl:{
      type: Sequelize.STRING,
      allowNull: true
    },
    quizDate: {
      type: Sequelize.DATE,
      
      defaultValue: Sequelize.NOW
    }
  }, 
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = QuizResult;
