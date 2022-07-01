<script lang="ts">
  import FusionCharts from "fusioncharts";
  import Timeseries from "fusioncharts/fusioncharts.timeseries";
  // @ts-ignore
  import SvelteFC, { fcRoot } from "svelte-fusioncharts";
  import { currentProject, currentProjectID } from "./stores";

  fcRoot(FusionCharts, Timeseries);

  const getChartConfig = () => {
    const schema = [
      { name: "Date", type: "date", format: "%Y-%m-%d" },
      { name: "Activity", type: "number" },
    ];
    const data = $currentProject?.sessions.map((s) => {
      const date = new Date(s.timestamp);
      return [
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        s.duration / 1000 / 60,
      ];
    });
    if (!data) return {};
    // const data = [
    //   ["2016-1-1", 5],
    //   ["2016-1-2", 90],
    //   ["2016-1-3", 19],
    //   ["2016-1-4", 0],
    //   ["2016-1-5", 81],
    // ];
    console.log(data);
    const fusionDataStore = new FusionCharts.DataStore();

    const fusionTable = fusionDataStore.createDataTable(data, schema);
    console.log(fusionTable);

    return {
      type: "timeseries",
      width: "100%",
      height: 450,
      renderAt: "chart-container",
      dataSource: {
        data: fusionTable,
        chart: {
          // theme: "zune",
          bgColor: "#ff0000",
          bgAlpha: "70",
        },
        caption: {
          text: `Activity on project ${$currentProject?.project.name}`,
        },
        yAxis: [
          {
            plot: {
              value: "Activity",
              type: "column",
            },
            title: "Active time (minutes)",
          },
        ],
        // xAxis: {
        //   outputTimeFormat: {
        //     //year: "",
        //     month: "%b'%y (%q)",
        //     day: "%d/%m (%a)",
        //     //hour: "",
        //     //minute: "",
        //     //second: "",
        //     //millisecond: ""
        //   },
        // },
      },
    };
  };

  let chart: any;
</script>

<div id="chart-container">
  {#key $currentProjectID}
    <SvelteFC {...getChartConfig()} bind:chart />
  {/key}
</div>
