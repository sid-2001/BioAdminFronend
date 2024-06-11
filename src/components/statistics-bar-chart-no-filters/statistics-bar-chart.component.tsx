import { useEffect, useRef } from 'react';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
// am4core.useTheme(am4themes_animated);
import { nanoid } from 'nanoid';
import { MyTheme } from '@/helpers/charts-theme';

// class MyTheme extends am5.Theme {
//     setupDefaultRules() {
//         this.rule("Label").setAll({
//             fontSize: 12,
//             fill: am5.color(0x777777) // Default text color
//         });

//         this.rule("ColorSet").set("colors", [
//             am5.color("#47077F"), // Accent-1
//             am5.color("#6B0ABE"), // Accent-2
//             am5.color("#DF8603"), // Accent-3
//             am5.color("#FBA321"), // Accent-4
//             am5.color("#FC4B28")  // Accent-5
//         ]);
//     }
// }

// @ts-ignore
const StatisticsBarChartComponentNoFilters = ({ questionsWithAnswers, index, fullViewMode }) => {
    const nanoId = nanoid(7)
    // console.log(questionsWithAnswers, "questionsWithAnswersquestionsWithAnswers")
    const chartRefs = useRef({});

    const chartId = useRef(`chartdiv-${nanoid()}`);

    useEffect(() => {
        if (questionsWithAnswers) {
            // questionsWithAnswers.forEach((question, index) => {
            const root = am5.Root.new(chartId.current);

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
            let chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: false,
                // panY: true,
                // wheelX: "panX",
                // wheelY: "zoomX",
                pinchZoomX: true,
                paddingLeft: 0,
                layout: root.verticalLayout
            }));

            // chart.set("colors", am5.ColorSet.new(root, {
            //     colors: [
            //         am5.color("#47077F"), // Accent-1
            //         am5.color("#6B0ABE"), // Accent-2
            //         am5.color("#DF8603"), // Accent-3
            //         am5.color("#FBA321"), // Accent-4
            //         am5.color("#FC4B28")
            //     ]
            // }))

            // Generate series data
            let data = (questionsWithAnswers.answer || questionsWithAnswers.answers)?.map((ans: { answer_label: any; count: any; answer_text: any; perc: any; }) => ({
                category: (ans.answer_label || ans.answer_text),
                // category: question.s?.length > 2 ? 
                // ans?.answer_label.substring(0, 5) + '...' : ans.answer_label?.length > 10 ? ans.answer_label.substring(0, 10) + '...' : ans.answer_label,
                value: Number((ans?.perc * 100) || ans.count)
            }));

            // let exporting = am5exporting.Exporting.new(root, {
            //     menu: am5exporting.ExportingMenu.new(root, {}),
            //     dataSource: data,
            //     dataFields: {
            //         value: "Value (%)",
            //         category: "Category"
            //     },
            //     dataFieldsOrder: ["value", "category"]
            // });

            // Set data
            let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30, minorGridEnabled: true });

            xRenderer.grid.template.setAll({
                visible: false
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

            let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                maxDeviation: 0.3,
                categoryField: "category",
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {})
            }));
            // xAxis.get("renderer").labels.template.adapters.add("text", (_text, target) => {
            //     // console.log(xAxis?._mainDataItems?.length, "xAxisxAxis")
            //     // Safely attempt to access the category data
            //     // @ts-ignore
            //     const category = target.dataItem?.dataContext?.category;
            //     if (xAxis?._mainDataItems?.length > 5) {



            //         // Check if the category exists and is a string
            //         if (typeof category === 'string' && category.length > 1) {
            //             // Shorten the category to a maximum length, adding '...' at the end
            //             return category.substring(0, 1) + '...';
            //         }
            //     }
            //     // Check if the category exists and is a string
            //     if (typeof category === 'string' && category.length > 10) {
            //         // Shorten the category to a maximum length, adding '...' at the end
            //         return category.substring(0, 10) + '...';
            //     }

            //     // Return the original text if no shortening is needed or if category is not a string
            //     return category;
            // });


            let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                maxDeviation: 0.3,
                // min: 0,

                min: 0,

                // max: 100,
                // numberFormat: "#'%'",
                strictMinMax: true,
                calculateTotals: true,
                visible: false,
                renderer: am5xy.AxisRendererY.new(root, {
                    strokeOpacity: 0.1,
                    visible: false

                })
            }));

            yAxis.get("renderer").grid.template.setAll({
                strokeWidth: 0,
                visible: false
            });


            const mainTitle = questionsWithAnswers?.question_title_generated?.length > (fullViewMode ? 60 : 25) ? questionsWithAnswers?.question_title_generated?.substring(0, (fullViewMode ? 60 : 25)) + '...' : questionsWithAnswers?.question_title_generated;
            // const subTitle = "This is a sub-title";
            const title = am5.Label.new(root, {
                html: `<h5>${mainTitle ? mainTitle : questionsWithAnswers?.question_id}</h5>`,
                x: am5.percent(50),
                centerX: am5.percent(50),
                paddingTop: 0,
                paddingBottom: 10
            });
            chart.children.unshift(title);

            // chart.children.push(am5.Legend.new(root, {
            //     centerX: am5.percent(50),
            //     x: am5.percent(50)
            // }));

            let series = chart.series.push(am5xy.ColumnSeries.new(root, {
                name: "Series 1",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                categoryXField: "category",
                tooltip: am5.Tooltip.new(root, {
                    labelText: `{valueY}${(questionsWithAnswers?.type != ('numeric' || 'numericlist') || questionsWithAnswers?.chart_type == 'COLUMN_STACKED_100') ? '' : ''}`
                }),
            }));

            series.columns.template.setAll({
                tooltipY: 0,
                tooltipText: "{categoryX}: {valueY}",
                shadowOpacity: 0.1,
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowBlur: 1,
                strokeWidth: 2,
                stroke: am5.color(0xffffff),
                // shadowColor: am5.color(0x000000),
                // cornerRadiusTL: 50,
                // cornerRadiusTR: 50,
                fillGradient: am5.LinearGradient.new(root, {
                    stops: [
                        {}, // will use original column color
                        {}
                    ]
                }),
                fillPattern: am5.GrainPattern.new(root, {
                    maxOpacity: 0.15,
                    density: 0.5,
                    colors: [am5.color(0x000000), am5.color(0x000000), am5.color(0xffffff)]
                })
            });


            series.columns.template.states.create("hover", {
                shadowOpacity: 1,
                shadowBlur: 10,
                // cornerRadiusTL: 10,
                // cornerRadiusTR: 10
            })

            series.columns.template.adapters.add("fill", function (_fill, target) {
                return (chart as any).get("colors").getIndex(series.columns.indexOf(target));
            });
            // console.log(data, "datadatadata", questionsWithAnswers)
            if (data && data?.length > 0) {
                series.data.setAll(data);
                xAxis.data.setAll(data);
            }

            series.bullets.push(() => am5.Bullet.new(root, {
                sprite: am5.Label.new(root, {
                    // text: hideNum ? '' : "{valueY} %",
                    text: `{valueY}${(questionsWithAnswers?.type != ('numeric' || 'numericlist') || questionsWithAnswers?.chart_type == 'COLUMN_STACKED_100') ? '' : ''}`,
                    fill: am5.color(0xffffff),
                    centerY: am5.p50,
                    centerX: am5.p50,
                    fontSize: '10px',
                    populateText: true
                })
            }));
            // Add cursor
            chart.set("cursor", am5xy.XYCursor.new(root, {}));

            am5exporting.Exporting.new(root, {
                menu: am5exporting.ExportingMenu.new(root, {}),
                dataSource: data,
                dataFields: {
                    // value: "Value (%)",
                    value: "Value",
                    category: "Category"
                },
                dataFieldsOrder: ["value", "category"],
                filePrefix: nanoId
            });

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
    }, [questionsWithAnswers, index, fullViewMode]);

    return (
        <>
            <div onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()} id={chartId.current} style={{ width: "100%", height: "100%" }}></div>
        </>
    );
};

export default StatisticsBarChartComponentNoFilters;

