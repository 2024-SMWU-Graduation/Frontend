import {AuthProvider, useAuth} from "./AuthContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './Main.css'
import NavigateBar from './components/Nav';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Introduce from './pages/Introduce';
import IntroduceFeedback from './pages/IntroduceFeedback';
import Question from './pages/Question.js';
import QuestionFeedback from './pages/QuestionFeedback';
import {useEffect} from "react";
import {setAxiosInterceptors} from "./axios";
import {logout} from "./authActions";
import AuthSuccess from "./pages/AuthSuccess";

// import WebcamTest from './pages/WebcamTest';

function Main() {
  return (
      <AuthProvider>
      <BrowserRouter>
          <div className='wrapper'>
            <div className='contentWrapper'>
              <NavigateBar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="mypage" element={<MyPage />} />
                <Route path="login" element={<LogIn />} />
                <Route path="register" element={<Register />} />
                <Route path="introduce" element={<Introduce />} />
                <Route path="introducefeedback" element={<IntroduceFeedback />} />
                <Route path="question" element={<Question />} />
                <Route path="questionfeedback" element={<QuestionFeedback />} />

                {/* <Route path="webcamtest" element={<WebcamTest />} /> */}
              </Routes>
            </div>
          </div>
      </BrowserRouter>
      </AuthProvider>
  );
}


export default Main;
