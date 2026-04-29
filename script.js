const arrStates = [
  { strId: "04000US01", strName: "Alabama" },
  { strId: "04000US02", strName: "Alaska" },
  { strId: "04000US04", strName: "Arizona" },
  { strId: "04000US05", strName: "Arkansas" },
  { strId: "04000US06", strName: "California" },
  { strId: "04000US08", strName: "Colorado" },
  { strId: "04000US09", strName: "Connecticut" },
  { strId: "04000US10", strName: "Delaware" },
  { strId: "04000US12", strName: "Florida" },
  { strId: "04000US13", strName: "Georgia" },
  { strId: "04000US15", strName: "Hawaii" },
  { strId: "04000US16", strName: "Idaho" },
  { strId: "04000US17", strName: "Illinois" },
  { strId: "04000US18", strName: "Indiana" },
  { strId: "04000US19", strName: "Iowa" },
  { strId: "04000US20", strName: "Kansas" },
  { strId: "04000US21", strName: "Kentucky" },
  { strId: "04000US22", strName: "Louisiana" },
  { strId: "04000US23", strName: "Maine" },
  { strId: "04000US24", strName: "Maryland" },
  { strId: "04000US25", strName: "Massachusetts" },
  { strId: "04000US26", strName: "Michigan" },
  { strId: "04000US27", strName: "Minnesota" },
  { strId: "04000US28", strName: "Mississippi" },
  { strId: "04000US29", strName: "Missouri" },
  { strId: "04000US30", strName: "Montana" },
  { strId: "04000US31", strName: "Nebraska" },
  { strId: "04000US32", strName: "Nevada" },
  { strId: "04000US33", strName: "New Hampshire" },
  { strId: "04000US34", strName: "New Jersey" },
  { strId: "04000US35", strName: "New Mexico" },
  { strId: "04000US36", strName: "New York" },
  { strId: "04000US37", strName: "North Carolina" },
  { strId: "04000US38", strName: "North Dakota" },
  { strId: "04000US39", strName: "Ohio" },
  { strId: "04000US40", strName: "Oklahoma" },
  { strId: "04000US41", strName: "Oregon" },
  { strId: "04000US42", strName: "Pennsylvania" },
  { strId: "04000US44", strName: "Rhode Island" },
  { strId: "04000US45", strName: "South Carolina" },
  { strId: "04000US46", strName: "South Dakota" },
  { strId: "04000US47", strName: "Tennessee" },
  { strId: "04000US48", strName: "Texas" },
  { strId: "04000US49", strName: "Utah" },
  { strId: "04000US50", strName: "Vermont" },
  { strId: "04000US51", strName: "Virginia" },
  { strId: "04000US53", strName: "Washington" },
  { strId: "04000US54", strName: "West Virginia" },
  { strId: "04000US55", strName: "Wisconsin" },
  { strId: "04000US56", strName: "Wyoming" }
];

const arrColors = [
  "#0d6efd",
  "#198754",
  "#dc3545",
  "#fd7e14",
  "#6f42c1",
  "#20c997",
  "#d63384",
  "#0dcaf0"
];

const elPopulationForm = document.querySelector("#population-form");
const elStateSelect = document.querySelector("#state-select");
const elYearSlider = document.querySelector("#year-slider");
const elYearOutput = document.querySelector("#year-output");
const elUpdateButton = document.querySelector("#update-button");
const elStatusMessage = document.querySelector("#status-message");
const elSummaryCards = document.querySelector("#summary-cards");
const elChartCanvas = document.querySelector("#population-chart");
const elChartSummary = document.querySelector("#chart-summary");
const elChartDescription = document.querySelector("#chart-description");
const elScaleMode = document.querySelector("#scale-mode");
const elZoomInButton = document.querySelector("#zoom-in-button");
const elZoomOutButton = document.querySelector("#zoom-out-button");
const elResetZoomButton = document.querySelector("#reset-zoom-button");

let chartPopulation = null;
let objAllStateData = {};
let objSelectedStateData = {};
let arrAvailableYears = [];
let blnHasLoadedApiData = false;
let strScaleMode = "linear";
let strFocusedStateId = "";

const objZoomPlugin = window.ChartZoom || window["chartjs-plugin-zoom"];

if (objZoomPlugin) {
  Chart.register(objZoomPlugin);
}

