(() => {
  let problemName = "";
  let currentProblem = "";
  let currentProblemTitle = "";
  let currentCode = "";
  let errors = [];
  let checkbtn = document.getElementById("push-btn");
  let checkdebug = document.getElementById("debug-btn");
  const parent = document.getElementById("codingSection");
  const codeCard = parent.getElementsByClassName("card")[0];
  const codeCardHeader = codeCard.getElementsByClassName("card-header")[0];
  const cardbody = parent.getElementsByClassName("card-body")[0];
  const problemContainer = document.getElementById("problemSection");
  const card = problemContainer.getElementsByClassName("card")[0];
  const cardHeader = card.getElementsByClassName("card-header")[0];
  const title = cardHeader.querySelector("h2");
  const card_body = card.getElementsByClassName("card-body")[0];
  const example = card_body.querySelector("pre").textContent;

  const outputDiv = document.getElementById("output");

  if (!document.getElementById("custom-btn-style")) {
    const style = document.createElement("style");
    style.id = "custom-btn-style";
    style.textContent = `
      .custom-btn {
          background-color: #047857;
          color: white; 
          padding: 12px; 
          border: none; 
          border-radius: 4px; 
          font-size: 16px; 
          font-weight: bold; 
          cursor: pointer; 
      }
      .custom-btn:hover {
          background-color: #065F46; 
      }
    `;
    document.head.appendChild(style);
  }

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, problemId } = obj;
    if (type == "NEW") {
      chrome.storage.session.clear();
      currentProblem = problemId;
      problemName = problemId;
      newProblemOpened();
    }
  });

  const newProblemOpened = () => {
    const analyzeExists = document.getElementById("analyze-btn");
    if (!analyzeExists) {
      const analyzeBtn = document.createElement("button");
      analyzeBtn.id = "analyze-btn";
      analyzeBtn.className = "custom-btn";
      analyzeBtn.title = "Click to analyze the question with gemini";
      analyzeBtn.textContent = "Analyse";
      analyzeBtn.onclick = analyzeRequest;
      cardHeader.appendChild(analyzeBtn);
      currentProblemTitle = title.textContent;
      currentProblem = card_body.querySelector("div").textContent;

      chrome.runtime.sendMessage({
        type: "STORE_DATA",
        data: {
          title: currentProblemTitle,
          problem: currentProblem,
          example: example,
        },
      });
    }
  };

  const checkRejectedText = () => {
    const nestedDivs = outputDiv.querySelectorAll(".rejected");
    if (nestedDivs.length > 0) {
      errors = [];
      const container = outputDiv.querySelectorAll(".test-case-result");
      container.forEach((div) => {
        let inside_div = div.querySelectorAll(".test-case-input");
        currentCode = "";
        inside_div.forEach((in_div) => {
          let key = in_div.querySelector("div").textContent;
          let value = in_div.querySelector(".test-case-output").textContent;
          temp = {
            elem: key,
            val: value,
          };
          errors.push(temp);
        });
      });
    }
    return nestedDivs.length;
  };

  const observer = new MutationObserver(() => {
    let check = checkRejectedText();
    checkdebug = document.getElementById("debug-btn");
    checkbtn = document.getElementById("push-btn");
    if (!check) {
      if (checkdebug) {
        codeCardHeader.removeChild(checkdebug);
      }
      if (!checkbtn) {
        const pushBtn = document.createElement("button");
        pushBtn.id = "push-btn";
        pushBtn.className = "custom-btn";
        pushBtn.title = "Click to push your code to github";
        pushBtn.textContent = "Push";
        pushBtn.onclick = OpenNewTab;
        codeCardHeader.appendChild(pushBtn);
      }
    } else if (check) {
      curr = document.getElementsByClassName("CodeMirror-code")[0];
      currentCode = curr.outerHTML;

      let temp = {
        currentCode: currentCode,
        errors: errors,
      };

      chrome.runtime.sendMessage({
        type: "STORE_DATA",
        data: temp,
      });

      if (checkbtn) {
        codeCardHeader.removeChild(checkbtn);
      }
      if (!checkdebug) {
        const debugBtn = document.createElement("button");
        debugBtn.id = "debug-btn";
        debugBtn.className = "custom-btn";
        debugBtn.title = "Click to debug your code using gemini";
        debugBtn.textContent = "Debug";
        debugBtn.style.backgroundColor = "red";
        debugBtn.onclick = debugQuestion;
        codeCardHeader.appendChild(debugBtn);
      }
    }
  });

  observer.observe(outputDiv, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  const analyzeRequest = () => {
    console.log("analyze request sent");
    chrome.runtime.sendMessage({
      type: "COMMAND",
      data: {
        command: "Analyze",
      },
    });
    chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" });
  };

  const OpenNewTab = () => {
    chrome.runtime.sendMessage({
      type: "OPEN_NEWTAB",
      data: {
        url: "index.html",
      },
    });
  };

  const debugQuestion = () => {
    chrome.runtime.sendMessage({
      type: "COMMAND",
      data: {
        command: "Debug",
      },
    });
    chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" });
  };

  newProblemOpened();
})();
