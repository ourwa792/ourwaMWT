const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const helmet = require('helmet');
const compression = require('compression');

const ws = require('ws')


const SequelizeStore = require('connect-session-sequelize')(session.Store)
const sequelize = require('./utils/database').seq

var store = new SequelizeStore({
    db: sequelize,
    tableName: 'sessionMWT'
})

const app = express();


const wss = new ws.Server({port:5000});


// WebSocket connection handling with origin verification
wss.on('connection', (socket, req) => {
  const origin = req.headers.origin;
  if (origin !== 'http://localhost:3000') {
    socket.terminate();
    return;
  }

  console.log('New --- user --- connected');
  socket.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      wss.clients.forEach(client => {
        if (client !== socket && client.readyState === ws.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('Invalid message', error);
    }
  });
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false ,
    saveUninitialized: false,
    store: store
}))

store.sync({alter:true})

/* const corsOption = {
  origin: "*", // يلي بدو يبعت ريكويست
  methods : ["GET","HEAD","PUT","PATCH","POST","DELETE"],
  credentials : true
}
app.use(cors(corsOption)) */


const User = require('./model/association').User ;

const authRout = require('./routes/auth')
const userRout = require('./routes/user')
const adminRout = require('./routes/admin')
const db = require('./utils/database')
const lessonRout = require('./routes/lesson')
const videoRout = require('./routes/video')
const resourceRoutes = require('./routes/resources');
const quizRout = require('./routes/quiz')
const wolframRoutes = require('./routes/wolfram');
const boardRout = require('./routes/board')

app.set('view engine', 'ejs')
app.set('views', 'views')

const port = process.env.PORT 

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/css', express.static(path.join(__dirname, 'public/css'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use('/library', express.static(path.join(__dirname, 'public/library'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));
app.use(methodOverride('_method')); // إعداد method-override


app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(morgan('dev'))
app.use(flash())


app.use((req, res, next) => { // set it globally
  const error = req.flash('error');
  const success = req.flash('success');
  console.log('Flash error:', error);
  console.log('Flash success:', success);
  res.locals.error = error;
  res.locals.success = success;
  res.locals.errorMessage = req.errorMessage
  res.locals.user = req.session.user || null;
  
  next();
}) 

app.use((req, res, next) => {
  res.locals.error_msg = req.flash('error_msg');
  res.locals.success_msg = req.flash('success_msg') ;
  next()
})



app.use((req, res, next) => {
  // تحقق إذا كان هناك مستخدم مسجل في الجلسة
  if (!req.session.user) {
    console.log('no user in session')
    return next(); // إذا لم يكن هناك مستخدم، انتقل إلى الميدل وير التالي
  }
  
  // جلب بيانات المستخدم من قاعدة البيانات باستخدام معرف المستخدم المخزن في الجلسة
  User.findByPk(req.session.user.id)
    .then(user => {
      //console.log(user)
      if (!user) {
        return next(); // إذا لم يتم العثور على المستخدم، انتقل إلى الميدل وير التالي
      }
      // تخزين كائن المستخدم في req.user ليكون متاحاً في المعالجات اللاحقة
      req.user = user;
      next(); // انتقل إلى الميدل وير التالي
    })
    .catch(err => {
      next(new Error(err)); // في حالة حدوث خطأ، إرسال الخطأ إلى معالج الأخطاء
    });
}); 


app.use(authRout)
app.use('/admin', adminRout)
app.use(userRout)
app.use(lessonRout)
app.use(videoRout)
app.use('/resources', resourceRoutes)
app.use('/wolfram', wolframRoutes);
app.use('/quiz', quizRout)
app.use(boardRout)


app.get('/error', (req, res, next) => {
  const error = new Error('هذا خطأ تجريبي');
  error.status = 500;
  next(error); // إرسال الخطأ إلى معالج الأخطاء
});

app.use((req, res, next) => {
  console.log(`====Request URL==========: ${req.url}`);
  console.log(`====Request Method=======: ${req.method}`);
  next();
});

// معالج لجميع المسارات غير الموجودة (لإنشاء خطأ 404)
/*  app.use((req, res, next) => {
  const err = new Error('الصفحة غير موجودة');
  err.status = 404;
  next(err);
});


// معالج اخطاء موحد
 app.use((err, req, res, next) => {
  if(!err.status) {
    err.status = 500 ;
    err.message = 'الصفحة غير موجودة'
  }
  console.error(err.stack); // طباعة الخطأ في وحدة التحكم
  res.status(err.status || 500).render('error', { error: err ,
    pageTitle: 'ERROR-page'
  });
}); 
 */

app.listen(port, db.Database)


/* app.get('/api',(req,res)=>{
  res.json({message: ' hello world '})
}) */