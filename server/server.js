'use strict';

const express = require('express');
const morgan = require('morgan'); //Logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dayjs = require("dayjs");
const { json } = require('express');

const dao_surveys = require('./surveys-dao.js');
// init express
const app = new express();
const port = 3002;

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


// Insert new surveyInfo
// POST /api/surveyInfo
app.post('/api/surveyInfo',  

  (req, res) => {
    console.log(req.body)
    // VALIDAZIONI
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ error: 'Bad Request', description: 'Invalid parameters', errors: errors.array() })

    const sInfo = {
      title: req.body.title,
      owner: req.body.owner
    };
    dao_surveys.insertSInfo(sInfo)
      .then((id) => res.status(200).send(id).end())
      .catch((err) => res.status(500).json({ error: 'DB error', description: err.message }))
  });



// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});