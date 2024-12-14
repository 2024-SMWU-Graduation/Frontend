import './Feedback.css'
import React, {useRef} from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";

function Feedback() {
    const location = useLocation();
    const {result, videoUrl} = location.state;
    const videoRef = useRef(null); //video 태그 제어
    // const result = location.state?.result;

    const extractPercentage = (result) => {
        const match = result[0].match(/Negative.*?: (\d+(\.\d+)?)%/);
        return match ? parseFloat(match[1]) : null;
    }

    const analyzePercentage = (percentage) => {
        if (percentage >= 40) {
            return "부정적인 표정을 많이 지으셨네요 😥"
        } else {
            return "인터뷰 내내 긍정적인 미소를 유지했어요 🙂"
        }
    }

    //타임스탬프 추출
    const extractTimeStamps = (result) => {
        if (!result || result.length < 2) return [];
        return result[1].map((time) => {
          // 시작 시간, 종료시간 추출
          const match = time.match(/^(\d{2}):(\d{2}) - (\d{2}):(\d{2})$/); 
          if (match) {
            const startMinutes = parseInt(match[1], 10);
            const startSeconds = parseInt(match[2], 10);
            const endMinutes = parseInt(match[3], 10);
            const endSeconds = parseInt(match[4], 10);
            return {
              start : startMinutes * 60 + startSeconds,
              end : endMinutes * 60 + endSeconds,
            };
          }
          return null; // 유효하지 않은 형식 제외
        }).filter((time) => time !== null);
    };

    const handleTimestampClick = (time) => {
      if (isNaN(time) || time === null || time === undefined) {
        console.error("Invalid timestamp:", time);
        return;
      }

      if (videoRef.current) {
        videoRef.current.currentTime = parseFloat(time); //동영샹 재생 시간 설정 (숫자로 변환)
        videoRef.current.play() //동영상 재생
      }
    }

    console.log(result);
    const percentage = extractPercentage(result);
    console.log(percentage);
    const message = analyzePercentage(percentage);
    const timeStamps = extractTimeStamps(result);

    if (!result) {
        return <div>결과 조회에 실패했습니다.</div>
    }

    return (
        <div>
            <div className='content'>
                <div className='videoArea'>
                    <video ref={videoRef} src={videoUrl} controls></video>
                </div>
                <div className='feedbackArea'>
                    <h3>인터뷰 분석 완료!</h3>
                    <p className='mainFeedbackText'> {message} </p>
                    <p>
                        {result[0]}
                    </p>
                    <p>[시간대]</p>
                    {timeStamps && timeStamps.length > 0 ? (
                        <ul>
                            {timeStamps.map((time, index) => (
                                <li key={index}>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                    e.preventDefault();
                                    handleTimestampClick(time.start);
                                    }}
                                  >
                                    {Math.floor(time.start / 60).toString().padStart(2, '0')}:{(time.start % 60).toString().padStart(2, '0')}
                                    ~
                                    {Math.floor(time.end / 60).toString().padStart(2, '0')}:{(time.end % 60).toString().padStart(2, '0')}
                                  </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>시간대 정보 없음</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Feedback;