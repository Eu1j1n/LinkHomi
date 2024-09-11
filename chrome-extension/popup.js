document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ action: 'getBrowsingHistory' }, (response) => {
    const historyDiv = document.getElementById('history');
    response.forEach((item) => {
      const historyItem = document.createElement('div');
      historyItem.classList.add('history-item');

      const link = document.createElement('a');
      link.href = item.url;
      link.textContent = item.title || item.url;
      link.target = '_blank';

      historyItem.appendChild(link);
      historyDiv.appendChild(historyItem);
    });
  });
});
