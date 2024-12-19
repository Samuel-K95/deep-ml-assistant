(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, problemId } = obj;
    if (type === "NEW") {
      chrome.storage.session.clear();
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

  let analyzeExists = document.getElementById("analyze-btn");
  let analyzeBtn = document.createElement("button");

  let debugExists = document.getElementById("debug-btn");
  let debugBtn = document.createElement("button");

  let pushExists = document.getElementById("push-btn");
  let pushBtn = document.createElement("button");

  let ProseExists = false;
  let OutputExists = false;

  parentObserver = null;

  const config = { attributes: true, childList: true, subtree: true };
  let callback = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        let hcontainer = document.getElementsByClassName("prose")[0];
        if (hcontainer) {
          ProseExists = true;
          observeProseContainer(hcontainer);
        }
        let outContainer = document.getElementsByClassName(
          "rounded-xl border bg-card text-card-foreground shadow"
        )[0];

        if (outContainer) {
          OutputExists = true;
          observeOutPut(outContainer);
        }
      }
    }
  };

  function observeProseContainer(targetNode) {
    const config = { attributes: true, childList: true, subtree: true };

    const proseCallback = (mutationsList) => {
      let container = targetNode.getElementsByClassName("text-black")[0];

      if (container) {
        if (ProseExists && OutputExists) {
          parentObserver.disconnect();
        }
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
        analyzeExists = document.getElementById("analyze-btn");
        if (!analyzeExists) {
          analyzeBtn.id = "analyze-btn";
          analyzeBtn.className = "custom-analyze-btn";
          analyzeBtn.title = "Click to analyze the question with gemini";
          analyzeBtn.textContent = "Analyse";
          analyzeBtn.onclick = analyzeRequest;
        }

        currentExample = temp;
        document.body.append(analyzeBtn);
        proseObserver.disconnect();
      }
    };
    const proseObserver = new MutationObserver(proseCallback);
    proseObserver.observe(targetNode, config);
  }

  function observeOutPut(outContainer) {
    if (ProseExists && OutputExists) {
      parentObserver.disconnect();
    }
    const outputContainerCallback = (mutationsList) => {
      mutationsList.forEach((mutation) => {
        let container = document.getElementsByClassName("output-container")[0];
        if (container) {
          outPutCallBackObserver(container);
        }
      });

      function outPutCallBackObserver(container) {
        const config = { attributes: true, childList: true, subtree: true };

        const outPutCallback = () => {
          debugExists = document.getElementById("debug-btn");
          pushExists = document.getElementById("push-btn");

          let statCOnt = container.getElementsByClassName("p-6")[1];
          let statSpan = statCOnt.querySelector("span");
          let content = statSpan.textContent.trim();

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
        };

        const outPutObserver = new MutationObserver(outPutCallback);
        outPutObserver.observe(container, config);
      }
    };

    let outPutContainerObserver = new MutationObserver(outputContainerCallback);
    outPutContainerObserver.observe(outContainer, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  const newProblemOpened = () => {
    if (analyzeExists) {
      analyzeBtn.remove();
    }
    if (debugExists) {
      debugBtn.remove();
    }
    if (pushExists) {
      pushBtn.remove();
    }

    parentObserver = new MutationObserver(callback);
    parentObserver.observe(document.body, config);
  };

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

  const OpenNewTab = async () => {
    currentCodeNode = getCode();
    let temp = {
      currentCode: currentCodeNode,
      title: currentTitle,
      problem: currentProblem,
      example: currentExample,
    };

    let store = await chrome.runtime.sendMessage({
      type: "STORE_DATA",
      data: temp,
    });

    console.log("store", store);

    if (store.success) {
      chrome.runtime.sendMessage({
        type: "OPEN_NEWTAB",
        data: {
          url: "index.html",
        },
      });
    }
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
