import { Form, Modal, Button, Card, Row, Col, Container, FormGroup, InputGroup, FormControl, Spinner, Alert } from "react-bootstrap";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import { RiDeleteBin5Fill, RiDownload2Fill } from "react-icons/ri";
import { OpenQuestion } from './OpenQuestion.js';
import { ClosedQuestion } from './ClosedQuestion.js';
import { IoIosReturnLeft, IoIosWarning } from "react-icons/io";


function CreateNewSurvey(props) {

    const [title, setTitle] = useState(""); //title of the survey
    const [errTitle, setErrTitle] = useState(false); //If the title is empty
    const [errNumQuestion, setErrNumQuestion] = useState(false); //If the admin want to submit a survey with no question
    const [errMessage, setErrMessage] = useState(""); //To notify errors
    const [questions, setQuestions] = useState([]); //Array with all the questions inserted
    const [waiting, setWaiting] =useState(false); 

    let history = useHistory();

    /**
     * Function to append a question to the collection of questions of the survey
     * @param {*} question question to add to the survey
     */
    const handleAddQuestion = (question) => {

        if (errNumQuestion) setErrNumQuestion(false)
        if (errMessage !== "") setErrMessage("")

        //Set the questionId (incremental) 
        question.questionId = questions.length;
        // Instead the surveyId stays -1 because it is a temporaneous surveyId, when it will be inserted in the db, the db will assign it a real surveyId
        setQuestions([...questions, question]);
    }

    /**
     * Moves a question up
     * @param {*} index index of the question that must move up
     */
    const handleQuestionMoveUp = (index) => {
        //The question up need to go down and the question at index need to go at sQind-1
        const data = [...questions];
        data[index].questionId = index - 1; //Change the questionIds because its what set the order in the visualization of the survey
        data[index - 1].questionId = index;
        setQuestions(data.sort((sq1, sq2) => sq1.questionId - sq2.questionId));

    }

    /**
     * Moves a question down
     * @param {*} index index of the question that must move down
     */
    const handleQuestionMoveDown = (index) => {
        //The question down need to go up and the question at position [index] need to down at sQind-1
        const data = [...questions];
        data[index].questionId = index + 1;
        data[index + 1].questionId = index;
        setQuestions(data.sort((sq1, sq2) => sq1.questionId - sq2.questionId));
    }


    /**
     * Removes one question
     * @param {*} sQind index of the question to remove 
     */
    const handleRemoveQuestion = (sQind) => {
        const data = [...questions]
        data.splice(sQind, 1)
        for (let i = 0; i < data.length; i++) {
            data.questionId = i; //Change all the other surveyId to be consistent to the new number of questions
        }
        setQuestions(data);
    }

    //Set title when changes
    const handleTitleChange = (event) => {
        setTitle(event.target.value)
        setErrTitle(event.target.value.trim().length === 0) //When title is empty
        setErrMessage("");
    }

    //submit the survey
    const handleSubmitNewSurvey = (event) => {
        event.preventDefault();
        //Check that the title has been inserted and that there is at least one question inserted
        if (errTitle) {
            setErrMessage("Errors to fix")
            return;
        }
        if (title.trim().length === 0) {
            setErrMessage("Errors to fix")
            setErrTitle(true);
            return;
        }
        if (questions.length < 1) {
            setErrNumQuestion(true);
            setErrMessage("Errors to fix");
            return;
        }

        //All good here, submit the survey
        setWaiting(true); //waiting for the db
        props.insertNewSurvey(title, questions, props.adminUsername)
            .then(()=> setWaiting(false)) 
            .then(() => history.goBack())
            .catch(() => { 
                setWaiting(false);
                setErrMessage("Sorry, it has not been possible to insert the survey. Try again later.") });


    }

    return <Container id="survey_container">
        <Card>
            <Card.Header >
                {/*Title of the survey */}
                <Card.Title as="h3" className="text-center font-weight-bold" >New Survey</Card.Title>
                <Row>
                    <Form.Label column sm="2" className="font-weight-bold" >Title:</Form.Label>
                    <Col sm="8">
                        <Form.Control type="title" isInvalid={errTitle} placeholder="Enter title" onChange={handleTitleChange} />
                        <Form.Control.Feedback type="invalid">
                            Please insert the title.
                        </Form.Control.Feedback>
                    </Col>
                </Row>

            </Card.Header>

            <Card.Body>

                <Container fluid id="new_survey_questions" className="ps-15">

                    <Row as="h6" className="font-weight-bold">Questions: </Row>
                    {errNumQuestion ? <Row as="h6" className="text-danger font-weight-bold">Insert at least one question!</Row> : <></>}
                    {questions.length === 0 && !errNumQuestion ? <Row as="h6">Insert at least one question</Row> : <></>}


                    {questions.sort((sq1, sq2) => sq1.questionId - sq2.questionId)
                        .map((sQ, sQind) => {
                            return <QuestionRow key={sQind}
                                sQ={sQ} sQind={sQind}
                                questions={questions}
                                handleQuestionMoveUp={handleQuestionMoveUp}
                                handleQuestionMoveDown={handleQuestionMoveDown}
                                handleRemoveQuestion={handleRemoveQuestion} />

                        })}

                    <Row>
                        <AddQuestionModal submitQuestion={handleAddQuestion} /> {/** Modal to add a new question */}
                    </Row>
                </Container>
            </Card.Body>

            <Card.Footer>
                <Container className="d-flex flex-column">
                    {/** Eror message if present */}
                    {errMessage.length !== 0 ? <Alert variant="danger"><IoIosWarning fill="#920c19" size="30" className="mx-1" />{errMessage}</Alert> : <></>}
                </Container>

                <Container className="d-flex justify-content-between">
                    {/** Discard button */}
                    <Button variant="secondary" size="lg" onClick={() => history.goBack()}>
                        <IoIosReturnLeft />Discard
                    </Button>
                    {/** Waiting spinner */}
                    {waiting? <Spinner animation="border" role="status" variant="primary"></Spinner> : <></>}
                    {/** Submit button */}
                    <Button variant="custom" size="lg" onClick={handleSubmitNewSurvey} >
                        <RiDownload2Fill /> Submit the survey
                    </Button>
                </Container>

            </Card.Footer>
        </Card>

    </Container >
}

