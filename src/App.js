import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import AcademicPrograms from './features/AcademicPrograms';
import Ambulance from './features/Ambulance';
import ApplyForAdmission from './features/ApplyForAdmission';
import ClinicBooking from './features/ClinicBooking';
import Fundi from './features/Fundi';
import GoogleScholar from './features/GoogleScholar';
import GrammarlyAccess from './features/GrammarlyAccess';
import ICTContact from './features/ICTContact';
import LibraryBooking from './features/LibraryBooking';
import MicrosoftReset from './features/MicrosoftReset';
import MoodleLogin from './features/MoodleLogin';
import MyAccess from './features/MyAccess';
import PastQuestionPapers from './features/PastQuestionPapers';
import StudentCounselling from './features/StudentCounselling';
import UNIVENAdmin from './features/UNIVENAdmin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/academic-programs' element={<AcademicPrograms />} />
          <Route path='/ambulance' element={<Ambulance />} />
          <Route path='/apply-for-admission' element={<ApplyForAdmission />} />
          <Route path='/clinic-booking' element={<ClinicBooking />} />
          <Route path='/fundi' element={<Fundi />} />
          <Route path='/google-scholar' element={<GoogleScholar />} />
          <Route path='/grammarly-access' element={<GrammarlyAccess />} />
          <Route path='/ict-contact' element={<ICTContact />} />
          <Route path='/library-booking' element={<LibraryBooking />} />
          <Route path='/microsoft-reset' element={<MicrosoftReset />} />
          <Route path='/moodle-login' element={<MoodleLogin />} />
          <Route path='/my-access' element={<MyAccess />} />
          <Route path='/past-question-papers' element={<PastQuestionPapers />} />
          <Route path='/student-counselling' element={<StudentCounselling />} />
          <Route path='/univen-admin' element={<UNIVENAdmin />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
