import React from 'react';
//로그인 했을 때 이메일, 이름, 이미지 받아오기 기능 구현 중

export const Profile = ({userInfo}) => {
  return (
    <>
    <div style={{
      width:"32px",
      height:"32px",
      borderRadius:"32px",
      background:`url(${userInfo.profileImg.replace("96", "32")})`}}
      />
    <h3>이름: {userInfo.name}</h3>
    <h3>이메일: {userInfo.email}</h3>
    </>
  );
}
