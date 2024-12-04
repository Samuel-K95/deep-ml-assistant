chrome.tabs.onUpdated.addListener((tabId, tab) => {
  console.log("REloaddeddddd!");
  if (tab.url && tab.url.includes("deep-ml.com/problem")) {
    console.log("New");
    chrome.storage.sync.clear();
    const queryParameters = tab.url.split("/")[4];
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      problemId: queryParameters,
    });
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_DATA") {
    chrome.storage.sync.get(null, (existingData) => {
      let updatedData = { ...existingData, ...message.data };
      console.log("updated", updatedData);
      chrome.storage.sync.set(updatedData, () => {
        if (chrome.runtime.lastError) {
          console.error("Error storing data:", chrome.runtime.lastError);
        }

        chrome.storage.sync.get(null, (updatedItems) => {
          console.log("Updated items after set:", updatedItems);
        });
      });
    });
  } else if (message.type === "COMMAND") {
    if (message.data.command === "Analyze") {
      chrome.storage.sync.get(
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

          let data = "There was error fetching response";
          if (response.ok) {
            data = await response.json();
          }
          console.log("data");
          sendToSidePanel(data);
        }
      );
    } else if (message.data.command === "Debug") {
      chrome.storage.sync.get(null, async (items) => {
        let response = await fetch("http://127.0.0.1:8000/api/gemini/debug/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problem: items.problem,
            example: items.example,
            code: items.currentCode,
            errors: items.errors,
          }),
        });
        let data = "There was an error fetching response";
        if (response.ok) {
          data = await response.json();
        }
        sendToSidePanel(data);
      });
    }
  } else if (message.type === "OPEN_SIDEPANEL") {
    console.log("open side panel");
    chrome.sidePanel.open({ tabId: sender.tab.id });
  }
});

const sendToSidePanel = (data) => {
  chrome.storage.sync.get(null, (existingData) => {
    gemini_data = { gemini_response: data };
    let updatedData = { ...existingData, ...gemini_data };
    console.log("updated", updatedData);
    chrome.storage.sync.set(updatedData, () => {
      if (chrome.runtime.lastError) {
        console.error("Error storing data:", chrome.runtime.lastError);
      }
      chrome.storage.sync.get(null, (updatedItems) => {
        console.log("Updated items after set:", updatedItems);
      });
    });
  });
};
