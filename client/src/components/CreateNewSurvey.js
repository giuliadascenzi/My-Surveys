import { Form, Modal, Button, Card, Row, Col, Container, FormGroup, InputGroup, FormControl, Alert } from "react-bootstrap";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FcSearch, FcPlus } from "react-icons/fc";
import { FaArrowUp,FaArrowDown } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { OpenQuestion } from './OpenQuestion.js';
import { ClosedQuestion } from './ClosedQuestion.js';


function CreateNewSurvey(props) {
    const [title, setTitle] = useState("");
    const [errTitle, setErrTitle] =useState(false);
    const [errNumQuestion, setErrNumQuestion] =useState(false);

    const [questions, setQuestions] = useState([{ questionId: 0, surveyId: 0, chiusa: 1, min: 0, max: 3, obbligatoria: -1, question: "Top 3 dei tuoi piatti preferiti", answers: "Lasagna_Pizza_Sushi_Hamburger_Frittata_Paella" },
    { questionId: 1, surveyId:0, chiusa: 0, min:-1, max:-1, obbligatoria:1, question: "Che cosa studi?", answers: "" },
    { questionId: 2, surveyId:0, chiusa: 0, min:-1, max:-1, obbligatoria:1, question: "Che lavoro fai?", answers: "" }]);

    let history = useHistory();

    const handleAddQuestion = (question) => {
        if (errNumQuestion) setErrNumQuestion(false)
        console.log("quesion added");
        /**TODO: aggiornare l'id del survey */
        question.questionId = questions.length;
        setQuestions([...questions, question]);
    }

    const handleQuestionMoveUp = (index) =>
    {
       //The question up need to go down and the question at index need to go at sQind-1
       const data=[...questions];
       data[index].questionId = index-1;
       data[index-1].questionId = index;
       setQuestions(data.sort((sq1, sq2) => sq1.questionId - sq2.questionId));

    }
    const handleQuestionMoveDown = (index) =>
    {
        //The question down need to go up and the question at index need to down at sQind-1
        const data=[...questions];
        data[index].questionId = index+1;
        data[index+1].questionId = index; 
        console.log(data.sort((sq1, sq2) => sq1.questionId - sq2.questionId))
        setQuestions(data.sort((sq1, sq2) => sq1.questionId - sq2.questionId));
    }

    const handleRemoveQuestion = (sQind) =>
    {   
        const data = [...questions]
        data.splice(sQind, 1)
        for (let i=0; i<data.length; i++)
        {
            data.questionId=i;
        }
        setQuestions(data);
    }

    const handleTitleChange= (event) =>
    {
        setTitle(event.target.value)
        setErrTitle(event.target.value.trim().length==0)
    }
    const handleSubmitNewSurvey =(event) =>{
        event.preventDefault();
        //Check that the title has been inserted and that there is at least one question inserted
        if (errTitle) return;
        if (title.trim().length==0) 
            {
                setErrTitle(true);
                return;
            }
        if (questions.length<1)
         {setErrNumQuestion(true)
         return;}
        
        //All good here, submit the survey
        props.insertNewSurvey(title, questions, props.adminUsername);

        history.goBack()
    }

    return <Container>
        <Card>
            <Card.Header >
                {/*Title of the survey */}
                <Card.Title className="text-center" >New Survey</Card.Title>
                <Row>
                    <Form.Label column sm="2"  className="insertTitle">Title:</Form.Label>
                    <Col sm="8">
                        <Form.Control type="title" isInvalid={errTitle} placeholder="Enter title" onChange={handleTitleChange} />
                        <Form.Control.Feedback type="invalid">
                            Please insert the title.
                        </Form.Control.Feedback>
                    </Col>
                </Row>

            </Card.Header>

            <Card.Body>

                <>Questions: </>
                { errNumQuestion? <Alert variant="danger">Insert at least one question to submit the survey</Alert> : <></>}

                {questions.sort((sq1, sq2) => sq1.questionId - sq2.questionId)
                    .map((sQ, sQind) => {
                        return <QuestionRow key={sQind} 
                                            sQ={sQ} sQind={sQind} 
                                            questions={questions} 
                                            handleQuestionMoveUp={handleQuestionMoveUp} 
                                            handleQuestionMoveDown={handleQuestionMoveDown} 
                                            handleRemoveQuestion={handleRemoveQuestion}/>

                    })}

                <Row>
                    <AddQuestionButtonModal submitQuestion={handleAddQuestion} />
                </Row>

            </Card.Body>
            <Card.Footer>

                {/* submit button */}
                <Button variant="info"  className="btn btn-success btn-lg " onClick={handleSubmitNewSurvey} >
                    Submit the survey
                </Button>
                {/**TODO ADD a discard buytton?? */}


            </Card.Footer>
        </Card>

    </Container>
}

