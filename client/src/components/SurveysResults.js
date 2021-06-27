import { Form, Modal, Button, Card, Row, Col, Container} from "react-bootstrap";
import { useState } from 'react';
import {ImClipboard} from "react-icons/im";
import {AiOutlineArrowLeft, AiOutlineArrowRight}from "react-icons/ai";
import { OpenQuestion } from './OpenQuestion.js';
import { ClosedQuestion } from './ClosedQuestion.js';

/**
 * props got from APP:
 * surveyInfo
 * surveyQuestions
 * surveysAnswers
 */

//Modal showing a filled survey (seen in a readOnly way) + arrows to go  back and forth 
function SurveysResults(props)
{
    const [show, setShow] = useState(false);
    const [index, setIndex]= useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //go to the next filled survey if its possible
    const nextSurvey = () => {if (index+1 < props.surveyAnswers.length) setIndex(index+1)}
    //go to the previous filled survey if its possible
    const lastSurvey = () => {if (index-1 >= 0) setIndex(index-1)}
  
    return (
      <> {/** Button to check the results */}
        <CheckResultButton handleShow={handleShow}/>
        
        <Modal size="lg" show={show} onHide={handleClose}>

          <Modal.Header closeButton className="text-center">
            <Modal.Title className="font-weight-bold">"{props.surveyInfo.title}"</Modal.Title>
          </Modal.Header>

          <Modal.Body>
             {/** In the body of the modal are shown the filled survey selected using the arrows. */}
              <OneSurveyResult
                surveyQuestions={props.surveyQuestions}
                surveyAnswers = {props.surveyAnswers[index]}    
              />
          </Modal.Body>

          <Modal.Footer>
            {/** Go ahead arrow*/}
            <Button variant="outline-secondary" onClick={lastSurvey} disabled={index===0}>
                  <AiOutlineArrowLeft
                    size="20"
                    fill="black"
                  />
            </Button>
            {/** Go back arrow */}
            <Button variant="outline-secondary" onClick={nextSurvey} disabled={index===props.surveyAnswers.length-1}>
                <AiOutlineArrowRight
                    size="20"
                    fill="black"
                  />
            </Button>
          </Modal.Footer>

        </Modal>
      </>
    );
  }
 
  
/*Clicking on this button the user gets redirected to the page where he/she can fill in the selected survey*/
function CheckResultButton(props)
{
    return <Button variant="outline-custom" onClick={props.handleShow}>
                  <ImClipboard
                    size="20"
                    fill="black"
                  ></ImClipboard>
              </Button>
}  


//Shows one filled survey
function OneSurveyResult(props)
{  
  const answers = JSON.parse(props.surveyAnswers.answers); //Because in the db the answers are saved as a JSON array
    return <Card>

            <Card.Body> 
                <Form >
                    <Form.Group as={Row} controlId="surveyForm" >
                        {/* Input label for the user name*/}
                        <Form.Label column sm="4">Write here your name:</Form.Label>
                        <Col sm="4">
                            <Form.Control type="username"  value={props.surveyAnswers.user? props.surveyAnswers.user : ""} readOnly/>
                        </Col>
                    </Form.Group>
                        {/* Questions ordered by increasing questionId below */}
                        { 
                        props.surveyQuestions.sort((sq1, sq2) => sq1.questionId - sq2.questionId)
                                            .map((sQ, sQind) => {   
                                                                    if (sQ.chiusa === 1) /* closed Question */
                                                                        return <Container fluid id="questionRow" key={sQ.questionId}>
                                                                                <ClosedQuestion
                                                                                    surveyQuestion={sQ}
                                                                                    key={sQ.questionId}
                                                                                    questionIndex={sQind } 
                                                                                    answer = {answers[sQind]}
                                                                                    />
                                                                                </Container>
                                                                    else                /* open Question */
                                                                        return <Container fluid id="questionRow" key={sQ.questionId}>
                                                                                  <OpenQuestion 
                                                                                    surveyQuestion={sQ}
                                                                                    key={sQ.questionId}
                                                                                    questionIndex={sQind} 
                                                                                    answer = {answers[sQind]}
                                                                                  />
                                                                            </Container>
                                                                })}


                </Form>
            </Card.Body>

        </Card>
}


export default SurveysResults;