import { useEffect, useRef } from "react";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5radar from "@amcharts/amcharts5/radar";
// am4core.useTheme(am4themes_animated);

// @ts-ignore
const StatisticsGuageChartComponent = ({ questionsWithAnswers, index }) => {
  const chartRefs = useRef({});

  useEffect(() => {
    if (questionsWithAnswers) {
      // questionsWithAnswers.forEach((question, index) => {
      const root = am5.Root.new(`chartdiv-${index}`);

      // Themes begin
      root.setThemes([am5themes_Animated.new(root)]);
      // Themes end

      // Create chart
      let chart = root.container.children.push(
        am5radar.RadarChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          innerRadius: am5.percent(20),
          startAngle: -90,
          endAngle: 180,
        })
      );

      // Generate series data
      let data = questionsWithAnswers?.answer?.map(
        (ans: { answer_label: any; count: any }) => ({
          category: ans?.answer_label,
          // category: question.answer?.length > 2 ?
          // ans?.answer_label.substring(0, 5) + '...' : ans.answer_label?.length > 10 ? ans.answer_label.substring(0, 10) + '...' : ans.answer_label,
          value: ans?.count,
          full: questionsWithAnswers?.answer?.length,
          // columnSettings: {
          //     // @ts-ignore
          //     fill: chart.get("colors").getIndex(0)
          // }
          color: am5.color(0x8a16e5),
        })
      );

      let cursor = chart.set(
        "cursor",
        am5radar.RadarCursor.new(root, {
          behavior: "zoomX",
        })
      );

      cursor.lineY.set("visible", false);

      // Create axes and their renderers
      // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
      let xRenderer = am5radar.AxisRendererCircular.new(root, {
        //minGridDistance: 50
      });

      xRenderer.labels.template.setAll({
        radius: 10,
      });

      xRenderer.grid.template.setAll({
        forceHidden: true,
      });

      let xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: xRenderer,
          min: 0,
          max: 100,
          strictMinMax: true,
          numberFormat: "#'%'",
          tooltip: am5.Tooltip.new(root, {}),
        })
      );

      let yRenderer = am5radar.AxisRendererRadial.new(root, {
        minGridDistance: 20,
      });

      yRenderer.labels.template.setAll({
        centerX: am5.p100,
        fontWeight: "500",
        fontSize: 18,
        templateField: "columnSettings",
        oversizedBehavior: "truncate",
      });

      yRenderer.grid.template.setAll({
        forceHidden: true,
      });

      let yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "category",
          renderer: yRenderer,
        })
      );

      if (data && data?.length > 0) {
        yAxis.data.setAll(data);
      }

      // Create series
      // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
      let series1 = chart.series.push(
        am5radar.RadarColumnSeries.new(root, {
          xAxis: xAxis,
          yAxis: yAxis,
          clustered: false,
          valueXField: "full",
          categoryYField: "category",
          fill: root.interfaceColors.get("alternativeBackground"),
        })
      );

      series1.columns.template.setAll({
        width: am5.p100,
        fillOpacity: 0.08,
        strokeOpacity: 0,
        cornerRadius: 20,
      });

      if (data && data?.length > 0) {
        series1.data.setAll(data);
      }

      let series2 = chart.series.push(
        am5radar.RadarColumnSeries.new(root, {
          xAxis: xAxis,
          yAxis: yAxis,
          clustered: false,
          valueXField: "value",
          categoryYField: "category",
        })
      );

      series2.columns.template.setAll({
        width: am5.p100,
        strokeOpacity: 0,
        tooltipText: "{category}: {valueX}%",
        cornerRadius: 20,
        templateField: "columnSettings",
      });

      if (data && data?.length > 0) {
        series2.data.setAll(data);
      }
      // After series creation
      series1.columns.template.set("fill", am5.color(0x8a16e5));
      series2.columns.template.set("fill", am5.color(0x8a16e5));

      series1.appear(1000);
      series2.appear(1000);
      chart.appear(1000, 100);
      // Add cursor
      // @ts-ignore
      // chart.set("cursor", am5xy.XYCursor.new(root, {}));

      // Save the chart instance in refs
      (chartRefs as any).current[index] = root;
      // });
    }

    // Cleanup
    return () => {
      Object.keys(chartRefs.current).forEach((key) => {
        (chartRefs as any).current[key].dispose();
      });
    };
  }, [questionsWithAnswers, index]);

  return (
    <>
      <div
        id={`chartdiv-${index}`}
        style={{ width: "100%", height: "100%" }}
      ></div>
    </>
  );
};

export default StatisticsGuageChartComponent;
