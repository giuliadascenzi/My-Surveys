import { Form, Modal,  Button, Card, Row, Col, Container, FormGroup, InputGroup, FormControl} from "react-bootstrap";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FcSearch, FcPlus} from "react-icons/fc";
import {ImClipboard,ImPencil2} from "react-icons/im";
import {AiOutlineArrowLeft, AiOutlineArrowRight}from "react-icons/ai";
import {  Link } from 'react-router-dom';
import { OpenQuestion } from './OpenQuestion.js';
import { ClosedQuestion } from './ClosedQuestion.js';


function CreateNewSurvey(props)
{ const [title, setTitle]= useState();
  const [questions, setQuestions] = useState([{ questionId: 3, surveyId:0, chiusa: 1, min:0, max:3, obbligatoria:-1, question: "Top 3 dei tuoi piatti preferiti", answers: "Lasagna_Pizza_Sushi_Hamburger_Frittata_Paella" },
]);
 return <Container>
            <Card>
                <Card.Header >
                    {/*Title of the survey */}
                    <Card.Title className="text-center" >"NEW SURVEY"</Card.Title> 
                    <Row>
                       <Form.Label column sm="2" className="insertTitle">Title:</Form.Label>
                       <Col sm="8">
                            <Form.Control type="title" placeholder="Enter title"  required onChange = {(event)=> setTitle(event.target.value)}/>
                            <Form.Control.Feedback type="invalid">
                                Please choose a username.
                            </Form.Control.Feedback>
                       </Col>
                    </Row>                       
                    
                </Card.Header>

            <Card.Body>
                <>Questions: </>

                {questions.sort((sq1, sq2) => sq1.questionId - sq2.questionId)
                                              .map((sQ, sQind) => {
                                                                    if (sQ.chiusa === 1) /* closed Question */
                                                                        return <ClosedQuestion
                                                                            surveyQuestion={sQ}
                                                                            key={sQ.questionId}
                                                                            questionIndex={sQind } 
                                                                            />
                                                                    else                /* open Question */
                                                                        return <OpenQuestion 
                                                                            surveyQuestion={sQ}
                                                                            key={sQ.questionId}
                                                                            questionIndex={sQind} 
                                                                            />
                                                                })}
               <Row> 
                   <AddQuestionButton/>
                </Row>

            </Card.Body>
            </Card>

        </Container>
}


function AddQuestionButton(props)
{
    const [show, setShow] =useState(false)
    const [questionText, setQuestionText] =useState();
    const [numAnswers, setNumAnswers] =useState(0);
    const [min, setMin] =useState(0);
    const [max, setMax] =useState(0);
    const [chiusa, setChiusa]= useState(true);
    const [obbligatoria, setObbligatoria] = useState();
    const [answers, setAnswers] =useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChooseTypeOfQuestion = (event) =>
    {   console.log(event.target.id);
        if (event.target.id == "radio-openQuestion")
            setChiusa(false)
        else
            setChiusa(true)
    }
    const handleNumAnswersChange = (event) =>
    {   
        setNumAnswers(event.target.value)
        const data = []
        for (let i=0; i< event.target.value; i++)
            data.push("");
        setAnswers(data);
    } 
    const handleSubmit = (event) =>
    {
      //{ questionId: 3, surveyId:0, chiusa: 1, min:0, max:3, obbligatoria:-1, question: "Top 3 dei tuoi piatti preferiti", answers: "Lasagna_Pizza_Sushi_Hamburger_Frittata_Paella" },

    }
    return <>
            <Button variant="success" size="sm" className="fixed-left-bottom" onClick={handleShow}>
                + Add question
            </Button>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/** CHOOSE BETWEEN CLOSE AND OPEN */}
                    <Form.Group as={Row} onChange= {handleChooseTypeOfQuestion}>
                        <Form.Label as="legend" column sm={6}>
                             Choose type of question: 
                        </Form.Label>
                     <Col sm={6}>

                        <Form.Check 
                            type='radio'
                            name = 'typeOfQuestion'
                            id={`radio-closeQuestion`}
                            label={"Close"}
                            defaultChecked
                        />
                        <Form.Check 
                            type='radio'
                            name = 'typeOfQuestion'
                            id={`radio-openQuestion`}
                            label={"Open"}
                        />
                        
                      </Col>
                    </Form.Group>
                    {/** TEXT OF THE QUESTION */}

                    <Form.Group as={Row} controlId="textOfQuestion">
                        <Form.Label column sm={6}>
                        Text of the question
                        </Form.Label>
                        <Col sm={6}>
                        <Form.Control as="textarea"  type="text" placeholder="text" onChange={(ev)=> setQuestionText(ev.target.value)}/>
                        </Col>
                    </Form.Group>

                    {/* IN CASE ITS BEEN SELECTED OPEN QUESTION           */}
                    {
                        !chiusa ? 
                            /** Obbligatoria? */
                            <Form.Check 
                            type='checkbox'
                            name = 'obbligatoria'
                            id={`radio-MandatoryQuestion`}
                            label={"Is the answer mandatory?"}
                            onChange = {(ev)=> setObbligatoria(ev.target.checked)}
                            />
                            :
                            /** Its a closed Question => specify number of possible answers, minimum answer to give, maximum number to give */
                            <>
                            <FormGroup >
                               <Row>
                                <Form.Label as="legend" column sm={6}>
                                Number of possible answers:
                                </Form.Label>
                                <Col sm={2}>
                               <Form.Control  type="number" placeholder="Tot" value={numAnswers} min={1} onChange={handleNumAnswersChange}/>
                                </Col>
                                </Row>

                                <Row>
                                <Form.Label as="legend" column sm={6}>
                                Maximum number of answers to select:
                                </Form.Label>
                                <Col sm={2}>
                               <Form.Control  type="number" placeholder="max" value={min} min={0} max={numAnswers} onChange={(ev)=>  setMin(ev.target.value)}/>
                                </Col>
                                </Row>
                                <Row>
                                <Form.Label as="legend" column sm={6}>
                                Mininum number of answers to select:
                                </Form.Label>
                                <Col sm={2}>
                               <Form.Control  type="number" placeholder="min" value={max} min={0} max={numAnswers} onChange={(ev)=> setMax(ev.target.value)}/>
                                </Col>
                                </Row>
                            </FormGroup>

                            {answers.length>0 ?                                 
                                <Row>
                                <Form.Label as="legend" column sm={6}>
                                Possible Answers:
                                </Form.Label> 
                                </Row> : <></>}
                            {answers.map((an, index) =>
                            
                                            <InputGroup  className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="inputGroup-sizing-sm">-</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl aria-label="default" aria-describedby="inputGroup-sizing-default" />
                                            </InputGroup>
                                        )
                        }
                            </>
                        
                    }

                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Discard
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                        Add question
                    </Button>
                </Modal.Footer>
            </Modal>
            </>
        
   
}


export default CreateNewSurvey;