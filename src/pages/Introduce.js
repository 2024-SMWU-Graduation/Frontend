import './Introduce.css'
import { ReactMediaRecorder } from "react-media-recorder";
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"; 

function Introduce() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [videoBlob, setVideoBlob] = useState(null);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  // const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  //사용자 웹캠에 접근
  const getUserCamera = () =>{
    navigator.mediaDevices
      .getUserMedia({video: true})
      .then((stream) => {
        //비디오 tag에 stream 추가
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserCamera();
  },[]);

  // 녹화 시작 함수
  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    recordedChunks.current = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setMediaBlobUrl(url);
      setVideoBlob(blob);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  // 녹화 중지 함수
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const fileUrl = URL.createObjectURL(selectedFile);
    setMediaBlobUrl(fileUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("파일을 선택하세요.");
     try {
      const formData = new FormData();
      formData.append("file", videoBlob || file);

      // S3 업로드 API 호출
      const s3Response = await axios.post("http://localhost:8080/api/interview", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });

      const videoUrl = s3Response.data.data;

      // AI 분석 API 호출
      const aiResponse = await axios.post("http://localhost:8081/upload", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        }});

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

  return (
    <div>
      <div className='wrapper-2'>
        <h2 className='intro'>
          카메라를 켜고 1분간 자기소개를 녹화해주세요
        </h2>
        
        {/* <video className='webcam' ref={videoRef} /> */}
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
          {mediaBlobUrl && (
            <div>
              <video src={mediaBlobUrl} controls></video>
              <br />
              <a href={mediaBlobUrl} download="1분자기소개.webm">
                Download
              </a>
            </div>
          )}

          <form onSubmit={handleSubmit} className='submit'>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">분석 요청</button>
          </form>
          {result && <div>결과: {result}</div>}
        </div>
      </div>
    </div>
  );
}

export default Introduce;