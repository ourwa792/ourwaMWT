

//cloudinary.api.root_folders().then(res => console.log(res));

// cloudinary.api.sub_folders('sample').then(res => console.log(res));

/* cloudinary.api
.delete_resources(['educational-resources/mpepfytgb0qukhhnvboi'],{
    type: 'authenticated', resource_type: 'raw'
})
.then (res => console.log(res))
.catch (err => console.log(err)); */

/* cloudinary.v2.uploader.upload_large("my_large_video.mp4", 
    { resource_type: "video" }, 
   function(error, result) {console.log(result, error); }); */

const WolframAlphaAPI = require('@wolfram-alpha/wolfram-alpha-api');
const waApi = WolframAlphaAPI('T6YRT5-7G4QGAUYRL');

/* const formatAnswer = answer => `<strong class="answer">${answer}</strong>`;
waApi.getFull('20! seconds in years').then((data) => {
  //console.log(formatAnswer(data));

  console.log(data)
}).catch(console.error); */

  
/* 
[{"time": 88, "asked": false, "correct": 3, "options": ["شكل خماسي يحوي زوايا و اضلاع", "شكل رباعي فيه ضلعان قائمان", "شكل رباعي فيه كل ضلعان متقابلان متوازيان و متساويان و زوياه قائمة", "مربع اضلاعه متعامدة"], "question": "ما هو تعريف المستطيل "}, 

{"time": 210, "asked": false, "correct": 2, "options": ["نجمع زواياه", "نجمع اطوال اضلاعه", "نطرح مساحته من مجموع اطوال اضلاعه"], "question": "إحدى طرق حساب محيط مستطيل هي؟"}]

[{"time": 88, "asked": false, "correct": 3, "options": ["شكل خماسي يحوي زوايا و اضلاع", "شكل رباعي فيه ضلعان قائمان", "شكل رباعي فيه كل ضلعان متقابلان متوازيان و متساويان و زوياه قائمة", "مربع اضلاعه متعامدة"], "question": "ما هو تعريف المستطيل "}, {"time": 210, "asked": false, "correct": 2, "options": ["نجمع زواياه", "نجمع اطوال اضلاعه", "نطرح مساحته من مجموع اطوال اضلاعه","نجمع الاضلاع ونقسم على 2"], "question": "إحدى طرق حساب محيط مستطيل هي؟"}] */


exports.getMonthlyCompetitionWinners = async (req, res) => {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
  
      const winners = await QuizResult.findAll({
        where: Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), currentMonth),
        where: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), currentYear),
        attributes: [
          'userId',
          [Sequelize.fn('SUM', Sequelize.col('userScore')), 'totalScore']
        ],
        include: [{ model: User, attributes: ['username'] }],
        group: ['userId', 'User.id'],
        order: [[Sequelize.fn('SUM', Sequelize.col('userScore')), 'DESC']],
        limit: 10
      });
  
      res.render('quiz/monthlyWinners', { winners });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


/* 
  const {translate} = require('@vitalets/google-translate-api')
  const { text } = translate('كيف نكامل x+1', {to: 'en'})
  .then(text => console.log(text)) */

  const axios = require('axios');

  const WOLFRAM_ALPHA_APP_ID = 'T6YRT5-7G4QGAUYRL';
  
/*   const getWolframAlphaAnswer = async (question) => {
    try {
      const response = await axios.get('https://api.wolframalpha.com/v2/query', {
        params: {
          input: question,
          appid: WOLFRAM_ALPHA_APP_ID,
          output: 'json'
        }
      });
  
      if (response.data.queryresult.success) {
        const pods = response.data.queryresult.pods;
        return pods.map(pod => ({
          title: pod.title,
          content: pod.subpods.map(subpod => subpod.plaintext).join('\n')
        }));
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching data from Wolfram Alpha:', error);
      return null;
    }
  };
  
  // مثال على كيفية استخدام الدالة
  (async () => {
    const question = 'how to draw a regular traingle';
    const answer = await getWolframAlphaAnswer(question);
    console.log('Answer:', answer);
  })(); */
  

const translate = require("google-translate-open-api").default

translate('Ik spreek Engels', { to: 'en'}).then(res => {
    console.log(res.text);
    //=> I speak English
   
    //=> nl
}).catch(err => {
    console.error(err);
});