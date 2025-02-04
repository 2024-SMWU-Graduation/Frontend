import React from 'react';
// import {Background, LoadingText} from './LoadingStyle';
import Spinner from '../assets/images/Spinner.gif';

const Loading = () => {
  return (
    <div>
      <h3>잠시만 기다려주세요..</h3>
      <img src={Spinner} alt='로딩' width="15%" />
    </div>
  );
};

export default Loading;


// export default () => {
//     return (
//       <Background>
//         <LoadingText>잠시만 기다려 주세요.</LoadingText>
//         <img src={Spinner} alt="로딩중" width="5%" />
//       </Background>
//     );
// };