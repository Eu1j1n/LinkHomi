// src/pages/SuccessPage.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2"; // sweetalert2 임포트
import "sweetalert2/dist/sweetalert2.min.css"; // sweetalert2 스타일 임포트

function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pgToken = queryParams.get("pg_token");

    if (pgToken) {
      // 결제 성공 시 Swal 모달을 띄움
      Swal.fire({
        title: "결제 성공!",
        text: "결제가 성공적으로 완료되었습니다.",
        icon: "success",
        confirmButtonText: "메인 페이지로 이동",
        showCloseButton: true,
        allowOutsideClick: false,
      }).then(() => {
        navigate("/main"); // 모달 확인 후 메인 페이지로 이동
      });
    }
  }, [location.search, navigate]);

  return <div></div>;
}

export default SuccessPage;
