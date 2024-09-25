document.addEventListener('DOMContentLoaded', () => {
  const historyListElement = document.getElementById('historyList');
  const searchBar = document.getElementById('searchBar');
  const dropZone = document.getElementById('dropZone');

  const historyItems = []; // 방문 기록을 저장할 배열

  // 일주일치 방문 기록 가져오기
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 1주일 전
  chrome.history.search(
    {
      text: '',
      startTime: oneWeekAgo,
      maxResults: 100,
    },
    (items) => {
      items.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('draggable', true);
        listItem.className = 'history-list-item';

        const image = document.createElement('img');
        image.src = getFaviconUrl(item.url);
        image.alt = 'Favicon';
        image.style.width = '20px';
        image.style.marginRight = '10px';

        image.onerror = () => {
          const defaultIcon = document.createElement('i');
          defaultIcon.className = 'fa-regular fa-face-meh';
          defaultIcon.style.fontSize = '20px';
          defaultIcon.style.marginRight = '10px';
          listItem.insertBefore(defaultIcon, title);
          image.style.display = 'none';
        };

        const title = document.createElement('a');
        title.textContent = truncateTitle(item.title);
        title.href = item.url;
        title.target = '_blank';
        title.style.textDecoration = 'none';

        const copyIcon = document.createElement('i');
        copyIcon.className = 'fa-solid fa-link copy-icon';
        copyIcon.onclick = () => copyToClipboard(item.url);

        // 드래그 시작 이벤트
        listItem.ondragstart = (event) => {
          // 드래그할 데이터를 설정 (제목과 URL을 JSON 형태로 저장)
          const dragData = {
            title: item.title, // 제목 추가
            url: item.url, // URL 추가
          };
          event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
        };

        listItem.appendChild(image);
        listItem.appendChild(title);
        listItem.appendChild(copyIcon);
        historyListElement.appendChild(listItem);

        // 방문 기록을 배열에 저장
        historyItems.push(item);
      });

      // 모든 히스토리 아이템이 추가된 후 초기 검색 수행
      performSearch();
    }
  );

  // 검색 기능
  searchBar.addEventListener('input', performSearch);

  function performSearch() {
    const searchTerm = searchBar.value.toLowerCase();
    historyListElement.innerHTML = ''; // 리스트 초기화

    historyItems.forEach((item) => {
      const titleText = truncateTitle(item.title).toLowerCase();
      if (titleText.includes(searchTerm)) {
        const listItem = document.createElement('li');
        listItem.setAttribute('draggable', true);
        listItem.className = 'history-list-item';

        const image = document.createElement('img');
        image.src = getFaviconUrl(item.url);
        image.alt = 'Favicon';
        image.style.width = '20px';
        image.style.marginRight = '10px';

        image.onerror = () => {
          const defaultIcon = document.createElement('i');
          defaultIcon.className = 'fa-regular fa-face-meh';
          defaultIcon.style.fontSize = '20px';
          defaultIcon.style.marginRight = '10px';
          listItem.insertBefore(defaultIcon, title);
          image.style.display = 'none';
        };

        const title = document.createElement('a');
        title.textContent = truncateTitle(item.title);
        title.href = item.url;
        title.target = '_blank';
        title.style.textDecoration = 'none';

        const copyIcon = document.createElement('i');
        copyIcon.className = 'fa-solid fa-link copy-icon';
        copyIcon.onclick = () => copyToClipboard(item.url);

        // 드래그 시작 이벤트
        listItem.ondragstart = (event) => {
          // 드래그할 데이터를 설정 (제목과 URL을 JSON 형태로 저장)
          const dragData = {
            title: item.title, // 제목 추가
            url: item.url, // URL 추가
          };
          event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
        };

        listItem.appendChild(image);
        listItem.appendChild(title);
        listItem.appendChild(copyIcon);
        historyListElement.appendChild(listItem);
      }
    });
  }

  // 드롭존에서 드롭 이벤트 처리
  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault(); // 기본 동작 방지
    dropZone.style.border = '2px dashed #557AFF'; // 드래그 시 스타일 변경
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.style.border = ''; // 드래그가 떠날 때 스타일 원복
  });

  dropZone.addEventListener('drop', async (event) => {
    event.preventDefault();
    const dragData = JSON.parse(event.dataTransfer.getData('text/plain'));

    // 드롭된 데이터 처리
    console.log('드롭된 URL:', dragData.url);
    console.log('드롭된 제목:', dragData.title);

    // 사용자 ID 가져오기
    const userId = localStorage.getItem('userId');

    // API 요청 (여기서는 예시로 Axios 사용)
    try {
      await axios.post('http://localhost:5001/api/add-url', {
        categoryId: 1, // 원하는 카테고리 ID로 변경
        url: dragData.url,
        title: dragData.title,
        userId: userId,
      });

      Swal.fire({
        title: '성공!',
        text: 'URL이 카테고리에 추가되었습니다.',
        icon: 'success',
        confirmButtonText: '확인',
      });
    } catch (error) {
      console.error('Error adding URL:', error);
      Swal.fire({
        title: '오류!',
        text: 'URL 추가에 실패했습니다.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }

    dropZone.style.border = ''; // 스타일 원복
  });
});

// 주어진 URL에서 favicon URL을 가져오는 함수
function getFaviconUrl(url) {
  try {
    const urlObject = new URL(url);
    return `${urlObject.protocol}//${urlObject.hostname}/favicon.ico`;
  } catch (error) {
    console.error('URL 변환 오류:', error);
    return '';
  }
}

// 제목을 15자로 잘라내는 함수
function truncateTitle(title) {
  return title.length > 15 ? title.substring(0, 15) + '...' : title;
}

// 클립보드에 URL 복사
function copyToClipboard(url) {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert('URL이 클립보드에 복사되었습니다!');
    })
    .catch((err) => {
      console.error('클립보드 복사 실패:', err);
    });
}
