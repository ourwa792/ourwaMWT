const { Sequelize, Op } = require("sequelize");
const sequelize = require('../utils/database').seq;

const User = require('./user')
const VideoLesson = require('./vid_lesson')
const Resources = require('./resources')
const QuizResult = require('./quiz_result')
const Quiz = require('./quiz')
const FeedBack = require('./feedback');
const Lesson  = require('./lesson');
const Category  = require('./category')

User.hasMany(FeedBack)
FeedBack.belongsTo(User,{constraints: true, onDelete: 'CASCADE'})

User.hasMany(VideoLesson)
VideoLesson.belongsTo(User,{constraints:true,onDelete:'CASCADE'})

Lesson.hasMany(FeedBack, {constraints: true, onDelete: 'CASCADE'})
FeedBack.belongsTo(Lesson)

User.hasMany(VideoLesson,{constraints: true, onDelete: 'CASCADE'})
VideoLesson.belongsTo(User,{constraints: true, onDelete: 'CASCADE'}) 

User.belongsToMany(Quiz,{through:QuizResult})
Quiz.belongsToMany(User,{through:QuizResult}) 

Resources.belongsTo(Lesson, {foreignkey:'lesson_id',allowNull: true})
Lesson.hasMany(Resources,{constraints: true}) 

Lesson.belongsTo(Category)
Category.hasMany(Lesson,{constraints: true, onDelete: 'CASCADE'})

// Define one-to-many relationships between Quiz and QuizResult
Quiz.hasMany(QuizResult);
QuizResult.belongsTo(Quiz);

// Define one-to-many relationships between User and QuizResult
User.hasMany(QuizResult);
QuizResult.belongsTo(User);

//User.hasMany(Resources)
//Resources.belongsTo(User,{constraints: true, onDelete: 'CASCADE'})



module.exports = { User, FeedBack, Lesson, Category, sequelize, Op,
    VideoLesson, Quiz, Resources, QuizResult
}

