const route = require('express').Router()
const adminController = require('../controller/admin')
const { check, body } = require("express-validator");

const isAdmin = require('../middleware/isAdmin')
const upload = require('../config/videoMulter')

const quizController = require('../controller/quiz')

route.get('/dashboard', isAdmin, adminController.getDashboard)

//route.get('/students', adminController.getStudents);

route.get("/add-student", isAdmin, adminController.getAddStudent);

route.post(
  "/add-student",
  isAdmin,
  [
    check("email")
      .isEmail()
      .withMessage("الرجاء إدخال بريد إلكتروني صالح")
      .normalizeEmail(),

    body("userName")
      .notEmpty()
      .withMessage("اسم المستخدم فارغ")
      .isLength({ min: 3 })
      .withMessage("اسم المستخدم يجب ألا يقل عن 3 أحرف"),

    body("password")
      .isLength({ min: 5 })
      .withMessage("الرجاء إدخال كلمة مرور بطول 5 محارف على الأقل")
      .trim(),

    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("كلمة المرور غير مطابقة");
        }
        return true;
      }),
  ],
  adminController.postAddStudent
);


route.post(
  '/edit-student',isAdmin ,
  [
    body('username').isLength({ min: 4 }).withMessage('يجب أن يكون اسم المستخدم 4 أحرف على الأقل.'),
    body('password').isLength({ min: 5 }).withMessage('يجب أن تكون كلمة المرور 5أحرف على الأقل.'),
    body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح.'),
    body('isAdmin').isBoolean().withMessage('يجب أن تكون قيمة الأدمن صحيحة.')
  ],
  adminController.postEditStudent
);

route.post('/delete-student', isAdmin, adminController.postDeleteStudent);

route.get('/student-feedbacks', isAdmin, adminController.getStudentFeedbacks)
route.get('/api/feedback-chart', isAdmin, adminController.getFeedbackChartData);
route.get('/api/feedback-table', isAdmin, adminController.getFeedbackTableData);

route.get('/add-video-lesson', isAdmin, adminController.getAddVideoLesson);
route.post(
  '/api/add-video-lesson', isAdmin ,
  (req, res, next) => {
    upload.single('thumbnail')(req, res, (err) => {
      if (err) {
        return res.status(422).json({ validationErrors: [{ msg: err.message, param: 'thumbnail' }], errorMessage: err.message });
      }
      next();
    });
  },
  [
    body('title').notEmpty().isLength({ min: 5 }).withMessage('عنوان الدرس يجب ألا يقل عن 5 محرفاً.'),
    body('link').notEmpty().isURL().withMessage('رابط الفيديو غير صالح.'),
    body('description').notEmpty().isLength({ min: 15 }).withMessage('الوصف يجب ألا يقل عن 15 محرفاً.'),
    body('grade').notEmpty().withMessage('الصف مطلوب.')
  ],
 
  adminController.postAddVideoLesson
);

route.get('/allUsersPerformance', isAdmin, quizController.getAllUsersPerformanceReport);


module.exports = route
