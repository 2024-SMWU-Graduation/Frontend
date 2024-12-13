import './Introduce.css'
import { ReactMediaRecorder } from "react-media-recorder";
import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"; 

function Introduce() {
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

  // 플라스크 연결
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("파일을 선택하세요.");

    // 파일을 base64로 변환
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const response = await axios.post("http://localhost:5000/analyze", {
          image: reader.result, // base64 이미지 데이터 전달
        });

        setResult(response.data.output);
      } catch (error) {
        console.error("에러 발생:", error);
        alert("요청에 실패했습니다.");
      }
    };
  };

  return (
    <div>
      <div className='wrapper'>
        <h2 className='intro'>
          카메라를 키고 1분간 자기소개를 녹화해주세요
        </h2>
        <video className='webcam' ref={videoRef} />
        <div className='video'>
          <ReactMediaRecorder c
          video
          render={({ status, startRecording, stopRecording, mediaBlobUrl }) =>(
            <div>
              <button className='startBtn' onClick={startRecording}>start recording</button> 
              <button className='stopBtn' onClick={stopRecording}>stop recording</button><br/><br/>
              <p>{status}</p>
              <video src={mediaBlobUrl} controls></video><br/>
            </div>  
          )}
          />
        </div>
        <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">분석 요청</button>
        </form>
        {result && <div>결과: {result}</div>}
      </div>
    </div>
  );
}

export default Introduce;