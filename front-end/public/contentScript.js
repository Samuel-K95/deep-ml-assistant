(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, problemId } = obj;
    chrome.storage.session.clear();
    if (type === "NEW") {
      console.log("new problem loaded");
      newProblemOpened();
    }
  });

  const style = document.createElement("style");
  style.textContent = `
    .custom-analyze-btn {
      position: fixed;
      left: 20px;
      bottom: 20px;
      background-color: green;
      color: white;
      font-weight: bold;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
    }

    .custom-debug-btn{
      position: fixed;
      right: 20px;
      bottom: 20px;
      background-color: red;
      color: white;
      font-weight: bold;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
    }
  `;
  document.head.append(style);

  let currentProblem = "";
  let currentTitle = "";
  let currentExample = [];
  let currentCodeNode = "";

  let debugExists = document.getElementById("debug-btn");
  let debugBtn = document.createElement("button");

  let pushExists = document.getElementById("push-btn");
  let pushBtn = document.createElement("button");

  const newProblemOpened = () => {
    let analyzeExists = document.getElementById("analyze-btn");
    let analyzeBtn = document.createElement("button");

    if (!analyzeExists) {
      analyzeBtn.id = "analyze-btn";
      analyzeBtn.className = "custom-analyze-btn";
      analyzeBtn.title = "Click to analyze the question with gemini";
      analyzeBtn.textContent = "Analyse";
      analyzeBtn.onclick = analyzeRequest;
    }
    const config = { attributes: true, childList: true, subtree: true };
    let callback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          let hcontainer = document.getElementsByClassName("prose")[0];
          if (hcontainer) {
            observeProseContainer(hcontainer);
          }
        }
      }
    };

    const parentObserver = new MutationObserver(callback);
    parentObserver.observe(document.body, config);

    function observeProseContainer(targetNode) {
      const config = { attributes: true, childList: true, subtree: true };

      const proseCallback = (mutationsList) => {
        let container = targetNode.getElementsByClassName("text-black")[0];

        if (container) {
          parentObserver.disconnect();
          currentTitle = container.textContent;

          const descriptionElement = document.querySelector(
            ".prose .space-y-2 .ml-6"
          );
          if (descriptionElement) {
            currentProblem = descriptionElement.textContent.trim();
          }

          const exampleContainers = document.querySelectorAll(
            ".prose .space-y-4.container"
          );

          let temp = [];
          exampleContainers.forEach((container) => {
            const inputElement = Array.from(
              container.querySelectorAll("h3")
            ).find((h3) => h3.textContent.includes("Input"));
            const outputElement = Array.from(
              container.querySelectorAll("h3")
            ).find((h3) => h3.textContent.includes("Output"));

            if (inputElement && outputElement) {
              const inputPre = inputElement.nextElementSibling;
              const outputPre = outputElement.nextElementSibling;

              if (
                inputPre &&
                inputPre.tagName === "PRE" &&
                outputPre &&
                outputPre.tagName === "PRE"
              ) {
                const example = {
                  input: inputPre.textContent.trim(),
                  output: outputPre.textContent.trim(),
                };
                temp.push(example);
              }
            }
          });
          currentExample = temp;
          document.body.append(analyzeBtn);
          proseObserver.disconnect();
        }
      };
      const proseObserver = new MutationObserver(proseCallback);
      proseObserver.observe(targetNode, config);
    }
  };

  outContainer = document.getElementsByClassName(
    "rounded-xl border bg-card text-card-foreground shadow"
  )[0];

  const outputContainerCallback = () => {
    let container = document.getElementsByClassName("output-container")[0];
    if (container) {
      outPutCallBackObserver(container);
    }

    function outPutCallBackObserver(targetNode) {
      const config = { attributes: true, childList: true, subtree: true };
      const outPutCallback = () => {
        debugExists = document.getElementById("debug-btn");
        pushExists = document.getElementById("push-btn");

        let container = document.getElementsByClassName("output-container")[0];

        if (container) {
          outPutObserver.disconnect();
          let statCOnt = container.getElementsByClassName("p-6")[1];
          if (statCOnt) {
            let statSpan = statCOnt.querySelector("span");
            if (statSpan) {
              let content = statSpan.textContent.trim();
              console.log("status", content);
              console.log("debug", debugExists, "push", pushExists);

              if (content === "Failed") {
                if (pushExists && document.body.contains(pushBtn)) {
                  pushBtn.remove();
                }
                if (!debugExists) {
                  debugBtn.id = "debug-btn";
                  debugBtn.textContent = "Debug";
                  debugBtn.className = "custom-debug-btn";
                  debugBtn.title = "Press to debug using gemini";
                  document.body.append(debugBtn);
                }
                debugBtn.onclick = debugQuestion;
              } else {
                console.log("accepted here");
                if (debugExists && document.body.contains(debugBtn)) {
                  debugBtn.remove();
                }
                if (!pushExists) {
                  pushBtn.id = "push-btn";
                  pushBtn.textContent = "Push";
                  pushBtn.className = "custom-debug-btn";
                  pushBtn.style.backgroundColor = "green";
                  pushBtn.title = "Press to push to github";
                  document.body.append(pushBtn);
                }
                pushBtn.onclick = OpenNewTab;
              }
            } else {
              console.log("Span element not found.");
            }
          } else {
            console.log("p-6 container not found.");
          }
        } else {
          console.log("Output container not found.");
        }
      };
      const outPutObserver = new MutationObserver(outPutCallback);
      outPutObserver.observe(targetNode, config);
    }
  };

  outPutContainerObserver = new MutationObserver(outputContainerCallback);
  outPutContainerObserver.observe(outContainer, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const analyzeRequest = () => {
    chrome.runtime.sendMessage({
      type: "STORE_DATA",
      data: {
        title: currentTitle,
        problem: currentProblem,
        example: currentExample,
      },
    });
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
    currentCodeNode = getCode();
    let temp = {
      currentCode: currentCodeNode,
      title: currentTitle,
      problem: currentProblem,
      example: currentExample,
    };

    chrome.runtime.sendMessage({
      type: "STORE_DATA",
      data: temp,
    });
    chrome.runtime.sendMessage({
      type: "OPEN_NEWTAB",
      data: {
        url: "index.html",
      },
    });
  };

  const debugQuestion = () => {
    currentCodeNode = getCode();
    let temp = {
      currentCode: currentCodeNode,
    };

    chrome.runtime.sendMessage({
      type: "STORE_DATA",
      data: temp,
    });
    chrome.runtime.sendMessage({
      type: "COMMAND",
      data: {
        command: "Debug",
      },
    });
    chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" });
  };

  const getCode = () => {
    const codeContainer = document.querySelector(".view-lines");
    if (codeContainer) {
      return codeContainer.outerHTML;
    } else {
      return "";
    }
  };
})();
