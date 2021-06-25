import { Navbar, Button, Nav, OverlayTrigger, Popover } from "react-bootstrap";
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
            <Button variant="warning">
              <BsBoxArrowInRight
                  className="ml-3"
                  size= "30"
                  fill="black"
              /> 
            Log in as administrator
          </Button>
        </OverlayTrigger>
}



function MyLogInButton2(props)
{
  return <Link to="/login">
            <Button variant="warning">
              <BsBoxArrowInRight
                  className="ml-3"
                  size= "30"
                  fill="black"
              /> 
            Log in as administrator
          </Button>
        </Link>
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
          <Button variant="warning">
          <BsBoxArrowInLeft
              className="ml-3"
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

    <Navbar bg="warning" variant="light" >
      { /* <Navbar.Toggle aria-controls="left-sidebar" onClick={this.showSidebar}/> 
      <Navbar.Toggle aria-controls="left-sidebar"/>*/}
      <Navbar.Brand href="/" className="col-9">
        <BsFillQuestionSquareFill className="mr-1 px-1" size="30" /> My Online Surveys
      </Navbar.Brand>
      
      <Nav className="col-3">
        <Nav.Item >
          {props.loggedIn? <MyLogOutButton logout={props.doLogOut}/> : <MyLogInButton login={props.doLogIn}/>}
        </Nav.Item>
      </Nav>
    </Navbar>
  
</>
  );
    
  
}

export default MyNavbar;
