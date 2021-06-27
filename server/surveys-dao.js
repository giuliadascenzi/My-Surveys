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

          resolve(true); //TODO: senza funziona comunque?? CON se c'è un errore in uno dei run da errore? lo devo controllare o non importa??
  })
  });
};


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
                                                    let opzionale= question.min===0;
                                                    let answers = answer.split("_"); //Format of the answer indexA_indexB_indexC 
                                                    if (answers.length< question.min || answers.length> question.max) return reject("One or more answer are not valid 151");
                                                    let validAnswers = [...Array(question.answers.split("_").length).keys()] //The valid answers are number in range (0, maxAnswers) because the answers are the indexes of the closed answers chosen.
                                                    
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
//insert answers (filled in survey)
exports.insertAnswers = (surveyId, user, answers)=> {

  return new Promise((resolve, reject) => {
    /** I must change the answers format in the accepted format: ["ans1", "ans2", "ans3"] */
    let ans = "[";
    for (let i=0; i< answers.length-1; i++)
         ans = ans + '"'+answers[i]+'",';
    ans= ans + '"'+answers[answers.length-1]+'"]';

    const sql = "INSERT INTO S_ANSWERS(surveyId, user, answers) VALUES (?, ?, ?)";
    db.run(sql, [surveyId, user, ans], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(true);
    });
  });
};
    
