import './Introduce.css'
import { ReactMediaRecorder } from "react-media-recorder";

function Introduce() {
  return (
    <div>
      <div className='wrapper'>
        <h2 className='intro'>
          카메라를 키고 1분간 자기소개를 녹화해주세요
        </h2>
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
        
      </div>
    </div>
  );
}

export default Introduce;