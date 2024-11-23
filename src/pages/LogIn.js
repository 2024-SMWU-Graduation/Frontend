import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import './LogIn.css';

//import { useForm,Controller } from "react-hook-form";
//import { AuthContext } from "components/Functions/AuthContext";

const User = {
  email : " " ,
  password : " ",
  name : " "
}

function LogIn() {
  const [email, setEmail] = useState('');
  const [inputPw, setInputPw] = useState('')

  return (
    <div>
      <div className = "page">
        <div className = "titleWrap">
            이메일과 비밀번호를 입력하세요
        </div>

        <div className = "contentWrap">
            <div className="inputTitle">
                이메일 주소
            </div>
            <div className="inputWrap">
                <input className="input"></input>
            </div>
        </div>

        <div className = "contentWrap">
            <div className="inputTitle">
                비밀번호
            </div>
            <div className="inputWrap">
                <input className="input"></input>
            </div>
        </div>

        <div className="buttonWrap">
            <button className="bottomButton">
              로그인
            </button>
        </div>
        <hr nonshade/>
        <div className="registerWrap">
          <div className="registerTitle">
            계정이 없으신가요? <Link to="/resister">가입하기</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;