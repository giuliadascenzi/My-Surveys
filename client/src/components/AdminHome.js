import { Card, Table, Row, Col, Button, Container,Alert } from "react-bootstrap";
import { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { FcSearch, FcPlus} from "react-icons/fc";
import {ImClipboard,ImPencil2} from "react-icons/im";
import {  Link } from 'react-router-dom';
import SurveysResults from "./SurveysResults";

/** Props got from APP:
 * surveyInfo
 * surveyQuestions
 * adminUsername
 * surveysAnswers
 */
function AdminHome(props)
{
    return <Container fluid>
            <Alert variant="success">Hello, {props.adminUsername}. Welcome back!</Alert>
            <AdminResults surveysInfo={props.surveysInfo} 
                          surveysQuestions={props.surveyQuestions} 
                          surveysAnswers={props.surveysAnswers}
                          />
            <CreateNewSurvey adminUsername={props.adminUsername}/>
    </Container>
}


function AdminResults(props)
{
    return <>
    <Row className="px-3">
        In the following table are shown all the surveys you have created so far:
    </Row>
    
    <Table striped  >
    <thead>
      <tr>
        <th>Survey title</th>
        <th>Date</th>
        <th>Number of answers</th>
        <th>Results        </th>


      </tr>
    </thead>
    <tbody>
      {
        props.surveysInfo.map( s =>  <ResultsRow surveyInfo={s}
                                                 key={s.surveyId}
                                                 surveysQuestions={props.surveysQuestions}
                                                 surveysAnswers={props.surveysAnswers}/>)
      }
    </tbody>
  </Table>

  </>
}

function ResultsRow(props)
{
    return <>
    <tr>
    <td>{props.surveyInfo.title}</td>
    <td>{props.surveyInfo.date.format('dddd, MMMM D, YYYY h:mm A')}</td>
    <td>{props.surveysAnswers.filter(s => s.surveyId==props.surveyInfo.surveyId).length}</td>
    <td><SurveysResults surveyQuestions={props.surveysQuestions.filter(s => s.surveyId == props.surveyInfo.surveyId)}
                        surveyAnswers={props.surveysAnswers.filter(s => s.surveyId == props.surveyInfo.surveyId)}
                        surveyInfo={props.surveyInfo}/></td>
  </tr>
</>
}




function CreateNewSurvey(props)
{  console.log("home/"+props.adminUsername+"/NewSurvey");
    return <>
            <>Create a new survey: </>
              <Link to={props.adminUsername+"/NewSurvey"}>
                  <Button variant="outline-secondary" >
                          <ImPencil2
                            size="20"
                            fill="black"
                          ></ImPencil2>
                      New survey
                  </Button>
              </Link>
          </>
        }
    
export default AdminHome;