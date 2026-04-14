import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TextScanner from './features/TextScanner';

// Import your feature components here, e.g.,
// import AcademicPrograms from './features/AcademicPrograms';
// import Ambulance from './features/Ambulance';
// ...

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/academic-programs' component={AcademicPrograms} />
        <Route path='/ambulance' component={Ambulance} />
        <Route path='/apply-for-admission' component={ApplyForAdmission} />
        <Route path='/clinic-booking' component={ClinicBooking} />
        <Route path='/fundi' component={Fundi} />
        <Route path='/google-scholar' component={GoogleScholar} />
        <Route path='/grammarly-access' component={GrammarlyAccess} />
        <Route path='/ict-contact' component={ICTContact} />
        <Route path='/library-booking' component={LibraryBooking} />
        <Route path='/microsoft-reset' component={MicrosoftReset} />
        <Route path='/moodle-login' component={MoodleLogin} />
        <Route path='/my-access' component={MyAccess} />
        <Route path='/past-question-papers' component={PastQuestionPapers} />
        <Route path='/student-counselling' component={StudentCounselling} />
        <Route path='/univen-admin' component={UNIVENAdmin} />
        <Route path='/text-scanner' component={TextScanner} />
        <Route path='/' component={Home} /> {/* Default route */}
      </Switch>
    </Router>
  );
}

export default App;