import {
    Box, Checkbox, Grid, ListSubheader, MenuItem, Tooltip, Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledContentBox } from "./visualization-configurations-table.style";
import { ListsTypes, ConfigQuestionType, } from "./visualization-configurations-table.type";
import { theme } from "@/constants/theme";
// add material react table
import { MaterialReactTable } from 'material-react-table';

import OutlinedInput from '@mui/material/OutlinedInput';
import { Select as SingleSelect } from '@mui/material';
import { ListService } from "@/services/list.service";
import { logger } from "@/helpers/logger";

interface DynamicVisualizationProps {
    // UpdateConfigData: (payload: UpdateDataType[]) => Promise<void>;
    dataToEdit: ConfigQuestionType[]
    setDataToEdit: React.Dispatch<React.SetStateAction<ConfigQuestionType[]>>
    // questionTypesList: ListsTypes[];
    editConfig: boolean;
    setEditConfig: React.Dispatch<React.SetStateAction<boolean>>;
    bannerPointsList: any;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// export const SlideList = [
//     { id: 1, name: 'DEMO_Slide' },
//     { id: 2, name: 'SINGLE' },
//     { id: 3, name: 'MULTI' }
// ]


// export const LegendList = [
//     { id: 1, name: 'Left' },
//     { id: 2, name: 'Right' },
//     { id: 3, name: 'Top' },
//     { id: 4, name: 'Bottom' }
// ]


const VisualizationConfigurationsTable: React.FC<DynamicVisualizationProps> = ({
    dataToEdit, setDataToEdit, editConfig, bannerPointsList, setLoading }) => {
    const listService = new ListService();
    const [charts, setCharts] = useState<ListsTypes[]>([])
    const [slideTypes, setSlideTypes] = useState<ListsTypes[]>([])
    const [legendPositions, setLegendPositions] = useState<ListsTypes[]>([])


    console.log(slideTypes, legendPositions, "slideTypesslideTypes")
    async function GetChartsLists() {
        setLoading(true);
        try {
            const data = await listService.get_charts_types();
            console.log(data, "dataqwert");
            if (data) {
                setCharts(data)
            }
        } catch (error) {
            logger.error(error)
        } finally {
            setLoading(false);
        }
    }

    async function GetSlidesTypesLists() {
        setLoading(true);
        try {
            const data = await listService.get_survey_slide_types();
            if (data) {
                setSlideTypes(data)
            }
        } catch (error) {
            logger.error(error)
        } finally {
            setLoading(false);
        }
    }

    async function GetLegendsPositionLists() {
        setLoading(true);
        try {
            const data = await listService.get_survey_legend_positions();
            if (data) {
                setLegendPositions(data)
            }
        } catch (error) {
            logger.error(error)
        } finally {
            setLoading(false);
        }
    }
    // const [changedQuestionIds, setChangedQuestionIds] = React.useState(new Set());

    const handleChartTypeChange = (questionId: any, newChartTypeId: any) => {

        // const selectedChart = charts?.find((item) => item?.id == newChartTypeId)?.name
        // Update the chart_type_id for the question with the specified questionId
        const newQuestionList = dataToEdit.map(question => {
            if (question.question_id === questionId) {
                return { ...question, chart_type: newChartTypeId };
            }
            return question;
        });
        // @ts-ignore
        setDataToEdit(newQuestionList);
        // setChangedQuestionIds(prev => new Set(prev).add(questionId));
    };

    const handleSlideTypeChange = (questionId: any, newChartTypeId: any) => {

        // const selectedChart = charts?.find((item) => item?.id == newChartTypeId)?.name
        // Update the chart_type_id for the question with the specified questionId
        const newQuestionList = dataToEdit.map(question => {
            if (question.question_id === questionId) {
                return { ...question, slide_type: newChartTypeId };
            }
            return question;
        });
        // @ts-ignore
        setDataToEdit(newQuestionList);
        // setChangedQuestionIds(prev => new Set(prev).add(questionId));
    };

    const handleLegendAxisChange = (questionId: any, newChartTypeId: any) => {

        // const selectedChart = charts?.find((item) => item?.id == newChartTypeId)?.name
        // Update the chart_type_id for the question with the specified questionId
        const newQuestionList = dataToEdit.map(question => {
            if (question.question_id === questionId) {
                return { ...question, legend_position: newChartTypeId };
            }
            return question;
        });
        // @ts-ignore
        setDataToEdit(newQuestionList);
        // setChangedQuestionIds(prev => new Set(prev).add(questionId));
    };

    // const handleClassificationTypeChange = (questionId: any, newChartTypeId: any) => {

    //     // const selectedChart = charts?.find((item) => item?.id == newChartTypeId)?.name
    //     // Update the chart_type_id for the question with the specified questionId
    //     const newQuestionList = dataToEdit.map(question => {
    //         if (question.id === questionId) {
    //             return { ...question, classification_type_id: newChartTypeId };
    //         }
    //         return question;
    //     });

    //     setDataToEdit(newQuestionList);
    // };

    // const handleCheckboxChange = (questionId: string, newReverseScaleValue: boolean, checkboxtype: string) => {
    //     setDataToEdit(prevList => {
    //         return prevList.map(question => {
    //             // console.log(question?.question_id === questionId, question?.question_id, questionId, "question?.question_id === questionIdquestion?.question_id === questionId")
    //             if (question?.question_id === questionId) {
    //                 return { ...question, [checkboxtype]: newReverseScaleValue };
    //             }
    //             return question;
    //         });
    //     });
    //     // setChangedQuestionIds(prev => new Set(prev).add(questionId));
    // };

    const handleCheckboxChange = (questionId: string, newReverseScaleValue: boolean, checkboxtype: string) => {
        setDataToEdit(prevList => {
            return prevList.map(question => {
                if (question?.question_id === questionId) {
                    if (checkboxtype === 'is_demographic_question' && newReverseScaleValue === true) {
                        return { ...question, [checkboxtype]: newReverseScaleValue, include_total: true, reverse_axis: false };
                    } else {
                        return { ...question, [checkboxtype]: newReverseScaleValue };
                    }
                }
                return question;
            });
        });
    };


    const handleBoxAnalysisChange = (questionId: number, newValue: any) => {
        setDataToEdit((prevList: any) => {
            return prevList.map((question: { question_value: any; }) => {
                if (question.question_value == questionId) {
                    return { ...question, box_analysis_type: newValue }
                }
                return question;
            })
        })
    }

    const handleBannerPointsChange = (questionId: number, newValue: any) => {
        setDataToEdit((prevList: any) => {
            return prevList.map((question: { question_value: any }) => {
                if (question.question_value == questionId) {
                    return { ...question, banner_points: newValue }
                }
                return question;
            })
        })
    }

    const getScaleOptions = (answerCount: number) => {
        if (answerCount == 10) {
            return [{ value: 'T3B', text: 'T3B' }, { value: 'B3B', text: 'B3B' }, { value: 'M4B', text: 'M4B' }, { value: 'T2B', text: 'T2B' }, { value: 'B2B', text: 'B2B' }];
        } else if (answerCount == 7) {
            return [{ value: 'T3B', text: 'T3B' }, { value: 'B3B', text: 'B3B' }, { value: 'T2B', text: 'T2B' }, { value: 'B2B', text: 'B2B' }, { value: 'M3B', text: 'M3B' }];
        } else if (answerCount == 5) {
            return [{ value: 'T2B', text: 'T2B' }, { value: 'B2B', text: 'B2B' }, { value: 'M1B', text: 'M1B' }];
        }
        return [];
    };

    const getScaleCustomsOptions = (answerCount: number) => {
        if (answerCount == 10) {
            return [{ value: 'T1B', text: 'T1B' }, { value: 'T4B', text: 'T4B' }, { value: 'T5B', text: 'T5B' }, { value: 'T6B', text: 'T6B' }, { value: 'T7B', text: 'T7B' }, { value: 'T8B', text: 'T8B' }, { value: 'T9B', text: 'T9B' }, { value: 'T10B', text: 'T10B' },
            { value: 'B1B', text: 'B1B' }, { value: 'B4B', text: 'B4B' }, { value: 'B5B', text: 'B5B' }, { value: 'B6B', text: 'B6B' }, { value: 'B7B', text: 'B7B' }, { value: 'B8B', text: 'B8B' }, { value: 'B9B', text: 'B9B' }, { value: 'B10B', text: 'B10B' }];
        } else if (answerCount == 7) {
            return [{ value: 'T1B', text: 'T1B' }, { value: 'T4B', text: 'T4B' }, { value: 'T5B', text: 'T5B' }, { value: 'T6B', text: 'T6B' }, { value: 'T7B', text: 'T7B' },
            { value: 'B1B', text: 'B1B' }, { value: 'B4B', text: 'B4B' }, { value: 'B5B', text: 'B5B' }, { value: 'B6B', text: 'B6B' }, { value: 'B7B', text: 'B7B' },];
        } else if (answerCount == 5) {
            return [{ value: 'T1B', text: 'T1B' }, { value: 'T3B', text: 'T3B' }, { value: 'T4B', text: 'T4B' }, { value: 'T5B', text: 'T5B' },
            { value: 'B1B', text: 'B1B' }, { value: 'B3B', text: 'B3B' }, { value: 'B4B', text: 'B4B' }, { value: 'B5B', text: 'B5B' },];
        }
        return [];
    };


    // console.log(changedQuestionIds, "changedQuestionIdschangedQuestionIdschangedQuestionIds")

    console.log(dataToEdit, "questionquestionquestionquestion")

    const columns = [
        {
            accessorKey: 'question_id',
            header: 'Code',
            size: 200,
            // isVisible: selectGrids,
            Cell: ({ row }: { row: any }) => (
                <Tooltip placement="right" title={
                    <Box style={{ backgroundColor: "#ffffff !important", width: "100%" }}>
                        <Box>
                            <h3>{row.original?.question_text}</h3>
                        </Box>
                        {row?.original?.answers?.map((answer: { answer_text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                            // @ts-ignore
                            <div key={index}>{index + 1}.   {answer?.answer_text || answer?.answer_label}</div>
                        ))}
                    </Box>
                }
                    PopperProps={{
                        sx: {
                            '& .MuiTooltip-tooltip': {
                                backgroundColor: "#ffffff",
                                color: theme.palette.primary.main,
                                width: 'calc(100vw) !important'
                            }
                        }
                    }}
                >
                    <span>{row?.original?.question_id}</span>
                </Tooltip>
            ),
        },
        {
            accessorKey: 'question_variable_id',
            header: 'Variable',
            size: 200,
            Cell: ({ row }: { row: any }) => (
                <span>{row.original.question_variable_id ? row.original.question_variable_id : "NA"}</span>
            ),
        },
        {
            accessorKey: 'question_type_name',
            header: 'Type',
            size: 200,
            Cell: ({ row }: { row: any }) => (
                <span>{row.original.question_type_name ? row.original.question_type_name : "NA"}</span>
            ),
        },

        {
            accessorKey: 'chart_type',
            header: 'Chart Type',
            // size: 250,
            Cell: ({ row }: { row: any }) => {
                return (
                    <SingleSelect
                        value={row.original.chart_type}
                        disabled={!editConfig}
                        size="small"
                        sx={{
                            width: "90%",
                        }}
                        onChange={(e) => handleChartTypeChange(row.original.question_id, e.target.value)}
                        input={<OutlinedInput />}
                        renderValue={(selected) => selected ? charts?.find((item) => item?.name == selected)?.name : ''}
                    >
                        {charts?.map((option) => (
                            <MenuItem key={option.name} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </SingleSelect>
                )
            },

        },

        {
            accessorKey: 'is_demographic_question',
            header: 'Demographic',
            size: 180,
            Cell: ({ row }: { row: any }) => (
                <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={row.original.is_demographic_question} value={row.original.is_demographic_question} onChange={(e) => {
                    handleCheckboxChange(row.original.question_id, e.target.checked, 'is_demographic_question')
                }}

                />
            ),
        },

        {
            accessorKey: 'box_analysis_type',
            header: 'Box Analysis',
            size: 300,
            Cell: ({ row }: { row: any }) => {
                // const options = getScaleOptions(row.original.answers.length)
                // const numericListptions = getScaleOptions(row.original.level_id)
                const standardOptions = getScaleOptions(row.original?.answers?.length);
                const customOptions = getScaleCustomsOptions(row.original?.answers?.length);
                const selectedValues = Array.isArray(row.original.box_analysis_type) ? row.original.box_analysis_type : [];
                return (
                    <>
                        <SingleSelect
                            multiple
                            value={selectedValues}
                            // disabled={disableState}
                            size="small"
                            sx={{
                                width: "100%", display: (row.original?.question_type_id == 12 || row.original?.question_type_id == 13 || row.original?.question_type_id == -1 || row.original?.question_type_name == 'grid')
                                    && row.original?.answers?.length > 4
                                    ? "block" : "none"
                            }}
                            onChange={(e) => handleBoxAnalysisChange(row.original.question_value, e.target.value)}
                            input={<OutlinedInput />}
                            // renderValue={(selected) => selected?.slice(0, 5).join(',') + selected?.length > 5 ? '...' : null}
                            renderValue={(selected) => selected?.slice(0, 5).join(',') + (selected?.length > 5 ? '...' : '')}

                        >
                            <ListSubheader>Default</ListSubheader>
                            {standardOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.text}
                                </MenuItem>
                            ))}

                            {/* Custom Options */}
                            <ListSubheader>Custom</ListSubheader>
                            {customOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.text}
                                </MenuItem>
                            ))}
                        </SingleSelect >
                    </>
                )
            },
        },

