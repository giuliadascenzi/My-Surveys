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
                const sInfo = rows.map(record => ({ surveyId: record.surveyId, title: record.title, owner: record.title, date: dayjs(record.date) }));
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

exports.getAllSurveysAnswers= () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM S_ANSWERS';
        db.all(sql, (err, rows) => {
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

exports.checkAnswerValidity = (surveyId, questionId, answer) => {

  return new Promise((resolve, reject) => {
         const sql1 = "SELECT * as FROM S_QUESTIONS WHERE SurveyId=? AND QuestionId=?";
         db.get(sql1, [surveyId, questionId], (err, rows) => { 
                                                  console.log(rows)
                                                  if (err) 
                                                  {
                                                    return reject(err);
                                                  }
                                                  
                                                  else
                                                      resolve(true);
                                                 });

    });
};
//insert answers (filled in survey)
exports.insertAnswers = (surveyId, user, answers)=> {

  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO S_ANSWERS(surveyId, user, answers) VALUES (?, ?, ?)";
    db.run(sql, [surveyId, user, answers], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(true);
    });
  });
};
    

/*

exports.getImportant = (userId=1) => {

  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE (user = ? AND important=1)";
    db.all(sql, [userId], (err, rows) => {
      if (err)
        reject(err);
      else {
        const tasks = rows.map(record => ({ id: record.id, description: record.description, important: record.important, private: record.private, deadline: record.deadline, user: record.user, completed: record.completed }));

        resolve(tasks);
      }
    });
  });
};

exports.getPrivate = (userId=1) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE (user = ? AND private=1)";
    db.all(sql, [userId], (err, rows) => {
      if (err)
        reject(err);
      else {
        const tasks = rows.map(record => ({ id: record.id, description: record.description, important: record.important, private: record.private, deadline: record.deadline, completed: record.completed }));
        resolve(tasks);
      }
    });
  });
};

exports.getTask = ( taskId, userId=1) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE (user = ? AND id=?)";
    db.get(sql, [userId, taskId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        const task = { id: row.id, description: row.description, important: row.important, private: row.private, deadline: row.deadline, completed: row.completed };
        resolve(task);
      }
    });
  });
};

// add a new task
exports.createTask = (task, userId=1) => {

  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO tasks(id, description, important, private, deadline, completed, user) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.run(sql, [task.id, task.description, task.important, task.private, task.deadline, 0, userId], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(this.lastID);
    });
  });
};

  exports.getSevenDaysTasks = (todayDate, sevenDays, userId=1) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks WHERE (user = ? AND deadline >=? AND deadline<=?)' ;
      db.all(sql, [userId, todayDate+" 00:00", sevenDays+" 23:59"], (err, rows) => {
        if(err){

          reject(err);}
        else {

          const tasks = rows.map(record => ({id:record.id, description:record.description, important:record.important, private: record.private, deadline: record.deadline, completed: record.completed}));
          resolve(tasks);
        }
      });
    });
  };



exports.getTodayTasks = (todayDate, userId=1) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks WHERE (user = ? AND deadline >=? AND deadline<=?)' ;
      db.all(sql, [userId, todayDate+" 00:00", todayDate+" 23:59"], (err, rows) => {
        if(err)
          reject(err);
        else {

          const tasks = rows.map(record => ({id:record.id, description:record.description, important:record.important, private: record.private, deadline: record.deadline, completed: record.completed}));
          resolve(tasks);
        }
      });
    });
  }


// update an existing Task
exports.updateTask = (task, userId=1) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE tasks SET description=?, important=?, private=?, deadline=?, completed=? WHERE (user = ? AND id=?)';
    db.run(sql, [task.description, task.important, task.private, task.deadline, task.completed, userId, task.id], function (err, result) {
      if (err) {
        reject(err);
        return;
      }

      resolve(task.id);
    });
  });
};


// delete an existing exam
exports.deleteTask = (id, userId=1) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM tasks WHERE (user = ? AND id = ?)';
    db.run(sql, [userId, id], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}
*/
