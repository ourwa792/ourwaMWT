$(document).ready(function () {
    const surveyJson = {
        "id": 1 ,
        "title": "How Big of a Star Wars Fan You Are",
        "logoPosition": "right",
        "showProgressBar": "top",
        "showTimerPanel": "top",
        "maxTimeToFinishPage": 20,
        "completedHtmlOnCondition": [{
            "expression": "{totalScore} > 14",
            "html": "You got {totalScore} out of {maxScore} points.</br></br>Congratulation! You did great!"
        }, {
            "expression": "{totalScore} > 7",
            "html": "You got {totalScore} out of {maxScore} points.</br></br>Well Done! <i>Your focus determines your reality.</i> And this is the way you passed the quiz."
        }, {
            "expression": "{totalScore} <= 7",
            "html": "You got {totalScore} out of {maxScore} points.</br></br><i>In my experience</i>, as Obi-Wan Kenobi said, <i>there's no such thing as luck.</i>"
        }],
        "pages": [{
            "name": "startPage",
            "elements": [{
                "type": "html",
                "name": "welcomeMsg",
                "html": "<b>Take this funny quiz to find out how well you know Star Wars.</b></br></br><i>May the Force be with you.</i></br><img src=' https://surveyjs.io/Content/Images/examples/scored-quiz/introImg.jpg' width='100%' height='auto',></img>\n"
            }]
        }, {
            "elements": [{
                "type": "radiogroup",
                "name": "qFirstMovieReleaseYear",
                "title": "What year did the first Star Wars movie come out?",
                "choices": [1980, 2015, 1977],
                "correctAnswer": 1977,
                "score": 5
            }]
        }, {
            "elements": [{
                "type": "radiogroup",
                "name": "qBabyYodaName",
                "score": 3,
                "title": "What is Baby Yoda's real name?",
                "correctAnswer": "grogu",
                "choices": [{
                    "value": "mike",
                    "text": "Mike"
                }, {
                    "value": "grogu",
                    "text": "Grogu"
                }, {
                    "value": "din",
                    "text": "Din"
                }]
            }]
        }, {
            "elements": [{
                "type": "rating",
                "name": "qSithLordsCount",
                "score": 3,
                "title": "According to Yoda, how many Sith Lords there always are? No more. No less.",
                "correctAnswer": 2,
                "rateValues": [0, 1, 2, 3, 4]
            }]
        }, {
            "elements": [{
                "type": "boolean",
                "name": "qBobaFettSurvival",
                "score": 4,
                "title": "Boba Fett survived the Sarlacc pit. True or false?",
                "labelTrue": "True",
                "labelFalse": "False",
                "correctAnswer": true
            }]
        }, {
            "elements": [{
                "type": "image",
                "name": "falconImage",
                "imageLink": "https://surveyjs.io/Content/Images/examples/scored-quiz/millenium-falcon.jpg"
            }, {
                "type": "radiogroup",
                "name": "qHanSolosShipName",
                "score": 5,
                "startWithNewLine": false,
                "title": "What is the name of Han Solo's ship?",
                "correctAnswer": "falcon",
                "choices": [{
                    "value": "corfe",
                    "text": "The Corfe Castle"
                }, {
                    "value": "blackPearl",
                    "text": "The Black Pearl"
                }, {
                    "value": "falcon",
                    "text": "The Millennium Falcon"
                }]
            }]
        }],
        "firstPageIsStarted": true
    };

    Survey.Serializer.addProperty("question", {
        name: "score:number"
    });

    const survey = new Survey.Model(surveyJson);

    survey.onComplete.add((sender) => {
        console.log(JSON.stringify(sender.data, null, 3));
    });

    function calculateMaxScore(questions) {
        let maxScore = 0;
        questions.forEach((question) => {
            if (question.score) {
                maxScore += question.score;
            }
        });
        return maxScore;
    }

    function calculateTotalScore(data) {
        let totalScore = 0;
        Object.keys(data).forEach((qName) => {
            const question = survey.getQuestionByValueName(qName);
            if (question && question.isAnswerCorrect()) {
                if (question.score) {
                    totalScore += question.score;
                }
            }
        });
        return totalScore;
    }
    survey.onCompleting.add((sender) => {
        const totalScore = calculateTotalScore(sender.data);
        const maxScore = calculateMaxScore(sender.getAllQuestions());

        sender.setValue("maxScore", maxScore);
        sender.setValue("totalScore", totalScore);
    });

    survey.onComplete.add((sender) => {
        const results = {
            quizId: surveyJson.id,  // التأكد من وجود معرف الكويز
            userAnswers: sender.data,
            userScore: sender.getValue('totalScore'),
            maxScore: sender.getValue('maxScore')
        };
console.log(JSON.stringify(results, null, 3));
        // إرسال النتائج إلى الخادم
        $.post('/quiz/submit', results)
            .done((response) => {
                window.location.href = `/quiz/results/${response.quizId}/${response.userScore}`;
            })
            .fail((error) => {
                alert('There was an error submitting your results. Please try again.');
            });
    });

    $("#surveyElement").Survey({ model: survey });
});
    