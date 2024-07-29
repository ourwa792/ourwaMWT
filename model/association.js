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

/* Quiz.Update({
    quizSchema:{"pages": [{"name": "startPage", "elements": [{"html": "<p>مجموعة متنوعة من اسئلة الوحدة الثالثة للصف السابع بعنوان: النسبة و التناسب</p></br></br><i>هل سيحالفك الحظ ؟</i></br><img src='https://res.cloudinary.com/dg0d0jmtz/image/upload/v1721696754/quiz/Screenshot_2024-07-23_030517_fd31tq.png' width='100%' height='auto'></img>", "name": "welcomeMsg", "type": "html"}]}, {"elements": [{"name": "qFirst", "type": "radiogroup", "score": 1, "title": "تحيك نساجة \\(2\\) متر منن السجاد في 5 أيام فهي تحيك في \\(20\\) يوم :", "choices": ["\\(8\\)", "\\(50\\)", "\\(16\\)", "\\(10\\)"], "correctAnswer": "\\(8\\)"}]}, {"elements": [{"name": "qSecond", "type": "radiogroup", "score": 3, "title": "إذا اشترت حلا \\(3\\) كيلو غرام من التفاح بمبلغ \\(90\\) ليرة سورية فعندئذٍ يكون ثمن \\(10\\) كيلوغرامات هو :", "choices": [{"text": "\\(30\\)", "value": "1"}, {"text": "\\(300\\)", "value": "2"}, {"text": "\\(450\\)", "value": "3"}, {"text": "\\(270\\)", "value": "4"}], "correctAnswer": "2"}]}, {"elements": [{"name": "qThird", "type": "radiogroup", "score": 1, "title": "شجرتا سرو متجاورتان, طول الأولى \\(12\\) متراً وطول ظلها \\(9\\) أمتار, فإذا كان طول الشجرة الثانية \\(10\\) أمتار كان طول ظلها:", "choices": [{"text": "\\(5\\)", "value": "1"}, {"text": "\\(13\\)", "value": "2"}, {"text": "\\(7.5\\)", "value": "3"}, {"text": "\\(3\\)", "value": "4"}], "correctAnswer": "3"}]}, {"elements": [{"name": "qFourth", "type": "radiogroup", "score": 1, "title": "تحتاج سيارة \\(3\\) ساعات لقطع مسافة \\(160\\) كيلومتراً , حتى تقطع مسافة \\(240\\) كيلومتراً تحتاج :", "choices": [{"text": "\\(5.5\\)", "value": "1"}, {"text": "\\(2\\)", "value": "2"}, {"text": "\\(4.5\\)", "value": "3"}, {"text": "\\(7\\)", "value": "4"}], "correctAnswer": "3"}]}, {"elements": [{"name": "qfifth", "type": "radiogroup", "score": 1, "title": "إذا كان \\( \\displaystyle \\frac{3}{5} \\) = \\( \\displaystyle \\frac{a}{100} \\) كان \\(a\\) هو العدد", "choices": [{"text": "\\(75\\)", "value": "1"}, {"text": "\\(20\\)", "value": "2"}, {"text": "\\(30\\)", "value": "3"}, {"text": "\\(60\\)", "value": "4"}], "correctAnswer": "4"}]}, {"elements": [{"name": "qsixth", "type": "radiogroup", "score": 2, "title": "إذا كانت النسبة %7 هي ذاتها \\( \\displaystyle \\frac{7}{100} \\), كانت النسبة %15 هي :", "choices": [{"text": "\\( \\displaystyle \\frac{15}{80} \\)", "value": "1"}, {"text": "\\( \\displaystyle \\frac{6}{50} \\)", "value": "2"}, {"text": "\\( \\displaystyle \\frac{3}{20} \\)", "value": "3"}, {"text": "\\( \\displaystyle \\frac{20}{100} \\)", "value": "4"}], "correctAnswer": "3"}]}, {"elements": [{"name": "qseven", "type": "radiogroup", "score": 1, "title": "35% من العدد \\(20\\) يساوي:", "choices": [{"text": "\\(9\\)", "value": "1"}, {"text": "\\(6\\)", "value": "2"}, {"text": "\\(5\\)", "value": "3"}, {"text": "\\(7\\)", "value": "4"}], "correctAnswer": "4"}]}, {"elements": [{"name": "qeigth", "type": "radiogroup", "score": 1, "title": "إذا كان 50% من العدد \\(x\\) يساوي \\(18\\) كان \\(x\\) هو العدد :", "choices": [{"text": "\\(9\\)", "value": "1"}, {"text": "\\(36\\)", "value": "2"}, {"text": "\\(90\\)", "value": "3"}, {"text": "\\(72\\)", "value": "4"}], "correctAnswer": "2"}]}, {"elements": [{"name": "qninth", "type": "radiogroup", "score": 3, "title": "إذا أضفنا إلى عدد 10% من العدد نفسه فكان الناتج \\(220\\) , كان هذا العدد:", "choices": [{"text": "\\(210\\)", "value": "1"}, {"text": "\\(180\\)", "value": "2"}, {"text": "\\(200\\)", "value": "3"}, {"text": "\\(190\\)", "value": "4"}], "correctAnswer": "3"}]}, {"elements": [{"name": "qten", "type": "radiogroup", "score": 3, "title": "أجرت مدرسة اختباراً فنجح 80% من طلاب الصف, فإذا كان عدد الناجحين \\(20\\) طالباً فإن عدد طلاب الصف هو:", "choices": [{"text": "\\(50\\)", "value": "1"}, {"text": "\\(40\\)", "value": "2"}, {"text": "\\(80\\)", "value": "3"}, {"text": "\\(25\\)", "value": "4"}], "correctAnswer": "4"}]}, {"elements": [{"name": "qeleven", "type": "radiogroup", "score": 1, "title": "إذا كان ثمن \\(7\\) كيلو غراماً من العدس يساوي \\(178.5\\) ل.س فإن سعر الكيلوغرام الواحد هو:", "choices": [{"text": "\\(185.5\\)", "value": "1"}, {"text": "\\(171.5\\)", "value": "2"}, {"text": "\\(25.5\\)", "value": "3"}, {"text": "\\(1249.5\\)", "value": "4"}], "correctAnswer": "3"}]}, {"elements": [{"name": "qtwelve", "type": "radiogroup", "score": 1, "title": "ينتج مصنع \\(1272\\) عبوةً زجاجية في \\(6\\) ساعات, معدل إنتاج المصنع في الساعة هو:", "choices": [{"text": "\\(305\\)", "value": "1"}, {"text": "\\(250\\)", "value": "2"}, {"text": "\\(212\\)", "value": "3"}, {"text": "\\(200\\)", "value": "4"}], "correctAnswer": "3"}]}, {"elements": [{"name": "qtherten", "type": "radiogroup", "score": 1, "title": "يحرث جرار \\(280\\) دونماً في أسبوع, معدل حرث الجرار في اليوم هو:", "choices": [{"text": "\\(30\\)", "value": "1"}, {"text": "\\(45\\)", "value": "2"}, {"text": "\\(35\\)", "value": "3"}, {"text": "\\(40\\)", "value": "4"}], "correctAnswer": "4"}]}, {"elements": [{"name": "qfourthen", "type": "radiogroup", "score": 1, "title": "سافر جابر بسيارته، فقطع مسافة \\(243\\) كيلومتراً خلال \\(3\\) ساعات، مُعدَّل ما يقطعه في ساعة واحدة يساوي", "choices": [{"text": "\\(81\\)", "value": "1"}, {"text": "\\(60.75\\)", "value": "2"}, {"text": "\\(55.5\\)", "value": "3"}, {"text": "\\(729\\)", "value": "4"}], "correctAnswer": "1"}]}, {"elements": [{"name": "qfiftheen", "type": "radiogroup", "score": 1, "title": " يعد مطعم \\(108\\) وجبات في تسع ساعات معدل الوجبات التي يعدها في الساعة هو:", "choices": [{"text": "\\(12\\)", "value": "1"}, {"text": "\\(36\\)", "value": "2"}, {"text": "\\(8\\)", "value": "3"}, {"text": "\\(15\\)", "value": "4"}], "correctAnswer": "1"}]}, {"elements": [{"name": "qsixteen", "type": "radiogroup", "score": 1, "title": "يكتب مجد \\(320\\) سطر في 4 ساعات معدل ما يكتبه مجد في الساعة هو:", "choices": [{"text": "\\(8\\)", "value": "1"}, {"text": "\\(80\\)", "value": "2"}, {"text": "\\(64\\)", "value": "3"}, {"text": "\\(25\\)", "value": "4"}], "correctAnswer": "2"}]}, {"elements": [{"name": "qseventeen", "type": "radiogroup", "score": 1, "title": "ترش سيارة اطفاء \\(240\\) لتر في\\(12\\) دقيقة, إذن ترش السيارة في الدقيقة:", "choices": [{"text": "\\(150\\)", "value": "1"}, {"text": "\\(240\\)", "value": "2"}, {"text": "\\(100\\)", "value": "3"}, {"text": "\\(200\\)", "value": "4"}], "correctAnswer": "4"}]}, {"elements": [{"name": "qegtheen", "type": "text", "score": 5, "title": "تستهلك سيارة 9 ليرات بنزين لقطع مسافة 100 كيلومتر, كم ليتراً يلزمها من البنزين لقطع مسافة 375 كيلومتر؟", "inputType": "number", "correctAnswer": 33.75}]}], "logoPosition": "right", "completedHtml": "<h4>You got <b>{totalScore}</b> out of <b>{maxScore}</b> correct answers.</h4>", "showTimerPanel": "top", "showProgressBar": "top", "firstPageIsStarted": true, "maxTimeToFinishPage": 20, "completedHtmlOnCondition": [{"html": "You got {totalScore} out of {maxScore} points.</br></br><h5>ممتاز نتيجتك رائعة !!</h5>", "expression": "{totalScore} >= 14"}, {"html": "You got {totalScore} out of {maxScore} points.</br></br><i>لا بأس بإمكانك التحسن</i>", "expression": "{totalScore} = 13 || {totalScore} = 12 || {totalScore} = 11"}, {"html": "You got {totalScore} out of {maxScore} points.</br></br><i>يجب عليك الدراسة بشكل اكبر</i>", "expression": "{totalScore} <= 10"}]},
    difficulty: 'Medium' ,
    title: 'تمارين الوحدة الثالثة -الصف السابع' ,
    tag: "تمارين الوحدة"    
}).then(res => console.log(res))
.catch(err => console.log(err)) */