import React from 'react';
import { GrShareOption } from "react-icons/gr";
import Swal from 'sweetalert2'; 
import '../style/PostCard.css'; 

function Share({ url, image}) {
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        console.log('URL이 클립보드에 복사되었습니다:', url);

        // alert 부분
        Swal.fire({
          title: "성공!",
          text: "URL이 클립보드에 복사되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
      })
      .catch((error) => {
        console.error('클립보드 복사 실패!', error);
        Swal.fire({
          title: "실패!",
          text: "URL 복사에 실패했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  return (
    <>
      <GrShareOption className='share-button' onClick={handleCopyUrl} />
        {image && <img src={image} alt="Share" />}
    </>
  );
}

export default Share;
