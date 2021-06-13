import { Navbar, Button, Nav } from "react-bootstrap";
import { BsBoxArrowInLeft, BsBoxArrowInRight, BsFillQuestionSquareFill} from "react-icons/bs";
import { Link } from 'react-router-dom';





function MyLogInButton(props)
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

  return <Button variant="warning" onClick={props.doLogOut}>
          <BsBoxArrowInLeft
              className="ml-3"
              size= "30"
              fill="black"
        />
          Log out
        </Button>

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
          {props.loggedIn? <MyLogOutButton doLogOut={props.doLogOut}/> : <MyLogInButton/>}
        </Nav.Item>
      </Nav>
    </Navbar>
  
</>
  );
    
  
}

export default MyNavbar;
