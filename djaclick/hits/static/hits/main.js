console.log("Hello world");

(async function () {
  // const rawdata = [
  //   { year: 2010, count: 10 },
  //   { year: 2011, count: 20 },
  //   { year: 2012, count: 15 },
  //   { year: 2013, count: 25 },
  //   { year: 2014, count: 22 },
  //   { year: 2015, count: 30 },
  //   { year: 2016, count: 28 },
  // ];

  const res = await fetch("/hits/timeseries");
  const json = await res.json();
  const rawdata = json["data"];
  console.log(rawdata);

  const data = {
    labels: rawdata.map((row) => row.year),
    datasets: [
      {
        label: "Acquisitions by year",
        data: rawdata.map((row) => {
          // return { x: `${row.year}-11-06 23:39:30`, y: row.count };
          return { x: `${row.ts}`, y: row.count };
        }),
      },
    ],
  };
  const config = {
    type: "line",
    data: data,
    options: {
      scales: {
        x: {
          type: "time",
          // min: `${rawdata[0].year}-11-06 23:39:30`,
          min: `${rawdata[0].ts}`,
          time: {
            unit: "year",
          },
        },
      },
    },
  };

  const myChart = new Chart(
    document.getElementById("acquisitions"),
    config,
  );
})();
