import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
//import App from './components/App';
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Introduce from './pages/Introduce';
import Question from './pages/Question.js';

function Main() {
  return (
    <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="login" element={<LogIn />} />
          <Route path="register" element={<Register />} />
          <Route path="introduce" element={<Introduce />} />
          <Route path="question" element={<Question />} />
          </Routes>
    </BrowserRouter>
  );
}

export default Main;
