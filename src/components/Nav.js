import { Link } from 'react-router-dom';
import './Nav.css'


function Nav() {
  return (
    <div className="nav">
      <span className="title">AI 면접 도우미</span>
      <Link classname="navbarMenu" to={'/'}>HomePage</Link>
      <Link classname="navbarMenu" to={'/mypage'}>마이페이지</Link>
      <Link classname="navbarMenu" to={'/login'}>로그인</Link>
    </div>
  );
}

export default Nav;
