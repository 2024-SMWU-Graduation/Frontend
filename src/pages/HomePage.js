import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"; 
import './HomePage.css';

function HomePage() {

  const navigate = useNavigate();
  const getStart = async() => {
    navigate("/introduce");
  }

  return (
    <div className="main-container">
      <main className="main">
        <h2 className="headline">
          AI면접에 지친 당신을 위한 <span className="highlight"> 이지터뷰</span>
        </h2>
        <p className="subheadline">
          기업들의 AI면접 완벽 대비를 위한 자기 소개 및 돌발 질문 답변 분석 서비스 <br></br>
          표정과 자세, 답변 내용까지 AI가 분석하여 맞춤형 피드백 제공
        </p>
        <button className="cta-button" onClick={getStart}>Get Started</button>
      </main>
    </div>
  );
}

export default HomePage;