// controllers/adminController.js
const { validationResult, buildCheckFunction } = require('express-validator');
const {User, FeedBack, Lesson, Category, VideoLesson} = require('../model/association');
const bcrypt = require("bcryptjs");
const multer = require('multer')
const upload = require('../config/videoMulter')


exports.getDashboard = (req, res, next) => {
  User.findAll()
    .then(students => {
      res.render('admin/dashboard', {
        pageTitle: 'لوحة القيادة',
        students: students,
      });
    })
    .catch(err => {
      console.error(err);
      req.flash('error', 'حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى لاحقاً.');
      res.status(500).redirect('/admin/dashboard');
    });
};

exports.getStudents = (req, res, next) => {
  User.findAll()
    .then(students => {
      res.render('admin/students', {
        pageTitle: 'قائمة الطلاب',
        students: students
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).render('error', { error: err, pageTitle: 'خطأ' });
    });
};

//--------------------------



exports.getAddStudent = (req, res, next) => {
  res.render("admin/add-student", {
    pageTitle: "Add Student",
    oldInput: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};


exports.postAddStudent = async (req, res, next) => {
  const { userName, email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-student", {
      pageTitle: "Add Student",
      errorMessage: errors.array()[0].msg,
      oldInput: { userName, email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }
  try {
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.status(422).render("admin/add-student", {
        pageTitle: "اضافة طالب",
        errorMessage: "البريد الإلكتروني موجود بالفعل.",
        oldInput: { userName, email, password, confirmPassword },
        validationErrors: [],
      });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ userName, email, password: hashedPassword });
    await user.save();
    req.flash("success", "تم إضافة الطالب بنجاح");
    res.redirect("/admin/dashboard"); // إعادة التوجيه لنفس الصفحة مع رسالة تأكيد
  } catch (error) {
    console.error(error);
    req.flash("error", "حدث خطأ ما، يرجى المحاولة مرة أخرى");
    res.redirect("/admin/add-student");
  }
};


//-------------------------


exports.postEditStudent = (req, res, next) => {
  const { studentId, password, username, email, isAdmin } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(err => err.msg));
    return res.redirect('/admin/dashboard');
  }

  User.findByPk(studentId)
    .then(student => {
      if (!student) {
        req.flash('error', 'لم يتم العثور على الطالب.');
        return res.redirect('/admin/dashboard');
      }

      student.userName = username;
      student.email = email;
      student.isAdmin = isAdmin === 'true';
      if (password) {
        student.password = bcrypt.hashSync(password, 8)
      }
      return student.save();
    })
    .then(result => {
      req.flash('success', 'تم تعديل بيانات الطالب بنجاح.');
      res.redirect('/admin/dashboard');
    })
    .catch(err => {
      console.error(err);
      req.flash('error', 'حدث خطأ أثناء تعديل بيانات الطالب.');
      res.redirect('/admin/dashboard');
    });
};
 

//--------------------

exports.postDeleteStudent = (req, res, next) => {
  const { studentId } = req.body;

  User.findByPk(studentId)
    .then(student => {
      if (!student) {
        req.flash('error', 'لم يتم العثور على الطالب.');
        return res.redirect('/admin/dashboard');
      }

      return student.destroy();
    })
    .then(() => {
      req.flash('success', 'تم حذف الطالب بنجاح.');
      res.redirect('/admin/dashboard');
    })
    .catch(err => {
      console.error(err);
      req.flash('error', 'حدث خطأ أثناء محاولة حذف الطالب. يرجى المحاولة مرة أخرى لاحقاً.');
      res.status(500).redirect('/admin/dashboard');
    });
};


//--------------

exports.getStudentFeedbacks = (req, res) => {
  res.render('admin/studentFeedbacks', {
    pageTitle: 'تقييمات الطلاب'
  });
};

