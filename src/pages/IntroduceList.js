import React, { useState, useEffect } from 'react';
import { api } from "../axios"
import './IntroduceList.css';
import { formatDate } from "../utils/DateUtils";

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
        <div className="video-container">
            <h3 className="video-count">총 { videos ? videos.length : 0 }개의 면접 결과</h3>
            <div className="video-grid">
                {videos && videos.map((video) => (
                    <div key={video.interviewId} className="video-item">
                        <video src={video.videoUrl} controls width="100%"/>
                        <h3>{video.title}</h3>
                        <p>{ formatDate(video.createdAt) }</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoGrid;
