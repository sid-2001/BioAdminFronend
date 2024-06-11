import { useEffect, useRef } from 'react';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
// am4core.useTheme(am4themes_animated);
import { nanoid } from 'nanoid';
interface DataItem {
    answerLabel: string;
    [key: string]: any;
};

import { MyTheme } from '@/helpers/charts-theme';


// @ts-ignore
const StatisticsStackedBarChartComponent = ({ questionsWithAnswers, index, hideNum, question_id }: { questionsWithAnswers: any, index: number, hideNum: boolean, question_id?: string }) => {
    const nanoId = nanoid(7)

    // console.log(questionsWithAnswers, "questionsWithAnswersquestionsWithAnswers")
    const chartRefs = useRef({});
    const reverse_axis = question_id?.endsWith('_NPS') ? false : true;

    useEffect(() => {
        const chartId = `chartdiv-${index}`
        if (questionsWithAnswers && document.getElementById(chartId) && questionsWithAnswers.variables?.length) {
            const root = am5.Root.new(`chartdiv-${index}`);

            // root.setThemes([am5themes_Animated.new(root)]);
            let myTheme = am5.Theme.new(root);

            myTheme.rule("Grid", ["base"]).setAll({
                strokeOpacity: 0.1
            });

            // root.setThemes([
            //     am5themes_Animated.new(root),
            //     myTheme
            // ]);

            root.setThemes([
                am5themes_Animated.new(root),
                MyTheme.new(root)  // Correct way to instantiate a custom theme
            ]);

            let chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                // wheelX: "panY",
                // wheelY: "zoomY",
                paddingLeft: 0,
                // pinchZoomX: true,
                layout: root.verticalLayout
            }));


            // chart.set("scrollbarY", am5.Scrollbar.new(root, {
            //     orientation: "vertical"
            // }));

            // Convert your data structure to a format that can be used by amCharts
            // let uniqueAnswerLabels = new Set();
            // let chartData = questionsWithAnswers && questionsWithAnswers?.variables?.map((variable: { variable_name: any; answer: any[]; }) => {
            //     let dataObj: any = { certification: variable.variable_name };
            //     variable.answer.forEach(ans => {
            //         dataObj[ans.answer_label] = ans.count;
            //         uniqueAnswerLabels.add(ans.answer_label); // Collect unique answer labels
            //     });
            //     return dataObj;
            // });

            // let uniqueAnswerLabels = new Set();
            // const processedData: DataItem[] = questionsWithAnswers.variables[0].answer.map((ans: { answer_label: any; }) => {
            //     const dataItem: DataItem = { answerLabel: ans.answer_label };

            //     questionsWithAnswers.variables.forEach((variable: { answer: any[]; variable_name: any; }) => {
            //         const answer = variable.answer.find(a => a.answer_label === ans.answer_label);
            //         dataItem[variable.variable_name] = answer ? (answer?.perc * 100) || answer?.count : 0; // Convert percentage to a whole number if needed
            //         uniqueAnswerLabels?.add(variable.variable_name)
            //     });

            //     return dataItem;
            // });

            let processedData: DataItem[] = []

            let uniqueAnswerLabels = new Set();
            if (reverse_axis) {
                const processedData1: DataItem[] = questionsWithAnswers?.variables[0]?.answer?.map((ans: { answer_label: any; }) => {
                    const dataItem: DataItem = { answerLabel: ans.answer_label };

                    questionsWithAnswers?.variables?.forEach((variable: { answer: any[]; variable_name: any; }) => {
                        const answer = variable?.answer?.find(a => a.answer_label === ans.answer_label);
                        dataItem[variable.variable_name] = answer ? (answer?.perc * 100) || answer?.count : 0; // Convert percentage to a whole number if needed
                        uniqueAnswerLabels?.add(variable.variable_name)
                    });

                    return dataItem;
                });
                processedData = processedData1
            } else {
                let chartData = questionsWithAnswers && questionsWithAnswers?.variables?.map((variable: { variable_name: any; answer: any[]; }) => {
                    let dataObj: any = { certification: variable.variable_name };
                    variable.answer.forEach(ans => {
                        dataObj[ans.answer_label] = ans ? (ans?.perc * 100) || ans?.count : 0;
                        uniqueAnswerLabels.add(ans.answer_label); // Collect unique answer labels
                    });
                    return dataObj;
                });
                processedData = chartData
            }

            // console.log(chartData, "uniqueAnswerLabelsuniqueAnswerLabelsuniqueAnswerLabels", uniqueAnswerLabels)

            let yRenderer = am5xy.AxisRendererY.new(root, {});

            let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: reverse_axis ? "answerLabel" : 'certification',
                renderer: yRenderer,
                tooltip: am5.Tooltip.new(root, {})
            }));

            yRenderer.grid.template.setAll({
                // location: 1
                visible: false
            })

            yRenderer.labels.template.setAll({
                // rotation: -60,
                // centerY: am5.p50,
                // centerX: am5.p50,
                // paddingRight: 10,
                oversizedBehavior: "wrap",
                maxWidth: 150,
                textAlign: "center"
            });

            if (processedData && processedData?.length > 0) {
                yAxis.data.setAll(processedData);
            }
            let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
                // min: 0,

                // max: 100,
                // numberFormat: "#'%'",
                // strictMinMax: true,
                calculateTotals: true,
                visible: false,

                maxPrecision: 0,
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 40,
                    strokeOpacity: 0.1
                })
            }));

            xAxis.get("renderer").grid.template.setAll({
                strokeWidth: 0,
                visible: false
            });

            var legend = chart.children.unshift(am5.Legend.new(root, {
                // centerX: am5.p50,
                // x: am5.p50,
                marginBottom: 20,
                // width: 100%,
                layout: root.gridLayout,
                // height: am5.percent(100),
                maxHeight: 100,
                verticalScrollbar: am5.Scrollbar.new(root, {
                    orientation: "vertical"
                })
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
                    categoryYField: reverse_axis ? "answerLabel" : 'certification',
                }));


                // series.columns.template.setAll({
                //     tooltipText: "{name}: {valueY}",
                //     tooltipY: 0
                // });
                series.columns.template.setAll({
                    tooltipText: `{name}, {categoryY}: {valueX}${reverse_axis ? '%' : ''}`,
                    // tooltipText: "{name}, {categoryY}: {valueX}%",
                    // tooltipText: "{name}, {categoryY} : {valueXTotalPercent.formatNumber('#.#')}%",
                    tooltipY: am5.percent(90)
                });
                if (processedData && processedData?.length > 0) {
                    series.data.setAll(processedData);
                }
                // series.appear();

                // Add bullets for labels on top of each column
                series.bullets.push(() => am5.Bullet.new(root, {
                    sprite: am5.Label.new(root, {
                        text: hideNum ? '' : `{valueX}${reverse_axis ? '%' : ''}`,
                        // text: hideNum ? '' : "{valueX}%",
                        // text: hideNum ? '' : "{valueXTotalPercent.formatNumber('#.#')}%",
                        fill: am5.color(0xffffff),
                        centerY: am5.p50,
                        centerX: am5.p50,
                        fontSize: '10px',
                        populateText: hideNum ? false : true
                    })
                }));
                legend.data.push(series);
            });

            am5exporting.Exporting.new(root, {
                menu: am5exporting.ExportingMenu.new(root, {}),
                filePrefix: nanoId,
                dataSource: processedData,
                dataFields: {
                    answerLabel: "Answer Label",
                    ...Object.fromEntries(Array.from(uniqueAnswerLabels).map(label => ([label, label])))
                }
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

