import Lottie from 'lottie-react';
import loadingLottie from '../assets/images/lotties/loading.json';
import styled from 'styled-components';

const LoadingScreenContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; // 부모 컨테이너에 상대 위치 설정
  height: 100vh; // 전체 화면 높이
  width: 100vw; // 전체 화면 너비
  background-color: #ffffff; // 선택적 배경색
`;

const LottieContainer = styled.div`
  position: absolute; // 절대 위치 설정
  top: 50%; // 수직 중앙
  left: 50%; // 수평 중앙
  transform: translate(-50%, -50%); // 정확한 중앙으로 이동
  width: 200px; // 필요한 너비 설정
  height: auto; // 자동 높이 설정
  max-width: 100%; // 화면 크기에 따라 너비 제한
  max-height: 80%; // 화면 높이에 따라 높이 제한
`;

function LoadingScreen() {
  return (
    <LoadingScreenContainer>
      <LottieContainer>
        <Lottie animationData={loadingLottie} />
      </LottieContainer>
    </LoadingScreenContainer>
  );
}

export default LoadingScreen;
