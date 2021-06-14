import { Form, Modal, Button } from "react-bootstrap";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FcSearch, FcPlus} from "react-icons/fc";
import {ImClipboard,ImPencil2} from "react-icons/im";
import {AiOutlineArrowLeft, AiOutlineArrowRight}from "react-icons/ai";
import {  Link } from 'react-router-dom';

/**
 * props got from APP:
 * surveyInfo
 * surveyQuestions
 * surveysAnswers
 */
function SurveysResults(props)
{
    const [show, setShow] = useState(false);
    const [index, setInde]= useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const nextSurvey = () => console.log("+1");
    const lastSurvey = () => console.log("-1");
  
    return (
      <>
        <CheckResultButton handleShow={handleShow}/>
        
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>"{props.surveyInfo.title}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <OneSurveyResult
                surveysQuestions={props.surveysQuestions}
                surveyAnswers = {props.surveysAnswers.filter(s=> s.surveyId== props.surveyInfo.surveyId)}
               
              />

          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={lastSurvey}>
                  <AiOutlineArrowLeft
                    size="20"
                    fill="black"
                  />
            </Button>
            <Button variant="outline-secondary" onClick={nextSurvey}>
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
      
      /*Clicking on this button the user gets redirect to the page where he/she can fill in the selected survey*/
function CheckResultButton(props)
{
    return <Button variant="outline-secondary" onClick={props.handleShow}>
                  <ImClipboard
                    size="20"
                    fill="black"
                  ></ImClipboard>
              </Button>
}  

function OneSurveyResult(props)
{
    return <Form>
    <Form.Group controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" placeholder="Enter email" />
      <Form.Text className="text-muted">
        We'll never share your email with anyone else.
      </Form.Text>
    </Form.Group>
  
    <Form.Group controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" />
    </Form.Group>
    <Form.Group controlId="formBasicCheckbox">
      <Form.Check type="checkbox" label="Check me out" />
    </Form.Group>
    <Button variant="primary" type="submit">
      Submit
    </Button>
  </Form>
}


export default SurveysResults;