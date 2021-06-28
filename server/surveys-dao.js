'use strict';
/* Data Access Object (DAO) module for accessing the data about the surveys */

const sqlite = require('sqlite3');
const dayjs = require('dayjs')

// open the database
const db = new sqlite.Database('surveys.db', (err) => {
    if (err) throw err;
});

// get All Info about the surveys
exports.getAllSurveysInfo = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM S_INFO';
        db.all(sql, (err, rows) => {
            if (err)
                reject(err);
            else {
                const sInfo = rows.map(record => ({ surveyId: record.surveyId, title: record.title, owner: record.owner, date: dayjs(record.date) }));
                resolve(sInfo);
            }
        });
    });
};

//get all the questions of all the surveys
exports.getAllSurveysQuestions= () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM S_QUESTIONS';
        db.all(sql, (err, rows) => {
            if (err)
                reject(err);
            else {
                const sQuestions = rows.map(record => ({ questionId: record.questionId, surveyId:record.surveyId,  chiusa: record.chiusa, min:record.min, max:record.max, obbligatoria:record.obbligatoria, question: record.question, answers: record.answers }));
                resolve(sQuestions);
            }
        });
    });
};

// get the answers of the surveys owned by the actual logged in admin
exports.getAdminSurveysAnswers= (admin) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT A.surveyId, A.user, A.answers FROM S_ANSWERS as A,S_INFO as I WHERE I.surveyId = A.surveyId AND I.owner=?';
        db.all(sql,[admin], (err, rows) => {
            if (err)
                reject(err);
            else {
                const sAnswers = rows.map(record => ({ answers: record.answers, surveyId: record.surveyId, user: record.user }));
                resolve(sAnswers);
            }
        });
    });
};

// add a new survey
exports.insertSInfo = (sInfo) => {

    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO S_INFO(surveyId, owner, title, date) VALUES (?, ?, ?, ?)";
      db.run(sql, [sInfo.surveyId, sInfo.owner, sInfo.title, sInfo.date], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  };

// insert questions in survey
exports.insertQuestions = (sQuestions, surveyId) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO S_QUESTIONS(surveyId, questionId, chiusa, min, max, obbligatoria, question, answers) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    db.serialize(()=>{
      for (let i=0; i<sQuestions.length; i++)
          db.run(sql, [surveyId, i, sQuestions[i].chiusa, sQuestions[i].min, sQuestions[i].max, sQuestions[i].obbligatoria,sQuestions[i].question,sQuestions[i].answers], function (err) 
          {
            if (err) {
              reject(err);
              return;
            }
          }
          );

          resolve(true); })
  });
};

//Check if the survey of the given surveyId exists in the database
exports.checkSurveyIdExists = (surveyId) => {

  return new Promise((resolve, reject) => {
         const sql1 = "SELECT COUNT(*) as FOUND FROM S_INFO WHERE SurveyId=?";
         db.get(sql1, [surveyId], (err, rows) => { 
                                                  if (err) 
                                                  {
                                                    
                                                    return reject(err);
                                                  }
                                                  else if (rows.FOUND ==0)
                                                      { 
                                                        
                                                      return reject("SurveyId not found");;
                                                      }
                                                  else
                                                      resolve(true);
                                                 });

    });
};

//checks if the numbers of answers given by the user is the same of the number of question in the survey (must be the same)
exports.checkNumberOfAnswers = (surveyId, numOfAnswers) => {

  return new Promise((resolve, reject) => {
         const sql1 = "SELECT COUNT(*) as NUM FROM S_QUESTIONS WHERE SurveyId=?";
         db.get(sql1, [surveyId], (err, rows) => { 
                                                  if (err) 
                                                  {
                                                    
                                                    return reject(err);
                                                  }
                                                  else if (rows.NUM !==numOfAnswers)
                                                      { 
                                                        
                                                      return reject("Number of answers different from the number of survey's questions");;
                                                      }
                                                  else
                                                      resolve(true);
                                                 });

    });
};

//For each answer get its question and the related constraints and check that every constraint is followed by the answer given
exports.checkAnswerValidity = (surveyId, questionId, answer) => {

  return new Promise((resolve, reject) => {
          
          const sql1 = "SELECT * FROM S_QUESTIONS WHERE (surveyId=? AND questionId=?)";
          db.all(sql1, [surveyId, questionId], (err, rows) => { 
                                                  if (rows==undefined) return reject("Error checking the validity of the answers");
                                                  if (err) 
                                                  {
                                                    return reject(err);
                                                  }
                                                  
                                                  let question= rows[0];
                                                  if (question.chiusa==1) //Closed question
                                                  {
                                                    let opzionale= (question.min===0);
                                                    let answers = answer.split("_"); //Format of the answer indexA_indexB_indexC 
                                                    
                                                    if (answers.length< question.min || answers.length> question.max) return reject("One or more answer are not valid 151");
                                                    
                                                    let validAnswers = [...Array(question.answers.split("_").length).keys()] //The valid answers are numbers in range (0, maxAnswers) because the answers are the indexes of the closed answers chosen.
                                                    
                                                    if (!opzionale && answers.filter(a => !validAnswers.includes(parseInt(a))).length!=0) return reject("One or more answer are not valid 153 " + answers +"|" +validAnswers );
                                                    
                                                    resolve(true)
                                                  }
                                                  else
                                                  {
                                                    if (question.obbligatoria==1 && answer.trim()=="") return reject("One or more answer are not valid 158");
                                                    
                                                    resolve(true)
                                                  }
                                                      
                                                 });

    });
};

//insert answers (filled survey)
exports.insertAnswers = (surveyId, user, answers)=> {

  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO S_ANSWERS(surveyId, user, answers) VALUES (?, ?, ?)";
    db.run(sql, [surveyId, user, JSON.stringify(answers)], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(true);
    });
  });
};
    
