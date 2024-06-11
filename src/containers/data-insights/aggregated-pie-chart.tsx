import { useEffect, useRef } from "react";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";
// am4core.useTheme(am4themes_animated);

// @ts-ignore
const StatisticsPieChartComponent = ({ questionsWithAnswers, index }) => {
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
        am5percent.PieChart.new(root, {
          endAngle: 270,
          layout: root.verticalLayout,
          innerRadius: am5.percent(60),
        })
      );

      // Create series
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
      let series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
          endAngle: 270,
        })
      );

      series.set(
        "colors",
        am5.ColorSet.new(root, {
          colors: [
            am5.color(0x73556e),
            am5.color(0x9fa1a6),
            am5.color(0xf2aa6b),
            am5.color(0xf28f6b),
            am5.color(0xa95a52),
            am5.color(0xe35b5d),
            am5.color(0xffa446),
          ],
        })
      );

      let gradient = am5.RadialGradient.new(root, {
        stops: [
          { color: am5.color(0x000000) },
          { color: am5.color(0x000000) },
          {},
        ],
      });

      series.slices.template.setAll({
        fillGradient: gradient,
        strokeWidth: 2,
        stroke: am5.color(0xffffff),
        cornerRadius: 10,
        shadowOpacity: 0.1,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowColor: am5.color(0x000000),
        fillPattern: am5.GrainPattern.new(root, {
          maxOpacity: 0.2,
          density: 0.5,
          colors: [am5.color(0x000000)],
        }),
      });

      series.slices.template.states.create("hover", {
        shadowOpacity: 1,
        shadowBlur: 10,
      });

      series.ticks.template.setAll({
        strokeOpacity: 0.4,
        strokeDasharray: [2, 2],
      });

      series.states.create("hidden", {
        endAngle: -90,
      });

      series.labels.template.setAll({
        maxWidth: 150,
        oversizedBehavior: "truncate",
        textAlign: "center"
    });

      // Generate series data
      let data = (questionsWithAnswers?.answer || questionsWithAnswers?.answers)?.map(
        (ans: { answer_label: any; count: any; answer_text: any; }) => ({
          category: (ans?.answer_label || ans?.answer_text),
          // category: question.answer?.length > 2 ?
          // ans?.answer_label.substring(0, 5) + '...' : ans.answer_label?.length > 10 ? ans.answer_label.substring(0, 10) + '...' : ans.answer_label,
          value: ans?.count,
        })
      );

      let legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          marginTop: 15,
          marginBottom: 15,
        })
      );
      legend.markerRectangles.template.adapters.add(
        "fillGradient",
        function () {
          return undefined;
        }
      );
      if (data && data?.length > 0) {
        legend.data.setAll(series.dataItems);
      }

      if (data && data?.length > 0) {
        series.data.setAll(data);
      }

      // Add cursor
      // @ts-ignore
      chart.set("cursor", am5xy.XYCursor.new(root, {}));

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

export default StatisticsPieChartComponent;
