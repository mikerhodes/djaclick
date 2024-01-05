// main.js renders the charts for hits into canvases
// defined on the page. The canvas elements should have
// class=chart and, optionally, data-group-by=status/path/method.

// Store charts by their canvas ID for later updates
const charts = new Map();

// Default configuration for all charts
const defaultConfig = {
  type: "line",
  options: {
    pointStyle: false,
    borderWidth: 1,
    animation: { duration: 0 },
    scales: {
      x: { type: "time" },
      y: { min: 0, stacked: true },
    },
  },
};

async function redrawChart(canvasElement) {
  const groupBy = canvasElement.dataset.groupBy;
  let res = undefined;
  if (!groupBy) {
    res = await fetch("/hits/timeseries");
  } else {
    res = await fetch(`/hits/timeseries?groupby=${groupBy}`);
  }
  const json = await res.json();

  // Create chart.js friendly datasets by mapping
  // to x,y and find the min X and maxY as we do so.
  const datasets = [];
  let minDate = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;
  json["series"].forEach((rawdata) => {
    const data = [];

    rawdata["data"].forEach((row) => {
      const ts = Date.parse(row.ts);
      minDate = Math.min(row.ts, minDate);
      maxY = Math.max(row.count, maxY);

      data.push({ x: ts, y: row.count });
    });

    datasets.push({
      label: rawdata["label"],
      data: data,
      fill: "stack",
    });
  });

  const chartId = canvasElement.id;
  if (!charts.has(chartId)) {
    charts[chartId] = new Chart(canvasElement, structuredClone(defaultConfig));
  }
  const chart = charts[chartId];
  chart.options.scales.x.min = minDate;
  chart.options.scales.y.suggestedMax = maxY;
  chart.data = { datasets: datasets };
  chart.update();
}

function redrawAllCharts() {
  const matches = document.querySelectorAll("canvas.chart");
  matches.forEach((n) => {
    redrawChart(n);
  });
}

(async function () {
  const button = document.querySelector("#getmorehits");
  button.addEventListener("click", (event) => {
    redrawAllCharts();
  });
  redrawAllCharts();
})();
