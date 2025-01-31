import '../css/Question.css';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"; 
import { api } from "../axios";

import QuestionData from "../assets/data/QuestionData.js";
import CategoryData from "../assets/data/CategoryData.js";

function Question() {
  const navigate = useNavigate();
  const [videoBlob, setVideoBlob] = useState(null); //녹화된 영상 Blob 상태
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null); //영상 URL 상태
  const [isRecording, setIsRecording] = useState(false); //녹화 상태
  const [isRecordingFinished, setIsRecordingFinished] = useState(false); // 녹화 종료 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태

  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 버튼 상태
  const [selectedText, setSelectedText] = useState(""); // 랜덤 질문 상태 관리
  const [isRecordingText, setIsRecordingText] = useState("") // 녹화중 알림 텍스트 
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]); //녹화된 영상 데이터
  const intervalRef = useRef(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // 선택한 카테고리 업데이트
    const questions = QuestionData[category]; // 해당 카테고리의 질문 가져오기
    if (questions && questions.length > 0) {
      const randomText = questions[Math.floor(Math.random() * questions.length)];
      setSelectedText(randomText);
    } else {
      setSelectedText("해당 카테고리에 질문이 없습니다.");
    }

    // 3초 후 녹화 시작
    setTimeout(() => {
      startRecording();
    }, 3000);
  }

  //사용자 웹캠에 접근
  const getUserCamera = () =>{
    navigator.mediaDevices
      .getUserMedia({video: true})
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 화면 키면 바로 웹캠 띄우기
  useEffect(() => {
    getUserCamera();
  },[]);

  // 녹화 시작 함수
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true, // 녹화 시에만 오디오 추가
    });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/mp4" });

    recordedChunks.current = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(recordedChunks.current, { type: "video/mp4" });
      setVideoBlob(videoBlob); //녹화된 영상 Blob 저장
      const url = URL.createObjectURL(videoBlob);
      setMediaBlobUrl(url);
      setIsPopupOpen(true); // 팝업 상태 활성화
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setIsRecordingText("녹화중");
  };

  // 녹화 중지 함수
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsRecordingText("녹화 종료")
  };

  const handleSubmit = async () => {
    if (!videoBlob) {
      return alert("녹화된 영상이 없습니다.");
    }
    try {
      const formData = new FormData();
      formData.append("file", videoBlob, "recorded-video.mp4");

      // S3 업로드 API 호출
      const s3Response = await api.post("/interview", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });

      const videoUrl = s3Response.data.data;

      // AI 분석 API 호출
      const aiResponse = await axios.post("http://localhost:8081/upload", formData, {
        headers: { "Content-type": "multipart/form-data", },
      });

      // 녹화 완료 페이지 이동
      navigate('/question-end');
    } catch (error) {
      console.error("에러 발생:", error);
      alert("요청에 실패했습니다.");
    }
  };

  return (
    <div>
      <div className='question-wrapper'>
        <h2 className='intro'>
          아래 직무별 버튼 중 한가지를 클릭하여 질문을 확인하세요.
        </h2>
        <div className='question-wargning-text'>
          질문이 제시되면 3초 후 녹화가 시작됩니다. 답변을 준비해주세요.
        </div>
        <br/>
        <div className='catergory-buttons'>
          {CategoryData.map((category, index) => (
            <button
              key={index}
              className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
            {category}
            </button>
          ))}
        </div>
        <br/>
        <h2 className="selected-text">
          {selectedText}
        </h2>
        <div className='record-warning'>
          {isRecordingText}
        </div>
        <br/>
        <div style={{ position: "relative", width: "640px", height: "480px", }}>
          <video ref={videoRef} />
          <div
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: "50%", height: "50%",
              transform: "translate(-50%, -50%)",
              border: "2px dashed #ffffff",
            }}
          ></div>
        </div>

        <div className='video'>
          <button className="start-stop-Btn" onClick={startRecording} disabled={isRecording}>
            Start Recording
          </button>
          <button className="start-stop-Btn" onClick={stopRecording} disabled={!isRecording}>
            Stop Recording
          </button>
          <br />
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h3 className='intro'>녹화가 완료되었습니다. <br/> 분석을 요청하시겠습니까?</h3>
            <video src={mediaBlobUrl} controls style={{ width: "100%" }}></video>
            <button className="submit-button" onClick={handleSubmit}>분석 요청</button>
            <button className="submit-button" onClick={() => setIsPopupOpen(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Question;