import MyNavbar from './components/MyNavbar.js'
import MySurveysTable from './components/MySurveysTable.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

function App() {
  return ( <>
    <head>
      <title>My Online Surveys</title>
    </head>
    <body>
      <header>
        <MyNavbar/>
        <container>
        <MySurveysTable></MySurveysTable>
        </container>
      </header>
    </body>


    </>
    );
}

export default App;
