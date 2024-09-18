import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function CancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    MySwal.fire({
      icon: "warning",
      title: "결제가 취소되었습니다.",
      text: "결제 진행이 취소되었습니다. 다시 시도해주세요.",
      confirmButtonText: "확인",
    }).then(() => {
      navigate("/main"); // 메인 페이지로 리다이렉트
    });
  }, [navigate]);

  return <div></div>;
}

export default CancelPage;
