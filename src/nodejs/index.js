require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const mysql = require('mysql2');
const axios = require('axios');

const app = express();
const port = 5001;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// MySQL 연결
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.VITE_DB_PASSWORD,
  database: 'test_db',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류:', err);
  } else {
    console.log('MySQL에 성공적으로 연결되었습니다.');
  }
});

app.use(cors()); // CORS 미들웨어
app.use(bodyParser.json()); // JSON 파싱 미들웨어

// 구글 로그인 라우트
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  console.log('클라이언트에서 받은 토큰:', token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const { name, email, picture } = payload;

    console.log('사용자 ID 및 정보:', { userId, payload });

    const query = `
      INSERT INTO users (google_id, name, email, picture)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), picture = VALUES(picture)
    `;

    db.query(query, [userId, name, email, picture], (err, result) => {
      if (err) {
        console.error('사용자 정보 저장 오류:', err);
        return res.status(500).json({ error: '사용자 정보 저장 실패' });
      }

      console.log('사용자 정보 저장 성공', result);
      res.status(200).json({ userId, payload });
    });
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    res.status(400).json({ error: '유효하지 않은 토큰' });
  }
});

// 카테고리 추가 로직
app.post('/api/add-category', (req, res) => {
  const { userId, name } = req.body;
  console.log('Received data:', { userId, name });

  if (!userId || !name) {
    return res.status(400).json({ error: 'userId가 없습니다.' });
  }

  // 사용자의 카테고리 개수 확인
  const countQuery = `
    SELECT COUNT(*) as count FROM categories
    WHERE user_id = ?
  `;

  db.query(countQuery, [userId], (err, results) => {
    if (err) {
      console.error('카테고리 개수 확인 오류:', err.message);
      return res.status(500).json({ error: '카테고리 개수 확인 실패' });
    }

    const categoryCount = results[0].count;

    // 사용자가 이미 5개의 카테고리를 가지고 있는지 확인
    if (categoryCount >= 5) {
      return res
        .status(400)
        .json({ error: '카테고리는 최대 5개까지 생성할 수 있습니다.' });
    }

    // 중복 카테고리 이름 확인
    const checkQuery = `
      SELECT * FROM categories
      WHERE user_id = ? AND name = ?
    `;

    db.query(checkQuery, [userId, name], (err, results) => {
      if (err) {
        console.error('중복 확인 오류:', err.message);
        return res.status(500).json({ error: '중복 확인 실패' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: '이미 존재하는 카테고리입니다.' });
      }

      // 카테고리 추가 쿼리
      const query = `
        INSERT INTO categories (user_id, name)
        VALUES (?, ?)
      `;

      db.query(query, [userId, name], (err, result) => {
        if (err) {
          console.error('카테고리 추가 오류:', err.message);
          return res.status(500).json({ error: '카테고리 추가 실패' });
        }

        console.log('카테고리 추가 성공', result);
        res.status(200).json({ success: true });
      });
    });
  });
});

// 카테고리 조회 로직
app.get('/api/get-categories/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId가 없습니다.' });
  }

  const query = `
    SELECT * FROM categories
    WHERE user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('카테고리 조회 오류:', err.message);
      return res.status(500).json({ error: '카테고리 조회 실패' });
    }

    console.log('카테고리 조회 성공', results);
    res.status(200).json(results);
  });
});

// 카카오페이 결제 API
app.post('/api/kakao-pay-approve', async (req, res) => {
  const { item_name, total_amount, user_email } = req.body;
  console.log('Received KakaoPay data:', {
    item_name,
    total_amount,
    user_email,
  });

  try {
    const response = await axios.post(
      'https://open-api.kakaopay.com/online/v1/payment/ready',
      {
        cid: 'TC0ONETIME',
        partner_order_id: 'partner_order_id',
        partner_user_id: user_email, // 이메일을 partner_user_id로 사용
        item_name: item_name,
        quantity: '1',
        total_amount: total_amount,
        vat_amount: '200',
        tax_free_amount: '0',
        approval_url: 'http://localhost:5173/success',
        fail_url: 'http://localhost:5173/fail',
        cancel_url: 'http://localhost:5173/cancel',
      },
      {
        headers: {
          Authorization: `SECRET_KEY ${process.env.VITE_KAKAO_REST_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('카카오페이 승인 응답:', response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      '카카오페이 결제 승인 오류:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: '카카오페이 결제 승인 실패' });
  }
});

// 카카오페이 성공
app.get('/api/kakao-pay-success', (req, res) => {
  res.redirect('http://localhost:5173/success?pg_token=' + req.query.pg_token);
});

// 카카오페이 취소
app.get('/api/kakao-pay-cancel', (req, res) => {
  res.redirect('http://localhost:5173/cancel');
});

// 카카오페이 실패
app.get('/api/kakao-pay-fail', (req, res) => {
  res.redirect('http://localhost:5173/fail');
});

// URL 일치 확인 로직
app.post('/api/check-url', (req, res) => {
  const { categoryId } = req.body;
  const userId = req.headers['user-id']; // 헤더에서 userId를 가져옵니다.

  console.log('Received data for URL check:', { categoryId, userId });

  if (!categoryId || !userId) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }

  // 해당 카테고리와 일치하는 URL을 찾는 쿼리 (title 조건 제거)
  const query = `
    SELECT * FROM urls
    WHERE category_id = ? AND user_id = ?
  `;

  db.query(query, [categoryId, userId], (err, results) => {
    if (err) {
      console.error('URL 조회 오류:', err.message);
      return res.status(500).json({ error: 'URL 조회 실패' });
    }

    if (results.length > 0) {
      console.log('일치하는 URL을 찾았습니다:', results);
      return res.status(200).json({ match: true, urls: results }); // 필드 이름을 'urls'로 변경
    } else {
      console.log('일치하는 URL이 없습니다.');
      return res.status(200).json({ match: false, urls: [] }); // 빈 배열 반환
    }
  });
});

// URL 추가 로직
app.post('/api/add-url', (req, res) => {
  const { title, url, categoryId } = req.body;
  const userId = req.headers['user-id']; // 헤더에서 userId를 가져옵니다.

  console.log('Received data:', { title, url, categoryId, userId });

  if (!title || !url || !categoryId || !userId) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }

  // URL 추가 쿼리
  const query = `
    INSERT INTO urls (user_id, title, url, category_id, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(query, [userId, title, url, categoryId], (err, result) => {
    if (err) {
      console.error('URL 추가 오류:', err.message);
      return res.status(500).json({ error: 'URL 추가 실패' });
    }

    console.log('URL 추가 성공', result);
    res.status(200).json({ success: true });
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
