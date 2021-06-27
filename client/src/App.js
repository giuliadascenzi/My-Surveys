import MyNavbar from './components/MyNavbar.js'
import MySurveysTable from './components/MySurveysTable.js'
import FillInSurvey from './components/FillInSurvey.js'
import AdminHome from './components/AdminHome.js'
import CreateNewSurvey from './components/CreateNewSurvey.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import API from './API';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import dayjs from 'dayjs'
import { Toast } from "react-bootstrap";


/*
FORMAT of the DATA

   * surveysInfo = array of { surveyId, title, owner, date }

   * surveysQuestion = array of { surveyId, questionId, chiusa, min, max, obbligatoria, question, answers} 
     (where answers are the possible answers, in case of closed question, concatenated by "_")

   * adminSurveyAnswers = array of {surveyId, user, answers}
     (where answers is an array of answers -one for each question of the survey-)

*/

function App() {

  const [surveysInfo, setSurveysInfo] = useState([]); //Information about the surveys
  const [surveysQuestions, setSurveysQuestions] = useState([]); //Questions of each survey
  const [adminSurveysAnswers, setAdminSurveysAnswers] = useState([]); //Answers given by users to the surveys owned by the logged in admin.
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [dirty, setDirty] = useState(true);
  const [user, setUser] = useState(null); //Admin
  const [message, setMessage] = useState('');

  // check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // user info, if already logged in
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        console.log(err); // mostly unauthenticated user
      }
    };
    checkAuth();
  }, []);

  //rehydrate the local data (every time a user logs in/out, create a survey or fill in a survey)
  useEffect(() => {

    const getSurveysInfo = async () => {
      const surveys = await API.getAllSurveysInfo();
      setSurveysInfo(surveys);
    };

    const getSurveysQuestions = async () => {
      const surveysQ = await API.getAllSurveysQuestions();
      setSurveysQuestions(surveysQ);
    };

    const getSurveysAnswers = async () => {
      if (loggedIn) { //Only the answers of the admin's surveys are fetched so the admin must be logged in
        const surveysA = await API.getAdminSurveysAnswers();
        setAdminSurveysAnswers(surveysA);
      }
    };

    if (dirty)
      getSurveysInfo()
        .then(getSurveysQuestions)
        .then(getSurveysAnswers)
        .catch(err => handleErrors(err))
        .finally(() => setDirty(false));  //In any cases set dirty to false at the end

  }, [dirty, loggedIn]);


  // show error message in toast
  const handleErrors = (err) => {
    setMessage({ msg: err.error, type: 'danger' });
    console.log(err);
  }


  /*
  * Function to add a new filled survey in the local data and in the db.
  */
  const addFilledSurvey = async (surveyId, answers, user) => {

    const filledSurvey = { surveyId: surveyId, answers: answers, user: user };
    try {
      await API.addFilledSurvey(filledSurvey)
      setDirty(true) //Setting dirty to true it triggers the rehydrating process
    }
    catch (err) {
      throw err; //The error is managed in  the Fill In Survey form
    }

  }

  /**
   * Function to add a new survey in the local data and in the db.
   * @param {*} title title of the survey, string
   * @param {*} questions array of question in the format { surveyId, questionId, chiusa, min, max, obbligatoria, question, answers}
   * @param {*} owner owner of the survey (must be the admin logged in)
   */
  const insertNewSurvey = async (title, questions, owner) => {

    try {
      await API.addNewSurvey(title, owner, dayjs().format("YYYY-MM-DD"), questions);
      setDirty(true) //Setting dirty to true it triggers the  rehydrating process
    }
    catch (err) {
      throw err; //The error is managed in the New Survey form
    }

  }

  /**
   * Function to login
   * @param {*} credentials  username, password
   */
  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setDirty(true)
    }
    catch (err) {
      // error is handled and visualized in the login form, so the error is not managed but only threw
      throw err;
    }
  }


  /**
   * Function to log out
   */
  const doLogOut = async () => {
    await API.logOut()
    // clean up everything
    setLoggedIn(false);
    setUser(null);
    setSurveysInfo([]);
    setSurveysQuestions([]);
    setAdminSurveysAnswers([]);
    setDirty(true);

  }

  return (<>

    <Router>

      {/**Title */}
      <title>My Online Surveys</title>
      
      {/**Navbar */}
      <MyNavbar loggedIn={loggedIn} doLogOut={doLogOut} doLogIn={doLogIn} />
      
      {/**Toast with error messages if set */}
      <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
        <Toast.Body>{message?.msg}</Toast.Body>
      </Toast>


      <Switch>

        {/**Route to visulize a survey and fill it. Only user not logged in can access it */}
        <Route path='/survey/:surveyId' render={({ match }) => {
          if (loggedIn)
            return <Redirect to={'/home/' + user.username} />

          if (surveysInfo.map(s => s.surveyId).includes(parseInt(match.params.surveyId))) {
            return <FillInSurvey
                    surveyInfo={surveysInfo.filter(s => (s.surveyId === parseInt(match.params.surveyId)))[0]} //Only the surveyInfo of the selected survey
                    surveyQuestions={surveysQuestions.filter(s => (s.surveyId === parseInt(match.params.surveyId)))} //Only the questions of the selected survey
                    addFilledSurvey={addFilledSurvey} //Function to submit the filled survey
                  ></FillInSurvey>
          } 
          else
            return <>Survey Not Found </>
        }
        }>
        </Route>

        {/**Route to access the page of the survey creation. Only logged in users can access it */}
        <Route path='/home/:username/newSurvey' render={() => {
          if (loggedIn)
            return <CreateNewSurvey 
              adminUsername={user.username} //username of the admin logged in
              insertNewSurvey={insertNewSurvey} />

          else
            return <Redirect to="/" />

        }}>
        </Route>
       
        {/**Route to access the home page of an admin. Only the admin after logging in can access it */}
        <Route path='/home/:username' render={() => {
          if (!loggedIn)
            return <Redirect to='/' />
          else {
            const adminSurveyIds = surveysInfo.filter(s => s.owner === user.username).map(s => s.surveyId); //Ids of the surveys created by the admin
            return <AdminHome
              loading={dirty}
              adminUsername={user.username} //Username of the admin logged in
              surveysInfo={surveysInfo.filter(s => s.owner === user.username)} //Only the surveyInfo of surveys owned by the admin
              surveysAnswers={adminSurveysAnswers} 
              surveyQuestions={surveysQuestions.filter(sq => adminSurveyIds.includes(sq.surveyId)) //Only questions of the surveys owned by the admin
              }>
            </AdminHome>
          }
        }
        }>
        </Route>

        {/**If the user is not logged in this route access the home page of a normal user, instead if the admin is logged in he/she is redirected to the admin home page */}
        <Route path='/' render={() => {
          if (loggedIn)
            return <Redirect to={'/home/' + user.username} />
          else
            return <MySurveysTable
                      surveysInfo={surveysInfo}
                      loading={dirty}>
                  </MySurveysTable>
        }}>
        </Route>

      </Switch>
    </Router>
  </>
  );
}

export default App;
