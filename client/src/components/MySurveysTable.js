import { Table, Row, Button} from "react-bootstrap";
import { RiSurveyLine} from "react-icons/ri";
import { PersonCircle, CheckAll  } from 'react-bootstrap-icons';


function MyFillInButton(props)
{
    return <Button variant="light">
        <RiSurveyLine
          size="20"
          fill="black"
    />
    </Button>

}  
function MySurveysTable(props) {
    return <>
    <Row className="px-3">
        In the following table are shown all the available surveys:
    </Row>
    
    <Table striped   >
    <thead>
      <tr>
        <th>Survey title</th>
        <th>Owner</th>
        <th>Date</th>
        <th>    </th>

      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Patti mangia pasta al pesto</th>
        <th>PattiDeGiu</th>
        <th>07/06/2021</th>
        <th><MyFillInButton/></th>
      </tr>
      <tr>
        <th>Walter problema pubblico</th>
        <th>GiuliaD</th>
        <th>03/06/2021</th>
        <th><MyFillInButton/></th>
      </tr>
      <tr>
        <th>CPD applicazioni web</th>
        <th>GiuliaD</th>
        <th>03/06/2021</th>
        <th><MyFillInButton/></th>
      </tr>
    </tbody>
  </Table>

  </>

  
    
  
}

export default MySurveysTable;
