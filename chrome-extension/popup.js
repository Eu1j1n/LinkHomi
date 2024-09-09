document.addEventListener('DOMContentLoaded', () => {
  const historyDiv = document.getElementById('history');

  // chrome.history API를 사용하여 기록 불러오기
  chrome.history.search({ text: '', maxResults: 10 }, (historyItems) => {
    historyItems.forEach((item) => {
      const historyItem = document.createElement('div');
      historyItem.classList.add('history-item');

      // URL 링크 생성
      const link = document.createElement('a');
      link.href = item.url;
      link.textContent = item.title || item.url;
      link.target = '_blank';

      historyItem.appendChild(link);
      historyDiv.appendChild(historyItem);
    });
  });
});
