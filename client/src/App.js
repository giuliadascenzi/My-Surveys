import MyNavbar from './components/MyNavbar.js'
import MySurveysTable from './components/MySurveysTable.js'
import FillInSurvey from './components/FillInSurvey.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { useState } from 'react';
import dayjs from 'dayjs';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';




/* Static data */
const sInfo = [{ surveyId: 0, title: "Abitudini culinarie tra gli studenti italiani", owner: "pattidegi", date:dayjs("2021-05-02T09:00:00.000Z") },
{ surveyId: 1, title: "Quanto ne sai sulla raccolta differenziata?", owner: "giuliadash", date:dayjs("2021-06-02T09:00:00.000Z") },
{ surveyId: 2, title: "Come ha modificato la tua vita la pandemia?", owner: "giuliadash", date:dayjs("2021-06-02T09:00:00.000Z") }
];
/*Keys: questionId,surveyId*/
const sQuestions= [{ questionId: 0, surveyId:0,  chiusa: 1, min:1, max:1, obbligatoria:-1, question: "Quanti anni hai?", answers: "0-10_11-20_21-30_31-40_41+" },
{ questionId: 1, surveyId:0, chiusa: 1, min:1, max:1, obbligatoria:-1, question: "Nazionalità?", answers: "Italia_Spagna_Francia_Norvegia_Altro" },
{ questionId: 3, surveyId:0, chiusa: 1, min:0, max:3, obbligatoria:-1, question: "Top 3 dei tuoi piatti preferiti", answers: "Lasagna_Pizza_Sushi_Hamburger_Frittata_Paella" },

{ questionId: 2, surveyId:0, chiusa: 0, min:-1, max:-1, obbligatoria:1, question: "Che cosa studi?", answers: "" },
{ questionId: 0, surveyId:1, chiusa: 0, min:-1, max:-1, obbligatoria:1, question: "Che lavoro fai?", answers: "" }

];
const sAnswers=[];


function App() {
  const [surveysInfo, setSurveysInfo] =useState([...sInfo]);
  const [surveysQuestions, setSurveysQuestions] =useState([...sQuestions]);
  const [surveysAnswers, setsurveysAnswers] =useState([...sAnswers]);

  const addFilledInSurvey = (surveyId, answers, user) => {
    console.log("addFilledInSurvey");
    const FilledInSurvey = {surveyId: surveyId, answers: answers, user:user};
    setsurveysAnswers([...surveysAnswers, FilledInSurvey]);

  }
  
  return ( <>
        
        <Router>
            <title>My Online Surveys</title>
            <MyNavbar/>

                <Switch>
                  <Route path='/survey/:surveyId' render={({match}) =>
                      {
                      if (surveysInfo.map(s=>s.surveyId).includes(parseInt(match.params.surveyId)))

                        return <FillInSurvey 
                                    surveyInfo={surveysInfo.filter(s=>(s.surveyId==match.params.surveyId))[0]}
                                    surveyQuestions={surveysQuestions.filter(s=>(s.surveyId==match.params.surveyId))}
                                    addFilledInSurvey = {addFilledInSurvey}
                               ></FillInSurvey>
                      else
                          return <>Survey Not Found </>
                      }  
                    }>
                      
                  </Route>
                  <Route path='/' render={() =>
                      <MySurveysTable surveysInfo={surveysInfo}></MySurveysTable>
                      }>
                  </Route>
              
              </Switch>
        </Router>
    </>
    );
}

export default App;
