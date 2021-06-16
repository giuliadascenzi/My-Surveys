import { Form, Modal, Button, Card, Row, Col, Container, FormGroup, InputGroup, FormControl } from "react-bootstrap";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FcSearch, FcPlus } from "react-icons/fc";
import { ImClipboard, ImPencil2 } from "react-icons/im";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { OpenQuestion } from './OpenQuestion.js';
import { ClosedQuestion } from './ClosedQuestion.js';


function CreateNewSurvey(props) {
    const [title, setTitle] = useState();
    const [questions, setQuestions] = useState([{ questionId: 3, surveyId: 0, chiusa: 1, min: 0, max: 3, obbligatoria: -1, question: "Top 3 dei tuoi piatti preferiti", answers: "Lasagna_Pizza_Sushi_Hamburger_Frittata_Paella" },
    ]);
    const handleAddQuestion = (question) => {
        console.log("quesion added");
        /**TODO: aggiornare l'id della question e del survey */
        setQuestions([...questions, question]);
    }
    return <Container>
        <Card>
            <Card.Header >
                {/*Title of the survey */}
                <Card.Title className="text-center" >New Survey</Card.Title>
                <Row>
                    <Form.Label column sm="2" className="insertTitle">Title:</Form.Label>
                    <Col sm="8">
                        <Form.Control type="title" placeholder="Enter title" required onChange={(event) => setTitle(event.target.value)} />
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
                        if (sQ.chiusa) /* closed Question */
                            return <ClosedQuestion
                                surveyQuestion={sQ}
                                key={sQ.questionId}
                                questionIndex={sQind}
                            />
                        else                /* open Question */
                            return <OpenQuestion
                                surveyQuestion={sQ}
                                key={sQ.questionId}
                                questionIndex={sQind}
                            />
                    })}
                <Row>
                    <AddQuestionButton submitQuestion={handleAddQuestion} />
                </Row>

            </Card.Body>
        </Card>

    </Container>
}


function AddQuestionButton(props) {
    const [show, setShow] = useState(false)
    const [questionText, setQuestionText] = useState();
    const [numAnswers, setNumAnswers] = useState("1");
    const [max, setMax] = useState("0");
    const [min, setMin] = useState("0");
    const [chiusa, setChiusa] = useState(true);
    const [obbligatoria, setObbligatoria] = useState(false);
    const [possibleAnswers, setPossibleAnswers] = useState([""]);
    const [err, setErr] = useState({ numAnswers: false, min: false, max: false, questionText: false})

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChooseTypeOfQuestion = (event) => {
        console.log(event.target.id);
        if (event.target.id == "radio-openQuestion")
            setChiusa(false)
        else
            setChiusa(true)
    }
    const handleNumAnswersChange = (event) => {
        const newValue=parseInt(event.target.value)

        setNumAnswers( newValue)

        if ( newValue > 10 ||  newValue < 1) //Error: numAnswers not valid 
        { 
            if (!err.numAnswers)
                setErr({ numAnswers: true, min: err.min, max: err.max, questionText: err.questionText });
            if ( newValue < 0)
                setPossibleAnswers([]);
            return;
        }

        else //ValidNumber, if err.numAnswer is set, change it
        {
            if (err.numAnswers)
                setErr({ numAnswers: false, min: err.min, max: err.max, questionText: err.questionText });
        }

        const data = []
        if ( newValue <= possibleAnswers.length) //The numAnswers has been decreased. I keep the first answers and delete the latest ones
        {
            for (let i = 0; i < event.target.value; i++)
                data.push(possibleAnswers[i]);

            setPossibleAnswers(data);
        }
        else //The numAnswers has been increased of event.target.value- possibleAnswers.length answers. I keep the first answers and add new ones
        {
            for (let i = 0; i < event.target.value - possibleAnswers.length; i++)
                data.push("");
            setPossibleAnswers(possibleAnswers.concat(data));
        }
    }

    const handleMinChange = (event) => {
        const newValue=parseInt(event.target.value)
        setMin(newValue);
        if (newValue > max || newValue< 0) //Error: min not valid 
        {       
            if (!err.min)
                setErr({ numAnswers: err.numAnswers, min: true, max: err.max, questionText: err.questionText });
            return;
        }

        else //ValidNumber, if err.min is set, change it
        {
            if (err.min)
                setErr({ numAnswers: err.numAnswers, min: false, max: err.max , questionText: err.questionText});
        }

    }


    const handleMaxChange = (event) => {
        const newValue=parseInt(event.target.value)
        setMax(newValue);

        if (newValue > numAnswers || newValue< min) //Error: max not valid 
        {
            
            if (!err.max)
                setErr({ numAnswers: err.numAnswers, min: err.min, max: true, questionText: err.questionText });
            return;
        }

        else //ValidNumber, if err.max is set, change it
        {
            if (err.max)
                setErr({ numAnswers: err.numAnswers, min: err.min, max: false, questionText: err.questionText });
        }

    }
    const handleAddedTextPossibleAnswer = (event, index) => {
        let data = []
        for (let i = 0; i < possibleAnswers.length; i++) {
            if (i == index)
                data.push(event.target.value);
            else
                data.push(possibleAnswers[i]);
        }
        setPossibleAnswers(data);
    }
    const handleSubmit = (event) => {
        //{ questionId: 3, surveyId:0, chiusa: 1, min:0, max:3, obbligatoria:-1, question: "Top 3 dei tuoi piatti preferiti", answers: "Lasagna_Pizza_Sushi_Hamburger_Frittata_Paella" },
        const newQuestion = { questionId: -1, surveyId: -1, chiusa: chiusa, min: min, max: max, obbligatoria: obbligatoria, question: questionText, answers: possibleAnswers.join("_") }
        props.submitQuestion(newQuestion);
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
                <Form.Group as={Row} onChange={handleChooseTypeOfQuestion}>
                    <Form.Label as="legend" column sm={5}>
                        Choose type of question:
                    </Form.Label>
                    <Col sm={6}>

                        <Form.Check
                            type='radio'
                            name='typeOfQuestion'
                            id={`radio-closeQuestion`}
                            label={"Close"}
                            defaultChecked
                        />
                        <Form.Check
                            type='radio'
                            name='typeOfQuestion'
                            id={`radio-openQuestion`}
                            label={"Open"}
                        />

                    </Col>
                </Form.Group>
                {/** TEXT OF THE QUESTION */}

                <Form.Group as={Row} controlId="textOfQuestion">
                    <Form.Label column sm={5} required>
                        Text of the question
                    </Form.Label>
                    <Col sm={7}>
                        <Form.Control as="textarea" isInvalid={err.testo} type="text" placeholder="text" onChange={(ev) => setQuestionText(ev.target.value)} />
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
                                            isInvalid={((max > numAnswers) || (max < min))}
                                            onChange={handleMaxChange} />
                                    </Col>
                                    <Col sm={5} >
                                        <Form.Text muted>
                                            It can't exceed the total of answers.
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
                                            value={min}
                                            isInvalid={((min > max) || (min < 0))}
                                            onChange={handleMinChange} />
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

                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text key={"possAnswer" + index} id="inputGroup-sizing-sm">-</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl as="textarea"
                                            key={"possibleQuestion" + index}
                                            rows={1}
                                            onChange={(event) => handleAddedTextPossibleAnswer(event, index)}
                                            required
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