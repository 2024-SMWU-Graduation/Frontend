import { Link } from 'react-router-dom';
//import './Nav.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "bootstrap/dist/css/bootstrap.min.css";

function BasicExample() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">이지터뷰</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/introduce">1분 자기소개</Nav.Link>
            <Nav.Link href="#link">돌발질문</Nav.Link>
            <Nav.Link href="/mypage">마이페이지</Nav.Link>
            <Nav.Link href="/login">로그인</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;


/*
function Nav() {
  return (
    <div className="nav">
      <div className='logo'>
        <Link classname="navbarMenu" to={'/'}>로고 넣기</Link>
      </div>
      <Link classname="navbarMenu" to={'/introduce'}>1분 자기소개</Link>
      <Link classname="navbarMenu" to={'/mypage'}>마이페이지</Link>
      <Link classname="navbarMenu" to={'/login'}>로그인</Link>
    </div>
  );
}

export default Nav;
*/