function QuestionRow(props)
{
   return <> <Container fluid id="questionRow"><Row >
                            <Col sm="10">
                                {props.sQ.chiusa ? /* closed Question */
                                    <ClosedQuestion
                                        surveyQuestion={props.sQ}
                                        key={"question" + props.sQind}
                                        questionIndex={props.sQind} />

                                    : <OpenQuestion
                                        surveyQuestion={props.sQ}
                                        key={"question" + props.sQind}
                                        questionIndex={props.sQind}
                                    />}

                            </Col>
                            <Col id="bottoni" >
                                <Button key={"buttonUp"+props.sQind} variant="outline-secondary" disabled={props.sQind==0} onClick={()=> props.handleQuestionMoveUp(props.sQind)}>
                                    <FaArrowUp fill="black"/>
                                </Button>
                                <Button  key={"buttonDown"+props.sQind} variant="outline-secondary" disabled={props.sQind==props.questions.length-1} onClick={()=> props.handleQuestionMoveDown(props.sQind)}>
                                    <FaArrowDown fill="black"/>
                                </Button>
                                <Button  key={"remove"+props.sQind} variant="outline-secondary"onClick={()=> props.handleRemoveQuestion(props.sQind)}>
                                    <RiDeleteBin5Fill fill="black"/>
                                </Button>
                            </Col>
                        </Row>
                        </Container>
                        </>
}

