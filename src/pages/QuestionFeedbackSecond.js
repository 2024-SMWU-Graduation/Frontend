import "../css/QuestionFeedback.css";
import { api } from "../axios";
import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import parseQuestionFeedback from "../utils/ParseQuestionFeedback";
import Loading from "../components/Loading";

function QuestionFeedbackSecond() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state.id;
  const videoRef = useRef(null); //video 태그 제어
  const [analyzeData, setAnalyzeData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [fetching, setFetching] = useState(true); // 백엔드 요청 여부 추적 상태

  // 두번째 영상
  const [videoSecond, setVideoSecond] = useState(null);
  const [SecondAnalyzeUrl, setSecondAnalyzeUrl] = useState(null);
  const [SecondVideoUrl, setSecondVideoUrl] = useState(null);
  const [SecondNegativePercentage, setSecondNegativePercentage] =
    useState(null);
  const [SecondTimelines, setSecondTimelines] = useState([]);

  // 질문 텍스트 받아오기
  const [questionTextEdit, setQuestionTextEdit] = useState("");

  // 백에서 영상 url, 표정분석 결과 url 받기
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get(`/feedback/random`, {
          params: { interviewId: id },
        });

        if (response.data && response.data.data) {
          const feedbackList = response.data.data.feedbackList;
          const secondFeedback = feedbackList[1]; // 두 번째 피드백

          // 두번째 피드백
          setVideoSecond(secondFeedback);
          setSecondAnalyzeUrl(secondFeedback.analyzeUrl);
          setSecondVideoUrl(secondFeedback.videoUrl);
          setSecondNegativePercentage(secondFeedback.negativePercentage);
          setSecondTimelines(secondFeedback.timelines || []);

          // analyzeUrl가 null이 아니면 요청을 멈추도록 설정
          if (SecondAnalyzeUrl) {
            setFetching(false); // analyzeUrl가 올바르게 설정되면 요청 중지
          }
        } else {
          console.error("API 응답이 예상한 형식이 아닙니다:", response.data);
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchFeedback();

    // 5초마다 백엔드에 요청을 보내 analyzeUrl가 변경되었는지 체크 (polling)
    const interval = setInterval(() => {
      if (fetching) {
        fetchFeedback();
      }
    }, 5000);

    // // 컴포넌트가 unmount될 때 interval을 정리
    return () => clearInterval(interval);
  }, [fetching, id]);

  useEffect(() => {
    if (SecondAnalyzeUrl) {
      setFetching(false);
    }
  }, [SecondAnalyzeUrl]);

  // json 파일 데이터 저장하기
  useEffect(() => {
    // if (!apiResult || !apiResult.analyzeUrl) return; // 🔥 apiResult가 완전히 설정된 후 실행
    // console.log("🔥 useEffect 실행 - analyzeUrl:", apiResult.analyzeUrl);

    const fetchAnalyzeData = async () => {
      try {
        const response = await fetch(SecondAnalyzeUrl);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const jsonData = await response.json();

        //console.log("✅ AI 분석 결과 데이터:", jsonData);
        setAnalyzeData(jsonData);

        // 질문 텍스트 +기호 파싱
        if (jsonData.question) {
          const formattedText = jsonData.question.replace(/\+/g, " ");
          setQuestionTextEdit(formattedText);
        }
      } catch (error) {
        console.error("❌ AI 분석 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    fetchAnalyzeData();
  }, [SecondAnalyzeUrl]);

  // 부정-긍정 판단
  const analyzePercentage = (percentage) => {
    if (percentage >= 40) {
      return "부정적인 표정을 많이 지으셨네요 😥";
    } else {
      return "인터뷰 내내 긍정적인 미소를 유지했어요 🙂";
    }
  };

  // 타임라인 렌더링
  const renderTimelines = (timelines) => {
    return timelines.map((timeline, index) => {
      const { startTime, endTime, intensity } = timeline;

      // 시작 시간 초단위 변환
      const [startMinutes, startSeconds] = startTime.split(":").map(Number);
      const start = startMinutes * 60 + startSeconds;

      return (
        <li key={index}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleTimestampClick(start);
            }}
          >
            {startTime} - {endTime} ({intensity})
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
  };

  // 첫번째 영상 피드백 페이지로 이동
  const goToSecondVideo = (id) => {
    navigate(`/question-feedback`, {
      state: { id },
    });
  };

  return (
    <div>
      {videoSecond ? (
        <div className="content">
          <div className="videoArea">
            <video
              ref={videoRef}
              src={SecondVideoUrl}
              controls
              preload="auto"
            ></video>
          </div>
          <div className="feedbackArea">
            <div className="tabs">
              <button
                className={activeTab === 0 ? "active" : ""}
                onClick={() => setActiveTab(0)}
              >
                표정 분석
              </button>
              <button
                className={activeTab === 1 ? "active" : ""}
                onClick={() => setActiveTab(1)}
              >
                AI 답변 분석
              </button>
            </div>
            <h3>인터뷰 분석 완료!</h3>
            <div className="tabContent">
              {activeTab === 0 && (
                <>
                  <p className="mainFeedbackText">[부정 표정 확인하기]</p>
                  <p>{analyzePercentage(SecondNegativePercentage)}</p>
                  <p>부정 퍼센트: {SecondNegativePercentage}%</p>
                  {SecondTimelines.length > 0 ? (
                    <ul>{renderTimelines(SecondTimelines)}</ul>
                  ) : (
                    <p>시간대 정보 없음</p>
                  )}
                </>
              )}
              {activeTab === 1 && (
                <>
                  <p className="mainFeedbackText">
                    [AI 답변 분석 피드백 확인하기]
                  </p>
                  {analyzeData?.answer ? (
                    <div>
                      <div className="feedback-script-title">❓ 꼬리 질문</div>
                      <p>{questionTextEdit}</p>
                      <div className="feedback-script-title">✏️ 답변</div>
                      <p>{analyzeData.answer}</p>
                      {parseQuestionFeedback(analyzeData)}
                    </div>
                  ) : (
                    <div>
                      <p>데이터를 불러오는 중입니다...</p>
                      <Loading />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>데이터를 불러오는 중입니다...</p>
      )}

      <div className="next-video-container">
        <button className="next-video-btn" onClick={() => goToSecondVideo(id)}>
          {" "}
          ← 첫번째 영상으로 이동
        </button>
      </div>
    </div>
  );
}

export default QuestionFeedbackSecond;
