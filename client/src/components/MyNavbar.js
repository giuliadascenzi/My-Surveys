import { Navbar, Button, Nav, OverlayTrigger, Popover, Container } from "react-bootstrap";
import { BsBoxArrowInLeft, BsBoxArrowInRight, BsFillQuestionSquareFill} from "react-icons/bs";
import { Link } from 'react-router-dom';
import { LogInForm, LogOutForm } from "./LogForms";


function MyLogInButton(props)
{ const popover = (
  <Popover id="popover-login">
    <Popover.Title as="h3">Log in as an admin</Popover.Title>
    <Popover.Content>
      <LogInForm login={props.login}/>
    </Popover.Content>
  </Popover>
);

  return <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose={true}>
            <Button size="lg"id="log_button">
              <BsBoxArrowInRight
                  size= "30"
                  fill="black"
                  className = "pe-3"
              /> 
             Log in 
          </Button>
        </OverlayTrigger>
}





function MyLogOutButton(props) {
  const popover = (
    <Popover id="popover-login">
      <Popover.Title as="h3">Log out</Popover.Title>
      <Popover.Content>
        <LogOutForm logout={props.logout}/>
      </Popover.Content>
    </Popover>
  );
  
  return <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose={true} >
          <Button size="lg" id="log_button">
          <BsBoxArrowInLeft
              size= "30"
              fill="black"
        />
          Log out
        </Button>
        </OverlayTrigger>

}

function MyNavbar(props) {
  /* Navbar */
  return (
<>
  <Container fluid id="navbar_container">
    <Navbar bg="warning" variant="dark"  id="navbar">
      <Navbar.Brand href="/" className="col-9">
        <BsFillQuestionSquareFill className="mr-1" className="border-dark" size="35" fill="white"/> My Online Surveys
      </Navbar.Brand>
      
      <Nav className="col-3">
      <Container fluid className="justify-content-md-end">
        <Nav.Item >
          {props.loggedIn? <MyLogOutButton logout={props.doLogOut}/> : <MyLogInButton login={props.doLogIn}/>}
        </Nav.Item>
        </Container>
      </Nav>
    </Navbar>
  </Container>
  
</>
  );
    
  
}

export default MyNavbar;
