import React, { useState, useEffect } from 'react';
import { api } from "../axios"
import './IntroduceList.css';

const VideoGrid = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get('/interview');
                setVideos(response.data.data.responseDtoList);
                // console.log(response.data.totalInterview);
            } catch (error) {
                console.error('비디오를 가져오는 중 오류 발생:', error);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="video-grid">
            {videos && videos.map((video) => (
                <div key={video.interviewId} className="video-item">
                    <video src={video.videoUrl} controls width="100%" />
                    <h3>{video.title}</h3>
                    <p>{formatDate(video.createdAt)}</p>
                </div>
            ))}
        </div>
    );
};

function formatDate(localDateTime) {
    const date = new Date(localDateTime); // LocalDateTime 문자열을 Date 객체로 변환

    const year = date.getFullYear(); // 연도
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
    const day = String(date.getDate()).padStart(2, '0'); // 일

    return `${year}년 ${month}월 ${day}일`;
}

export default VideoGrid;
