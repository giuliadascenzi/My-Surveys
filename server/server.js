'use strict';

const express = require('express');
const morgan = require('morgan'); //Logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dayjs = require("dayjs");
const { json } = require('express');

const dao_surveys = require('./surveys-dao.js');
// init express
const app = express();
const port = 3002;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

app.get("/", (req, res) => res.send("Welcome in the OnlineSurveys site"));


// GET /api/surveysInfo
app.get('/api/surveysInfo', async (req, res) => {
  dao_surveys.getAllSurveysInfo()
    .then((sInfos) => res.json(sInfos))
    .catch((err) => res.status(500).json({ error: 'DB error', desctiption: err }))
});

// GET /api/surveysQuestions
app.get('/api/surveysQuestions', async (req, res) => {
  dao_surveys.getAllSurveysQuestions()
    .then((sQuestions) => res.json(sQuestions))
    .catch((err) => res.status(500).json({ error: 'DB error', desctiption: err }))
});

// GET /api/surveysAnswers
app.get('/api/surveysAnswers', async (req, res) => {
  dao_surveys.getAllSurveysAnswers()
    .then((sAnswers) => res.json(sAnswers))
    .catch((err) => res.status(500).json({ error: 'DB error', desctiption: err }))
});


// Insert new survey
// POST /api/survey
// ACCEPTED FORMAT : {title: , owner: , date: , questions: []}
// ACCEPTED FORMAT FOR EACH QUESTION : {chiusa: , question: , min: , max: , obbligatoria: , answers: } (in case its closed mandatory all except obbligatoria, in case its open mandatory all except min, max, answers)
// **TODO**: check che owner is logged in
app.post('/api/survey',
  [check('title', 'title must be a not empty string').notEmpty(),
  check('owner', 'owner must be a not empty string').notEmpty(),
  check('date', 'date must be in format yyyy-mm-dd ').matches("(^$|^(19|20)[0-9][0-9]\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$)"),
  check('questions', '"questions" must be an array of length>1').isArray({ min: 1 }),
  check('questions.*.chiusa', '"chiusa" attribute of each question must be or 0 (=open) or 1 (=closed)').isInt({ min: 0, max: 1 }), // * is a wildcard, means that that check is needed for each element of the array
  check('questions.*.question', '"question" attribute of each questions must not be empty').notEmpty(),
  check('questions').custom(questions => {
                           for (let i = 0; i < questions.length; i++) 
                           {
                              if (questions[i].chiusa == 1) //Closed question
                              {
                                if (questions[i].min == undefined || questions[i].max == undefined || questions[i].answers == undefined) return false;
                                let tot = questions[i].answers.split("_").length;
                                if (tot == 0 || tot > 10) return false //tot answer must be at least one but less than 10
                                if (questions[i].max < 0 || questions[i].min < 0) return false //min and max must be positive
                                if (questions[i].max > tot) return false // max cant be more than tot
                                if (questions[i].min > questions[i].max) return false //min cant be more than max
                              }
                              else //Open question
                              {
                                if (questions[i].obbligatoria == undefined) return false
                              }
                            }

                            return true
                                       } 
                          ) 
                      .withMessage("errors in the questions format") //Error message to use with the custom validator
  ],
  (req, res) => {
    // VALIDAZIONI
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ error: 'Bad Request', description: 'Invalid parameters', errors: errors.array() })

    const sInfo = { //No Id, because is set automatically by the db.
      title: req.body.title,
      owner: req.body.owner,
      date: req.body.date,

    };
    let surveyId=-1;
    dao_surveys.insertSInfo(sInfo)
      .then((id) => surveyId = id)  //It returns the surveyId inserted
      .then (() => dao_surveys.insertQuestions(req.body.questions, surveyId))
      .then (() => res.status(200).json("Survey inserted correctly").end())
      .catch((err) => res.status(500).json({ error: 'Error inserting the survey in the db', description: err }))

  });


// Insert new filled survey in the answers table
// POST /api/filledSurvey
app.post('/api/filledSurvey', 
    [
        check('surveyId', "surveyID must be an int").isInt(),
        check('user', "user attribute missing").notEmpty(),
        check('answers', "answers must be an array").isArray({min:1})
    ],
    (req, res) => {
        // VALIDAZIONI
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ error: 'Bad Request', description: 'Invalid parameters', errors: errors.array() })
        
        const checkAnswersValidity = async(surveyId, answers)=>
         { 
           for (let i=0; i<answers.length; i++)
            { 
              await dao_surveys.checkAnswerValidity(surveyId, i, answers[i]) //check the answer i
            }
         }
         //TODO: check if the owner is the logged in admin
        dao_surveys.checkSurveyIdExists(req.body.surveyId) //1) check that the survey exists
            .then(console.log("surveyOK"))
            .then( ()=> dao_surveys.checkNumberOfAnswers(req.body.surveyId, req.body.answers.length)) //2) Check if the answers are the right number acording to the number of questions of that survey
            .then(console.log("numberAnswersOK"))
            .then(() => checkAnswersValidity(req.body.surveyId, req.body.answers)) //3) for each answer check that is consistent with the question restriction
            .then(console.log("answersValidity"))
            .then(()=> dao_surveys.insertAnswers(req.body.surveyId, req.body.user, req.body.answers)) //4) Insert in the db
            .then(() => res.status(200).json("Answers inserted correctly").end())
            .catch((err) => res.status(500).json({ error: 'Error inserting the answers in the db', description: err }))
    });







// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});