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
      existingData.currentCode = message.data.currentCode;
      existingData.errors = message.data.errors;
      const updatedData = { ...existingData, ...message.data };
      chrome.storage.session.set(updatedData, () => {
        if (chrome.runtime.lastError) {
          console.error("Error storing data:", chrome.runtime.lastError);
        }
      });
    });
  } else if (message.type == "COMMAND") {
    if (message.data.command == "Analyze") {
      chrome.storage.session.get(
        ["title", "problem", "example"],
        async (items) => {
          let response = await fetch(
            "http://127.0.0.1:8000/api/gemini/analyze/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: items.title,
                problem: items.problem,
                example: items.example,
              }),
            }
          );
          if (response.ok) {
            let data = await response.json();
            console.log("response data:", data);
          } else {
            console.error("Error:", response.status, response.statusText);
          }
        }
      );
    } else if (message.data.command === "Debug") {
      chrome.storage.session.get(
        ["problem", "example", "currentCode", "errors"],
        async (items) => {
          let response = await fetch(
            "http://127.0.0.1:8000/api/gemini/debug/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                problem: items.problem,
                example: items.example,
                code: items.currentCode,
                erros: items.errors,
              }),
            }
          );
          if (response.ok) {
            let data = await response.json();
            console.log("response data:", data);
          } else {
            console.error("Error:", response.status, response.statusText);
          }
        }
      );
    }
  }
});
