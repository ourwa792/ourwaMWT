const route = require('express').Router()

const {protectedRoute} = require('../middleware/authMiddleWare')

const quizController = require('../controller/quiz')



route.get('/list', protectedRoute, quizController.getAllQuizzes )

route.get('/quiz', protectedRoute, quizController.filterQuizzes)

route.get('/filter', protectedRoute, quizController.filterQuizzes)

route.get('/take/:id', protectedRoute, quizController.getQuizById);

route.post('/submit', protectedRoute, quizController.submitQuiz)

route.get('/attempts', protectedRoute, quizController.getUserAttempts);

route.get('/results/:resultId', protectedRoute, quizController.getQuizResult);



module.exports = route