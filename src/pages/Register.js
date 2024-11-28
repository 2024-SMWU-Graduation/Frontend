import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import './Register.css';

function Resister () {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const sendVerificationCode = async() => {
    try {
        console.log(email)
        const response = await axios.post("http://localhost:8080/api/mail", { email });
        console.log('인증 코드 전송 성공 ');
    } catch (error) {
      console.log('인증 코드 전송 실패 ');
    }
  }

  const signUp = async() => {
    try {
      const response = await axios.post("http://localhost:8080/users/signup", { email, password, name });
      console.log('회원가입 성공');
    } catch (error) {
      console.log('회원가입 실패');
    }
  }

  return (
    <div>
      <div className = "page">
        <div className = "titleWrap">
            회원가입
        </div>

        <div className = "contentWrap">
            <div className="inputTitle">
                이메일 입력
            </div>
            <div className="inputWrap">
                <input
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
        </div>

        <div className="buttonWrap">
            <button className="bottomButton" onClick={sendVerificationCode}>
              이메일 인증
            </button>
        </div>

        <div className = "contentWrap">
            <div className="inputTitle">
                인증번호 입력
            </div>
            <div className="inputWrap">
                <input className="input"></input>
            </div>
        </div>

        <div className = "contentWrap">
            <div className="inputTitle">
                비밀번호 입력
            </div>
            <div className="inputWrap">
                <input className="input"></input>
            </div>
        </div>

        <div className = "contentWrap">
            <div className="inputTitle">
                비밀번호 재확인
            </div>
            <div className="inputWrap">
                <input className="input"></input>
            </div>
        </div>

        <div className="buttonWrap">
            <button className="bottomButton" onClick={signUp}>
              가입하기
            </button>
        </div>
        
      </div>
    </div>
  );
}

export default Resister;