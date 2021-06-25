import { Form, Button, Container, Row} from 'react-bootstrap';
import { useState } from 'react';
//import { Redirect } from 'react-router';




function LogInForm(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  
  const handleSubmit = (event) => {

    // stop event default and propagation
    event.preventDefault();
    event.stopPropagation(); 

    const form = event.currentTarget; 

    // check if form is valid using HTML constraints
    if (!form.checkValidity()) { 
        // errors
        setValidated(true); // enables bootstrap validation error report
        console.log("no");
    } else {
        console.log("si");
        const credentials = { username, password };

        props.login(credentials);
    }

    
  };

  return (
    <Container fluid style={{width:"100%"}}>
      <Form noValidate validated={validated} onSubmit={handleSubmit} id="log_in_form">
        <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='username' value={username} onChange={ev => setUsername(ev.target.value)} required  />
            <Form.Control.Feedback type="invalid">
               Insert username
            </Form.Control.Feedback>
        
        </Form.Group>
        <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value) } required minLength="6"/>
            <Form.Control.Feedback type="invalid">
                Invalid number of digits
            </Form.Control.Feedback>
        </Form.Group>
        <Button variant="success" type="submit" form="log_in_form">Login</Button>
      </Form>
    </Container>)
}


function LogOutForm(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  
  const handleSubmit = (event) => {

    // stop event default and propagation
    event.preventDefault();
    event.stopPropagation(); 

    const form = event.currentTarget; 

    // check if form is valid using HTML constraints
    if (!form.checkValidity()) { 
        // errors
        setValidated(true); // enables bootstrap validation error report
        console.log("no");
    } else {
        console.log("si");
        const credentials = { username, password };

        props.login(credentials);
    }

    
  };

  return ( <Container>
          <Form>
        <Form.Text as={Row }>Are you sure you want to log out? </Form.Text>
        <Form.Text as={Row}>Any unsaved work will be lost.</Form.Text>
       <Button as={Row} variant="success" onClick={props.logout} >Logout</Button>
       </Form>
      </Container>
  )
}


export {LogInForm, LogOutForm};