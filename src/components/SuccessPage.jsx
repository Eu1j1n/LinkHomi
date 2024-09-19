// src/pages/SuccessPage.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2"; // sweetalert2 임포트
import "sweetalert2/dist/sweetalert2.min.css"; // sweetalert2 스타일 임포트
import axios from "axios"; // axios 임포트

function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pgToken = queryParams.get("pg_token");

    if (pgToken) {
      const userEmail = localStorage.getItem("userEmail");
      const itemName = localStorage.getItem("selected_item_name");

      console.log("useremail" + userEmail);
      console.log("itemName" + itemName);

      axios
        .post("http://localhost:5001/api/kakao-pay-success", {
          user_email: userEmail,
          item_name: itemName,
        })
        .then(() => {
          Swal.fire({
            title: "결제 성공!",
            text: "결제가 성공적으로 완료되었습니다.",
            icon: "success",
            confirmButtonText: "메인 페이지로 이동",
            showCloseButton: true,
            allowOutsideClick: false,
          }).then(() => {
            navigate("/main");
          });
        })
        .catch((error) => {
          console.error("결제 정보 전송 오류:", error);
        });
    }
  }, [location.search, navigate]);

  return <div></div>;
}

export default SuccessPage;
