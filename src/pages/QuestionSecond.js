import '../css/QuestionSecond.css';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios"; 
import { api } from "../axios";
import {formatPercentage} from "../utils/FormatUtils";

function QuestionSecond() {
  const navigate = useNavigate();
  const [videoBlob, setVideoBlob] = useState(null); //녹화된 영상 Blob 상태
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null); //영상 URL 상태
  const [isRecording, setIsRecording] = useState(false); //녹화 상태
  const [isRecordingFinished, setIsRecordingFinished] = useState(false); // 녹화 종료 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태

  const [selectedText, setSelectedText] = useState(""); // 랜덤 질문 상태 관리
  const [randomInterviewId, setRandomInterviewId] = useState("") // 아이디값
  const [tailQuestion, setTailQuestion] = useState("") // 추가 질문

  const location = useLocation();
  const firstInterviewId = location.state.id; // 첫번째 동영상 아이디값
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]); //녹화된 영상 데이터

  // 추가질문 받아오기
  useEffect(() => {
    const getTailQuestion = async () => {
        try {
            const tail = await api.get(`/interview/random/${firstInterviewId}/question/tail`);
            console.log(tail.data.data);

            if (tail.data.data.success) {
              setTailQuestion(tail.data.data.questionData);
            } else {
              setTimeout(getTailQuestion, 5000); // 5초 후 다시 요청
            }
            console.log(tailQuestion);
        } catch (error) {
            console.error('꼬리질문 가져오는 중 오류 발생:', error);
        }
    };

    getTailQuestion();
  }, []);

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
  };

  // 녹화 중지 함수
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // 분석 요청
  const handleSubmit = async () => {
    if (!videoBlob) {
      return alert("녹화된 영상이 없습니다.");
    };

    try {
      const videoFormData = new FormData();
      videoFormData.append("file", videoBlob, "recorded-video.mp4");

      // // AI 분석 API 호출
      // const aiResponse = await axios.post("http://localhost:8081/upload", videoFormData, {
      //   headers: { "Content-type": "multipart/form-data", },
      // });

      // const formData = new FormData();
      // formData.append("file", videoBlob, "recorded-video.mp4");

      // // JSON 데이터를 문자열로 변환해서 추가
      // const jsonData = JSON.stringify({
      //   interviewId: randomInterviewId,
      //   questionData: selectedText, 
      // });
      // formData.append("requestDto", new Blob([jsonData], { type: "application/json" }));

      // // S3 업로드 API 호출
      // const s3Response = await api.post("/interview/random/question", formData, {
      //   headers: {
      //     "Content-type": "multipart/form-data",
      //   },
      // });

      // const modifiedData = {
      //   interviewId: randomInterviewId,
      //   percentage: formatPercentage(aiResponse.data.result[0]),
      //   timelines: aiResponse.data.result[1]
      // };

      // await api.post("/feedback/random", modifiedData, {
      //   headers: { "Content-Type": "application/json" }
      // });

      // 녹화 완료 페이지 이동
      navigate('/interview-end');
    } catch (error) {
      console.error("에러 발생:", error);
      alert("요청에 실패했습니다.");
    };
  };

  return (
    <div>
      <div className='question-wrapper'>
        <h2 className='intro'>
          {tailQuestion ? tailQuestion : "추가질문 생성중"}
          <br/>
        </h2>

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

export default QuestionSecond;