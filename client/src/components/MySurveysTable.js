import { Table, Row, Button, Container, Spinner } from "react-bootstrap";
import { RiSurveyLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

//Shows the table with all the available surveys
function MySurveysTable(props) {
  return <>
    <Container fluid className="p-4">
      <Row as="h6" className="font-weight-bold">
        In the following table are shown all the available surveys:
      </Row>
    </Container>
    {/** TABLE */}
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
        {!props.loading ?
                        props.surveysInfo.map(s => <SurveyRow surveyInfo={s}
                                                        key={s.surveyId} />)
                        : 
                        <></> /**The data is loading so the body of the table is not shown */}
      </tbody>
    </Table>

       {/** If the data is loading, the content of the table is not shown and its notified to the user by a loading spinner */}
      {props.loading ? 
         <Container className="d-flex justify-content-center">
          {/*Loading spinner*/}
          <Spinner animation="border" role="status" variant="primary"></Spinner>
        </Container>

        : <></>}

  </>




}

//One row of the table
function SurveyRow(props) {
  return <>
    <tr>
      <td>{props.surveyInfo.title}</td> 
      <td>{props.surveyInfo.owner}</td> 
      <td>{props.surveyInfo.date ? dayjs(props.surveyInfo.date).format('dddd, MMMM D, YYYY') : ""}</td> 
      <td><MyFillInButton surveyId={props.surveyInfo.surveyId} /></td> 
    </tr>
  </>
}


/*Clicking on this button the user gets redirect to the page where he/she can fill in the selected survey*/
function MyFillInButton(props) {
  return <Link to={"/survey/" + props.surveyId}>
            <Button variant="outline-custom" >
              <RiSurveyLine
                size="20"
                fill="black"
              ></RiSurveyLine>
            </Button>
          </Link>

}
export default MySurveysTable;
