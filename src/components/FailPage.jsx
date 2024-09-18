// src/pages/FailPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // sweetalert2 임포트
import "sweetalert2/dist/sweetalert2.min.css"; // sweetalert2 스타일 임포트

function FailPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 결제 실패 시 Swal 모달을 띄움
    Swal.fire({
      title: "결제 실패",
      text: "결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      icon: "error",
      confirmButtonText: "메인 페이지로 돌아가기",
      showCloseButton: true,
      allowOutsideClick: false,
    }).then(() => {
      navigate("/main"); // 모달 확인 후 메인 페이지로 이동
    });
  }, [navigate]);

  return <div></div>;
}

export default FailPage;
