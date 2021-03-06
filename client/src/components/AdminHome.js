import { Table, Row, Button, Container, Col, Spinner } from "react-bootstrap";
import dayjs from 'dayjs';
import { ImPencil2 } from "react-icons/im";
import { Link } from 'react-router-dom';
import SurveysResults from "./SurveysResults";

/** Props got from APP:
 * surveyInfo
 * surveyQuestions
 * adminUsername
 * surveysAnswers
 */
function AdminHome(props) {

  return <Container fluid>
    {/** Welcome message */}
    <h4 className="py-3 font-weight-bold">Hello, {props.adminUsername}. Welcome back!</h4>
    {/** Table with the results of the admin surveys */}
    <AdminResults surveysInfo={props.surveysInfo}
      surveysQuestions={props.surveyQuestions}
      surveysAnswers={props.surveysAnswers}
      loading={props.loading}
    />
    {/** Button to create a new survey */}
    <CreateNewSurveyButton adminUsername={props.adminUsername} />
  </Container>
}


function AdminResults(props) {
  /** Table with title-date-number of answers so far- button to see the answers */
  return <>
    <h6 className="py-2">
      In the following table are shown all the surveys you have created so far:
    </h6>

    <Table bordered variant="light">
      <thead id="table_header">
        <tr>
          <th>Survey title</th>
          <th>Date</th>
          <th>Number of answers</th>
          <th>Check the results</th>
        </tr>
      </thead>

      <tbody id="table_body">
        {!props.loading ?
          props.surveysInfo.map(s => <ResultsRow surveyInfo={s}
                                        key={s.surveyId}
                                        surveysQuestions={props.surveysQuestions}
                                        surveysAnswers={props.surveysAnswers} />)
          : //The data is loading so the table is not shown
          <></>
        }
      </tbody>
    </Table>

    {/** If the data is loading, the content of the table is not shown and its notified to the user by a loading spinner */}
    {props.loading ? <Container className="d-flex justify-content-center">
                        {/*Loading spinner*/}
                        <Spinner animation="border" role="status" variant="primary"></Spinner>
                      </Container>
      : <></>
    }

  </>
}


//One row of the table with all the results of the surveys owned by the admin
function ResultsRow(props) {

  const numAnswers = props.surveysAnswers.filter(s => s.surveyId === props.surveyInfo.surveyId).length //Num of time a user filled in the survey
  
  return <>
    <tr>
      <td>{props.surveyInfo.title}</td> 
      <td>{props.surveyInfo.date ? dayjs(props.surveyInfo.date).format('dddd, MMMM D, YYYY') : ""}</td> 
      <td>{numAnswers}</td> 
      <td>{numAnswers > 0 ? //Show results only if there are any
                          <SurveysResults 
                            surveyQuestions={props.surveysQuestions.filter(s => s.surveyId === props.surveyInfo.surveyId)}
                            surveyAnswers={props.surveysAnswers.filter(s => s.surveyId === props.surveyInfo.surveyId)}
                            surveyInfo={props.surveyInfo} />
                          : <></>}
      </td>
    </tr>
  </>
}




function CreateNewSurveyButton(props) {
  return <Container fluid className="justify-content-start p-0">
    <Row className="py-4">
      <Col sm={3} >
        <h6 > To create a new survey: </h6>
      </Col>
      <Col >
        <Link to={props.adminUsername + "/NewSurvey"}>
          <Button size="md" variant="outline-custom" >
            <ImPencil2
              size="20"
              fill="black"
              className="mx-2 my-0 "
            ></ImPencil2>
            New survey
          </Button>
        </Link>
      </Col>
    </Row>
  </Container>
}

export default AdminHome;