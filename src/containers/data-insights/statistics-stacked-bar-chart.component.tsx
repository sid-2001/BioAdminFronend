import { useEffect, useRef } from 'react';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// am4core.useTheme(am4themes_animated);


// @ts-ignore
const StatisticsStackedBarChartComponent = ({ questionsWithAnswers, index }) => {

    // console.log(questionsWithAnswers, "questionsWithAnswersquestionsWithAnswers")
    const chartRefs = useRef({});

    useEffect(() => {
        const chartId = `chartdiv-${index}`
        if (questionsWithAnswers && document.getElementById(chartId)) {
            const root = am5.Root.new(`chartdiv-${index}`);

            // root.setThemes([am5themes_Animated.new(root)]);
            let myTheme = am5.Theme.new(root);

            myTheme.rule("Grid", ["base"]).setAll({
                strokeOpacity: 0.1
            });

            root.setThemes([
                am5themes_Animated.new(root),
                myTheme
            ]);

            let chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "panY",
                wheelY: "zoomY",
                paddingLeft: 0,
                // pinchZoomX: true,
                layout: root.verticalLayout
            }));


            chart.set("scrollbarY", am5.Scrollbar.new(root, {
                orientation: "vertical"
            }));

            // Convert your data structure to a format that can be used by amCharts
            let uniqueAnswerLabels = new Set();
            let chartData = questionsWithAnswers && questionsWithAnswers?.variables?.map((variable: { variable_name: any; answer: any[]; }) => {
                let dataObj: any = { certification: variable?.variable_name };
                variable?.answer?.forEach(ans => {
                    dataObj[ans?.answer_label] = ans?.count;
                    uniqueAnswerLabels?.add(ans?.answer_label); // Collect unique answer labels
                });
                return dataObj;
            });

            // console.log(chartData, "uniqueAnswerLabelsuniqueAnswerLabelsuniqueAnswerLabels", uniqueAnswerLabels)

            let yRenderer = am5xy.AxisRendererY.new(root, {});

            let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: "certification",
                renderer: yRenderer,
                tooltip: am5.Tooltip.new(root, {})
            }));

            yRenderer.grid.template.setAll({
                location: 1
            })

            yRenderer.labels.template.setAll({
                // rotation: -60,
                // centerY: am5.p50,
                // centerX: am5.p50,
                // paddingRight: 10,
                oversizedBehavior: "truncate",
                maxWidth: 150,
                textAlign: "center"
            });

            if (chartData && chartData?.length > 0) {
                yAxis.data.setAll(chartData);
            }

            let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
                min: 0,
                maxPrecision: 0,
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 40,
                    strokeOpacity: 0.1
                })
            }));

            var legend = chart.children.unshift(am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50,
            }));

            // Dynamically create series for each unique answer label
            uniqueAnswerLabels.forEach((answerLabel: any) => {
                let series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    name: answerLabel,
                    stacked: true,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    baseAxis: yAxis,
                    valueXField: answerLabel,
                    categoryYField: "certification"
                }));


                // series.columns.template.setAll({
                //     tooltipText: "{name}: {valueY}",
                //     tooltipY: 0
                // });
                series.columns.template.setAll({
                    tooltipText: "{name}, {categoryY}: {valueX}",
                    tooltipY: am5.percent(90)
                });

                if (chartData && chartData?.length > 0) {
                    series.data.setAll(chartData);
                }

                // series.appear();

                // Add bullets for labels on top of each column
                series.bullets.push(() => am5.Bullet.new(root, {
                    sprite: am5.Label.new(root, {
                        text: "{valueX}",
                        fill: am5.color(0xffffff),
                        centerY: am5.p50,
                        centerX: am5.p50,
                        populateText: true
                    })
                }));
                legend.data.push(series);
            });

            chart.set("cursor", am5xy.XYCursor.new(root, {}));
            (chartRefs as any).current[index] = root;
        }

        return () => {
            // Object.keys((chartRefs as any).current).forEach(key => {
            //     (chartRefs as any).current[key].dispose();
            // });
            Object.keys(chartRefs.current).forEach((key) => {
                (chartRefs as any).current[key].dispose();
            });
        };
    }, [questionsWithAnswers, index]);


    return (
        <>
            <div onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()} id={`chartdiv-${index}`} style={{ width: "100%", height: "100%" }} ></div>
        </>
    );
};

export default StatisticsStackedBarChartComponent;

