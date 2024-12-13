import './Introduce.css'
import { ReactMediaRecorder } from "react-media-recorder";
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";

function Introduce() {
  const navigate = useNavigate();

  // 플라스크 연결
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  let videoRef = useRef(null)

  //사용자 웹캠에 접근
  const getUserCamera = () =>{
    navigator.mediaDevices.getUserMedia({
      video: true
    })
    .then((stream) => {
      //비디오 tag에 stream 추가
      let video = videoRef.current
      video.srcObject = stream
      video.play()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    getUserCamera()
  },[videoRef])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile);

    const fileUrl = URL.createObjectURL(selectedFile);
    setVideoPreviewUrl(fileUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("파일을 선택하세요.");

    const formData = new FormData();
    formData.append("file", file)

    try {
      const response = await axios.post("http://localhost:8080/upload", formData, {
        headers: {
        "Content-type": "multipart/form-data",
      },
      });

      setResult(response.data);
      navigate('/feedback', {
        state : {
          result: response.data.result,
          videoUrl: videoPreviewUrl
        }
      })
    } catch (error) {
      console.error("에러 발생:", error);
      alert("요청에 실패했습니다.");
    }
  };

  return (
    <div>
      <div className='wrapper'>
        <h2 className='intro'>
          카메라를 켜고 1분간 자기소개를 녹화해주세요
        </h2>
        <video className='webcam' ref={videoRef} />
        <div className='video'>
          <ReactMediaRecorder c
          video
          render={({ status, startRecording, stopRecording, mediaBlobUrl }) =>(
              <div>
                <button className='startBtn' onClick={startRecording}>start recording</button>
                <button className='stopBtn' onClick={stopRecording}>stop recording</button>
                <br/><br/>
                <p>{status}</p>
                <video src={mediaBlobUrl} controls></video>
                <br/>
                <a href={mediaBlobUrl} download="mysound.mp4">download</a>
              </div>
          )}
          />
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