/**
 * Component that show one question of the survey's ones. 
 */
function QuestionRow(props) {
    return <>
            <Row >
            <Container className="d-flex justify-content-between" key={props.sQind} >
            <Col sm={9}>
            <Container  fluid id="questionRow">
                {props.sQ.chiusa ? /* closed Question */
                    <ClosedQuestion
                        surveyQuestion={props.sQ}
                        key={"question" + props.sQind}
                        questionIndex={props.sQind} />

                    : /* open Question */
                    <OpenQuestion
                        surveyQuestion={props.sQ}
                        key={"question" + props.sQind}
                        questionIndex={props.sQind}
                    />}
              </Container>
            </Col>
            <Col id="bottoni" >
              <Container className="d-flex justify-content-end">
                {/** Up button */}
                <Button key={"buttonUp" + props.sQind} variant="outline-secondary" disabled={props.sQind === 0} onClick={() => props.handleQuestionMoveUp(props.sQind)}>
                    <FaArrowUp fill="black" />
                </Button>
                {/** Down button */}
                <Button key={"buttonDown" + props.sQind} variant="outline-secondary" disabled={props.sQind === props.questions.length - 1} onClick={() => props.handleQuestionMoveDown(props.sQind)}>
                    <FaArrowDown fill="black" />
                </Button>
                {/** Remove button */}
                <Button key={"remove" + props.sQind} variant="outline-secondary" onClick={() => props.handleRemoveQuestion(props.sQind)}>
                    <RiDeleteBin5Fill fill="black" />
                </Button>
            </Container>
            </Col>
      </Container>
      </Row>
    </>
}

