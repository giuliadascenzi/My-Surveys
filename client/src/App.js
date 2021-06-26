import MyNavbar from './components/MyNavbar.js'
import MySurveysTable from './components/MySurveysTable.js'
import FillInSurvey from './components/FillInSurvey.js'
import AdminHome from './components/AdminHome.js'
import CreateNewSurvey from './components/CreateNewSurvey.js'
import {LogInForm, LogOutForm} from './components/LogForms.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import API from './API';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import dayjs from 'dayjs'


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
  const [surveysInfo, setSurveysInfo] =useState([]); 
  const [surveysQuestions, setSurveysQuestions] =useState([]);
  const [adminSurveysAnswers, setAdminSurveysAnswers] =useState([]);
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [dirty, setDirty] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false)
  const [user, setUser] = useState(null);

  // check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        console.log(err.error); // mostly unauthenticated user
      }
    };
    checkAuth();
  }, []);
  
  useEffect(()=> {
    const getSurveysInfo = async () => {
        const surveys = await API.getAllSurveysInfo();
        setSurveysInfo(surveys);
        setDirty(false);
    };
    if(dirty)
      getSurveysInfo()
      .catch(err => {
        //setMessage({msg: "Impossible to load your exams! Please, try again later...", type: 'danger'});
        console.error(err);
      });
  }, [dirty, loggedIn]);

  useEffect(()=> {
    const getSurveysQuestions = async () => {
        const surveysQ = await API.getAllSurveysQuestions();
        setSurveysQuestions(surveysQ);
        setDirty(false);

    };
    if(dirty)
      getSurveysQuestions()
      .catch(err => {
        //setMessage({msg: "Impossible to load your exams! Please, try again later...", type: 'danger'});
        console.error(err);
      });
  }, [dirty, loggedIn]);

  useEffect(()=> {
    const getSurveysAnswers = async () => {
      if(loggedIn) {
        const surveysA = await API.getAdminSurveysAnswers();
        setAdminSurveysAnswers(surveysA);
        setDirty(false);
      }
    };
    if(dirty)
      getSurveysAnswers()
      .catch(err => {
        //setMessage({msg: "Impossible to load your exams! Please, try again later...", type: 'danger'});
        console.error(err);
      });
  }, [dirty, loggedIn]);
  
  /*
  * Function to add a new filled survey in the local data and in the db.
  */
  const addFilledSurvey = (surveyId, answers, user) => {
    /** function to add a new filled  survey. It's called submitting the fillSurvey */
    console.log("[addFilledInSurvey]");
    const FilledSurvey = {surveyId: surveyId, answers: answers, user:user, status:"added"}; //TODO: Gestire questa roba degli stati!
    setAdminSurveysAnswers([...adminSurveysAnswers, FilledSurvey]); //TODO: se non è dell'amministratore non va fatto!!!

    API.addFilledSurvey(FilledSurvey)
      .then(()=> setDirty(true))
      .catch((err) => console.error(err));

  }

  /*
  * Function to add a new survey in the local data and in the db.
  */
  const insertNewSurvey = (title, questions, owner) => {
    /** function to add a new  survey. It's called submitting the NewSurvey */
    console.log("[insertNewSurvey]");
    //Insert in sInfo table format = { surveyId: , title: , owner: , date: }
    API.addNewSurvey(title, owner, dayjs().format("YYYY-MM-DD"), questions)
    .then(()=> setDirty(true))
    .catch((err) => console.error(err));
    //Insert all the questions in sQuestions, adding in each question the surveyId **TODO**
    console.log(title,dayjs().format("YYYY-MM-DD"), questions, owner);


  }

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setDirty(true)
    }
    catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      // handleErrors(err)
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
  
  return ( <>
        
        <Router>
            <title>My Online Surveys</title>
            <MyNavbar loggedIn={loggedIn} doLogOut={doLogOut} doLogIn={doLogIn}/>

                <Switch>
                  
                  <Route path='/survey/:surveyId' render={({match}) =>
                      {
                      if (loggedIn) 
                         return <Redirect to={'/home/' + user.username}/>
                         
                      if (surveysInfo.map(s=>s.surveyId).includes(parseInt(match.params.surveyId)))
                       { 
                        return <FillInSurvey 
                                    surveyInfo={surveysInfo.filter(s=>(s.surveyId==match.params.surveyId))[0]}
                                    surveyQuestions={surveysQuestions.filter(s=>(s.surveyId==match.params.surveyId))}
                                    addFilledSurvey = {addFilledSurvey}
                               ></FillInSurvey>
                      }else
                          return <>Survey Not Found </>
                      }  
                    }>
                      
                  </Route>


                  <Route path='/home/:username/newSurvey' render={({match}) =>
                  { 
                    if (loggedIn)
                    return  <CreateNewSurvey adminUsername={user.username}
                                        insertNewSurvey={insertNewSurvey}/>
                      
                    else 
                       return <Redirect to="/"/>  
                      
                  }  }>
                  </Route>
                      
                    <Route path='/home/:username' render={({match}) =>
                      { if (!loggedIn) 
                          return <Redirect to='/'/>
                       else
                       { const adminSurveyId= surveysInfo.filter(s=> s.owner==user.username).map(s => s.surveyId);
                          return <AdminHome 
                                    adminUsername={user.username} 
                                    surveysInfo={surveysInfo.filter(s=> s.owner==user.username)} //Only the surveyInfo of surveys owned by the admin
                                    surveysAnswers={adminSurveysAnswers} 
                                    surveyQuestions={surveysQuestions.filter(sq => adminSurveyId.includes(sq.surveyId)) //Only questions of the surveys owned by the admin
                                    }>
                                 </AdminHome>}}
                      }>
                  </Route>
                      
{/** 
                  <Route path="/login" render={() =>
                    loggedIn ? <Redirect to="/" /> : <LogInForm login={doLogIn}/>}>
                   </Route>

                  <Route path="/logout" render = {() =>
                    loggedIn ? <LogOutForm logout={doLogOut} /> : <Redirect to="/" />}>
                   </Route>
  */}               

                  <Route path='/' render={() =>{
                    if (loggedIn) 
                      return <Redirect to={'/home/' + user.username}/>
                    else
                     return <MySurveysTable surveysInfo={surveysInfo}></MySurveysTable>
                  }}>
                  </Route>
              
              </Switch>
        </Router>
    </>
    );
}

export default App;
