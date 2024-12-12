import './Introduce.css'
import { ReactMediaRecorder } from "react-media-recorder";

function Introduce() {
  return (
    <div>
      <h1>
        
      </h1>
      <ReactMediaRecorder
        video
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) =>(
          <div>
            <p>{status}</p>
            <button onClick={startRecording}>start recording</button>
            <button onClick={stopRecording}>stop recording</button><br/><br/>
            <video src={mediaBlobUrl} controls></video><br/>
          </div>  
        )}
      />
    </div>
  );
}

export default Introduce;