function AddQuestionButtonModal(props) {
    const [show, setShow] = useState(false)
    const [questionText, setQuestionText] = useState(" ");
    const [numAnswers, setNumAnswers] = useState("1");
    const [max, setMax] = useState("0");
    const [min, setMin] = useState("0");
    const [chiusa, setChiusa] = useState(false);
    const [obbligatoria, setObbligatoria] = useState(false);
    const [possibleAnswers, setPossibleAnswers] = useState([""]); //already inserted the first (mandatory) possible answer
    const [errText, setErrText] = useState(false);
    const [errPossibleAnswers, setErrPossibleAnswers] = useState([true]) //already inserted the value for the first answer

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChooseTypeOfQuestion = (event) => {
        if (event.target.id == "radio-openQuestion")
            setChiusa(false)
        else
            setChiusa(true)
    }

    const handleNumAnswersChange = (event) => {
        event.preventDefault();
        const newValue = parseInt(event.target.value)
        setNumAnswers(newValue);


        if (newValue > 10 || newValue < 1) //Error: numAnswers not valid 
        {
            if (newValue < 0) //Reset possible answers
            {
                setPossibleAnswers([]);
                setErrPossibleAnswers([]);
            }
            return;
        }

        const data = []
        const err = []
        if (newValue <= possibleAnswers.length) //The numAnswers has been decreased. I keep the first answers and delete the latest ones
        {
            for (let i = 0; i < event.target.value; i++) {
                data.push(possibleAnswers[i]);
                err.push(errPossibleAnswers[i])
            }

            setPossibleAnswers(data);
            setErrPossibleAnswers(err);
        }
        else //The numAnswers has been increased of event.target.value- possibleAnswers.length answers. I keep the first answers and add new ones
        {
            for (let i = 0; i < event.target.value - possibleAnswers.length; i++) {
                data.push("");
                err.push(true);
            }
            setPossibleAnswers(possibleAnswers.concat(data));
            setErrPossibleAnswers(errPossibleAnswers.concat(err))
        }
    }


    const handleAddedTextPossibleAnswer = (event, index) => {

        let data = []
        let err = []
        for (let i = 0; i < possibleAnswers.length; i++) {
            if (i == index) {
                data.push(event.target.value);
                err.push(event.target.value.trim().length == 0);
            }
            else {
                data.push(possibleAnswers[i]);
                err.push(errPossibleAnswers[i]);
            }
        }
        setPossibleAnswers(data);
        setErrPossibleAnswers(err);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        //check errors

        if ((numAnswers > 10) || (numAnswers < 1) || (max > numAnswers) || (max < min) || (min < 0)) //One or more fields invalid
        {
            console.log("errori nei tre cammpi")
            return;
        }
        if (questionText.trim().length == 0) //Text of the question missing
        {
            setErrText(true);
            return;
        }

        if (chiusa && errPossibleAnswers.filter(err => err == true).length != 0) //one of the answers has not been filled in
        {
            return
        }


        //Question format: { questionId: , surveyId:, chiusa: , min:, max:, obbligatoria:, question: , answers: },
        //surveyId and questionId will be set from the component above.
        const newQuestion = { questionId: -1, surveyId: -1, chiusa: chiusa, min: min, max: max, obbligatoria: obbligatoria, question: questionText, answers: possibleAnswers.join("_") }
        props.submitQuestion(newQuestion);
        handleClose();
    }

    const handleTextChange = (event) => {
        setQuestionText(event.target.value)
        if (event.target.value.trim().length == 0)
            setErrText(true)
        if (errText && event.target.value.trim().length != 0)
            setErrText(false)
    }



    return <>
        <Button variant="success" size="lg" className="fixed-left-bottom" onClick={handleShow}>
            + Add question
        </Button>
        <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>New Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/** CHOOSE BETWEEN CLOSE AND OPEN */}
                <Form.Group as={Row} onChange={handleChooseTypeOfQuestion}>
                    <Form.Label as="legend" column sm={5}>
                        Choose type of question:
                    </Form.Label>
                    <Col sm={6}>

                        <Form.Check
                            type='radio'
                            name='typeOfQuestion'
                            id="radio-closeQuestion"
                            key="radio-closeQuestion"
                            label={"Close"}
                        />
                        <Form.Check
                            type='radio'
                            name='typeOfQuestion'
                            id={`radio-openQuestion`}
                            key="radio-OpenQuestion"
                            label={"Open"}
                            defaultChecked
                        />

                    </Col>
                </Form.Group>
                {/** TEXT OF THE QUESTION */}

                <Form.Group as={Row} controlId="textOfQuestion">
                    <Form.Label column sm={5} required>
                        Text of the question
                    </Form.Label>
                    <Col sm={7}>
                        <Form.Control as="textarea" isInvalid={errText} type="text" placeholder="text" onChange={handleTextChange} />
                        <Form.Control.Feedback type="invalid">Required field</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                {/* IN CASE ITS BEEN SELECTED OPEN QUESTION           */}
                {
                    !chiusa ?
                        /** Obbligatoria? */
                        <Form.Check
                            type='checkbox'
                            name='obbligatoria'
                            key="obbligatoria"
                            id={`radio-MandatoryQuestion`}
                            label={"Is the answer mandatory?"}
                            onChange={(ev) => setObbligatoria(ev.target.checked)}
                        />
                        :

                        /* IN CASE ITS BEEN SELECTED CloSED QUESTION QUESTION           */
                        /** Its a closed Question => specify number of possible answers, minimum answer to give, maximum number to give */
                        <>
                            <FormGroup >
                                <Row>
                                    <Col sm={5} >
                                        <Form.Label>
                                            Number of possible answers:
                                        </Form.Label>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Control key={"numAnswersCheckbox"}
                                            type="number"
                                            placeholder="Tot"
                                            id="tot"
                                            key="tot"
                                            value={numAnswers}
                                            isInvalid={((numAnswers > 10) || (numAnswers < 1))}
                                            onChange={handleNumAnswersChange} />
                                    </Col>
                                    <Col sm={5} >
                                        <Form.Text muted>
                                            It must be at least one and less than 10.
                                        </Form.Text>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col sm={5}>
                                        <Form.Label >
                                            Maximum number of answers to select:
                                        </Form.Label>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Control type="number"
                                            placeholder="max"
                                            value={max}
                                            id="max"
                                            key="max"
                                            isInvalid={((max > numAnswers) || (max < min))}
                                            onChange={(event) => setMax(parseInt(event.target.value))} />
                                    </Col>
                                    <Col sm={5} >
                                        <Form.Text muted>
                                            It can't exceed the total of answers and must be greater than the minimum.
                                        </Form.Text>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col sm={5}>
                                        <Form.Label >
                                            Mininum number of answers to select:
                                        </Form.Label>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Control type="number"
                                            placeholder="min"
                                            id="min"
                                            key="min"
                                            value={min}
                                            isInvalid={((min > max) || (min < 0))}
                                            onChange={(event) => setMin(parseInt(event.target.value))} />
                                    </Col>
                                    <Col sm={5} >
                                        <Form.Text muted>
                                            It can't exceed the maximum and must be positive.
                                        </Form.Text>
                                    </Col>

                                </Row>


                                {possibleAnswers.length > 0 ?
                                    <Row>
                                        <Form.Label as="legend" column sm={6}>
                                            Possible Answers:
                                        </Form.Label>
                                    </Row> : <></>}
                                {possibleAnswers.map((an, index) =>

                                    <InputGroup className="mb-3" key={"possibleAnswer" + index}>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroup-sizing-sm">-</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl as="textarea"
                                            key={"possibleAnswer" + index}
                                            id={"possibleAnswer" + index}
                                            rows={1}
                                            isInvalid={errPossibleAnswers[index]}
                                            onChange={(event) => handleAddedTextPossibleAnswer(event, index)}

                                        />
                                        <Form.Control.Feedback type="invalid">Required field</Form.Control.Feedback>
                                    </InputGroup>
                                )
                                }
                            </FormGroup>
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