/* require ('dotenv').config()

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
}) */

//cloudinary.api.root_folders().then(res => console.log(res));

// cloudinary.api.sub_folders('sample').then(res => console.log(res));

/* cloudinary.api
.delete_resources(['educational-resources/mpepfytgb0qukhhnvboi'],{
    type: 'authenticated', resource_type: 'raw'
})
.then (res => console.log(res))
.catch (err => console.log(err)); */

/* cloudinary.uploader.destroy('qtns9vji1byfg3ubrlok.pdf')
.then(res => console.log(res))
.catch(er => console.log(er)) */

/* cloudinary.v2.uploader.upload_large("my_large_video.mp4", 
    { resource_type: "video" }, 
   function(error, result) {console.log(result, error); }); */

/* const fs = require('fs')

const path = require('path')
const axios = require('axios');

async function download(){
    const url = 'https://res.cloudinary.com/dg0d0jmtz/raw/upload/v1720059048/educational-resources/file-1720059047256.pptx'
    const Path = path.resolve(__dirname, 'file', 'er')

    const res = await axios.get(url, {responseType: 'stream'})
    res.data.pipe(fs.createWriteStream(Path))

    return new Promise((resolve, reject) => {
        res.data.on('end', () => resolve('downloaded'));
        res.data.on('error', (err) => reject(err));
    })

}

download() */

/* const WolframAlphaAPI = require('@wolfram-alpha/wolfram-alpha-api');
const waApi = WolframAlphaAPI('T6YRT5-7G4QGAUYRL');

const formatAnswer = answer => `<strong class="answer">${answer}</strong>`;
waApi.getShort('20! seconds in years').then((data) => {
  console.log(formatAnswer(data));
}).catch(console.error); */

[{"time": 88, "asked": false, "correct": 3, "options": ["شكل خماسي يحوي زوايا و اضلاع", "شكل رباعي فيه ضلعان قائمان", "شكل رباعي فيه كل ضلعان متقابلان متوازيان و متساويان و زوياه قائمة", "مربع اضلاعه متعامدة"], "question": "ما هو تعريف المستطيل "}, 

{"time": 210, "asked": false, "correct": 2, "options": ["نجمع زواياه", "نجمع اطوال اضلاعه", "نطرح مساحته من مجموع اطوال اضلاعه"], "question": "إحدى طرق حساب محيط مستطيل هي؟"}]


[{"time": 88, "asked": false, "correct": 3, "options": ["شكل خماسي يحوي زوايا و اضلاع", "شكل رباعي فيه ضلعان قائمان", "شكل رباعي فيه كل ضلعان متقابلان متوازيان و متساويان و زوياه قائمة", "مربع اضلاعه متعامدة"], "question": "ما هو تعريف المستطيل "}, {"time": 210, "asked": false, "correct": 2, "options": ["نجمع زواياه", "نجمع اطوال اضلاعه", "نطرح مساحته من مجموع اطوال اضلاعه","نجمع الاضلاع ونقسم على 2"], "question": "إحدى طرق حساب محيط مستطيل هي؟"}]


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



