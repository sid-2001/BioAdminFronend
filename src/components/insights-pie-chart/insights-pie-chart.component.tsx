import { useEffect, useRef } from 'react';

import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
// am4core.useTheme(am4themes_animated);
import { nanoid } from 'nanoid'; interface DataItem {
    answerLabel: string;
    [key: string]: any;
};
import { MyTheme } from '@/helpers/charts-theme';


// @ts-ignore
const InsightsPieChartComponent = ({ questionsWithAnswers, index, question_id }: { questionsWithAnswers: any, index: number, question_id?: string }) => {
    const chartRefs = useRef({});
    const nanoId = nanoid(7)
    const reverse_axis = question_id?.endsWith('_NPS') ? false : true;

    useEffect(() => {
        if (questionsWithAnswers && questionsWithAnswers?.variables?.length) {
            // questionsWithAnswers.forEach((question, index) => {
            const root = am5.Root.new(`chartdiv-${index}`);

            // Themes begin
            // root.setThemes([
            //     am5themes_Animated.new(root)
            // ]);

            root.setThemes([
                am5themes_Animated.new(root),
                MyTheme.new(root)  // Correct way to instantiate a custom theme
            ]);
            // Themes end

            // Create chart
            let chart = root.container.children.push(am5percent.PieChart.new(root, {
                layout: root.verticalLayout,
                innerRadius: am5.percent(40)
            }));

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
            // @ts-ignore
            uniqueAnswerLabels?.forEach((answerLabel: any, index: number) => {
                let lastItem;
                for (let item of uniqueAnswerLabels) {
                    lastItem = item;
                }

                const firstItem = uniqueAnswerLabels.values().next().value;
                // console.log([index], "indexindexindex", lastItem == index, uniqueAnswerLabels, lastItem, firstItem, firstItem == index)
                let series = chart.series.push(am5percent.PieSeries.new(root, {
                    valueField: answerLabel,
                    categoryField: reverse_axis ? "answerLabel" : 'certification',
                    // alignLabels: !(firstItem == index)
                }));

                let bgColor = root.interfaceColors.get("background");

                series.ticks.template.setAll({ forceHidden: lastItem == index ? false : true });
                series.labels.template.setAll({
                    oversizedBehavior: "truncate",
                    maxWidth: 100,
                    forceHidden: lastItem == index ? false : true,
                });
                series.slices.template.setAll({
                    stroke: bgColor,
                    strokeWidth: 2,
                    tooltipText:
                        `{category}: {valuePercentTotal.formatNumber('0.00')}${reverse_axis ? '%' : ''} ({value})`
                    // "{category}: {valuePercentTotal.formatNumber('0.00')}% ({value})"
                });

                series.bullets.push(() => am5.Bullet.new(root, {
                    sprite: am5.Label.new(root, {
                        // text: hideNum ? '' : "{valueY} %",
                        text: `{valuePercentTotal.formatNumber('#.#')}${reverse_axis ? '%' : ''}`,
                        // text: "{valuePercentTotal.formatNumber('#.#')}%",
                        fill: am5.color(0xffffff),
                        centerY: am5.p50,
                        centerX: am5.p50,
                        fontSize: '10px',
                        populateText: true
                    })
                }));

                if (firstItem == index) {
                    series.slices.template.states.create("hover", { scale: 0.95 });
                }

                if (processedData && processedData?.length > 0) {
                    series?.data?.setAll(processedData);
                }
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


            (chartRefs as any).current[index] = root;
        }

        return () => {
            Object.keys(chartRefs.current).forEach((key) => {
                (chartRefs as any).current[key].dispose();
            });
        };
    }, [questionsWithAnswers, index]);

    return (
        <>
            <div onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()} id={`chartdiv-${index}`} style={{ width: "100%", height: "100%" }}></div>
        </>
    );
};

export default InsightsPieChartComponent;

