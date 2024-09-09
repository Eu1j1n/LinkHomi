require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OAuth2Client } = require("google-auth-library");
const mysql = require("mysql2");

const app = express();
const port = 5001;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// MySQL 연결
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Cjftlr224!",
  database: "test_db",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL 연결 오류:", err);
  } else {
    console.log("MySQL에 성공적으로 연결되었습니다.");
  }
});

app.use(cors()); // CORS 미들웨어
app.use(bodyParser.json()); // JSON 파싱 미들웨어

// 구글 로그인 라우트
app.post("/api/google-login", async (req, res) => {
  const { token } = req.body;

  console.log("클라이언트에서 받은 토큰:", token); // 클라이언트에서 받은 토큰 출력

  try {
    // 토큰 검증
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // 클라이언트 ID
    });

    // 사용자 정보 추출
    const payload = ticket.getPayload();
    const userId = payload["sub"]; // 사용자 ID
    const { name, email, picture } = payload;

    console.log("사용자 ID 및 정보:", { userId, payload }); //사용자 정보 콘솔로 찍히게하기

    // MySQL에 구글 사용자 정보 삽입 코드
    const query = `
      INSERT INTO users (google_id, name, email, picture)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), picture = VALUES(picture)
    `;

    db.query(query, [userId, name, email, picture], (err, result) => {
      if (err) {
        console.error("사용자 정보 저장 오류:", err);
        return res.status(500).json({ error: "사용자 정보 저장 실패" });
      }

      console.log("사용자 정보 저장성공", result);
      res.status(200).json({ userId, payload });
    });
  } catch (error) {
    console.error("토큰 검증 오류:", error); // 오류 발생 시 로그 출력
    res.status(400).json({ error: "유효하지 않은 토큰" }); // 클라이언트에 오류 응답
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
