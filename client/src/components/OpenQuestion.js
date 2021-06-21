import {  Form } from "react-bootstrap";
import { useState } from 'react';

/*Props passate da FillInSurvey.js:
surveyQuestion= the questions of this survey (questionId, surveyId, chiusa: 0, min:-1, max:-1, obbligatoria:0/1, question, answers: ""))
setAnswer= function to set the answer of the question*/
/** Props passate da SurveyResult
 * surveyQuestion= the questions of this survey (questionId, surveyId, chiusa: 0, min:-1, max:-1, obbligatoria:0/1, question, answers: ""))
* answer
 */
function OpenQuestion(props) {
    const [text, setText] =useState();
    
    const handleOpenQuestionChange = (event) =>
    {  
        if (props.answer) return;
        
        setText(event.target.value);
        if (props.setAnswer)
            props.setAnswer(props.questionIndex, event.target.value)
               
    }
    

    return <Form.Group controlId={"FillInSurvey.openQuestion" + props.surveyQuestion.questionId}>
                {/** Question: */}
                <Form.Label  >{props.questionIndex+1 + ") " + props.surveyQuestion.question}  </Form.Label>
                {/** Free space to answer: */}
                <Form.Text className="text-muted">
                {props.surveyQuestion.obbligatoria? "This answer is mandatory" : "This answer is optional"}
                </Form.Text>
                {   //readOnly
                     <Form.Control   as="textarea"     
                                maxLength="200" 
                                rows={3} 
                                readOnly = {props.answer!=undefined}
                                value = {props.answer ? props.answer : text}
                                onChange={handleOpenQuestionChange}
                                required = {props.surveyQuestion.obbligatoria === 1} />
                 }
                <Form.Control.Feedback type="invalid">
                    Please fill in this answer.
                </Form.Control.Feedback>

            </Form.Group>
}

export  {OpenQuestion};