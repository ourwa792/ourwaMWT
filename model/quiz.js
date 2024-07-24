const seq = require("../utils/database").seq;

const Sequelize = require("sequelize");

const Quiz = seq.define(
  "quiz",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    quizSchema: {
      type: Sequelize.DataTypes.JSON,
      allowNull: true,
    },

    difficulty: {
      type: Sequelize.DataTypes.STRING,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tag: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    maxScore: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
      
    }},
  {
    timestamps: false,
    freezeTableName: true,
    //tableName: 'quizzes' // تحديد اسم الجدول المستخدم
  }
);
module.exports = Quiz;

/*   const doIt = async () => {
  const result = await Quiz.bulkCreate([{
    quizSchema:{
      "title": "Geography Quiz",
      "completedHtml": "<h4>You got <b>{correctAnswers}</b> out of <b>{questionCount}</b> correct answers.</h4>",
      "completedHtmlOnCondition": [
       {
        "expression": "{correctAnswers} == 0",
        "html": "<h4>Unfortunately, none of your answers is correct. Please try again.</h4>"
       },
       {
        "expression": "{correctAnswers} == {questionCount}",
        "html": "<h4>Congratulations! You answered all the questions correctly!</h4>"
       }
      ],
      "pages": [
       {
        "name": "intro",
        "elements": [
         {
          "type": "html",
          "name": "intro-text",
          "html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Welcome to the Geography Test!</title>\n    <style>\n        ul {\n            list-style-type: disc;\n            padding-left: 10px;\n        }\n    </style>\n</head>\n<body> \n<p style=\"margin-top: 1em; text-align: justify;\">\n  <strong>Welcome to the Geography Quiz!</strong>\n</p>\n<p style=\"margin-top: 1em; text-align: justify;\">This quiz is designed to challenge your knowledge of various geographical facts and locations around the world. You will be presented with a series of multiple-choice questions, each with four possible answers. Carefully read each question and select the answer you believe is correct.\n<br>\n<br>\nBefore you begin, please enter your name in the field below. This will help us keep track of your results. Then, click <b>Start Quiz</b>.\n<br>\n<br>\nGood luck, and enjoy testing your geography knowledge!</p>"
         },
         {
          "type": "text",
          "name": "username",
          "titleLocation": "hidden",
          "isRequired": true,
          "maxLength": 25,
          "placeholder": "Emily Johnson"
         }
        ]
       },
       {
        "name": "first-page",
        "elements": [
         {
          "type": "radiogroup",
          "name": "capital-australia",
          "title": "What is the capital city of Australia?",
          "correctAnswer": "c) Canberra",
          "choices": [
           "a) Sydney",
           "b) Melbourne",
           "c) Canberra",
           "d) Brisbane"
          ],
          "choicesOrder": "random",
          "colCount": 2
         }
        ]
       },
       {
        "name": "second-page",
        "elements": [
         {
          "type": "radiogroup",
          "name": "longest-river",
          "title": "Which river is the longest in the world?",
          "correctAnswer": "b) Nile River",
          "choices": [
           {
            "value": "a) Amazon River",
            "text": "a) the Amazon River"
           },
           {
            "value": "b) Nile River",
            "text": "b) the Nile River"
           },
           {
            "value": "c) Yangtze River",
            "text": "c) the Yangtze River"
           },
           {
            "value": "d) Mississippi River",
            "text": "d) the Mississippi River"
           }
          ],
          "choicesOrder": "random",
          "colCount": 2
         }
        ]
       },
       {
        "name": "third-page",
        "elements": [
         {
          "type": "radiogroup",
          "name": "mountain-everest",
          "title": "Mount Everest is located in which two countries?",
          "correctAnswer": "d) Nepal and China",
          "choices": [
           "a) India and China",
           "b) Nepal and India",
           "c) China and Bhutan",
           "d) Nepal and China"
          ],
          "choicesOrder": "random",
          "colCount": 2
         },
         {
          "type": "radiogroup",
          "name": "largest-desert",
          "title": "What is the largest desert in the world?",
          "correctAnswer": "d) the Antarctic Desert",
          "choices": [
           "a) the Sahara Desert",
           "b) the Arabian Desert",
           "c) the Gobi Desert",
           "d) the Antarctic Desert"
          ],
          "choicesOrder": "random",
          "colCount": 2
         },
         {
          "type": "radiogroup",
          "name": "largest-population",
          "title": "Which country has the largest population in the world?",
          "correctAnswer": "d) China",
          "choices": [
           "a) India",
           {
            "value": "b) United States",
            "text": "b) the United States"
           },
           "c) Indonesia",
           "d) China"
          ],
          "choicesOrder": "random",
          "colCount": 2
         },
         {
          "type": "radiogroup",
          "name": "great-barrier-reef",
          "title": "The Great Barrier Reef is off the coast of which country?",
          "correctAnswer": "b) Australia",
          "choices": [
           "a) Brazil",
           "b) Australia",
           "c) Indonesia",
           "d) South Africa"
          ],
          "choicesOrder": "random",
          "colCount": 2
         },
         {
          "type": "radiogroup",
          "name": "continent-sahara",
          "title": "Which continent is the Sahara Desert located in?",
          "correctAnswer": "b) Africa",
          "choices": [
           "a) Asia",
           "b) Africa",
           "c) South America",
           "d) Australia"
          ],
          "choicesOrder": "random",
          "colCount": 2
         },
         {
          "type": "radiogroup",
          "name": "smallest-country",
          "title": "What is the smallest country in the world by area?",
          "correctAnswer": "c) Vatican City",
          "choices": [
           "a) Monaco",
           "b) San Marino",
           "c) Vatican City",
           "d) Liechtenstein"
          ],
          "choicesOrder": "random",
          "colCount": 2
         },
         {
          "type": "radiogroup",
          "name": "sunshine-state",
          "title": "Which U.S. state is known as the \"Sunshine State\"?",
          "correctAnswer": "c) Florida",
          "choices": [
           "a) California",
           "b) Texas",
           "c) Florida",
           "d) Arizona"
          ],
          "choicesOrder": "random",
          "colCount": 2
         },
         {
          "type": "radiogroup",
          "name": "land-rising-sun",
          "title": "Which country is known as the Land of the Rising Sun?",
          "correctAnswer": "b) Japan",
          "choices": [
           "a) China",
           "b) Japan",
           "c) South Korea",
           "d) Thailand"
          ],
          "choicesOrder": "random",
          "colCount": 2
         },
         {
          "type": "radiogroup",
          "name": "danube-river",
          "title": "The Danube River flows through how many countries?",
          "correctAnswer": "c) 10",
          "choices": [
           "a) 4",
           "b) 6",
           "c) 10",
           "d) 12"
          ],
          "choicesOrder": "random",
          "colCount": 2
         },
         {
          "type": "radiogroup",
          "name": "largest-ocean",
          "title": "Which is the largest ocean in the world?",
          "correctAnswer": "d) Pacific Ocean",
          "choices": [
           "a) Atlantic Ocean",
           "b) Indian Ocean",
           "c) Arctic Ocean",
           "d) Pacific Ocean"
          ],
          "choicesOrder": "random",
          "colCount": 2
         }
        ]
       }
      ],
      "cookieName": "geography-quiz",
      "showProgressBar": "belowheader",
      "progressBarType": "questions",
      "allowCompleteSurveyAutomatic": false,
      "startSurveyText": "Start Quiz",
      "firstPageIsStarted": true,
      "questionsOnPageMode": "questionPerPage",
      "maxTimeToFinish": 120,
      "showTimerPanel": "top",
      "headerView": "advanced"
     } ,
  defficulty:'Easy',title:"تمارين الوحدة الرابعة جبر - الصف الثامن" ,
  tag: "تمارين عامة" , maxScore: 50
}])
  console.log(result); 
}

doIt()   */