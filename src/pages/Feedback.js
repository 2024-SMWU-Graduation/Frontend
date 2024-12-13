import './Feedback.css'
import React from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";

function Feedback() {
    const location = useLocation();
    const {result, videoUrl} = location.state;
    // const result = location.state?.result;

    const extractPercentage = (result) => {
        const match = result[0].match(/Negative.*?: (\d+(\.\d+)?)%/);
        return match ? parseFloat(match[1]) : null;
    }

    const extractTimeStamps = (result) => {
        if (!result || result.length < 2) return [];
        return result[1];
    }

    const analyzePercentage = (percentage) => {
        if (percentage >= 40) {
            return "부정적인 표정을 많이 지으셨네요 😥"
        } else {
            return "인터뷰 내내 긍정적인 미소를 유지했어요 🙂"
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
                    <video src={videoUrl} controls></video>
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
                                <li key={index}>{time}</li>
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

function analyzeResult() {

}

export default Feedback;
