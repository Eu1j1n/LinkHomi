document.addEventListener('DOMContentLoaded', async () => {
  const historyListElement = document.getElementById('historyList');
  const searchBar = document.getElementById('searchBar');
  const dropZone = document.getElementById('dropZone');

  const historyItems = []; // 방문 기록을 저장할 배열
  let debounceTimeout; // 디바운스 타이머

  // 일주일치 방문 기록 가져오기
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 1주일 전

  // 방문 기록을 가져오는 함수
  const fetchHistory = () => {
    return new Promise((resolve) => {
      chrome.history.search(
        {
          text: '',
          startTime: oneWeekAgo,
          maxResults: 100,
        },
        (items) => {
          items.forEach((item) => {
            historyItems.push(item);
          });
          resolve(); // 비동기 작업 완료
        }
      );
    });
  };

  // 모든 비동기 작업이 완료될 때까지 기다리기
  await fetchHistory();

  // 초기 검색 수행
  performSearch();

  // 검색 기능
  searchBar.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(performSearch, 300); // 300ms 후에 performSearch 호출
  });

  function performSearch() {
    const searchTerm = searchBar.value.toLowerCase();
    historyListElement.innerHTML = ''; // 리스트 초기화

    historyItems.forEach((item) => {
      const titleText = truncateTitle(item.title).toLowerCase();
      if (titleText.includes(searchTerm)) {
        const listItem = createHistoryItem(item);
        historyListElement.appendChild(listItem);
      }
    });
  }

  function createHistoryItem(item) {
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
    title.textContent = truncateTitle(item.title); // 제목을 잘라서 표시
    title.href = item.url; // URL 설정
    title.target = '_blank'; // 새 탭에서 열리도록 설정
    title.style.textDecoration = 'none'; // 밑줄 없애기
    title.style.fontWeight = 'bold'; // 제목을 굵게 표시
    title.style.color = 'black';

    const copyIcon = document.createElement('i');
    copyIcon.className = 'fa-solid fa-link copy-icon';
    copyIcon.onclick = () => copyToClipboard(item.url, copyIcon);

    // 드래그 시작 이벤트
    listItem.ondragstart = (event) => {
      const dragData = {
        title: item.title,
        url: item.url,
      };
      event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    };

    listItem.appendChild(image);
    listItem.appendChild(title);
    listItem.appendChild(copyIcon);
    return listItem;
  }

  // 드롭존에서 드롭 이벤트 처리
  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.style.border = '2px dashed #557AFF';
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.style.border = '';
  });

  dropZone.addEventListener('drop', async (event) => {
    event.preventDefault();
    const dragData = JSON.parse(event.dataTransfer.getData('text/plain'));

    console.log('드롭된 URL:', dragData.url);
    console.log('드롭된 제목:', dragData.title);

    const userId = localStorage.getItem('userId');

    try {
      await axios.post('http://localhost:5001/api/add-url', {
        categoryId: 1,
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

    dropZone.style.border = '';
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
function copyToClipboard(url, iconElement) {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      // 사운드 재생 및 아이콘 변경
      const audio = new Audio('assets/copySound.mp3');
      audio.play();

      const originalIconClass = iconElement.className;
      iconElement.className = 'fa-solid fa-check'; // 아이콘 변경

      setTimeout(() => {
        iconElement.className = originalIconClass; // 아이콘 원복
      }, 1000); // 1초 후 아이콘 원복
    })
    .catch((err) => {
      console.error('클립보드 복사 실패:', err);
    });
}
