import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // useLocation 훅 추가
import "../style/Subscribe.css";
import { gsap } from "gsap";
import axios from "axios"; // Axios를 사용해 서버와 통신

function Subscribe() {
  const location = useLocation(); // useLocation 훅 사용
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  useEffect(() => {
    // 이메일 값을 콘솔에 출력
    console.log("받아온 이메일:", email);

    // 인트로 텍스트 애니메이션
    gsap.fromTo(
      ".intro-text",
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.2, // 인트로 텍스트 시작 지연
      }
    );

    // 박스와 가격 애니메이션
    gsap.fromTo(
      [".pricing-section", ".price"],
      {
        opacity: 0,
        y: 50,
      },
      {
        duration: 1,
        opacity: 1,
        y: 0,
        stagger: 0.3,
        ease: "power3.out",
        delay: 1.5, // 인트로 텍스트 이후에 애니메이션 시작
        repeat: 0,
        yoyo: false,
      }
    );
  }, [email]); // email을 의존성 배열에 추가

  const handlePayment = async (productName, price) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/kakao-pay-approve",
        {
          item_name: productName,
          total_amount: price,
          user_email: email, // 이메일을 추가하여 서버로 전송
        }
      );

      const { next_redirect_pc_url } = response.data;

      window.location.href = next_redirect_pc_url;
    } catch (error) {
      console.error("카카오페이 결제 준비 오류:", error);
    }
  };

  return (
    <div className="subscribe-container">
      <h1 className="intro-text">
        카카오페이를 통해 간편하게 결제하고
        <br />
        단 한 번의 결제로 카테고리를 확장하여
        <br />
        보다 세밀하게 관리해 보세요!
      </h1>
      <div className="pricing-sections">
        <div
          className="pricing-wrapper"
          onClick={() => handlePayment("Beginner", 4900)}
        >
          <div className="pricing-section beginner">
            <h2>BASIC</h2>
            <p>
              시작하기에 완벽한 옵션!
              <br />
              최대 5개의 카테고리로 간편하게
              <br />
              관리하세요.
            </p>
          </div>
          <p className="price">5000원</p>
        </div>

        <div
          className="pricing-wrapper"
          onClick={() => handlePayment("Intermediate", 9800)}
        >
          <div className="pricing-section intermediate">
            <h2>STANDARD</h2>
            <p>
              중급 사용자를 위한 선택!
              <br />
              최대 10개의 카테고리로 더 넓은 관리 기능을 제공합니다.
            </p>
          </div>
          <p className="price">10000원</p>
        </div>

        <div
          className="pricing-wrapper"
          onClick={() => handlePayment("PRO", 14700)}
        >
          <div className="pricing-section pro">
            <h2>PRO</h2>
            <p>
              전문가용 패키지!
              <br />
              최대 15개의 카테고리로 최상의 관리와
              <br />
              유연성을 경험하세요.
            </p>
          </div>
          <p className="price">15000원</p>
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
