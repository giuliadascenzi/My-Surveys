import { Card, Table, Row, Col, Button, Container } from "react-bootstrap";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FcSearch, FcPlus} from "react-icons/fc";
import {ImClipboard,ImPencil2} from "react-icons/im";
import {  Link } from 'react-router-dom';


function AdminHome(props)
{
    return <Container fluid>
            <AdminResults surveysInfo={props.surveysInfo} surveysQuestions={props.surveysQuestions} surveysAnswers={props.surveysAnswers}/>
            <CreateNewSurvey />
    </Container>
}


function AdminResults(props)
{
    return <>
    <Row className="px-3">
        In the following table are shown all the surveys you have created:
    </Row>
    
    <Table striped  >
    <thead>
      <tr>
        <th>Survey title</th>
        <th>Date</th>
        <th>Number of answers</th>
        <th>         </th>


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
    <td><CheckResultButton surveyId={props.surveyInfo.surveyId}/></td>
  </tr>
</>
}



/*Clicking on this button the user gets redirect to the page where he/she can fill in the selected survey*/
function CheckResultButton(props)
{
    return <Link to={"/FilledInSurvey/"+ props.filledInSurveyId}>
              <Button variant="outline-secondary" >
                  <ImClipboard
                    size="20"
                    fill="black"
                  ></ImClipboard>
              </Button>
            </Link>

}  

function CreateNewSurvey(props)
{
    return <><>Create a new survey: </>
     <Button variant="outline-secondary" >
                  <ImPencil2
                    size="20"
                    fill="black"
                  ></ImPencil2>
               New survey</Button></>
}

export default AdminHome;