// Add the state choices to the multi-select menu.
function fnFillStateSelect() {
  arrStates.forEach((objState) => {
    const elOption = document.createElement("option");
    elOption.value = objState.strId;
    elOption.textContent = objState.strName;

    if (["04000US06", "04000US48", "04000US36"].includes(objState.strId)) {
      elOption.selected = true;
    }

    elStateSelect.appendChild(elOption);
  });
}

function fnGetSelectedStates() {
  return Array.from(elStateSelect.selectedOptions).map((elOption) => {
    return arrStates.find((objState) => objState.strId === elOption.value);
  }).filter(Boolean);
}

function fnSetStatus(strMessage, strType) {
  elStatusMessage.className = `alert alert-${strType} mb-3`;
  elStatusMessage.textContent = strMessage;
}

function fnFormatPopulation(numPopulation) {
  return new Intl.NumberFormat("en-US").format(numPopulation);
}

function fnFindPopulationForYear(arrRows, numYear) {
  const objRow = arrRows.find((objItem) => Number(objItem.Year) === numYear);
  return objRow ? Number(objRow.Population) : null;
}

function fnClearChart() {
  if (chartPopulation) {
    chartPopulation.destroy();
    chartPopulation = null;
  }
}

function fnBuildStateMap(arrRows) {
  const objAllowedStates = Object.fromEntries(
    arrStates.map((objState) => [objState.strId, objState.strName])
  );
  const objGroupedData = {};

  arrRows.forEach((objRow) => {
    const strStateId = objRow["State ID"];

    if (!objAllowedStates[strStateId]) {
      return;
    }

    if (!objGroupedData[strStateId]) {
      objGroupedData[strStateId] = {
        strId: strStateId,
        strName: objAllowedStates[strStateId],
        arrRows: []
      };
    }

    objGroupedData[strStateId].arrRows.push({
      Year: Number(objRow.Year),
      Population: Number(objRow.Population)
    });
  });

  Object.values(objGroupedData).forEach((objState) => {
    objState.arrRows = objState.arrRows
      .filter((objRow) => Number.isFinite(objRow.Year) && Number.isFinite(objRow.Population))
      .sort((objA, objB) => objA.Year - objB.Year);
  });

  return objGroupedData;
}

// Fetch all state population history from the current Data USA API.
async function fnFetchPopulationData() {
  const strApiUrl = "https://api.datausa.io/tesseract/data.jsonrecords?cube=acs_yg_total_population_5&drilldowns=State,Year&measures=Population&limit=1000,0";
  const objResponse = await fetch(strApiUrl);

  if (!objResponse.ok) {
    throw new Error("Population data could not load right now.");
  }

  const objResult = await objResponse.json();

  if (!objResult.data || objResult.data.length === 0) {
    throw new Error("No population data was found.");
  }

  return fnBuildStateMap(objResult.data);
}

async function fnEnsurePopulationData() {
  if (blnHasLoadedApiData) {
    return;
  }

  objAllStateData = await fnFetchPopulationData();
  blnHasLoadedApiData = true;
}

function fnUpdateSelectedStateData(arrSelectedStates) {
  objSelectedStateData = {};

  arrSelectedStates.forEach((objState) => {
    if (objAllStateData[objState.strId]) {
      objSelectedStateData[objState.strId] = objAllStateData[objState.strId];
    }
  });
}

function fnUpdateYearSlider() {
  const numCurrentYear = Number(elYearSlider.value);
  const arrYears = Object.values(objSelectedStateData)
    .flatMap((objState) => objState.arrRows.map((objRow) => objRow.Year));

  arrAvailableYears = [...new Set(arrYears)].sort((numA, numB) => numA - numB);

  if (arrAvailableYears.length === 0) {
    elYearSlider.disabled = true;
    elYearOutput.textContent = "No data";
    return;
  }

  elYearSlider.min = String(arrAvailableYears[0]);
  elYearSlider.max = String(arrAvailableYears[arrAvailableYears.length - 1]);
  elYearSlider.value = arrAvailableYears.includes(numCurrentYear)
    ? String(numCurrentYear)
    : String(arrAvailableYears[arrAvailableYears.length - 1]);
  elYearSlider.disabled = false;
  elYearOutput.textContent = elYearSlider.value;
}

function fnGetDatasetColor(numIndex) {
  return arrColors[numIndex % arrColors.length];
}

function fnGetStateColor(strStateId) {
  const numStateIndex = Object.keys(objSelectedStateData).indexOf(strStateId);
  return fnGetDatasetColor(Math.max(numStateIndex, 0));
}

