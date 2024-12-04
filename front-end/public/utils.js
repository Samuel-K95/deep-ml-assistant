function loadSidePanelData() {
  const target = document.getElementById("outer-continer");
  console.log("target", target);
  if (target) {
    chrome.storage.session.get(null, (existingData) => {
      if (Object.keys(existingData).length === 0) {
        target.textContent = "";
      } else if (existingData.gemini_response) {
        console.log("gem response", existingData);
        const content = document.createElement("div");
        content.className = "container";
        if (existingData.response_type === "analyze") {
          buildAnalyzeLayout(
            existingData.title,
            existingData.gemini_response,
            content
          );
          target.appendChild(content);
        }
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

const buildAnalyzeLayout = (title, analyze, container) => {
  console.log("Building analyze");
  console.log(analyze);
  console.log(typeof analyze);
  problemTitle = document.createElement("h1");
  problemTitle.textContent = title;
  problemTitle.className = "title";
  container.appendChild(problemTitle);

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
  exampleList = document.createElement("li");
  examples.forEach((element) => {
    list = document.createElement("ul");
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

  gaps = document.createElement("li");
  fetchedgap = analyze.gaps_identified.gaps;
  fetchedgap.forEach((element) => {
    list = document.createElement("ul");
    list.textContent = element;
    gaps.appendChild(list);
  });
  container.appendChild(gaps);

  solutions = document.createElement("h3");
  solutions.textContent = "Solution";
  solutions.className = "header";
  container.appendChild(solutions);

  sols = document.createElement("li");
  fetchedsols = analyze.gaps_identified.solutions;
  fetchedsols.forEach((element) => {
    list = document.createElement("ul");
    list.textContent = element;
    sols.appendChild(list);
  });
  container.appendChild(sols);

  feynman = document.createElement("h3");
  feynman.textContent = "Feynman Technique Analysis";
  feynman.className = "header";
  container.appendChild(feynman);

  breakdown = document.createElement("h4");
  breakdown.textContent = "Breakdown";
  breakdown.className = "inside-header";
  container.appendChild(breakdown);

  breakdownAnalysis = document.createElement("div");
  breakdownAnalysis.textContent = analyze.feynman_analysis.breakdown;
  breakdownAnalysis.className = "inner-content";
  container.appendChild(breakdownAnalysis);

  reconstruction = document.createElement("h4");
  reconstruction.textContent = "Reconstruction";
  reconstruction.className = "inside-header";
  container.appendChild(reconstruction);

  reconstructionAnalysis = document.createElement("div");
  reconstructionAnalysis.textContent = analyze.feynman_analysis.reconstruction;
  reconstructionAnalysis.className = "inner-content";
  container.appendChild(reconstructionAnalysis);

  lessonLearned = document.createElement("h4");
  lessonLearned.textContent = "Lesson Learned";
  lessonLearned.className = "inside-header";
  container.appendChild(lessonLearned);

  LessonAnalysis = document.createElement("div");
  LessonAnalysis.textContent = analyze.feynman_analysis.lessons_learned;
  LessonAnalysis.className = "inner-content";
  container.appendChild(LessonAnalysis);
};
