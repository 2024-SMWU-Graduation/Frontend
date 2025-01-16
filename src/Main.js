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
import IntroduceEnd from './pages/IntroduceEnd';
import IntroduceFeedback from './pages/IntroduceFeedback';
import Question from './pages/Question.js';
import QuestionEnd from './pages/QuestionEnd.js';
import QuestionFeedback from './pages/QuestionFeedback';
import {useEffect} from "react";
import {setAxiosInterceptors} from "./axios";
import {logout} from "./authActions";
import AuthSuccess from "./pages/AuthSuccess";

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
                <Route path="social-success" element={<AuthSuccess />} />
                <Route path="register" element={<Register />} />
                <Route path="introduce" element={<Introduce />} />
                <Route path="introduce-end" element={<IntroduceEnd />} />
                <Route path="introduce-feedback" element={<IntroduceFeedback />} />
                <Route path="question" element={<Question />} />
                <Route path="question-end" element={<QuestionEnd />} />
                <Route path="question-feedback" element={<QuestionFeedback />} />
              </Routes>
            </div>
          </div>
      </BrowserRouter>
      </AuthProvider>
  );
}


export default Main;