/* 
exports.getStudentFeedbacksData = async (req, res) => {
  try {
    const feedbacks = await FeedBack.findAll({
      include: {
        model: Lesson,
        attributes: ['title', 'grade'],
        include: {
          model: Category,
          attributes: ['name']
        }
      },
      include: {
        model: User,
        attributes: ['userName', 'email']
      }
    });

    const feedbackCounts = feedbacks.reduce((acc, feedback) => {
      const lesson = feedback.lesson;
      const category = `${lesson.title} - ${lesson.grade}`;
      if (!acc[category]) {
        acc[category] = {
          title: lesson.title,
          grade: lesson.grade,
          count: 0
        };
      }
      acc[category].count++;
      return acc;
    }, {});
    console.log(feedbackCounts)

    const labels = Object.keys(feedbackCounts);
    const counts = labels.map(label => feedbackCounts[label].count);

    // Collect data for DataTable
    const feedbackData = feedbacks.map(feedback => ({
      userName: feedback.user.userName,
      email: feedback.user.email,
      comments: feedback.comment,
      wellPrepared: feedback.wellPrepared ? 'Yes' : 'No',
      lessonTitle: feedback.lesson.title,
      lessonGrade: feedback.lesson.grade,
      lessonCategory: feedback.lesson.category.name
    }));

    console.log(feedbackData)
    res.json({ labels, counts, feedbackData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في جلب التقييمات' });
  }
}; */

exports.getFeedbackChartData = async (req, res) => {
  try {
    const feedbacks = await FeedBack.findAll({
      include: {
        model: Lesson,
        attributes: ['title', 'grade'] ,
        include: {
          model: Category ,
          attributes: ['name']
        }
      }
    })

    const feedbackCounts = feedbacks.reduce( (acc, feedback) => {
      const lesson = feedback.lesson ;
      const category = `${lesson.title} - ${lesson.grade}` ;
      if (! acc[category]) {
        acc[category] = {
          title: lesson.title,
          grade: lesson.grade,
          count: 0
        }
      }
      acc[category].count++ ;
      return acc ;
    }, {})

    const labels = Object.keys(feedbackCounts);
    const counts = labels.map (label => feedbackCounts[label].count)
    res.json({labels, counts})
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'خطأ في جلب بيانات المخطط'})
  }
}

exports.getFeedbackTableData = async (req, res) => {
  try {
    const feedbacks = await FeedBack.findAll({
      include: [
        {
          model: Lesson,
          attributes: ['title', 'grade'],
          include: {
            model: Category,
            attributes: ['name']
          }
        },
        {
          model: User,
          attributes: ['userName', 'email']
        }
      ]
    })
    console.log(feedbacks)
    const feedbackData = feedbacks.map(feedback => ({
      userName: feedback.user.userName,
      email: feedback.user.email,
      comments: feedback.rating.comments,
      lessonTitle: feedback.lesson.title,
      //well_prepared: feedback.rating.well-prepared ,
      lessonGrade: feedback.lesson.grade,
      lessonCategory: feedback.lesson.category.name,
      createdAt: feedback.createdAt.toLocaleString('ar-EG')
    }));

    res.json({feedbackData})
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'خطأ في جلب بيانات جدول التقييمات'})
  }
}

//===----==========

exports.getAddVideoLesson = (req, res, next) => {
  res.render('admin/add-video-lesson', {
    pageTitle: 'إضافة درس فيديو جديد',
    oldInput: { title: '', link: '', description: '', grade: '' },
    validationErrors: [],
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
};

// الفالديشن من السيرفر صحيحة
exports.postAddVideoLesson = async (req, res, next) => {
  const { title, link, description, grade } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //req.flash('error', 'حدثت أخطاء في الإدخال.');
    return res.status(422).json({
      validationErrors: errors.array(),
      errorMessage: 'حدثت أخطاء في الإدخال.'
    });
  }

  const thumbnailUrl = req.file ? req.file.path : null;

  try {
    const videoLesson = new VideoLesson({
      title: title,
      link: link,
      description: description,
      grade: grade,
      thumbnailUrl: thumbnailUrl
    });

    await videoLesson.save();
    res.status(201).json({ successMessage: 'تم إضافة درس الفيديو بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: 'حدث خطأ ما، يرجى المحاولة مرة أخرى' });
  }
};