import { Navbar,  Nav, Container } from "react-bootstrap";
import { BsFillQuestionSquareFill} from "react-icons/bs";
import {  MyLogInButton, MyLogOutButton } from "./LogForms";



function MyNavbar(props) {
  /* Navbar */
  return (
<>
  <Container fluid id="navbar_container">
    <Navbar bg="warning" variant="dark"  id="navbar">
      <Navbar.Brand href="/" className="col-9">
        <BsFillQuestionSquareFill className="mr-1" size="35" fill="white"/> My Online Surveys
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
