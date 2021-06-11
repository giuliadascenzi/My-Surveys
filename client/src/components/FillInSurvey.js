import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { BsCheckAll, BsFillPersonFill, BsBoxArrowInRight, BsFillQuestionSquareFill } from "react-icons/bs";
import { useState } from 'react';



/*Props passate da App:
surveyInfo= informations about that specific survey (surveyId, title, owner, date )
surveyQuestions= the questions of this survey (questionId, surveyId, chiusa: 0/1, min:num/-1, max:num/-1, obbligatoria:1/0/-1, question:, answers)
*/

function FillInSurvey(props) {
    var data = [];

    for(var i = 0; i < props.surveyQuestions.length; i++) {
        data.push("");
    }

    const [answers, setAnswers] =useState([...data]);

    const setAnswer = (answerIndex, answer) => 
    {   console.log("risposta",answer, answerIndex)
        let newAnswers = []
        for(var i = 0; i < answers.length; i++) {
            if (i===answerIndex)
                newAnswers.push(answer);
            else
                newAnswers.push(answers[i]);
        }
        setAnswers(newAnswers);
        console.log(answers)
    }

    return (<>
        <Card>

            <Card.Header className="text-center">
                {/*Title of the survey */}
                <Card.Title>"{props.surveyInfo.title}"</Card.Title> 
                {/*Owner of the survey */}
                <Card.Subtitle>Survey by {props.surveyInfo.owner}</Card.Subtitle> 
            </Card.Header>

            <Card.Body>
                <Form>
                    <Form.Group as={Row} controlId="surveyForm">
                        {/* Input label for the user name*/}
                        <Form.Label column sm="2" className="insertName">Write here your name:</Form.Label>
                        <Col sm="10">
                            <Form.Control type="username" placeholder="Enter name" />
                        </Col>
                        {/* Questions ordered by increasing questionId below */}
                        {props.surveyQuestions.sort((sq1, sq2) => sq1.questionId - sq2.questionId)
                                              .map((sQ, sQind) => {
                                                                    if (sQ.chiusa === 1) /* closed Question */
                                                                        return <ClosedQuestion
                                                                            surveyQuestion={sQ}
                                                                            key={sQ.questionId}
                                                                            questionIndex={sQind } />
                                                                    else                /* open Question */
                                                                        return <OpenQuestion 
                                                                            surveyQuestion={sQ}
                                                                            key={sQ.questionId}
                                                                            questionIndex={sQind} 
                                                                            setAnswer={setAnswer}/>
                                                                })}

                    </Form.Group>

                </Form>
            </Card.Body>
            <Card.Footer>
                <Row>
                    {/* submit button */}
                    <SubmitButton></SubmitButton>
                </Row>
            </Card.Footer>
        </Card>




    </>

    );


}

/*Props passate da FillInSurvey:
surveyQuestion= the questions of this survey (questionId, surveyId, chiusa: 1, min:num, max:num, obbligatoria:-1, question, answers: *separated by _*))
setAnswer= function to set the answer of the question*/
function ClosedQuestion(props) {


    /*if min,max= (0,1) or (1,1) radiobox because its a single answer question
    otherwise its checkbox because multiple answers can be selected */
    if ((props.surveyQuestion.min === 0 && props.surveyQuestion.max === 1) 
          || (props.surveyQuestion.min === 1 && props.surveyQuestion.max === 1))
       {
            return <Form.Group controlid={"FillInSurvey.openQuestion" + props.surveyQuestion.questionId}>
                         {/** Question */}
                        <Form.Label  >{props.questionIndex+1 + ") " + props.surveyQuestion.question}  </Form.Label>
                        {/** Possible answers: */}
                        {props.surveyQuestion.answers.split("_").map((ans, ansIndex) =>

                                <Form.Check
                                    type="radio"
                                    name={props.surveyQuestion.surveyId + props.surveyQuestion.questionId}
                                    id={ansIndex}
                                    label={ans}
                                    key={"radio" + ansIndex}
                                />)}
                                
                    </Form.Group>

       }

    else
        return <Form.Group controlid={"FillInSurvey.openQuestion" + props.surveyQuestion.questionId}>
                 {/** Question */}
                <Form.Label  >{props.questionIndex+1 + ") " + props.surveyQuestion.question}  </Form.Label>
                {/** Possible answers: */}
                {props.surveyQuestion.answers.split("_").map((ans, ansIndex) =>

                    <Form.Check
                        type="checkbox"
                        name={props.surveyQuestion.surveyId + props.surveyQuestion.questionId}
                        id={ansIndex}
                        label={ans}
                        key={"checkbox" + ansIndex}
                    />)}
            </Form.Group>
}

/*Props passate da FillInSurvey.js:
surveyQuestion= the questions of this survey (questionId, surveyId, chiusa: 0, min:-1, max:-1, obbligatoria:0/1, question, answers: ""))
setAnswer= function to set the answer of the question*/
function OpenQuestion(props) {
    
    const handleOpenQuestionChange = (event) =>
    {  //TODO: check lunghezza
       console.log(event.target.value);
       props.setAnswer(props.questionIndex, event.target.value)
    }
    

    return <Form.Group controlId={"FillInSurvey.openQuestion" + props.surveyQuestion.questionId}>
                {/** Question: */}
                <Form.Label  >{props.questionIndex+1 + ") " + props.surveyQuestion.question}  </Form.Label>
                {/** Free space to answer: */}
                <Form.Control as="textarea" rows={3} onChange={handleOpenQuestionChange} />
            </Form.Group>
}



function SubmitButton(props) {
    return <Button className="btn btn-success btn-lg ">
                Submit your answers
           </Button>
}




export default FillInSurvey;
