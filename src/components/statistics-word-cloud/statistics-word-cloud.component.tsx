import { useEffect, useRef } from 'react';

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";



import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
// am4core.useTheme(am4themes_animated);
import { nanoid } from 'nanoid';


import { MyTheme } from '@/helpers/charts-theme';

import { WordCloud } from "@amcharts/amcharts5/wc";

// @ts-ignore
interface DataItem {
    name: string;
    freq: number;
};


// @ts-ignore
const StatisticsWordCloud = ({ questionsWithAnswers, index, }: { questionsWithAnswers: any, index: number }) => {
    const nanoId = nanoid(7)
    // const questionsWithAnswers = data
    // console.log(questionsWithAnswers, "questionsWithAnswersquestionsWithAnswers")
    const chartRefs = useRef({});

    // const reverse_axis = question_id?.endsWith('_NPS') ? false : true;

    useEffect(() => {
        const chartId = `chartdiv-${index}`;
        if (questionsWithAnswers && document.getElementById(chartId) && questionsWithAnswers.length) {
            const root = am5.Root.new(chartId);

            root.setThemes([
                am5themes_Animated.new(root),
                MyTheme.new(root)
            ]);

            // Add series
            let series = root.container.children.push(WordCloud.new(root, {
                categoryField: "name",
                valueField: "freq",
                maxFontSize: am5.percent(15)
            }));

            // Configure labels
            series.labels.template.setAll({
                fontFamily: "Courier New",
                fill: am5.color(0xFC4B28)
            });

            // Convert your data structure to a format that can be used by the word cloud
            const data = questionsWithAnswers.map((variable: { name: string; freq: number; }) => {
                return { name: variable.name, freq: variable?.freq };
            });

            // Set data
            series.data.setAll(data);

            am5exporting.Exporting.new(root, {
                menu: am5exporting.ExportingMenu.new(root, {}),
                filePrefix: nanoId,
                dataSource: data,
                dataFields: {
                    name: "Name",
                    freq: "Frequency"
                }
            });
            // @ts-ignore
            chartRefs.current[index] = root;
        }

        return () => {
            Object.keys(chartRefs.current).forEach(key => {
                // @ts-ignore
                chartRefs.current[key].dispose();
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

export default StatisticsWordCloud;
