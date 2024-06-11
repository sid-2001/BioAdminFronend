import { useEffect, useRef } from 'react';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";
// am4core.useTheme(am4themes_animated);
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
// am4core.useTheme(am4themes_animated);
import { nanoid } from 'nanoid';
import { MyTheme } from '@/helpers/charts-theme';


// @ts-ignore
const StatisticsPieChartsComponent = ({ questionsWithAnswers, index, fullViewMode }) => {
    const chartRefs = useRef({});
    const nanoId = nanoid(7)

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
            let chart = root.container.children.push(
                am5percent.PieChart.new(root, {
                    layout: root.verticalLayout
                })
            );

            // Create series
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
            let series = chart.series.push(
                am5percent.PieSeries.new(root, {
                    valueField: "value",
                    categoryField: "category",
                    // endAngle: 270
                })
            );

            const mainTitle = questionsWithAnswers?.question_title_generated?.length > (fullViewMode ? 60 : 25) ? questionsWithAnswers?.question_title_generated?.substring(0, (fullViewMode ? 60 : 25)) + '...' : questionsWithAnswers?.question_title_generated;
            // const subTitle = "This is a sub-title";
            const title = am5.Label.new(root, {
                html: `<h5>${mainTitle ? mainTitle : questionsWithAnswers?.question_id}</h5>`,
                x: am5.percent(50),
                centerX: am5.percent(50),
                paddingTop: 0,
                paddingBottom: 0
            });
            chart.children.unshift(title);

            series.slices.template.states.create("hover", {
                shadowOpacity: 1,
                shadowBlur: 10
            })

            series.ticks.template.setAll({
                strokeOpacity: 0.4,
                strokeDasharray: [2, 2]
            })

            series.states.create("hidden", {
                endAngle: -90
            });

            series.labels.template.setAll({
                maxWidth: 200,
                oversizedBehavior: "truncate",
                textAlign: "center"
            });



            // Generate series data
            let data = (questionsWithAnswers.answers || questionsWithAnswers.answer).map((ans: { answer_text: any; answer_label: any; count: any; perc: any; }) => ({
                category: (ans.answer_text || ans?.answer_label),
                // category: question.answer?.length > 2 ? 
                // ans?.answer_text.substring(0, 5) + '...' : ans.answer_text?.length > 10 ? ans.answer_text.substring(0, 10) + '...' : ans.answer_text,
                value: (ans?.perc * 100) || ans.count
            }));

            // let legend = chart.children.unshift(am5.Legend.new(root, {
            //     centerX: am5.percent(50),
            //     x: am5.percent(50),
            //     marginTop: 15,
            //     marginBottom: 15,
            // }));

            if (data && data?.length > 0) {
                series.data.setAll(data);
            }

            series.bullets.push(() => am5.Bullet.new(root, {
                sprite: am5.Label.new(root, {
                    text: `{value}${(questionsWithAnswers?.type != ('numeric' || 'numericlist') || questionsWithAnswers?.chart_type == 'COLUMN_STACKED_100') ? '%' : '%'}`,  // Ensure the field name is correctly referenced here
                    fill: am5.color(0xffffff),
                    centerY: am5.p50,
                    centerX: am5.p50,
                    fontSize: '10px',
                    populateText: true
                })
            }));

            // if (data && data?.length > 0) {
            //     legend.data.setAll(series.dataItems);
            // }

            // Add cursor
            // @ts-ignore
            chart.set("cursor", am5xy.XYCursor.new(root, {}));

            am5exporting.Exporting.new(root, {
                menu: am5exporting.ExportingMenu.new(root, {}),
                dataSource: data,
                dataFields: {
                    value: "Value (%)",
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

export default StatisticsPieChartsComponent;

