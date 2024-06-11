import { useEffect, useRef } from "react";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// am4core.useTheme(am4themes_animated);

// @ts-ignore
const StatisticsBarChartComponent = ({ questionsWithAnswers, index }) => {
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
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          pinchZoomX: true,
          paddingLeft: 0,
          layout: root.verticalLayout,
        })
      );

      chart.set(
        "colors",
        am5.ColorSet.new(root, {
          colors: [
            am5.color(0x8a16e5),
            am5.color(0xaf24c6),
            am5.color(0xcb1717),
            am5.color(0xde6c1a),
            am5.color(0xabd019),
            am5.color(0x1da522),
            am5.color(0x8a16e5),
          ],
        })
      );

      // Generate series data
      let data = (questionsWithAnswers?.answer || questionsWithAnswers?.answers)?.map(
        (ans: { answer_label: any; count: any; answer_text: any; }) => ({
          category: (ans?.answer_label || ans?.answer_text),
          // category: question.s?.length > 2 ?
          // ans?.answer_label.substring(0, 5) + '...' : ans.answer_label?.length > 10 ? ans.answer_label.substring(0, 10) + '...' : ans.answer_label,
          value: ans?.count,
        })
      );

      // Set data
      let xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 30,
        minorGridEnabled: true,
      });

      xRenderer.grid.template.setAll({
        location: 1,
      });

      xRenderer.labels.template.setAll({
        rotation: -60,
        centerY: am5.p50,
        centerX: am5.p50,
        paddingRight: 10,
        oversizedBehavior: "truncate",
        // oversizedBehavior: "wrap",
        maxWidth: 100,
        textAlign: "center"
      });

      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          maxDeviation: 0.3,
          categoryField: "category",
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {}),
        })
      );
      // xAxis
      //   .get("renderer")
      //   .labels.template.adapters.add("text", (_text, target) => {
      //     // console.log(xAxis?._mainDataItems?.length, "xAxisxAxis")
      //     // Safely attempt to access the category data
      //     // @ts-ignore
      //     const category = target.dataItem?.dataContext?.category;
      //     if (xAxis?._mainDataItems?.length > 5) {
      //       // Check if the category exists and is a string
      //       if (typeof category === "string" && category?.length > 1) {
      //         // Shorten the category to a maximum length, adding '...' at the end
      //         return category.substring(0, 1) + "...";
      //       }
      //     }
      //     // Check if the category exists and is a string
      //     if (typeof category === "string" && category?.length > 10) {
      //       // Shorten the category to a maximum length, adding '...' at the end
      //       return category?.substring(0, 10) + "...";
      //     }

      //     // Return the original text if no shortening is needed or if category is not a string
      //     return category;
      //   });

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0.3,
          min: 0,
          // extraMax: 0.1, // this adds some space at the top
          // renderer: am5xy.AxisRendererY.new(root, {})
          renderer: am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.1,
          }),
        })
      );

      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Series 1",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          categoryXField: "category",
          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}",
          }),
        })
      );

      series.columns.template.setAll({
        tooltipY: 0,
        tooltipText: "{categoryX}: {valueY}",
        shadowOpacity: 0.1,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowBlur: 1,
        strokeWidth: 2,
        stroke: am5.color(0xffffff),
        shadowColor: am5.color(0x000000),
        cornerRadiusTL: 50,
        cornerRadiusTR: 50,
        fillGradient: am5.LinearGradient.new(root, {
          stops: [
            {}, // will use original column color
            { color: am5.color(0x000000) },
          ],
        }),
        fillPattern: am5.GrainPattern.new(root, {
          maxOpacity: 0.15,
          density: 0.5,
          colors: [
            am5.color(0x000000),
            am5.color(0x000000),
            am5.color(0xffffff),
          ],
        }),
      });

      series.columns.template.states.create("hover", {
        shadowOpacity: 1,
        shadowBlur: 10,
        cornerRadiusTL: 10,
        cornerRadiusTR: 10,
      });

      series.columns.template.adapters.add("fill", function (_fill, target) {
        return (chart as any)
          .get("colors")
          .getIndex(series.columns.indexOf(target));
      });
      // console.log(data, "datadatadata", questionsWithAnswers);
      if (data && data?.length > 0) {
        series.data.setAll(data);
        xAxis.data.setAll(data);
      }

      // Add cursor
      chart.set("cursor", am5xy.XYCursor.new(root, {}));

      // Save the chart instance in refs
      (chartRefs as any).current[index] = root;
      // });
    }

    // Cleanup
    return () => {
      Object?.keys(chartRefs?.current)?.forEach((key) => {
        (chartRefs as any).current[key]?.dispose();
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

export default StatisticsBarChartComponent;