//Modal to add a new question
function AddQuestionModal(props) {
    const [show, setShow] = useState(false)
    const [questionText, setQuestionText] = useState(" "); //Text of the question
    const [numAnswers, setNumAnswers] = useState("1"); //Num of the possible answers (In case of closed question)
    const [max, setMax] = useState("0"); //Max of selected answers
    const [min, setMin] = useState("0"); //Min of selected answers
    const [chiusa, setChiusa] = useState(false);  //Boolean, closed or opened question?
    const [obbligatoria, setObbligatoria] = useState(false); //In case of open question says if its mandatory the answer
    const [possibleAnswers, setPossibleAnswers] = useState([""]); //already inserted the first (mandatory) possible answer

    const [errText, setErrText] = useState(false); //When the text is empty
    const [errPossibleAnswers, setErrPossibleAnswers] = useState([true]) //true if the answer has an empty text, false otherwise. Already inserted the value for the first answer
    const [errMessage, setErrMessage] = useState("")
    const [submitted, setSubmitted] = useState(false); //Set only when clicking the first time submit, if there are errors in the form they will be shown.

    //Close of the modal
    const handleClose = () => {
        setShow(false);
        //reset everything
        setQuestionText(" ");
        setNumAnswers("1");
        setMax("0");
        setMin("0");
        setChiusa(false);
        setObbligatoria(false);
        setPossibleAnswers([""]);
        setErrText(false)
        setErrPossibleAnswers([true]);
        setErrMessage("");
        setSubmitted(false);
    }

    //Show of the modal
    const handleShow = () => setShow(true);

    //To set if the question is closed or opened.
    const handleChooseTypeOfQuestion = (event) => {
        if (event.target.id === "radio-openQuestion")
            setChiusa(false)
        else
            setChiusa(true)
    }

    //To set the number of possible answers (in case of closed question)
    const handleNumAnswersChange = (event) => {
        event.preventDefault();
        
        const newValue = parseInt(event.target.value)
        setNumAnswers(newValue);
        setErrMessage("");


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

    //To record the change of the text of a possible answer (in case of closed question)
    const handleAddedTextPossibleAnswer = (event, index) => {

        let data = []
        let err = []
        for (let i = 0; i < possibleAnswers.length; i++) {
            if (i === index) {
                data.push(event.target.value); 
                err.push(event.target.value.trim().length === 0); //If the text is an empty string the error is set to true
            }
            else {
                data.push(possibleAnswers[i]);
                err.push(errPossibleAnswers[i]);
            }
        }

        setPossibleAnswers(data);
        setErrPossibleAnswers(err);
        setErrMessage("");
    }

    //To set the text of the question
    const handleTextChange = (event) => {
        setQuestionText(event.target.value)
        if (event.target.value.trim().length === 0) //Text is an empty string
            setErrText(true)
        if (errText && event.target.value.trim().length !== 0) //It used to be an empty string but now is not
            setErrText(false)
        setErrMessage("");
    }

    //Submit the question
    const handleSubmit = (event) => {

        event.preventDefault();
        setSubmitted(true);

        //check errors

        if ((numAnswers > 10) || (numAnswers < 1) || (max > numAnswers) || (max < min) || (min < 0)) //One or more fields invalid
        {
            setErrMessage("Errors to fix")
            return;
        }
        if (questionText.trim().length === 0) //Text of the question missing
        {
            setErrMessage("Errors to fix")
            setErrText(true);
            return;
        }

        if (chiusa && errPossibleAnswers.filter(err => err === true).length !== 0) //one of the answers has not been filled in
        {
            setErrMessage("Errors to fix")
            return
        }


        //Question format: { questionId: , surveyId:, chiusa: , min:, max:, obbligatoria:, question: , answers: },
        //surveyId and questionId will be set from the component above.
        const newQuestion = { questionId: -1, surveyId: -1, chiusa: (chiusa ? 1 : 0), min: min, max: max, obbligatoria: (obbligatoria ? 1 : 0), question: questionText, answers: possibleAnswers.join("_") }
        props.submitQuestion(newQuestion);
        handleClose();
    }




    return <>
        {/** Add question button. It shows the modal */}
        <Button variant="success" size="md" className="my-2" onClick={handleShow}>
            <FaPlus />  Add
        </Button>
        {/** Modal */}
        <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title className="font-weight-bold">NEW QUESTION</Modal.Title>
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
                        Text of the question:
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

                        /* IN CASE ITS BEEN SELECTED ClOSED QUESTION QUESTION           */
                        /** Its a closed Question => specify number of possible answers, minimum answers to give, maximum answers to give */
                        <>
                            <FormGroup >
                                {/** Tot of answers given */}
                                <Row className="my-2">
                                    <Col sm={5} >
                                        <Form.Label>
                                            Number of answers:
                                        </Form.Label>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Control key={"numAnswersCheckbox"}
                                            type="number"
                                            placeholder="Tot"
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
                                
                                {/** Maximum number of answers to select */}
                                <Row className="my-2">
                                    <Col sm={5} >
                                        <Form.Label >
                                            Maximum number of answers to select:
                                        </Form.Label>
                                    </Col>
                                    <Col sm={2} >
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

                                {/** Minimum number of answers to select */}
                                <Row className="my-2">
                                    <Col sm={5}>
                                        <Form.Label >
                                            Mininum number of answers to select:
                                        </Form.Label>
                                    </Col>
                                    <Col sm={2} >
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

                                {/** SELECTABLE ANSWERS: */}

                                {possibleAnswers.length > 0 ? //There are at least one answer to show
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
                                        {/**Input field to specify the text of the answer*/}
                                        <FormControl as="textarea"
                                            key={"possibleAnswer" + index}
                                            id={"possibleAnswer" + index}
                                            rows={1}
                                            isInvalid={submitted && errPossibleAnswers[index]} //It show the error if present only after the user has tried to submit it
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
                {/** Error message if present */}
                <Container className="d-flex flex-column">
                    {errMessage.length !== 0 ? <Alert variant="danger"><IoIosWarning fill="#920c19" size="30" className="mx-1" />{errMessage}</Alert> : <></>}
                </Container>
                
                <Container className="d-flex justify-content-between">
                    {/** Discard button */}
                    <Button variant="secondary" size="lg" onClick={handleClose}>
                        Discard
                    </Button>
                    {/** Add button */}
                    <Button variant="success" size="lg" onClick={handleSubmit}>
                        Add question
                    </Button>
                </Container>
            </Modal.Footer>
        </Modal>
    </>


}


export default CreateNewSurvey;