function fnBuildChartDatasets(numSelectedYear) {
  const arrVisibleYears = arrAvailableYears.filter((numYear) => numYear <= numSelectedYear);
  const arrStatesToRender = strFocusedStateId && objSelectedStateData[strFocusedStateId]
    ? [objSelectedStateData[strFocusedStateId]]
    : Object.values(objSelectedStateData);

  return arrStatesToRender.map((objState) => {
    const strColor = fnGetStateColor(objState.strId);

    return {
      label: objState.strName,
      data: arrVisibleYears.map((numYear) => fnFindPopulationForYear(objState.arrRows, numYear)),
      borderColor: strColor,
      backgroundColor: strColor,
      pointRadius: arrVisibleYears.map((numYear) => numYear === numSelectedYear ? 6 : 3),
      pointHoverRadius: 7,
      tension: 0.25
    };
  });
}

function fnGetYAxisConfig() {
  return {
    type: strScaleMode,
    title: {
      display: true,
      text: strScaleMode === "logarithmic" ? "Population (log scale)" : "Population"
    },
    beginAtZero: strScaleMode === "linear",
    grace: strScaleMode === "linear" ? "8%" : undefined,
    ticks: {
      callback: (numValue) => fnFormatPopulation(numValue)
    }
  };
}

function fnUpdateChartSummary() {
  const numSelectedYear = Number(elYearSlider.value);
  const arrStatesToSummarize = strFocusedStateId && objSelectedStateData[strFocusedStateId]
    ? [objSelectedStateData[strFocusedStateId]]
    : Object.values(objSelectedStateData);
  const arrSummaryParts = arrStatesToSummarize.map((objState) => {
    const numPopulation = fnFindPopulationForYear(objState.arrRows, numSelectedYear);
    return `${objState.strName}: ${numPopulation ? fnFormatPopulation(numPopulation) : "No data"}`;
  });

  if (arrSummaryParts.length === 0) {
    elChartSummary.textContent = "Choose states to see a chart summary here.";
    elChartDescription.textContent = "A line chart compares the population of selected U.S. states over several years.";
    return;
  }

  const strFocusText = strFocusedStateId && objSelectedStateData[strFocusedStateId]
    ? ` Focus mode is on for ${objSelectedStateData[strFocusedStateId].strName}.`
    : "";
  const strSummary = `For ${numSelectedYear}, ${arrSummaryParts.join(". ")}.${strFocusText}`;
  elChartSummary.textContent = strSummary;
  elChartDescription.textContent = `A line chart compares selected U.S. state populations over time. The current scale is ${strScaleMode}. ${strSummary}`;
}

function fnToggleFocusedState(strStateId) {
  strFocusedStateId = strFocusedStateId === strStateId ? "" : strStateId;
  fnResetZoom();
  fnRenderChart();
  fnRenderSummaryCards();
}

function fnRenderChart() {
  const numSelectedYear = Number(elYearSlider.value);
  const arrVisibleYears = arrAvailableYears.filter((numYear) => numYear <= numSelectedYear);
  const objChartData = {
    labels: arrVisibleYears,
    datasets: fnBuildChartDatasets(numSelectedYear)
  };

  if (chartPopulation) {
    chartPopulation.data = objChartData;
    chartPopulation.options.scales.y = fnGetYAxisConfig();
    chartPopulation.options.scales.x.title.text = `Year (through ${numSelectedYear})`;
    chartPopulation.update();
    return;
  }

  chartPopulation = new Chart(elChartCanvas, {
    type: "line",
    data: objChartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          onClick: (objEvent, objLegendItem) => {
            const strClickedLabel = objLegendItem.text;
            const objMatchedState = Object.values(objSelectedStateData).find((objState) => objState.strName === strClickedLabel);

            if (objMatchedState) {
              fnToggleFocusedState(objMatchedState.strId);
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (objContext) => `${objContext.dataset.label}: ${fnFormatPopulation(objContext.parsed.y)} people`
          }
        },
        zoom: {
          limits: {
            x: { min: "original", max: "original", minRange: 1 },
            y: { min: "original", max: "original" }
          },
          pan: {
            enabled: true,
            mode: "xy",
            modifierKey: "shift"
          },
          zoom: {
            wheel: {
              enabled: true
            },
            drag: {
              enabled: true,
              backgroundColor: "rgba(13, 110, 253, 0.12)",
              borderColor: "rgba(13, 110, 253, 0.6)",
              borderWidth: 1
            },
            mode: "xy"
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: `Year (through ${numSelectedYear})`
          }
        },
        y: fnGetYAxisConfig()
      }
    }
  });
}

