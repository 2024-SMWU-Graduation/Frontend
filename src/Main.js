import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './Main.css'
import BasicExample from './components/Nav';
/*import Footer from './components/Footer';*/
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Introduce from './pages/Introduce';
import Question from './pages/Question.js';

function Main() {
  return (
    <BrowserRouter>
      <div className='wrapper'>
        <div className='contentWrapper'>
          <BasicExample />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="login" element={<LogIn />} />
            <Route path="register" element={<Register />} />
            <Route path="introduce" element={<Introduce />} />
            <Route path="question" element={<Question />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}


export default Main;
