/**
 * All the API calls
 */


async function getAllSurveysInfo() { // call: GET /api/surveysInfo
  const response = await fetch('/api/surveysInfo');
  const fetchedSurveysInfo = await response.json();
  if (response.ok) {
    return fetchedSurveysInfo;
  }
  else
    throw fetchedSurveysInfo; //In this object there is the error coming from the server

}

async function getAllSurveysQuestions() { // call: GET /api/surveysQuestions
  const response = await fetch('/api/surveysQuestions');
  const fetchedSurveysQ = await response.json();
  if (response.ok) {
    return fetchedSurveysQ;
  }
  else
    throw fetchedSurveysQ; //In this object there is the error coming from the server

}

async function getAdminSurveysAnswers() { // call: GET /api/surveysAnswers
  const response = await fetch('/api/surveysAnswers');
  const fetchedSurveysA = await response.json();
  if (response.ok) {
    return fetchedSurveysA;
  }
  else
    throw fetchedSurveysA; //In this object there is the error coming from the server

}

async function addFilledSurvey(filledSurvey) {// call: GET api/filledSurvey
  return new Promise((resolve, reject) => {
    fetch('/api/filledSurvey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ surveyId: filledSurvey.surveyId, user: filledSurvey.user, answers: filledSurvey.answers }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}


async function addNewSurvey(title, owner, date, questions) {// call: GET /api/survey
  return new Promise((resolve, reject) => {
    fetch('/api/survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: title, owner: owner, date: date, questions: questions }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

async function logIn(credentials) {
  let response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch (err) {
      throw err;
    }
  }
}

async function logOut() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
  const response = await fetch('/api/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server, mostly unauthenticated user
  }
}


const API = { getAllSurveysInfo, getAllSurveysQuestions, getAdminSurveysAnswers, addFilledSurvey, addNewSurvey, logIn, logOut, getUserInfo };
export default API


