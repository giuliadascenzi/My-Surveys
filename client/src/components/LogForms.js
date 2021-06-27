import { Form, Button, Container, Row, OverlayTrigger, Popover,Alert } from 'react-bootstrap';
import { useState } from 'react';
import { BsBoxArrowInLeft, BsBoxArrowInRight } from "react-icons/bs";


function MyLogInButton(props) {
  const popover = (
    <Popover id="popover-login">
      <Popover.Title className="font-weight-bold">Log in as an admin</Popover.Title>
      <Popover.Content>
        <LogInForm login={props.login} />
      </Popover.Content>
    </Popover>
  );

  return <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose={true}>
    <Button size="lg" id="log_button">
      <BsBoxArrowInRight
        size="30"
        fill="black"
        className="pe-3"
      />
      Log in
    </Button>
  </OverlayTrigger>
}





function MyLogOutButton(props) {
  const popover = (
    <Popover id="popover-login">
      <Popover.Title className="font-weight-bold">Log out</Popover.Title>
      <Popover.Content>
        <LogOutForm logout={props.logout} />
      </Popover.Content>
    </Popover>
  );

  return <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose={true} >
    <Button size="lg" id="log_button" >
      <BsBoxArrowInLeft
        size="30"
        fill="black"
      />
      Log out
    </Button>
  </OverlayTrigger>

}

function LogInForm(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {

    // stop event default and propagation
    event.preventDefault();
    event.stopPropagation();

    setErrorMessage("");

    const form = event.currentTarget;

    // check if form is valid using HTML constraints
    if (!form.checkValidity()) {
      // errors
      setValidated(true); // enables bootstrap validation error report

    } else {
      const credentials = { username, password };

      props.login(credentials).catch( (err) => { setErrorMessage(err); } );
    }


  };

  return (
    <Container fluid style={{ width: "100%" }}>
      <Form noValidate validated={validated} onSubmit={handleSubmit} id="log_in_form">
        <Form.Group controlId='username'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='username' value={username} onChange={ev => setUsername(ev.target.value)} required />
          <Form.Control.Feedback type="invalid">
            Insert username
          </Form.Control.Feedback>

        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required minLength="6" />
          <Form.Control.Feedback type="invalid">
            Invalid number of digits
          </Form.Control.Feedback>
        </Form.Group>
        {errorMessage!=="" ? <Alert  variant="danger"> {errorMessage} </Alert> : <></>}
        <Container fluid className="d-flex justify-content-center">
        <Button variant="custom" type="submit" form="log_in_form">Login</Button>
        </Container>
      </Form>
    </Container>)
}


function LogOutForm(props) {


  return (<Container>
    <Form>
      <Form.Text as={Row}>Are you sure you want to log out? </Form.Text>
      <Form.Text as={Row}>Any unsaved work will get lost.</Form.Text>
      <Container fluid className="d-flex justify-content-center">
      <Button as={Row} variant="custom" onClick={props.logout} >Logout</Button>
      </Container>
    </Form>
  </Container>
  )
}


export { LogInForm, LogOutForm, MyLogInButton, MyLogOutButton };