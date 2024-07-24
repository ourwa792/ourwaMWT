const { Quiz, QuizResult, User } = require("../model/association");
const { Sequelize, Op } = require("sequelize");
const sequelize = require('../utils/database').seq;

const {cloudinary} = require('../config/cloudinary')
//const {Model, Serializer} = require('survey-core')
const fs = require('fs')
const path = require('path')

const PDFDocument = require('pdfkit')
// دالة لحساب النقاط القصوى
function calculateMaxScore(questions) {
    let maxScore = 0;
    questions.forEach((question) => {
        if (question.score) {
            maxScore += question.score;
        }
    });
    return maxScore;
}

// دالة لحساب النقاط الإجمالية وعدد الإجابات الصحيحة والخاطئة
function calculateTotalScore(data, survey) {
    let totalScore = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    Object.keys(data).forEach((qName) => {
        const question = survey.getQuestionByValueName(qName);
        if (question && question.isAnswerCorrect()) {
            correctAnswers++;
            if (question.score) {
                totalScore += question.score;
            }
        } else {
            incorrectAnswers++;
        }
    });

    return { totalScore, correctAnswers, incorrectAnswers };
}



exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.render("quiz/list", { quizzes, pageTitle: "اختبارات" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.filterQuizzes = async (req, res) => {
  const difficulty = req.query.difficulty;
  let query = {};
  if (difficulty && difficulty !== "all") {
    query.difficulty = difficulty;
  }
  try {
    const quizzes = await Quiz.findAll({ where: query });
    res.json({ quizzes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.render("quiz/takeQuiz", {
      quiz,
      username: req.user.userName,
      pageTitle: quiz.title,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 
 
// إرسال نتائج الكويز
exports.submitQuiz = async (req, res) => {
  const { quizId, userAnswers, userScore, maxScore, correctAnswers, incorrectAnswers } = req.body;
  console.log('Received data:', req.body);

  try {
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // تحديث maxScore إذا كان مختلفًا عن القيمة الحالية
    if (quiz.maxScore !== maxScore) {
      quiz.maxScore = maxScore;
      await quiz.save();
    }

    // البحث عن محاولة سابقة للكويز لنفس المستخدم
    let quizResult = await QuizResult.findOne({
      where: { userId: req.user.id, quizId: quizId },
      include: [{ model: User }] // تضمين بيانات المستخدم
    });

    if (quizResult) {
      // إذا كانت هناك محاولة سابقة، تحديث النقاط وعدد المحاولات
      quizResult.userScore = userScore;
      quizResult.attempts += 1;
      quizResult.resultSchems = userAnswers;
      quizResult.quizDate = new Date(); // ضبط تاريخ الكويز الحالي
      await quizResult.save();
    } else {
      // إذا لم تكن هناك محاولة سابقة، إنشاء نتيجة جديدة
      quizResult = await QuizResult.create({
        userId: req.user.id,
        quizId: quizId,
        userScore: userScore,
        attempts: 1,
        resultSchems: userAnswers,
        quizDate: new Date() // ضبط تاريخ الكويز الحالي

      });
      // جلب بيانات المستخدم المرتبطة
      quizResult = await QuizResult.findByPk(quizResult.id, { include: [{ model: User }] });
    }

    // تحقق من شروط توليد الشهادة
    if (userScore === maxScore && quiz.difficulty === 'Hard' && quizResult.attempts === 1) {
      const doc = new PDFDocument();
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);

        // رفع الشهادة إلى Cloudinary
        cloudinary.uploader.upload_stream({ resource_type: 'raw', folder:'quiz',format:"pdf" },
          async (error, result) => {
          if (error) return res.status(500).json({ error: error.message });

          // إرسال رابط التحميل للمستخدم
          quizResult.certificateUrl = result.secure_url;
          await quizResult.save();
          res.json({
            resultId: quizResult.id,
            certificateUrl: result.secure_url,
            userScore: userScore,
            correctAnswers: correctAnswers,
            incorrectAnswers: incorrectAnswers,
            maxScore: quiz.maxScore
          });
        }).end(pdfData);
      });

    // تحميل الخطوط والصور
    const arabicFontPath = path.join(__dirname, '../public/fonts/Amiri-Regular.ttf');
    const backgroundImagePath = path.join(__dirname, '../public/image/certificate.jfif');
    const logoImagePath = path.join(__dirname, '../public/image/logo.png');

    doc.image(backgroundImagePath, 0, 0, { width: doc.page.width, height: doc.page.height});

 // اختيار الخط بناءً على اللغة

 doc.registerFont('ArabicFont', arabicFontPath);

 // تنسيق النصوص
 const userName = quizResult.user.userName;
 const quizTitle = quiz.title;

 const textOptions = {
   align: 'center',
   width: doc.page.width - 100
 };

 doc.font('ArabicFont').fontSize(25).fillColor('blue').text('شهادة الإنجاز', {
   ...textOptions,
   align: 'center',
   features: ['rtla']
 });

 doc.moveDown();
 doc.fontSize(20).fillColor('black').text('هذه الشهادة تؤكد أن الطالب', {
   ...textOptions,
   align: 'center',
   features: ['rtla']
 });

 doc.moveDown();
 doc.fontSize(30).fillColor('red').text(userName, {
   ...textOptions,
   align: 'center',
   bold: true,
   features: ['rtla']
 });

 doc.moveDown();
 doc.fontSize(20).fillColor('black').text('قد أكمل بنجاح الاختبار في', {
   ...textOptions,
   align: 'center',
   features: ['rtla']
 });

 doc.moveDown();
 doc.fontSize(25).fillColor('blue').text(quizTitle, {
   ...textOptions,
   align: 'center',
   bold: true,
   features: ['rtla']
 });

 doc.moveDown();
 doc.fontSize(20).fillColor('black').text(`من ${userScore} بدرجة ${maxScore}.`, {
   ...textOptions,
   align: 'center',
   features: ['rtla']
 });

 doc.end();

    } else {
      res.json({
        resultId: quizResult.id,
        userScore: userScore,
        correctAnswers: correctAnswers,
        incorrectAnswers: incorrectAnswers,
        maxScore: quiz.maxScore,
        message: 'No certificate generated as conditions were not met.'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};


  
exports.getQuizResult = async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const quizResult = await QuizResult.findByPk(resultId, {
      include: [
        {
          model: Quiz,
          //attributes: ["id", "title", "maxScore"]
        },
        {
          model: User,
          //attributes: ["id", "userName"]
        }
      ]
    });

    console.log("=====quizResult==="+ JSON.stringify(quizResult, null, 3))

    if (!quizResult) return res.status(404).json({ message: 'Quiz result not found' });

    res.render('quiz/result', {
      pageTitle: "نتيجة الاختبار" ,
      certificateUrl: quizResult.certificateUrl,
      quiz: quizResult.quiz,
      username: quizResult.user.userName,
      userScore: quizResult.userScore,
      maxScore: quizResult.quiz.maxScore,
      correctAnswers: quizResult.resultSchems.correctAnswers,
      incorrectAnswers: quizResult.resultSchems.incorrectAnswers,
      resultSchems : quizResult.resultSchems ,
      resultId: quizResult.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUserAttempts = async (req, res) => {
  try {
      const attempts = await QuizResult.findAll({
          where: { userId: req.user.id },
          include: [{ model: Quiz }]
      });

      const userScores = await QuizResult.findAll({
          attributes: [
              'userId',
              [sequelize.fn('SUM', sequelize.col('userScore')), 'totalScore']
          ],
          group: ['userId'],
          order: [[sequelize.fn('SUM', sequelize.col('userScore')), 'DESC']],
          include: [{ model: User }],
          limit: 10 // جلب أعلى 10 متفوقين
      });

      const performanceData = await analyzePerformance(req.user.id);

      res.render('quiz/attempts', { attempts, userScores, performanceData, pageTitle: "محاولات الاختبارات" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

//=======

const analyzePerformance = async (userId) => {
  const quizResults = await QuizResult.findAll({
      where: { userId },
      include: [{ model: Quiz }, { model: User }],
  });

  const userPerformance = {
      userId,
      attempts: [],
      averageScore: 0,
      averageCorrectAnswers: 0,
      averageIncorrectAnswers: 0,
  };

  let totalScore = 0;
  let totalCorrectAnswers = 0;
  let totalIncorrectAnswers = 0;

  quizResults.forEach(result => {
    const percentageScore = ((result.userScore / result.quiz.maxScore) * 100).toFixed(2);

      userPerformance.attempts.push({
          title: result.quiz.title,
          userScore: result.userScore,
          maxScore: result.quiz.maxScore,
          correctAnswers: result.resultSchems.correctAnswers,
          incorrectAnswers: result.resultSchems.incorrectAnswers,
          createdAt: result.quizDate
      });

      totalScore += parseFloat(percentageScore);
      totalCorrectAnswers += result.resultSchems.correctAnswers;
      totalIncorrectAnswers += result.resultSchems.incorrectAnswers;
  });

  userPerformance.averageScore = (totalScore / quizResults.length).toFixed(2);
  userPerformance.averageCorrectAnswers = (totalCorrectAnswers / quizResults.length).toFixed(2);
  userPerformance.averageIncorrectAnswers = (totalIncorrectAnswers / quizResults.length).toFixed(2);

  return userPerformance;
};
//==========


/* // دالة لجلب تقارير الأداء للطالب
exports.getUserPerformanceReport = async (req, res) => {
  try {
      const userId = req.user.id;
      const performanceData = await analyzePerformance(userId);
      res.render("quiz/userPerformance", { performanceData, pageTitle: "تقرير الأداء" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
 */
// دالة لجلب تقارير الأداء لجميع الطلاب (للمدير)
exports.getAllUsersPerformanceReport = async (req, res) => {
  try {
    const performanceReports = await analyzePerformance();
    console.log("====performanceReports==="+JSON.stringify(performanceReports,null,2))

    res.render("admin/allUsersPerformance", { performanceReports, pageTitle: "تقرير أداء الطلاب" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
