// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getBrowsingHistory') {
    chrome.history.search({ text: '', maxResults: 10 }, (items) => {
      sendResponse(items);
    });
    return true; // Indicates async response
  }
});
