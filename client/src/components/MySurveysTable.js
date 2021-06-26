import { Table, Row, Button} from "react-bootstrap";
import { RiSurveyLine} from "react-icons/ri";
import {  Link } from 'react-router-dom';
import dayjs from 'dayjs';

function MySurveysTable(props) {
    return <>

    <Row className="p-3" as="h5">
        In the following table are shown all the available surveys:
    </Row>
    
    <Table bordered variant="light" >
    <thead id="table_header">
      <tr >
        <th>Survey title</th>
        <th>Owner</th>
        <th>Date</th>
        <th>Fill in the survey</th>

      </tr>
    </thead>
    <tbody id="table_body">
      {
        props.surveysInfo.map( s =>  <SurveyRow surveyInfo={s}
                                                key={s.surveyId}/>)
      }
    </tbody>
  </Table>

  </>

  
    
  
}

function SurveyRow(props)
{
  return <>
        <tr>
        <td>{props.surveyInfo.title}</td>
        <td>{props.surveyInfo.owner}</td>
        <td>{props.surveyInfo.date? dayjs(props.surveyInfo.date).format('dddd, MMMM D, YYYY') : ""}</td>
        <td><MyFillInButton surveyId={props.surveyInfo.surveyId}/></td>
      </tr>
  </>
}


/*Clicking on this button the user gets redirect to the page where he/she can fill in the selected survey*/
function MyFillInButton(props)
{
    return <Link to={"/survey/"+ props.surveyId}>
              <Button variant="outline-custom" >
                  <RiSurveyLine
                    size="20"
                    fill="black"
                  ></RiSurveyLine>
              </Button>
            </Link>

}  
export default MySurveysTable;
