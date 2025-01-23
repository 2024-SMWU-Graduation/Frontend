import '../css/IntroduceFeedback.css';
import { api } from "../axios"
import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Feedback() {
    const location = useLocation();
    const id = location.state.id;
    const videoRef = useRef(null); //video 태그 제어
    const [apiResult, setApiResult] = useState(null);

    // 백에서 영상 url, 표정분석 결과 url 받가
    useEffect(() => {
      const fetchFeedback = async () => {
          try {
            const { data } = await api.get(`/feedback/introduce/${id}`);

            const feedback = {
              videoUrl: data.data.videoUrl,
              negativePercentage: data.data.negativePercentage,
              timelines: data.data.timelines || [] ,
            };
            setApiResult(feedback);
          } catch (error) {
              console.error('데이터를 가져오는 중 오류 발생:', error);
          }
      };

      fetchFeedback();
    }, [id]);

    const analyzePercentage = (percentage) => {
        if (percentage >= 40) {
            return "부정적인 표정을 많이 지으셨네요 😥"
        } else {
            return "인터뷰 내내 긍정적인 미소를 유지했어요 🙂"
        }
    };

    // 타임라인 렌더링
    const renderTimelines = (timelines) => {
      return timelines.map((timeline, index) => {
        const [start, end] = timeline.split(' - ').map((time) => {
          const [minutes, seconds] = time.split(':').map(Number);
          return minutes * 60 + seconds;
        });

        return (
          <li key={index}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleTimestampClick(start);
              }}
            >
              {timeline}
            </a>
          </li>
        );
      });
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

    return (
      <div>
      {apiResult ? (
        <div className="content">
          <div className="videoArea">
            <video ref={videoRef} src={apiResult.videoUrl} controls preload="auto"></video>
          </div>
          <div className="feedbackArea">
            <h3>인터뷰 분석 완료!</h3>
            <p className="mainFeedbackText">{analyzePercentage(apiResult.negativePercentage)}</p>
            <p>부정 퍼센트: {apiResult.negativePercentage}%</p>
            <p>[부정 표정 확인하기]</p>
            {apiResult.timelines.length > 0 ? (
              <ul>{renderTimelines(apiResult.timelines)}</ul>
            ) : (
              <p>시간대 정보 없음</p>
            )}
          </div>
        </div>
      ) : (
        <p>데이터를 불러오는 중입니다...</p>
      )}
    </div>
    );
};

export default Feedback;