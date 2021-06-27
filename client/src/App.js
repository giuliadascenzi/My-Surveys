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

// Static data 
const sInfo = [{ surveyId: 0, title: "Abitudini culinarie tra gli studenti italiani", owner: "pattidegi", date:dayjs("2021-05-02T09:00:00.000Z") },
{ surveyId: 1, title: "Quanto ne sai sulla raccolta differenziata?", owner: "giuliadash", date:dayjs("2021-06-02T09:00:00.000Z") },
{ surveyId: 2, title: "Come ha modificato la tua vita la pandemia?", owner: "giuliadash", date:dayjs("2021-06-02T09:00:00.000Z") }
];
//Keys: questionId,surveyId
const sQuestions= [{ questionId: 0, surveyId:0,  chiusa: 1, min:1, max:1, obbligatoria:-1, question: "Quanti anni hai?", answers: "0-10_11-20_21-30_31-40_41+" },
{ questionId: 1, surveyId:0, chiusa: 1, min:1, max:1, obbligatoria:-1, question: "Nazionalità?", answers: "Italia_Spagna_Francia_Norvegia_Altro" },
{ questionId: 3, surveyId:0, chiusa: 1, min:2, max:3, obbligatoria:-1, question: "Top 3 dei tuoi piatti preferiti", answers: "Lasagna_Pizza_Sushi_Hamburger_Frittata_Paella" },

{ questionId: 2, surveyId:0, chiusa: 0, min:-1, max:-1, obbligatoria:1, question: "Che cosa studi?", answers: "" },
{ questionId: 0, surveyId:1, chiusa: 0, min:-1, max:-1, obbligatoria:1, question: "Che lavoro fai?", answers: "" },
{ questionId: 0, surveyId:2, chiusa: 0, min:-1, max:-1, obbligatoria:1, question: "Come ha modificato la tua vita?", answers: "" }

];
const sAnswers=[{answers: ["1", "1", "ingegneria informatica", "0"], surveyId: 0, user: "giulia"},
{ answers: ["2", "3", "economia", "0_1_2"], surveyId: 0, user: "nik"},
{ answers: ["studio"], surveyId: 1, user: "nik"},
{ answers: ["veterinaria"], surveyId: 1, user: "giusj"},
{ answers: ["male"], surveyId: 2, user: "giusj"},
{ answers: ["non bene"], surveyId: 2, user: "giulia"},
 ];
*/

function App() {
  const [surveysInfo, setSurveysInfo] = useState([]);
  const [surveysQuestions, setSurveysQuestions] = useState([]);
  const [adminSurveysAnswers, setAdminSurveysAnswers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [dirty, setDirty] = useState(true);
  const [user, setUser] = useState(null);
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
        .catch(err => {
          handleErrors(err);
        })
        .finally(() => setDirty(false));

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


    const FilledSurvey = { surveyId: surveyId, answers: answers, user: user };

    try {
      await API.addFilledSurvey(FilledSurvey)
      setDirty(true) //Setting dirty to true it triggers the rehydrating process
    }
    catch (err) {
      throw err; //The error is managed in  the Fill In Survey form
    }

  }

  /*
  * Function to add a new survey in the local data and in the db.
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
      <title>My Online Surveys</title>
      <MyNavbar loggedIn={loggedIn} doLogOut={doLogOut} doLogIn={doLogIn} />

      <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
        <Toast.Body>{message?.msg}</Toast.Body>
      </Toast>
      <Switch>

        <Route path='/survey/:surveyId' render={({ match }) => {
          if (loggedIn)
            return <Redirect to={'/home/' + user.username} />

          if (surveysInfo.map(s => s.surveyId).includes(parseInt(match.params.surveyId))) {
            return <FillInSurvey
              surveyInfo={surveysInfo.filter(s => (s.surveyId == match.params.surveyId))[0]}
              surveyQuestions={surveysQuestions.filter(s => (s.surveyId == match.params.surveyId))}
              addFilledSurvey={addFilledSurvey}
            ></FillInSurvey>
          } else
            return <>Survey Not Found </>
        }
        }>

        </Route>


        <Route path='/home/:username/newSurvey' render={() => {
          if (loggedIn)
            return <CreateNewSurvey adminUsername={user.username}
              insertNewSurvey={insertNewSurvey} />

          else
            return <Redirect to="/" />

        }}>
        </Route>

        <Route path='/home/:username' render={() => {
          if (!loggedIn)
            return <Redirect to='/' />
          else {
            const adminSurveyId = surveysInfo.filter(s => s.owner == user.username).map(s => s.surveyId);
            return <AdminHome
              loading={dirty}
              adminUsername={user.username}
              surveysInfo={surveysInfo.filter(s => s.owner == user.username)} //Only the surveyInfo of surveys owned by the admin
              surveysAnswers={adminSurveysAnswers}
              surveyQuestions={surveysQuestions.filter(sq => adminSurveyId.includes(sq.surveyId)) //Only questions of the surveys owned by the admin
              }>
            </AdminHome>
          }
        }
        }>
        </Route>


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
