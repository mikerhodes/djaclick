console.log("Hello world");

let myChart = undefined;

async function redrawChart() {
  const res = await fetch("/hits/timeseries");
  const json = await res.json();
  const rawdata = json["data"];
  console.log(rawdata);

  let minDate = "a"; // "a" is after any valid date.
  rawdata.forEach((x) => {
    if (x.ts < minDate) {
      minDate = x.ts;
    }
  });

  const data = {
    // labels: rawdata.map((row) => row.ts),
    datasets: [
      {
        label: "Hits count",
        data: rawdata.map((row) => {
          // return { x: `${row.year}-11-06 23:39:30`, y: row.count };
          return { x: `${row.ts}`, y: row.count };
        }),
      },
    ],
  };
  if (!myChart) {
    const config = {
      type: "line",
      data: data,
      options: {
        animation: {
          duration: 0,
        },
        scales: {
          x: {
            type: "time",
            min: minDate,
            time: {
              // unit: "minute",
            },
          },
          y: {
            min: 0,
            suggestedMax: 500,
          },
        },
      },
    };

    myChart = new Chart(
      document.getElementById("acquisitions"),
      config,
    );
  } else {
    myChart.options.scales.x.min = minDate;
    myChart.data = data;
    myChart.update();
  }
}

(async function () {
  const button = document.querySelector("#getmorehits");
  button.addEventListener("click", (event) => {
    redrawChart();
  });
  redrawChart();
})();
