import './Introduce.css'
import { ReactMediaRecorder } from "react-media-recorder";
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { api } from "../axios"

function Introduce() {
  const navigate = useNavigate();
  const [videoBlob, setVideoBlob] = useState(null); //녹화된 영상 Blob 상태
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null); //영상 URL 상태
  const [isRecording, setIsRecording] = useState(false); //녹화 상태
  const [timeLeft, setTimeLeft] = useState(60); //타이머
  const [isRecordingFinished, setIsRecordingFinished] = useState(false); // 녹화 종료 상태
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]); //녹화된 영상 데이터
  const intervalRef = useRef(null);

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

  //타이머 시작
  const startTimer = () => {
    setTimeLeft(60); // 타이머 초기화
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          stopRecording(); // 타이머가 0이 되면 녹화 중지
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  //타이머 정지
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 녹화 시작 함수
  const startRecording = () => {
    const stream = videoRef.current.srcObject;
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
      setMediaBlobUrl(URL.createObjectURL(videoBlob));
      setIsRecordingFinished(true); // 녹화 종료 상태 활성화
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    startTimer();
  };

  // 녹화 중지 함수
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    stopTimer();
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

      // 결과를 다음 화면으로 전달
      navigate('/introducefeedback', {
        state: {
          result: aiResponse.data.result,
          videoUrl: videoUrl,
        },
      });
    } catch (error) {
      console.error("에러 발생:", error);
      alert("요청에 실패했습니다.");
    }
  };

  const padTime = (time) => time.toString().padStart(2, "0");

  return (
    <div>
      <div className='wrapper-2'>
        <h2 className='intro'>
          카메라를 켜고 1분간 자기소개를 녹화해주세요
          <br/>
          <br/>
          {padTime(Math.floor(timeLeft / 60))}:{padTime(timeLeft % 60)}
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
          <button className="startBtn" onClick={startRecording} disabled={isRecording}>
            Start Recording
          </button>
          <button className="stopBtn" onClick={stopRecording} disabled={!isRecording}>
            Stop Recording
          </button>
          <br />

          {isRecordingFinished && (
            <div>
              <h3>녹화가 완료되었습니다. 분석을 요청하시겠습니까?</h3>
              <button className="startBtn" onClick={handleSubmit}>분석 요청</button>
              <button className="startBtn" onClick={() => setIsRecordingFinished(false)}>취소</button>
            </div>
          )}

          {mediaBlobUrl && (
            <div>
              <video src={mediaBlobUrl} controls></video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Introduce;