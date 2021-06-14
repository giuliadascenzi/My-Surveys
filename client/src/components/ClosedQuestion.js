import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
/*Props passate da FillInSurvey:
surveyQuestion= the questions of this survey (questionId, surveyId, chiusa: 1, min:num, max:num, obbligatoria:-1, question, answers: *separated by _*))
setAnswer= function to set the answer of the question*/
/** Props passate da SurveyResult
 * surveyQuestion= the questions of this survey (questionId, surveyId, chiusa: 0, min:-1, max:-1, obbligatoria:0/1, question, answers: ""))
* answer
 */
function ClosedQuestion(props) {
    
    const [ans, setAns] =useState([]);
    const [errMin, setErrMin] = useState((props.surveyQuestion.min>0))
    const [errMax, setErrMax] = useState((props.surveyQuestion.max===0))



    const handleClosedQuestioinChanged = (event, ansIndex) => {

        if (props.answer) return

        if (!ans.includes(ansIndex))
            {   
                const data = [...ans, ansIndex]
                setAns(data);

                props.setAnswer(props.questionIndex, data.join("_"))
                if (data.length>= props.surveyQuestion.max)
                    setErrMax(true);
                if (errMin===true && data.length>= props.surveyQuestion.min )
                    setErrMin(false);

                
            } else
            {   
                const data=[];
                for (let elm of ans)
                        if (elm!==ansIndex) data.push(elm);

                setAns(data);
                props.setAnswer(props.questionIndex, data.join("_"))

                if (errMax===true && data.length<props.surveyQuestion.max)
                    setErrMax(false);

                if (errMin===false && data.length< props.surveyQuestion.min )
                    setErrMin(true);

            }


    }

        return <Form.Group controlid={"FillInSurvey.closeQuestion" + props.surveyQuestion.questionId} >
                 {/** Question */}
                
                <Form.Label  >{props.questionIndex+1 + ") " + props.surveyQuestion.question + (errMin? "*": "")}  </Form.Label>
                {/** Possible answers: */}
                {props.surveyQuestion.answers.split("_").map((answer, ansIndex) =>

                    <Form.Check
                        type="checkbox"
                        name={props.surveyQuestion.surveyId + props.surveyQuestion.questionId}
                        id={ansIndex}
                        label={answer}
                        readOnly = {props.answer!=undefined}
                        checked = {props.answer? props.answer.includes(ansIndex) : false}
                        key={"checkbox" + ansIndex}
                        onChange={(event)=>{ handleClosedQuestioinChanged(event, ansIndex)}}
                        disabled = {errMax && !ans.includes(ansIndex)}
                        required= {errMin}
                    />

                )}


            </Form.Group>
                                            
}

export {ClosedQuestion};
