function loadSidePanelData() {
  const target = document.getElementById("outer-continer");
  if (target) {
    chrome.storage.sync.get(null, (existingData) => {
      if (Object.keys(existingData).length === 0) {
        target.textContent = "";
      } else if (existingData.gemini_response) {
        const content = document.createElement("div");
        content.className = "container";
        content.textContent = existingData.gemini_response;
        target.appendChild(content);
      }
    });
  }
}

chrome.storage.sync.onChanged.addListener(() => {
  loadSidePanelData();
});

document.addEventListener("DOMContentLoaded", () => {
  loadSidePanelData();
});
