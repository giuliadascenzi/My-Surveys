import { Navbar, Form, FormControl, Button, Nav } from "react-bootstrap";
import { BsCheckAll, BsFillPersonFill, BsBoxArrowInRight, BsFillQuestionSquareFill} from "react-icons/bs";


function MyLogo(props) {

  return <BsCheckAll
    width="50"
    height="50"
    viewBox="0 0 16 16"
    fill="currentColor"
  />

}

function MyUserIcon(props) {

  return <BsBoxArrowInRight
    width="60"
    height="60"
    viewBox="0 0 16 16"
    fill="black"
  />

}


function MyLogInButton(props)
{
  return <Button variant="warning">
          <BsBoxArrowInRight
              className="mr-3 ml-3"
              size= "30"
              fill="black"
        /> 
        Log in as administrator
        </Button>
}


function MyLogOutIcon(props) {

  return <BsBoxArrowInRight
  width="60"
  height="60"
  viewBox="0 0 16 16"
    fill="black"
  />

}

function MyNavbar(props) {
  /* Navbar */
  return (
<>

    <Navbar bg="warning" variant="light" >
      { /* <Navbar.Toggle aria-controls="left-sidebar" onClick={this.showSidebar}/> 
      <Navbar.Toggle aria-controls="left-sidebar"/>*/}
      <Navbar.Brand href="/" className="col-10">
        <BsFillQuestionSquareFill className="mr-1 px-1" size="30" /> My Online Surveys
      </Navbar.Brand>
      
      <Nav className="col-2">
        <Nav.Item>
          <MyLogInButton/>
        </Nav.Item>
      </Nav>
    </Navbar>
  
</>
  );
    
  
}

export default MyNavbar;