function fnResetZoom() {
  if (chartPopulation && typeof chartPopulation.resetZoom === "function") {
    chartPopulation.resetZoom();
  }
}

function fnRenderSummaryCards() {
  const numSelectedYear = Number(elYearSlider.value);
  elYearOutput.textContent = String(numSelectedYear);
  elSummaryCards.innerHTML = "";

  Object.values(objSelectedStateData).forEach((objState) => {
    const numPopulation = fnFindPopulationForYear(objState.arrRows, numSelectedYear);
    const strPopulation = numPopulation ? fnFormatPopulation(numPopulation) : "No data";
    const strColor = fnGetStateColor(objState.strId);
    const strActiveClass = strFocusedStateId === objState.strId ? " snapshot-card-active" : "";

    const elCol = document.createElement("div");
    elCol.className = "col-md-6 col-xl-4";
    elCol.innerHTML = `
      <article class="card h-100 snapshot-card${strActiveClass}" style="--state-color: ${strColor};" data-state-id="${objState.strId}" tabindex="0" role="button" aria-pressed="${strFocusedStateId === objState.strId}">
        <div class="card-body">
          <h3 class="h5 card-title">${objState.strName}</h3>
          <p class="card-text mb-1">Population in ${numSelectedYear}</p>
          <p class="fw-bold population-number mb-0">${strPopulation}</p>
        </div>
      </article>
    `;

    elSummaryCards.appendChild(elCol);
  });

  elSummaryCards.querySelectorAll("[data-state-id]").forEach((elCard) => {
    elCard.addEventListener("click", () => {
      fnToggleFocusedState(elCard.dataset.stateId);
    });

    elCard.addEventListener("keydown", (objEvent) => {
      if (objEvent.key === "Enter" || objEvent.key === " ") {
        objEvent.preventDefault();
        fnToggleFocusedState(elCard.dataset.stateId);
      }
    });
  });

  fnUpdateChartSummary();
}

async function fnLoadSelectedStates() {
  const arrSelectedStates = fnGetSelectedStates();

  if (arrSelectedStates.length === 0) {
    fnSetStatus("Please choose at least one state.", "warning");
    fnClearChart();
    objSelectedStateData = {};
    strFocusedStateId = "";
    elSummaryCards.innerHTML = `<div class="col-12"><div class="alert alert-secondary mb-0">Pick states to see their populations here.</div></div>`;
    fnUpdateChartSummary();
    return;
  }

  fnSetStatus("Loading population data...", "info");
  elUpdateButton.disabled = true;
  elYearSlider.disabled = true;

  try {
    await fnEnsurePopulationData();
    fnUpdateSelectedStateData(arrSelectedStates);

    if (strFocusedStateId && !objSelectedStateData[strFocusedStateId]) {
      strFocusedStateId = "";
    }

    fnUpdateYearSlider();
    fnRenderChart();
    fnRenderSummaryCards();
    fnSetStatus("Great! The chart is ready. Move the slider to explore each year.", "success");
  } catch (error) {
    fnSetStatus(error.message || "Something went wrong while loading the data. Please try again.", "danger");
    fnClearChart();
    objSelectedStateData = {};
    strFocusedStateId = "";
    elSummaryCards.innerHTML = `<div class="col-12"><div class="alert alert-danger mb-0">Data could not be shown right now.</div></div>`;
    fnUpdateChartSummary();
  } finally {
    elUpdateButton.disabled = false;
  }
}

elPopulationForm.addEventListener("submit", (objEvent) => {
  objEvent.preventDefault();
  fnLoadSelectedStates();
});

elYearSlider.addEventListener("input", () => {
  fnRenderChart();
  fnRenderSummaryCards();
});

elScaleMode.addEventListener("change", () => {
  strScaleMode = elScaleMode.value;
  fnResetZoom();
  fnRenderChart();
  fnRenderSummaryCards();
});

elZoomInButton.addEventListener("click", () => {
  if (chartPopulation && typeof chartPopulation.zoom === "function") {
    chartPopulation.zoom(1.2);
  }
});

elZoomOutButton.addEventListener("click", () => {
  if (chartPopulation && typeof chartPopulation.zoom === "function") {
    chartPopulation.zoom(0.8);
  }
});

elResetZoomButton.addEventListener("click", () => {
  fnResetZoom();
});

fnFillStateSelect();
fnLoadSelectedStates();
// I AM FUNCTIONING
// I AM FUNCTIONING
// I AM FUNCTIONING
// I AM FUNCTIONING
// I AM FUNCTIONING
