import { Form} from "react-bootstrap";
import { useState } from 'react';


/* It is called by:
* >[FillInSurvey] passing these props:
*    - surveyQuestion= the questions of this survey (questionId, surveyId, chiusa: 1, min:num, max:num, obbligatoria:-1, question, answers: *separated by _*))
*    - setAnswer= function to set the answer of the question
* >[SurveyResult], passing these props
*   - surveyQuestion= the questions of this survey (questionId, surveyId, chiusa: 0, min:-1, max:-1, obbligatoria:0/1, question, answers: ""))
*   - answer= the answer of the question
*    (In survey result the question must be read only)
* >[QuestionRow], passing these props:
*   - surveyQuestion
*   - questionIndex
*    (In this case the answer must not be sent anywhere.)
 */
function ClosedQuestion(props) {
    
    const [ans, setAns] =useState([]); //Answer of the question
    const [errMin, setErrMin] = useState((props.surveyQuestion.min>0))
    const [errMax, setErrMax] = useState((props.surveyQuestion.max===0))

    const handleClosedQuestioinChanged = (event, ansIndex) => {

        if (props.answer ) return; //Read only question

        if (!ans.includes(ansIndex))
            {   
                const data = [...ans, ansIndex]
                setAns(data);

                if (props.setAnswer)
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
                if (props.setAnswer)
                    props.setAnswer(props.questionIndex, data.join("_"))

                if (errMax===true && data.length<props.surveyQuestion.max)
                    setErrMax(false);

                if (errMin===false && data.length< props.surveyQuestion.min )
                    setErrMin(true);

            }


    }

        return <Form.Group controlid={"FillInSurvey.closeQuestion" + props.surveyQuestion.questionId} >
                 
                 {/** Question */}
                <Form.Label  >{props.questionIndex+1 + ") " + props.surveyQuestion.question } </Form.Label>

                {/**To specify the requirements of the question */}
                <Form.Text className="text-muted">
                {props.surveyQuestion.min!==0? "This answer requires at least "+ props.surveyQuestion.min + " answers. " : "This answer is optional. "}
                {"The maximum number of answers is "+ props.surveyQuestion.max+". "}
                </Form.Text>

                {/** Possible answers: */}
                {props.surveyQuestion.answers.split("_").map((answer, ansIndex) =>
                
                   <Form.Check
                        type="checkbox"
                        name={props.surveyQuestion.surveyId + props.surveyQuestion.questionId}
                        id={ansIndex}
                        label={answer}
                        readOnly = {props.answer!==undefined}
                        checked = {props.answer ? props.answer.includes(ansIndex) : ans.includes(ansIndex)} //If prop.answers is different than undefined then the question is readOnly
                        key={"checkbox" + ansIndex}
                        disabled = {errMax && !ans.includes(ansIndex)} /** when the maximum number of selectable answer has been reached all the others are disabled */
                        required= {errMin} //errMin is set when the minimum number of answers has not been reached yet
                        onChange = {(event) => handleClosedQuestioinChanged(event, ansIndex)}
                    />
                )}



            </Form.Group>
                                            
}

export {ClosedQuestion};