        {
            accessorKey: 'banner_points',
            header: 'Banner Points',
            size: 300,
            Cell: ({ row }: { row: any }) => {
                const selectedValues = Array.isArray(row.original.banner_points) ? row.original.banner_points : [];
                return (
                    <>
                        <SingleSelect
                            multiple
                            value={selectedValues}
                            // disabled={disableState}
                            size="small"
                            sx={{ width: "100%", }}
                            onChange={(e) => handleBannerPointsChange(row.original.question_value, e.target.value)}
                            input={<OutlinedInput />}
                            // renderValue={(selected) => selected?.slice(0, 5).join(',') + selected?.length > 5 ? '...' : null}
                            renderValue={(selected) => selected?.slice(0, 5).join(',') + (selected?.length > 5 ? '...' : '')}
                        >
                            {bannerPointsList.map((option: { question_value: any, question_label: any }) => (
                                <MenuItem key={option.question_label} value={option.question_label}>
                                    {option.question_label}
                                </MenuItem>
                            ))}
                        </SingleSelect>
                    </>
                )
            },
        },

        // bannerpoints

        {
            accessorKey: 'slide_type',
            header: 'Slide Type',
            // size: 250,
            Cell: ({ row }: { row: any }) => {
                return (
                    <SingleSelect
                        value={row.original.slide_type}
                        disabled={!editConfig}
                        size="small"
                        sx={{
                            width: "90%",
                        }}
                        onChange={(e) => handleSlideTypeChange(row.original.question_id, e.target.value)}
                        input={<OutlinedInput />}
                        renderValue={(selected) => selected ? slideTypes?.find((item) => item?.key == selected)?.name : ''}
                    >
                        {slideTypes?.map((option) => (
                            <MenuItem key={option.key} value={option.key}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </SingleSelect>
                )
            },

        },

        {
            accessorKey: 'reverse_axis',
            header: 'Reverse Axis',
            size: 150,
            Cell: ({ row }: { row: any }) => (
                <Checkbox style={{ padding: "0px" }} disabled={!editConfig || row.original.is_demographic_question} checked={row.original.reverse_axis} value={row.original.reverse_axis} onChange={(e) => {
                    handleCheckboxChange(row.original.question_id, e.target.checked, 'reverse_axis')
                }}

                />
            ),
        },

        {
            accessorKey: 'legend_position',
            header: 'Legend Position',
            // size: 250,
            Cell: ({ row }: { row: any }) => {
                return (
                    <SingleSelect
                        value={row.original.legend_position}
                        disabled={!editConfig}
                        size="small"
                        sx={{
                            width: "90%",
                        }}
                        onChange={(e) => handleLegendAxisChange(row.original.question_id, e.target.value)}
                        input={<OutlinedInput />}
                        renderValue={(selected) => selected ? legendPositions?.find((item) => item?.key == selected)?.name : ''}
                    >
                        {legendPositions?.map((option) => (
                            <MenuItem key={option.key} value={option.key}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </SingleSelect>
                )
            },

        },

        {
            accessorKey: 'include_total',
            header: 'Include Total',
            size: 180,
            Cell: ({ row }: { row: any }) => (
                <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={row.original.include_total} value={row.original.include_total} onChange={(e) => {
                    handleCheckboxChange(row.original.question_id, e.target.checked, 'include_total')
                }}

                />
            ),
        },

        {
            accessorKey: 'run_nps',
            header: 'Run NPS',
            size: 180,
            Cell: ({ row }: { row: any }) => (
                <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={row.original.run_nps} value={row.original.run_nps} onChange={(e) => {
                    handleCheckboxChange(row.original.question_id, e.target.checked, 'run_nps')
                }}

                />
            ),
        },


        // {
        //     accessorKey: 'classification_type_name',
        //     header: 'Classification Type',
        //     size: 250,
        //     Cell: ({ row }: { row: any }) => {
        //         return (
        //             <SingleSelect
        //                 value={row.original.classification_type_id}
        //                 // disabled={disableState}
        //                 size="small"
        //                 sx={{
        //                     width: "90%",
        //                 }}
        //                 onChange={(e) => handleClassificationTypeChange(row.original.id, e.target.value)}
        //                 input={<OutlinedInput />}
        //                 renderValue={(selected) => selected ? charts?.find((item) => item?.id == selected)?.name : ''}
        //             >
        //                 {charts?.map((option) => (
        //                     <MenuItem key={option.id} value={option.id}>
        //                         {option.name}
        //                     </MenuItem>
        //                 ))}
        //             </SingleSelect>
        //         )
        //     },

        // },



    ];

    // console.log(dataToEdit, "questionListquestionList")


    // const handleSubmit = (e: any) => {
    //     e.preventDefault()

    //     const updates: any = [...changedQuestionIds].map(questionId => {
    //         return dataToEdit.find(question => question.question_id === questionId);
    //     });

    //     // console.log(updates, "updatesupdates")

    //     const dataToPost = updates && updates?.map((item: { is_min_diff: any; is_max_diff: any; is_tabulation: any; is_chartable_question: any; is_quotable_question: any; is_insights_question: any; is_conjoint_question: any; chart_type_id: any; question_id: any; }) => ({
    //         is_chartable_question: item?.is_chartable_question,
    //         is_quotable_question: item?.is_quotable_question,
    //         is_insights_question: item?.is_insights_question,
    //         is_conjoint_question: item?.is_conjoint_question,
    //         // is_min_diff: item?.is_min_diff,
    //         is_max_diff: item?.is_max_diff,
    //         is_tabulation: item?.is_tabulation,
    //         chart_type_id: item?.chart_type_id,
    //         question_id: item?.question_id

    //     }))
    //     if (dataToPost) {
    //         UpdateConfigData(dataToPost)
    //     }
    // }

    useEffect(() => {
        GetChartsLists()
        GetSlidesTypesLists()
        GetLegendsPositionLists()
    }, [])

    return (
        <Box style={{ padding: "0rem 2rem 2rem 2rem" }}>
            {/* <form onSubmit={handleSubmit}> */}
            <Grid container spacing={0} style={{ display: "block" }}  >
                <Box style={{ padding: "0rem 0rem 2rem 0rem" }}>
                    <StyledContentBox className="answer-add-container-view-mode-tabulation-table">
                        <Box sx={{ width: '100%' }}>
                            <MaterialReactTable
                                columns={columns}
                                data={dataToEdit}
                                // enableColumnOrdering // Enable column ordering
                                enableColumnResizing // Enable column resizing
                                // enablePinning // Enable column pinning
                                // enableRowSelection // Enable row selection
                                // enableRowActions // Enable row actions
                                enableSorting // Enable sorting
                                enableGlobalFilter // Enable global filter
                                enablePagination={true} // Enable pagination
                                // initialState={{ density: 'compact' }}
                                muiTableHeadCellProps={{ sx: { fontWeight: 'bold' } }}
                                muiTableContainerProps={{ sx: { maxHeight: "600px" } }}
                                enableStickyHeader
                                renderTopToolbarCustomActions={() => {
                                    return <Typography variant="h4">Questions</Typography>;
                                }}
                                muiPaginationProps={{
                                    rowsPerPageOptions: [25, 50, 100, 200, 500],
                                }}

                                initialState={{
                                    density: 'compact',
                                    columnPinning: { left: ['mrt-row-actions', 'question_id', 'classification_type_name', 'question_variable_type'] },
                                    pagination: { pageSize: 25, pageIndex: 0 }
                                }}
                            />
                        </Box>
                    </StyledContentBox>
                </Box>
            </Grid>
        </Box>
    )
}
export default VisualizationConfigurationsTable;