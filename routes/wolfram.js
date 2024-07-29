const axios = require('axios');
const {translate} = require("google-translate-api-x");

const express = require('express');
const route = express.Router();


const WOLFRAM_ALPHA_APP_ID = 'T6YRT5-7G4QGAUYRL';
// دالة للحصول على إجابة من Wolfram Alpha
const getWolframAlphaAnswer = async (question) => {
  try {
      const response = await axios.get('https://api.wolframalpha.com/v2/query', {
          params: {
              input: question,
              appid: WOLFRAM_ALPHA_APP_ID,
              output: 'json',
              format: 'plaintext,mathml,image'
          }
      });

      if (response.data.queryresult.success) {
          const pods = response.data.queryresult.pods;
          console.log(pods);
          return pods.map(pod => ({
              title: pod.title || 'فقرة',
              content: pod.subpods.map(subpod => subpod.plaintext).join('\n'),
              mathML: pod.subpods.map(subpod => subpod.mathml).join('\n'),
              steps: pod.subpods.filter(subpod => subpod.title.includes("Possible intermediate steps")).map(subpod => subpod.plaintext).join('\n'),
              images: pod.subpods.map(subpod => subpod.img ? subpod.img.src : null).filter(src => src !== null)
          }));
      } else {
          return null;
      }
  } catch (error) {
      console.error('Error fetching data from Wolfram Alpha:', error);
      return null;
  }
};

// معالجة الطلبات للحصول على الإجابات
route.post('/ask', async (req, res) => {
  const question = req.body.question;
  if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'الرجاء إدخال سؤال صالح' });
  }

  try {
      const translatedQuestion = await translate(question, { to: 'en' });
      const answer = await getWolframAlphaAnswer(translatedQuestion.text);

      if (answer) {
          const translatedAnswers = await Promise.all(
              answer.map(async (ans) => {
                  const translatedContent = await translate(ans.content, { to: 'ar' });
                  const translatedSteps = await translate(ans.steps, { to: 'ar' });
                  return {
                      title: ans.title,
                      content: translatedContent.text,
                      mathML: ans.mathML,
                      steps: translatedSteps.text,
                      images: ans.images
                  };
              })
          );
          res.json({ answer: translatedAnswers });
      } else {
          res.status(404).json({ error: 'لم يتم العثور على إجابة' });
      }
  } catch (error) {
      console.error('Error translating content:', error);
      res.status(500).json({ error: 'حدث خطأ أثناء معالجة السؤال. حاول مرة أخرى لاحقاً.' });
  }
})

// عرض صفحة الأسئلة
route.get('/', (req, res) => {
  res.render('ask', { answers: [], error: null, pageTitle: "اسأل سؤال" });
});




module.exports = route