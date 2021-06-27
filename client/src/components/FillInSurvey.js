import { Card, Form, Row, Col, Button, Alert, Container } from "react-bootstrap";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { OpenQuestion } from './OpenQuestion.js';
import { ClosedQuestion } from './ClosedQuestion.js';
import { IoIosReturnLeft, IoIosWarning } from "react-icons/io";
import { MdDoneAll } from "react-icons/md";
/*Props passate da App:
surveyInfo= informations about that specific survey (surveyId, title, owner, date )
surveyQuestions= the questions of this survey (questionId, surveyId, chiusa: 0/1, min:num/-1, max:num/-1, obbligatoria:1/0/-1, question:, answers)
*/

function FillInSurvey(props) {
    var data = [];
    for (var i = 0; i < props.surveyQuestions.length; i++) {
        data.push("");
    }

    const [answers, setAnswers] = useState([...data]);
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState("");
    const [errMessage, setErrMessage] = useState("");


    const setAnswer = (answerIndex, answer) => {
        let newAnswers = []
        for (var i = 0; i < answers.length; i++) {
            if (i === answerIndex)
                newAnswers.push(answer);  /** save the new answer of question i */
            else
                newAnswers.push(answers[i]);
        }
        setAnswers(newAnswers);

    }

    let history = useHistory();

    const handleSubmit = (event) => {

        // stop event default and propagation
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        // check if form is valid using HTML constraints
        if (!form.checkValidity()) {
            // errors
            setValidated(true); // enables bootstrap validation error report
            setErrMessage("Resolve errors before submitting")
            setTimeout(() => {
                setErrMessage("")
            }, 2000);
        } else {
            // submit the answers
            props.addFilledSurvey(props.surveyInfo.surveyId, answers, user);
            // redirect to the home page
            history.push("/");
        }

    };

    return (<Container id="survey_container">
        <Card>

            <Card.Header className="text-center">
                {/*Title of the survey */}
                <Card.Title className="font-weight-bold">"{props.surveyInfo.title}"</Card.Title>
                {/*Owner of the survey */}
                <Card.Subtitle>Survey by {props.surveyInfo.owner}</Card.Subtitle>
            </Card.Header>

            <Card.Body>

                <Form noValidate validated={validated} onSubmit={handleSubmit} id="filled_survey">
                    <Form.Group as={Row} controlId="surveyForm" >
                        {/* Input label for the user name*/}
                        <Form.Label column sm="4" >Write here your name:</Form.Label>
                        <Col sm="4">
                            <Form.Control type="username" placeholder="Enter name" required onChange={(event) => setUser(event.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a username.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    {/* Questions ordered by increasing questionId below */}
                    {props.surveyQuestions.sort((sq1, sq2) => sq1.questionId - sq2.questionId)
                        .map((sQ, sQind) => {
                            if (sQ.chiusa) /* closed Question */
                                return <Container fluid id="questionRow" key={sQ.questionId}>
                                    <ClosedQuestion
                                        surveyQuestion={sQ}
                                        key={sQ.questionId}
                                        questionIndex={sQind}
                                        setAnswer={setAnswer} />
                                </Container>
                            else                /* open Question */
                                return <Container fluid id="questionRow" key={sQ.questionId}>
                                    <OpenQuestion
                                        surveyQuestion={sQ}
                                        key={sQ.questionId}
                                        questionIndex={sQind}
                                        setAnswer={setAnswer} />
                                </Container>
                        })}



                </Form>
            </Card.Body>
            <Card.Footer>


                <Container className="d-flex flex-column">
                    {errMessage.length != 0 ? <Alert variant="danger"><IoIosWarning fill="#920c19" size="30" className="mx-1" />{errMessage}</Alert> : <></>}
                </Container>
                <Container className="d-flex justify-content-between">
                    <Button variant="secondary" size="lg" onClick={() => history.goBack()}>
                        <IoIosReturnLeft />Discard
                    </Button>
                    {/* submit button */}
                    <SubmitButton />
                </Container>
            </Card.Footer>
        </Card>
    </Container>





    );


}




function SubmitButton(props) {
    return <Button type="submit" className="btn btn-success btn-lg " form="filled_survey">
       <MdDoneAll/> Submit your answers
    </Button>
}




export default FillInSurvey;
