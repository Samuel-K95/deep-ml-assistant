chrome.tabs.onUpdated.addListener((tabId, tab) => {
  console.log("change detected", tab);
  if (tab.title && tab.title.includes("deep-ml.com/problems")) {
    console.log(tab, "new problem from service worker");
    chrome.storage.session.clear();
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      id: tabId,
    });
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message recienved");
  if (message.type === "STORE_DATA") {
    chrome.storage.session.get(null, (existingData) => {
      let updatedData = { ...existingData, ...message.data };
      console.log("updated", updatedData);
      chrome.storage.session.set(updatedData, () => {
        if (chrome.runtime.lastError) {
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          sendResponse({ success: true, data: updatedData });
        }
      });
    });
  } else if (message.type === "COMMAND") {
    if (message.data.command === "Analyze") {
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

          let data = "There was error fetching response";
          let response_type = "error";
          if (response.ok) {
            data = await response.json();
            response_type = "analyze";
          }
          sendToSidePanel(response_type, data);
          return true;
        }
      );
    } else if (message.data.command === "Debug") {
      chrome.storage.session.get(null, async (items) => {
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
        let response_type = "error";
        if (response.ok) {
          data = await response.json();
          response_type = "debug";
        }
        sendToSidePanel(response_type, data);
      });
    }
  } else if (message.type === "OPEN_SIDEPANEL") {
    console.log("open side panel");
    chrome.sidePanel.open({ tabId: sender.tab.id });
  } else if (message.type === "OPEN_NEWTAB") {
    console.log("open new tab");
    chrome.storage.session.get(null, (updatedItems) => {
      console.log("Updated items after set:", updatedItems);
    });
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") }, () => {
      sendResponse({ success: true });
    });
  }
  return true;
});

const sendToSidePanel = (type, data) => {
  chrome.storage.session.get(null, (existingData) => {
    gemini_data = { gemini_response: data };
    gemini_data = { ...gemini_data, ...{ response_type: type } };
    let updatedData = { ...existingData, ...gemini_data };
    console.log("sending to sidepanel", updatedData);
    chrome.storage.session.set(updatedData, () => {
      if (chrome.runtime.lastError) {
        console.error("Error storing data:", chrome.runtime.lastError);
      }
      chrome.storage.session.get(null, (updatedItems) => {
        console.log("Updated items after set:", updatedItems);
      });
    });
  });
};
