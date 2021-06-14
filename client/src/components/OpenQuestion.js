import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

/*Props passate da FillInSurvey.js:
surveyQuestion= the questions of this survey (questionId, surveyId, chiusa: 0, min:-1, max:-1, obbligatoria:0/1, question, answers: ""))
setAnswer= function to set the answer of the question*/
function OpenQuestion(props) {
    
    const handleOpenQuestionChange = (event) =>
    {  
            props.setAnswer(props.questionIndex, event.target.value)
               
    }
    

    return <Form.Group controlId={"FillInSurvey.openQuestion" + props.surveyQuestion.questionId}>
                {/** Question: */}
                <Form.Label  >{props.questionIndex+1 + ") " + props.surveyQuestion.question}  </Form.Label>
                {/** Free space to answer: */}
                <Form.Control   as="textarea"     
                                maxLength="200" 
                                rows={3} 
                                onChange={handleOpenQuestionChange}
                                required = {props.surveyQuestion.obbligatoria === 1} />
                <Form.Control.Feedback type="invalid">
                    Please fill in this answer.
                </Form.Control.Feedback>

            </Form.Group>
}

export default OpenQuestion;