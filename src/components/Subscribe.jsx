import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../style/Subscribe.css";
import { gsap } from "gsap";
import axios from "axios";
import Swal from "sweetalert2";

function Subscribe() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const userEmail = localStorage.getItem("userEmail");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    document.body.classList.add("subscribe-page");

    return () => {
      document.body.classList.remove("subscribe-page");
    };
  }, []);

  useEffect(() => {
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

    // 애니메이션
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
        delay: 0.2,
      }
    );

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
        delay: 1.5,
      }
    );
  }, []);

  useEffect(() => {
    if (userEmail) {
      axios
        .get(`http://localhost:5001/api/get-user-grade/${userEmail}`)
        .then((response) => {
          setGrade(response.data.grade || "NORMAL");
        })
        .catch((error) => {
          console.error("사용자 등급 조회 오류:", error);
          setGrade("NORMAL");
        });
    } else {
      setGrade("NORMAL");
    }
  }, [userEmail]);

  const handlePayment = async (productName, price) => {
    try {
      // 결제 제한 조건
      if (grade === "PRO") {
        Swal.fire({
          icon: "error",
          title: "결제 불가",
          text: "이미 PRO 등급입니다.",
          allowOutsideClick: false,
        });
        return;
      } else if (
        grade === "STANDARD" &&
        (productName === "BASIC" || productName === "STANDARD")
      ) {
        Swal.fire({
          icon: "error",
          title: "결제 불가",
          text: "현재 STANDARD 등급에서는 BASIC 및 STANDARD 패키지를 구매할 수 없습니다.",
          allowOutsideClick: false,
        });
        return;
      } else if (grade === "BASIC" && productName === "BASIC") {
        Swal.fire({
          icon: "error",
          title: "결제 불가",
          text: "현재 BASIC 등급입니다. 이미 BASIC 패키지를 이용 중입니다.",
          allowOutsideClick: false,
        });
        return;
      }

      localStorage.setItem("selected_item_name", productName);

      const response = await axios.post(
        "http://localhost:5001/api/kakao-pay-approve",
        {
          item_name: productName,
          total_amount: price,
          user_email: email,
        }
      );

      const { next_redirect_pc_url } = response.data;

      document.body.style.overflow = "hidden";

      Swal.fire({
        title: "결제 진행 중...",
        html: "결제 페이지로 이동합니다.",
        timer: 3000,
        timerProgressBar: true,
        didClose: () => {
          document.body.style.overflow = "auto";
          window.location.href = next_redirect_pc_url;
        },
      });
    } catch (error) {
      console.error("카카오페이 결제 준비 오류:", error);
    }
  };

  return (
    <div className="subscribe-container">
      <h1 className="intro-text">
        카카오페이를 통해 간편하게 결제하고
        <br />단 한 번의 결제로 카테고리를 확장하여 보다 세밀하게 관리해 보세요!
      </h1>
      <p className="current-grade">현재 등급: {grade || "NORMAL"}</p>
      <div className="pricing-sections">
        <div
          className={`pricing-wrapper ${
            grade === "BASIC" || grade === "STANDARD" || grade === "PRO"
              ? "disabled"
              : ""
          }`}
          onClick={() => handlePayment("BASIC", 4900)}
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
          <p className="price">4,900원</p>
        </div>

        <div
          className={`pricing-wrapper ${
            grade === "STANDARD" || grade === "PRO" ? "disabled" : ""
          }`} // STANDARD 및 PRO 등급에서 STANDARD 패키지 비활성화
          onClick={() => handlePayment("STANDARD", 9800)}
        >
          <div className="pricing-section intermediate">
            <h2>STANDARD</h2>
            <p>
              중급 사용자를 위한 선택!
              <br />
              최대 10개의 카테고리로 더 넓은 관리 기능을 제공합니다.
            </p>
          </div>
          <p className="price">9,900원</p>
        </div>

        <div
          className={`pricing-wrapper ${grade === "PRO" ? "disabled" : ""}`}
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
          <p className="price">14,800원</p>
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
