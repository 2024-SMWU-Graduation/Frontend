import '../css/IntroduceFeedback.css';
import { api } from "../axios"
import React, {useRef, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

function Feedback() {
    const location = useLocation();
    const {result, videoUrl} = location.state;
    const videoRef = useRef(null); //video 태그 제어
    const [apiResult, setApiResult] = useState(null);

    // 백에서 영상 url, 표정분석 결과 url 받아서 변수에 저장
    // const result = aiResponse.data.result
    //
    //
    //
    //

    // stt 분석 결과 url 백에서 받기
    //
    //
    //
    //
    //

    // 부정 표정 퍼센트 추출
    const extractPercentage = (result) => {
        const match = result[0].match(/Negative.*?: (\d+(\.\d+)?)%/);
        return match ? parseFloat(match[1]) : null;
    };

    const analyzePercentage = (percentage) => {
        if (percentage >= 40) {
            return "부정적인 표정을 많이 지으셨네요 😥"
        } else {
            return "인터뷰 내내 긍정적인 미소를 유지했어요 🙂"
        }
    };

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

    // 타임스탬프 클릭
    const handleTimestampClick = (time) => {
      if (isNaN(time) || time === null || time === undefined) {
        console.error("Invalid timestamp:", time);
        return;
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = parseFloat(time); //동영샹 재생 시간 설정 (숫자로 변환)
        
        const onSeeked = () => {
          videoRef.current.play();
          videoRef.current.removeEventListener("seeked", onSeeked); // 이벤트 제거
        };
        
        videoRef.current.addEventListener("seeked", onSeeked);
      }
    }

    // stt 분석 텍스트 받은거 띄우는 코드
    //
    //
    //
    //
    //
    //
    //

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
                    <video ref={videoRef} src={videoUrl} controls preload="auto"></video>
                </div>
                <div className='feedbackArea'>
                    <h3>인터뷰 분석 완료!</h3>
                    <p className='mainFeedbackText'> {message} </p>
                    <p>
                        {result[0]}
                    </p>
                    <p>[부정 표정 확인하기]</p>
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
                    {/* stt 분석 결과 띄우기 */}
                </div>
            </div>
        </div>
    );
};

export default Feedback;