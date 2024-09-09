// chrome-extension/historyService.js
export const getBrowsingHistory = () => {
  return new Promise((resolve, reject) => {
    chrome.history.search({ text: '', maxResults: 10 }, (historyItems) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(
          historyItems.map((item) => ({
            url: item.url,
            title: item.title,
            icon: `chrome://favicon/size/32x32/${item.url}`, // URL의 favicon 아이콘 가져오기
          }))
        );
      }
    });
  });
};
