import '../css/IntroduceFeedback.css';
import { api } from "../axios"
import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import parseFeedback from '../utils/ParseFeedback';

function Feedback() {
    const location = useLocation();
    const id = location.state.id;
    const videoRef = useRef(null); //video 태그 제어
    const [apiResult, setApiResult] = useState(null);
    const [analyzeData, setAnalyzeData] = useState(null);

    // 백에서 영상 url, 표정분석 결과 url 받기
    useEffect(() => {
      const fetchFeedback = async () => {
        try {
          const response = await api.get(`/feedback/introduce/${id}`);
          console.log("API 응답:", response); // 전체 응답 확인
          console.log("응답 데이터:", response.data); // 실제 데이터 확인
    
          if (response.data && response.data.data) {
            const feedback = {
              videoUrl: response.data.data.videoUrl,
              negativePercentage: response.data.data.negativePercentage,
              timelines: response.data.data.timelines || [],
              analyzeLink: response.data.data.analyzeLink,
            };
            setApiResult(feedback);
          } else {
            console.error("API 응답이 예상한 형식이 아닙니다:", response.data);
          }
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생:", error);
        }
      };
      fetchFeedback();
    }, [id]);

    // json 파일 데이터 저장하기
    useEffect(() => {
      if (!apiResult?.analyzeLink) return;
    
      const fetchAnalyzeData = async () => {
        try {
          const response = await fetch(apiResult.analyzeLink);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
          const jsonData = await response.json();
          console.log("✅ AI 분석 결과 데이터:", jsonData);
          setAnalyzeData(jsonData);
        } catch (error) {
          console.error("❌ AI 분석 데이터를 불러오는 중 오류 발생:", error);
        }
      };
    
      fetchAnalyzeData();
    }, [apiResult?.analyzeLink]);

    // 피드백 json 렌더링
    const renderAnalyzeResults = (analyzeData) => {
      if (!analyzeData) return <p>AI 분석 결과가 없습니다.</p>;
    };

    // 부정-긍정 판단
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

    return (
      <div>
      {apiResult ? (
        <div className="content">
          <div className="videoArea">
            <video ref={videoRef} src={apiResult.videoUrl} controls preload="auto"></video>
          </div>
          <div className="feedbackArea">
            <h3>인터뷰 분석 완료!</h3>
            <p className="mainFeedbackText">[부정 표정 확인하기]</p>
            <p>{analyzePercentage(apiResult.negativePercentage)}</p>
            <p>부정 퍼센트: {apiResult.negativePercentage}%</p>
            {apiResult.timelines.length > 0 ? (
              <ul>{renderTimelines(apiResult.timelines)}</ul>
            ) : (
              <p>시간대 정보 없음</p>
            )}
            <p className='mainFeedbackText'>[AI 답변 분석 피드백 확인하기]</p>
            <div className='feedback-script-title'>✏️ 원본 대본</div>
            <p>
              {analyzeData.original_script}
            </p>
            {parseFeedback(analyzeData.feedback)}
          </div>
        </div>
      ) : (
        <p>데이터를 불러오는 중입니다...</p>
      )}
    </div>
    );
};

export default Feedback;