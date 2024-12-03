chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("deep-ml.com/problem")) {
    const queryParameters = tab.url.split("/")[4];

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      problemId: queryParameters,
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_DATA") {
    chrome.storage.session.get(null, (existingData) => {
      existingData.currentCode = "";
      existingData.errors = [];
      const updatedData = { ...existingData, ...message.data };
      console.log("serive", updatedData);
      chrome.storage.session.set(updatedData, () => {
        if (chrome.runtime.lastError) {
          console.error("Error storing data:", chrome.runtime.lastError);
        }
      });
    });
  } else if (message.type == "COMMAND") {
    if (message.data.command == "Analyze") {
      chrome.storage.session.get(["title", "problem", "example"], (items) => {
        console.log(items.title);
        console.log(items.problem);
        console.log(items.example);
      });
    }
  }
});
