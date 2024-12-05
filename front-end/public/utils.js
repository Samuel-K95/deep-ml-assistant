function loadSidePanelData() {
  const target = document.getElementById("outer-continer");
  problemTitle = document.getElementById("problem-title");
  if (target) {
    chrome.storage.session.get(null, (existingData) => {
      if (Object.keys(existingData).length === 0) {
        target.textContent = "";
        problemTitle.textContent = "";
      } else if (existingData.gemini_response) {
        if (problemTitle && problemTitle.textContent === "") {
          (problemTitle.textContent = existingData.title),
            (problemTitle.className = "title");
        }

        console.log("gem response", existingData.gemini_response);
        const content = document.createElement("div");
        content.className = "container";
        if (existingData.response_type === "analyze") {
          buildAnalyzeLayout(existingData.gemini_response, content);
        } else {
          buildDebugLayout(existingData.gemini_response, content);
        }
        target.appendChild(content);
      }
    });
  }
}

chrome.storage.session.onChanged.addListener(() => {
  loadSidePanelData();
});

document.addEventListener("DOMContentLoaded", () => {
  loadSidePanelData();
});

const buildAnalyzeLayout = (aiResponse, container) => {
  let analyze = JSON.parse(aiResponse);

  responseType = document.createElement("h2");
  responseType.textContent = "Problem Analysis";
  responseType.className = "response-type";
  container.appendChild(responseType);

  explanationTitle = document.createElement("h3");
  explanationTitle.textContent = "Explanation";
  explanationTitle.className = "header";
  container.appendChild(explanationTitle);

  explanationContainer = document.createElement("div");
  console.log("core", analyze.core_concepts);

  explanationContainer.textContent = analyze.core_concepts.explanation;
  explanationContainer.className = "content";
  container.appendChild(explanationContainer);

  exampleTtile = document.createElement("h3");
  exampleTtile.textContent = "Examples";
  exampleTtile.className = "header";
  container.appendChild(exampleTtile);

  examples = analyze.core_concepts.examples;
  exampleContainer = document.createElement("div");
  exampleList = document.createElement("ul");
  examples.forEach((element) => {
    list = document.createElement("li");
    list.textContent = element;
    exampleList.appendChild(list);
  });
  exampleContainer.appendChild(exampleList);
  exampleContainer.className = "content";
  container.appendChild(exampleContainer);

  gapsIdentified = document.createElement("h3");
  gapsIdentified.textContent = "Gaps Identified";
  gapsIdentified.className = "header";
  container.appendChild(gapsIdentified);

  gaps = document.createElement("ul");
  fetchedgap = analyze.gaps_identified.gaps;
  fetchedgap.forEach((element) => {
    list = document.createElement("li");
    list.textContent = element;
    gaps.appendChild(list);
  });
  container.appendChild(gaps);

  solutions = document.createElement("h3");
  solutions.textContent = "Solution";
  solutions.className = "header";
  container.appendChild(solutions);

  sols = document.createElement("ul");
  fetchedsols = analyze.gaps_identified.solutions;
  fetchedsols.forEach((element) => {
    list = document.createElement("li");
    list.textContent = element;
    sols.appendChild(list);
  });
  container.appendChild(sols);
};

const buildDebugLayout = (aiResponse, container) => {
  let debug = JSON.parse(aiResponse);
  console.log("debug", debug);

  let responseType = document.createElement("h2");
  responseType.textContent = "Debug Analysis";
  responseType.className = "resonse-type";
  container.appendChild(responseType);

  let problemTitle = document.createElement("h3");
  problemTitle.textContent = "Problem";
  problemTitle.className = "title";
  container.appendChild(problemTitle);

  let problemContiner = document.createElement("div");
  problemContiner.textContent = debug.debug_analysis.problem;
  problemContiner.className = "content";
  container.appendChild(problemContiner);

  let exampleTitle = document.createElement("h3");
  exampleTitle.textContent = "Example";
  exampleTitle.className = "title";
  container.appendChild(exampleTitle);

  let inputTitle = document.createElement("h4");
  inputTitle.textContent = "Input";
  inputTitle.className = "innerTitle";
  container.appendChild(inputTitle);

  let inputContiner = document.createElement("div");
  inputContiner.textContent = debug.debug_analysis.example.input;
  inputContiner.className = "content";
  container.append(inputContiner);

  let expectedTitle = document.createElement("h4");
  expectedTitle.textContent = "Expected Output";
  expectedTitle.className = "innerTitle";
  container.appendChild(expectedTitle);

  let expectedContainer = document.createElement("div");
  expectedContainer.textContent = debug.debug_analysis.example.expected_output;
  expectedContainer.className = "content";
  container.append(expectedContainer);

  let codeTitle = document.createElement("h3");
  codeTitle.textContent = "Code Analysis";
  codeTitle.className = "title";
  container.appendChild(codeTitle);

  let codeErros = document.createElement("h4");
  codeErros.textContent = "Errors";
  codeErros.className = "innerTitle";
  container.appendChild(codeErros);

  let errors = debug.debug_analysis.code.errors;
  let errorContainer = document.createElement("ul");
  errors.forEach((error) => {
    let currError = document.createElement("li");
    let err = document.createElement("div");
    err.textContent = error.error;
    currError.appendChild(err);

    let loc = document.createElement("div");
    loc.textContent = error.locatipn;
    currError.appendChild(loc);

    let sugg = document.createElement("div");
    sugg.textContent = error.suggestion;
    currError.appendChild(sugg);

    errorContainer.appendChild(currError);
  });
  container.appendChild(errorContainer);

  let possImprov = document.createElement("h4");
  possImprov.textContent = "Possible Improvments";
  possImprov.className = "innerTitle";
  container.appendChild(possImprov);

  let improvments = debug.debug_analysis.code.possible_improvements;
  console.log("improv", improvments);
  let improvContainer = document.createElement("ul");
  improvments.forEach((improvment) => {
    let currImprov = document.createElement("li");
    let improv = document.createElement("div");
    improv.textContent = improvment.improvement;
    currImprov.appendChild(improv);

    let res = document.createElement("div");
    res.textContent = improvment.reason;
    currImprov.appendChild(res);

    improvContainer.appendChild(currImprov);
  });
  container.appendChild(improvContainer);
};
