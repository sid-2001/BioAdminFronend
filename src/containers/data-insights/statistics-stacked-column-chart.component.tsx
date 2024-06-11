import { useEffect, useRef } from 'react';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// am4core.useTheme(am4themes_animated);


// @ts-ignore
const StatisticsStackedColumnChartComponent = ({ questionsWithAnswers, index }) => {

    // console.log(questionsWithAnswers, "questionsWithAnswersquestionsWithAnswers")
    const chartRefs = useRef({});

    useEffect(() => {
        const chartId = `chartdiv-${index}`
        if (questionsWithAnswers && document.getElementById(chartId)) {
            const root = am5.Root.new(`chartdiv-${index}`);
            root.setThemes([am5themes_Animated.new(root)]);

            let chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX: true,
                layout: root.verticalLayout
            }));


            chart.set("scrollbarX", am5.Scrollbar.new(root, {
                orientation: "horizontal"
            }));
            // Convert your data structure to a format that can be used by amCharts
            let uniqueAnswerLabels = new Set();
            let chartData = questionsWithAnswers && questionsWithAnswers?.variables?.map((variable: { variable_name: any; answer: any[]; }) => {
                let dataObj: any = { certification: variable?.variable_name };
                variable?.answer?.forEach(ans => {
                    dataObj[ans?.answer_label] = ans.count;
                    uniqueAnswerLabels?.add(ans.answer_label); // Collect unique answer labels
                });
                return dataObj;
            });

            // console.log(chartData, "uniqueAnswerLabelsuniqueAnswerLabelsuniqueAnswerLabels", uniqueAnswerLabels)

            let xRenderer = am5xy.AxisRendererX.new(root, {
                minorGridEnabled: true
            });
            let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: "certification",
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {})
            }));

            xRenderer.grid.template.setAll({
                location: 1
            })

            xRenderer.labels.template.setAll({
                rotation: -60,
                centerY: am5.p50,
                centerX: am5.p50,
                paddingRight: 10,
                oversizedBehavior: "truncate",
                maxWidth: 100,
                textAlign: "center"
            });

            if (chartData && chartData?.length > 0) {
                xAxis.data.setAll(chartData);
            }

            let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                min: 0,
                renderer: am5xy.AxisRendererY.new(root, {
                    strokeOpacity: 0.1
                })
            }));

            var legend = chart.children.unshift(am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50
            }));

            // Dynamically create series for each unique answer label
            uniqueAnswerLabels.forEach((answerLabel: any) => {
                let series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    name: answerLabel,
                    stacked: true,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: answerLabel,
                    categoryXField: "certification"
                }));


                // series.columns.template.setAll({
                //     tooltipText: "{name}: {valueY}",
                //     tooltipY: 0
                // });
                series.columns.template.setAll({
                    tooltipText: "{name}, {categoryX}: {valueY}",
                    tooltipY: am5.percent(10)
                });


                if (chartData && chartData?.length > 0) {
                    series.data.setAll(chartData);
                }

                // series.appear();

                // Add bullets for labels on top of each column
                series.bullets.push(() => am5.Bullet.new(root, {
                    sprite: am5.Label.new(root, {
                        text: "{valueY}",
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

export default StatisticsStackedColumnChartComponent;

