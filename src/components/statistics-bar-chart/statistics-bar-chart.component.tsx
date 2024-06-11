import { useEffect, useRef } from 'react';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import "./bar-chart.css"

// am4core.useTheme(am4themes_animated);

interface StatisticsBarChartComponentProps {
    questionsWithAnswers: any;
    index: number | string;
    dataToEdit?: any;
    setDataToEdit?: any;
}


const StatisticsBarChartComponent = ({ questionsWithAnswers, index, setDataToEdit }: StatisticsBarChartComponentProps) => {
    // const StatisticsBarChartComponent = ({ questionsWithAnswers, index }) => {
    const chartRefs = useRef({});

    console.log(questionsWithAnswers, "questionsWithAnswersquestionsWithAnswersquestionsWithAnswers")

    useEffect(() => {
        if (questionsWithAnswers) {
            // questionsWithAnswers.forEach((question, index) => {
            const root = am5.Root.new(`chartdiv-${index}`);

            // Themes begin
            root.setThemes([
                am5themes_Animated.new(root)
            ]);
            // Themes end

            // Create chart
            let chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX: true,
                paddingLeft: 0,
                layout: root.verticalLayout
            }));

            chart.set("colors", am5.ColorSet.new(root, {
                colors: [
                    am5.color(0x8A16E5),
                    am5.color(0xAF24C6),
                    am5.color(0xCB1717),
                    am5.color(0xDE6C1A),
                    am5.color(0xABD019),
                    am5.color(0x1DA522),
                    am5.color(0x8A16E5)
                ]
            }))

            // Generate series data
            let data = (questionsWithAnswers?.answers || questionsWithAnswers?.answer)?.map((ans: { answer_code: any; answer_label: any; count: any; perc: any; }) => ({
                answer_code: ans.answer_code,
                // let data = questionsWithAnswers.answers.map((ans: { answer_label: any; count: any; }) => ({
                category: ans.answer_label,
                // category: question.s?.length > 2 ? 
                // ans?.answer_label.substring(0, 5) + '...' : ans.answer_label?.length > 10 ? ans.answer_label.substring(0, 10) + '...' : ans.answer_label,
                value: (ans?.perc * 100) || ans.count
            }));



            // Set data
            let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30, minorGridEnabled: true });

            xRenderer.grid.template.setAll({
                location: 1
            })

            let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                maxDeviation: 0.3,
                categoryField: "category",
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {})
            }));
            xAxis.get("renderer").labels.template.adapters.add("text", (_text, target) => {
                // console.log(xAxis?._mainDataItems?.length, "xAxisxAxis")
                // Safely attempt to access the category data
                // @ts-ignore
                const category = target.dataItem?.dataContext?.category;
                if (xAxis?._mainDataItems?.length > 5) {



                    // Check if the category exists and is a string
                    if (typeof category === 'string' && category.length > 1) {
                        // Shorten the category to a maximum length, adding '...' at the end
                        return category.substring(0, 1) + '...';
                    }
                }
                // Check if the category exists and is a string
                if (typeof category === 'string' && category.length > 10) {
                    // Shorten the category to a maximum length, adding '...' at the end
                    return category.substring(0, 10) + '...';
                }

                // Return the original text if no shortening is needed or if category is not a string
                return category;
            });


            let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                maxDeviation: 0.3,
                min: 0,
                // extraMax: 0.1, // this adds some space at the top
                // renderer: am5xy.AxisRendererY.new(root, {})
                renderer: am5xy.AxisRendererY.new(root, {
                    strokeOpacity: 0.1
                })
            }));

            // let series = chart.series.push(am5xy.ColumnSeries.new(root, {
            //     name: "Series 1",
            //     xAxis: xAxis,
            //     yAxis: yAxis,
            //     valueYField: "value",
            //     categoryXField: "category",
            //     tooltip: am5.Tooltip.new(root, {
            //         labelText: "{valueY}"
            //     }),
            // }));


            // series.columns.template.setAll({
            //     tooltipY: 0,
            //     tooltipText: "{categoryX}: {valueY}",
            //     shadowOpacity: 0.1,
            //     shadowOffsetX: 2,
            //     shadowOffsetY: 2,
            //     shadowBlur: 1,
            //     strokeWidth: 2,
            //     stroke: am5.color(0xffffff),
            //     shadowColor: am5.color(0x000000),
            //     cornerRadiusTL: 50,
            //     cornerRadiusTR: 50,
            //     fillGradient: am5.LinearGradient.new(root, {
            //         stops: [
            //             {}, // will use original column color
            //             { color: am5.color(0x000000) }
            //         ]
            //     }),
            //     fillPattern: am5.GrainPattern.new(root, {
            //         maxOpacity: 0.15,
            //         density: 0.5,
            //         colors: [am5.color(0x000000), am5.color(0x000000), am5.color(0xffffff)]
            //     })
            // });


            // series.columns.template.states.create("hover", {
            //     shadowOpacity: 1,
            //     shadowBlur: 10,
            //     cornerRadiusTL: 10,
            //     cornerRadiusTR: 10
            // })

            // series.columns.template.adapters.add("fill", function (_fill, target) {
            //     return (chart as any).get("colors").getIndex(series.columns.indexOf(target));
            // });



            // legend?.container?.children?.each((child) => {
            //     child.dom.style.display = 'none';
            // });


            console.log(questionsWithAnswers, "qwertyquestionsWithAnswersquestionsWithAnswers")
            function toggleSeries(series: am5xy.ColumnSeries, data: {
                category: any; answer_code: any;
            }[], ev: am5.ISpritePointerEvent & { type: "click"; target: am5xy.ColumnSeries; }) {
                console.log(series, "seriesseries", data, ev)
                if (series.get("visible")) {
                    series.hide();
                    console.log(series, "hidehidehide", data)
                } else {
                    series.show();
                    console.log(series, "showshowshow", data)
                }

                setDataToEdit((currentData: any[]) => {
                    return currentData.map((question) => {
                        // if (question.question_id === "hPanelCountry") {
                        return {
                            ...question,
                            answers: question.answers.map((answer: { answer_pre_code: any; answer_label: any; is_selected: any; }) => {
                                // Check if the answer_code matches the answer_pre_code
                                if (answer.answer_pre_code === data[0].answer_code && answer?.answer_label === data[0]?.category) {
                                    console.log(questionsWithAnswers, question, "questionquestion", answer?.answer_label === data[0]?.category, answer?.answer_label, data[0]?.category, answer, answer.answer_pre_code, data[0].answer_code, answer.answer_pre_code === data[0].answer_code, answer.is_selected)

                                    // Toggle the is_selected state
                                    return { ...answer, is_selected: !answer.is_selected };
                                }
                                return answer;
                            }),
                        };
                        // }
                        // return question;
                    });
                });
            }


            function makeSeries(name: any, _fieldName: any, data: any[]) {
                console.log(data, "datadata")
                let series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    name: name,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "value",
                    categoryXField: "category",
                    tooltip: am5.Tooltip.new(root, {
                        labelText: "{valueY}"
                    }),
                }));


                series.columns.template.setAll({
                    tooltipY: 0,
                    tooltipText: "{categoryX}: {valueY}",
                    shadowOpacity: 0.1,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    shadowBlur: 1,
                    strokeWidth: 1,  //2
                    stroke: am5.color(0xffffff),
                    shadowColor: am5.color(0x000000),
                    cornerRadiusTL: 50,
                    cornerRadiusTR: 50,
                    fillGradient: am5.LinearGradient.new(root, {
                        stops: [
                            {}, // will use original column color
                            { color: am5.color(0x000000) }
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
                    cornerRadiusTL: 10,
                    cornerRadiusTR: 10
                })

                // series.columns.template.adapters.add("fill", function (_fill, target) {
                //     return (chart as any).get("colors").getIndex(series.columns.indexOf(target));
                // });

                const legend = chart.children.push(am5.Legend.new(root, {
                    centerX: am5.p50,
                    x: am5.p50
                }));

                series.events.once("datavalidated", () => {
                    (series as any).get("legendDataItem").get("itemContainer").hide();
                });

                // series.bullets.push(function () {
                //     return am5.Bullet.new(root, {
                //         locationY: 0.5,
                //         sprite: am5.Label.new(root, {
                //             text: "{valueY}",
                //             fill: root.interfaceColors.get("alternativeText"),
                //             centerY: am5.p50,
                //             centerX: am5.p50,
                //             populateText: true
                //         })
                //     });
                // });

                series.data.setAll(data);
                series.appear();

                // Add series to legend
                var legendDataItem = legend.data.push(series);

                // Handle click event on the legend item
                legendDataItem.events.on("click", function (ev) {
                    console.log("Legend item clicked")
                    toggleSeries(series, data, ev);
                });

                // Optionally, handle the visibility change to update the legend marker
                // (series.events as any).on("visibilitychanged", function (ev) {
                //     legendDataItem.get("marker").set("disabled", !ev.target.get("visible"));
                // });

            }

            // Example call to makeSeries
            // You need to adjust data and field names based on your actual data structure
            data?.forEach((item: { answer_label: any; value: any; }) => {
                makeSeries(item?.answer_label, item?.value, [item]);
            });



            // series.data.setAll(data);
            xAxis.data.setAll(data);
            console.log(data, "datadatadata", questionsWithAnswers)

            // Add cursor
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
            <div onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()} id={`chartdiv-${index}`} style={{ width: "100%", height: "100%" }}></div>
        </>
    );
};

export default StatisticsBarChartComponent;

