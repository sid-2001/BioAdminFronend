import {
    Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Tooltip, Typography,
} from "@mui/material";
import React, { useState } from "react";
import { StyledContentBox } from "./charts-configurations-table.style";
import { ListsTypes, ConfigQuestionType, UpdateDataType, } from "./charts-configurations-table.type";
import { theme } from "@/constants/theme";
// add material react table
import { MaterialReactTable } from 'material-react-table';

import OutlinedInput from '@mui/material/OutlinedInput';
import { Select as SingleSelect } from '@mui/material';
import { QuestionNameInput } from "@/constants/cutom-question-name-input";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteIcon from '@mui/icons-material/Delete';

interface DynamicTabulationProps {
    UpdateConfigData: (payload: UpdateDataType[]) => Promise<void>;
    questionList: ConfigQuestionType[]
    setQuestionList: React.Dispatch<React.SetStateAction<ConfigQuestionType[]>>
    charts: ListsTypes[];
    questionTypesList: ListsTypes[];
    editConfig: boolean;
    setEditConfig: React.Dispatch<React.SetStateAction<boolean>>;
}


const ChartsConfigurationsTable: React.FC<DynamicTabulationProps> = ({ UpdateConfigData,
    questionList, setQuestionList, charts, editConfig, setEditConfig }) => {
    const [changedQuestionIds, setChangedQuestionIds] = React.useState(new Set());
    const [openEdit, setOpenEdit] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState<ConfigQuestionType | null>(null);
    const [validationErrors, setValidationErrors] = useState<any>({});


    const handleChartTypeChange = (questionId: any, newChartTypeId: any) => {

        // const selectedChart = charts?.find((item) => item?.id == newChartTypeId)?.name
        // Update the chart_type_id for the question with the specified questionId
        const newQuestionList = questionList.map(question => {
            if (question.question_id === questionId) {
                return { ...question, chart_type_id: newChartTypeId };
            }
            return question;
        });
        // @ts-ignore
        setQuestionList(newQuestionList);
        setChangedQuestionIds(prev => new Set(prev).add(questionId));
    };

    // const handleClassificationTypeChange = (questionId: any, newChartTypeId: any) => {

    //     // const selectedChart = charts?.find((item) => item?.id == newChartTypeId)?.name
    //     // Update the chart_type_id for the question with the specified questionId
    //     const newQuestionList = questionList.map(question => {
    //         if (question.id === questionId) {
    //             return { ...question, classification_type_id: newChartTypeId };
    //         }
    //         return question;
    //     });

    //     setQuestionList(newQuestionList);
    // };

    const handleCheckboxChange = (questionId: string, newReverseScaleValue: boolean, checkboxtype: string) => {
        setQuestionList(prevList => {
            return prevList.map(question => {
                // console.log(question?.question_id === questionId, question?.question_id, questionId, "question?.question_id === questionIdquestion?.question_id === questionId")
                if (question?.question_id === questionId) {
                    return { ...question, [checkboxtype]: newReverseScaleValue };
                }
                return question;
            });
        });
        setChangedQuestionIds(prev => new Set(prev).add(questionId));
    };

    const handleInputChangeRespondents = (questionId: string | number, newValue: string) => {
        setQuestionList(prevList => {
            return prevList.map(question => {
                if (question.question_id === questionId) {
                    return { ...question, question_title: newValue };
                }
                return question;
            });
        });
        setChangedQuestionIds(prev => new Set(prev).add(questionId));
    };

    const handleInputChangeQuestionlabel = (questionId: string | number, newValue: string) => {
        setQuestionList(prevList => {
            return prevList.map(question => {
                if (question.question_id === questionId) {
                    return { ...question, question_label: newValue };
                }
                return question;
            });
        });
        setChangedQuestionIds(prev => new Set(prev).add(questionId));
    };

    // console.log(changedQuestionIds, "changedQuestionIdschangedQuestionIdschangedQuestionIds")

    // console.log(questionList, "question")

    const handleEditClick = (question: ConfigQuestionType) => {
        setCurrentQuestion(question);
        setOpenEdit(true);
    };

    const handleAnswerChange = (answerIndex: number, field: string, newValue: string) => {
        if (currentQuestion) {
            const updatedAnswers = currentQuestion.answers.map((answer, index) => {
                if (index === answerIndex) {
                    return { ...answer, [field]: newValue };
                }
                return answer;
            });
            setCurrentQuestion({ ...currentQuestion, answers: updatedAnswers });
        }
    };

    const handleAnswerCheckboxChange = (answerIndex: number, field: string, newValue: boolean) => {
        if (currentQuestion) {
            const updatedAnswers = currentQuestion.answers.map((answer, index) => {
                if (index === answerIndex) {
                    return { ...answer, [field]: newValue };
                }
                return answer;
            });
            setCurrentQuestion({ ...currentQuestion, answers: updatedAnswers });
        }
    };

    const handleAddAnswer = () => {
        if (currentQuestion) {
            const newAnswer = { answer_id: '', answer_pre_code: String((currentQuestion?.answers?.length || 0) + 1), answer_text: '' };
            setCurrentQuestion({ ...currentQuestion, answers: [...currentQuestion.answers, newAnswer] });
        }
    };

    const handleDeleteAnswer = (answerIndex: number) => {
        if (currentQuestion) {
            const updatedAnswers = currentQuestion.answers.filter((_, index) => index !== answerIndex);
            setCurrentQuestion({ ...currentQuestion, answers: updatedAnswers });
        }
    };
    const validateForm = () => {
        const errors: any = {};

        if (!currentQuestion?.question_title) {
            errors.question_title = "Question Title is required";
        }
        if (!currentQuestion?.question_label) {
            errors.question_label = "Question Label is required";
        }
        if (!currentQuestion?.chart_type_id) {
            errors.chart_type_id = "Chart Type is required";
        }

        currentQuestion?.answers.forEach((answer, index) => {
            if (!answer.answer_pre_code) {
                errors[`answer_pre_code_${index}`] = "Answer Pre Code is required";
            }
            if (!answer.answer_text) {
                errors[`answer_text_${index}`] = "Answer Text is required";
            }
        });

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleModalSave = () => {
        if (validateForm() && currentQuestion) {
            const updatedQuestionList = questionList.map(question =>
                question.question_id === currentQuestion.question_id ? currentQuestion : question
            );
            setQuestionList(updatedQuestionList);
            setChangedQuestionIds(prev => new Set(prev).add(currentQuestion.question_id));
            setOpenEdit(false);
            setValidationErrors({})
        }
    };


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
            accessorKey: 'question_variable_type',
            header: 'Type',
            size: 200,
            Cell: ({ row }: { row: any }) => (
                <span>{row.original.question_variable_type ? row.original.question_variable_type : "NA"}</span>
            ),
        },
        {
            accessorKey: 'classification_type_name',
            header: 'Classification Type',
            size: 250,
            Cell: ({ row }: { row: any }) => (
                <span>{row.original.classification_type_name ? row.original.classification_type_name : "NA"}</span>
            ),
        },

        {
            accessorKey: 'parent_node',
            header: 'Parent name',
            // size: 250,
            Cell: ({ row }: { row: any }) => (
                <span>{row.original.parent_node ? row.original.parent_node : "NA"}</span>
            ),
        },
        {
            accessorKey: 'node',
            header: 'Node',
            // size: 200,
            Cell: ({ row }: { row: any }) => (
                <span>{row.original.node ? row.original.node : "NA"}</span>
            ),
        },
        // 
        {
            accessorKey: 'is_tabulation',
            header: 'Tabulation',
            size: 150,
            Cell: ({ row }: { row: any }) => (
                <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={row.original.is_tabulation} value={row.original.is_tabulation} onChange={(e) => {
                    handleCheckboxChange(row.original.question_id, e.target.checked, 'is_tabulation')
                }}

                />
            ),
        },

        {
            accessorKey: 'is_insights_question',
            header: 'Insight-able',
            size: 160,
            Cell: ({ row }: { row: any }) => (
                <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={row.original.is_insights_question} value={row.original.is_insights_question} onChange={(e) => {
                    handleCheckboxChange(row.original.question_id, e.target.checked, 'is_insights_question')
                }}

                />
            ),

        },


        {
            accessorKey: 'is_chartable_question',
            header: 'Chart-able',
            size: 150,
            Cell: ({ row }: { row: any }) => (
                <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={row.original.is_chartable_question} value={row.original.is_chartable_question} onChange={(e) => {
                    handleCheckboxChange(row.original.question_id, e.target.checked, 'is_chartable_question')
                }}

                />
            ),
        },
        {
            accessorKey: 'chart_type_name',
            header: 'Chart Type',
            // size: 250,
            Cell: ({ row }: { row: any }) => {
                return (
                    <SingleSelect
                        value={row.original.chart_type_id}
                        disabled={!editConfig}
                        size="small"
                        sx={{
                            width: "90%",
                        }}
                        onChange={(e) => handleChartTypeChange(row.original.question_id, e.target.value)}
                        input={<OutlinedInput />}
                        renderValue={(selected) => selected ? charts?.find((item) => item?.id == selected)?.name : ''}
                    >
                        {charts?.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </SingleSelect>
                )
            },

        },

        {
            accessorKey: 'question_title',
            header: 'Question Title',
            size: 250,
            Cell: ({ row }: { row: any }) => (
                <QuestionNameInput
                    placeholder="Question Title"
                    className="base-comp-question_code-input"
                    size="small"
                    disabled={!editConfig}
                    // fullWidth
                    sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, width: "90% !important" }}
                    value={row.original.question_title}
                    onChange={(e) => handleInputChangeRespondents(row.original.question_id, e.target.value)}
                />
            ),
        },

        {
            accessorKey: 'question_label',
            header: 'Question Label',
            size: 250,
            Cell: ({ row }: { row: any }) => (
                <QuestionNameInput
                    placeholder="Question Label"
                    className="base-comp-question_code-input"
                    size="small"
                    disabled={!editConfig}
                    // fullWidth
                    sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, width: "90% !important" }}
                    value={row.original.question_label}
                    onChange={(e) => handleInputChangeQuestionlabel(row.original.question_id, e.target.value)}
                />
            ),
        },

        {
            accessorKey: 'is_demographic',
            header: 'Is Demographic',
            size: 200,
            Cell: ({ row }: { row: any }) => (
                <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={row.original.is_demographic} value={row.original.is_demographic} onChange={(e) => {
                    handleCheckboxChange(row.original.question_id, e.target.checked, 'is_demographic')
                }}

                />
            ),
        },

        {
            accessorKey: 'is_max_diff',
            header: 'Max-Diff',
            size: 150,
            Cell: ({ row }: { row: any }) => (
                <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={row.original.is_max_diff} value={row.original.is_max_diff} onChange={(e) => {
                    handleCheckboxChange(row.original.question_id, e.target.checked, 'is_max_diff')
                }}

                />
            ),
        },
        {
            accessorKey: 'is_conjoint_question',
            header: 'Conjoint',
            size: 150,
            Cell: ({ row }: { row: any }) => (
                <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={row.original.is_conjoint_question} value={row.original.is_conjoint_question} onChange={(e) => {
                    handleCheckboxChange(row.original.question_id, e.target.checked, 'is_conjoint_question')
                }}

                />
            ),
        },
        {
            accessorKey: 'is_quotable_question',
            header: 'Quota-able',
            size: 160,
            Cell: ({ row }: { row: any }) => (
                <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={row.original.is_quotable_question} value={row.original.is_quotable_question} onChange={(e) => {
                    handleCheckboxChange(row.original.question_id, e.target.checked, 'is_quotable_question')
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

    // console.log(questionList, "questionListquestionList")

    // console.log(currentQuestion, "currentQuestioncurrentQuestion")

    // console.log(changedQuestionIds, "changedQuestionIdschangedQuestionIds")

    // console.log(validationErrors, "validationErrorsvalidationErrorsvalidationErrors")


    const handleSubmit = (e: any) => {
        e.preventDefault()

        const updates: any = [...changedQuestionIds].map(questionId => {
            return questionList.find(question => question.question_id === questionId);
        });

        // console.log(updates, "updatesupdates")

        // const dataToPost = updates && updates?.map((item: { is_min_diff: any; is_max_diff: any; is_tabulation: any; is_chartable_question: any; is_quotable_question: any; is_insights_question: any; is_conjoint_question: any; chart_type_id: any; question_id: any; is_demographic: boolean; question_title: string; question_label: string; answers: any; }) => ({
        //     is_chartable_question: item?.is_chartable_question,
        //     is_quotable_question: item?.is_quotable_question,
        //     is_insights_question: item?.is_insights_question,
        //     is_conjoint_question: item?.is_conjoint_question,
        //     // is_min_diff: item?.is_min_diff,
        //     is_max_diff: item?.is_max_diff,
        //     is_tabulation: item?.is_tabulation,
        //     chart_type_id: item?.chart_type_id,
        //     question_id: item?.question_id,
        //     is_demographic: item?.is_demographic,
        //     question_title: item?.question_title,
        //     question_label: item?.question_label,
        //     answers: item?.answers,

        // }))
        if (updates) {
            console.log(updates, "updates")
            UpdateConfigData(updates)
        }
    }

    const handleInputChangeNew = (property: string, newValue: any) => {
        setCurrentQuestion(prevQuestion => {
            if (prevQuestion) {
                return { ...prevQuestion, [property]: newValue };
            }
            return prevQuestion;
        });
    };

    return (
        <>

            <Dialog maxWidth="md" fullWidth open={openEdit} onClose={() => setOpenEdit(false)} aria-describedby="alert-dialog-slide-description">
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: "0.5rem"
                        }}
                    >
                        <DialogTitle id="alert-dialog-title" color="black" style={{ padding: "0px" }}>
                            Edit Questions
                        </DialogTitle>
                        <Box style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <Button variant="text" color="primary" onClick={() => {
                                setOpenEdit(false)
                                setCurrentQuestion(null)
                                setValidationErrors({})
                            }}>Cancel</Button>
                            <Button onClick={handleModalSave} variant="contained" color="primary">Save</Button>
                        </Box>
                    </Box>

                    {currentQuestion && (
                        <>
                            <Box style={{ padding: "1rem 2rem 2rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "calc(100vh - 400px)", marginBottom: "2rem" }}>
                                <Grid container spacing={1} style={{ marginBottom: "1rem" }}>
                                    <Grid item xs={12}>
                                        <label style={{ marginLeft: "5px", fontSize: '12px' }} >Question Title*</label>
                                        <QuestionNameInput
                                            placeholder="Question Title*"
                                            className="base-comp-question_code-input"
                                            size="small"
                                            disabled={!editConfig}
                                            // fullWidth
                                            sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, width: "100% !important" }}
                                            value={currentQuestion.question_title}
                                            onChange={(e) => handleInputChangeNew('question_title', e.target.value)}
                                            error={!!validationErrors.question_title}
                                            helperText={validationErrors.question_title}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label style={{ marginLeft: "5px", fontSize: '12px' }} >Question Label*</label>
                                        <QuestionNameInput
                                            placeholder="Question Label*"
                                            className="base-comp-question_code-input"
                                            size="small"
                                            disabled={!editConfig}
                                            // fullWidth
                                            sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, width: "100% !important" }}
                                            value={currentQuestion.question_label}
                                            onChange={(e) => handleInputChangeNew('question_label', e.target.value)}
                                            error={!!validationErrors.question_label}
                                            helperText={validationErrors.question_label}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label style={{ marginLeft: "5px", fontSize: '12px' }} >Chart Type*</label>
                                        <SingleSelect
                                            value={currentQuestion.chart_type_id}
                                            disabled={!editConfig}
                                            size="small"
                                            sx={{
                                                width: "100%",
                                            }}
                                            onChange={(e) => handleInputChangeNew('chart_type_id', e.target.value)}
                                            input={<OutlinedInput />}
                                            renderValue={(selected) => selected ? charts?.find((item) => String(item?.id) == selected)?.name : ''}
                                            error={!!validationErrors.chart_type_id}
                                        >
                                            {charts?.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </SingleSelect>
                                        {validationErrors.chart_type_id && <Typography style={{ fontSize: "12px", marginTop: "0.4rem" }} color="error">{validationErrors.chart_type_id}</Typography>}
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} style={{ marginBottom: "1rem" }}>
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center">
                                            <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={currentQuestion.is_tabulation} value={currentQuestion.is_tabulation} onChange={(e) => {
                                                handleInputChangeNew('is_tabulation', e.target.checked)
                                            }} />
                                            <Typography style={{ paddingLeft: "1rem" }} >Tabulation</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center">
                                            <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={currentQuestion.is_insights_question} value={currentQuestion.is_insights_question} onChange={(e) => {
                                                handleInputChangeNew('is_insights_question', e.target.checked)
                                            }} />
                                            <Typography style={{ paddingLeft: "1rem" }} >Insight-able</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center">
                                            <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={currentQuestion.is_chartable_question} value={currentQuestion.is_chartable_question} onChange={(e) => {
                                                handleInputChangeNew('is_chartable_question', e.target.checked)
                                            }} />
                                            <Typography style={{ paddingLeft: "1rem" }} >Chart-able</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} style={{ marginBottom: "1rem" }}>
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center">
                                            <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={currentQuestion.is_demographic} value={currentQuestion.is_demographic} onChange={(e) => {
                                                handleInputChangeNew('is_demographic', e.target.checked)
                                            }} />
                                            <Typography style={{ paddingLeft: "1rem" }} >Is Demographic</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center">
                                            <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={currentQuestion.is_max_diff} value={currentQuestion.is_max_diff} onChange={(e) => {
                                                handleInputChangeNew('is_max_diff', e.target.checked)
                                            }} />
                                            <Typography style={{ paddingLeft: "1rem" }} >Max-Diff</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center">
                                            <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={currentQuestion.is_conjoint_question} value={currentQuestion.is_conjoint_question} onChange={(e) => {
                                                handleInputChangeNew('is_conjoint_question', e.target.checked)
                                            }} />
                                            <Typography style={{ paddingLeft: "1rem" }} >Conjoint</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} style={{ marginBottom: "1rem" }}>
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center">
                                            <Checkbox style={{ padding: "0px" }} disabled={!editConfig} checked={currentQuestion.is_quotable_question} value={currentQuestion.is_quotable_question} onChange={(e) => {
                                                handleInputChangeNew('is_quotable_question', e.target.checked)
                                            }} />
                                            <Typography style={{ paddingLeft: "1rem" }} >Quota-able</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>



                                <Typography variant="h6" style={{ marginTop: '1rem' }}>Answers</Typography>
                                <Box display="flex" alignItems="center" justifyContent='space-between' style={{}}>
                                    <Box display="flex" alignItems="center" style={{ gap: '1rem', marginBottom: "0.5rem" }}>
                                        <label style={{ marginLeft: "5px", fontSize: '12px', marginRight: "0rem" }} >Active</label>
                                        <label style={{ marginLeft: "0px", fontSize: '12px', marginRight: "2rem" }} >Code*</label>
                                        <label style={{ marginLeft: "0px", fontSize: '12px' }} >Answer Text*</label>
                                    </Box>
                                    <Box display="flex" alignItems="center" >
                                        <label style={{ marginLeft: "5px", fontSize: '12px' }} >Delete</label>
                                    </Box>
                                </Box>
                                {currentQuestion?.answers?.map((answer, index) => (
                                    <Box key={index} display="flex" alignItems="center" style={{ gap: '1rem', marginBottom: "0.5rem" }}>
                                        <Checkbox
                                            style={{ padding: "0px", marginRight: "1rem" }}
                                            disabled={!editConfig}
                                            checked={answer?.answer_is_active}
                                            onChange={(e) => {
                                                handleAnswerCheckboxChange(index, 'answer_is_active', e.target.checked);
                                            }}
                                        />
                                        <QuestionNameInput
                                            placeholder="Answer Pre Code"
                                            className="base-comp-question_code-input"
                                            size="small"
                                            disabled={!editConfig}
                                            // fullWidth
                                            sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, width: "10% !important" }}
                                            value={answer.answer_pre_code}
                                            onChange={(e) => handleAnswerChange(index, 'answer_pre_code', e.target.value)}
                                            error={!!validationErrors[`answer_pre_code_${index}`]}
                                            helperText={validationErrors[`answer_pre_code_${index}`]}
                                        />
                                        <QuestionNameInput
                                            placeholder="Answer Text"
                                            className="base-comp-question_code-input"
                                            size="small"
                                            disabled={!editConfig}
                                            // fullWidth
                                            sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, width: "90% !important" }}
                                            value={answer.answer_text}
                                            onChange={(e) => handleAnswerChange(index, 'answer_text', e.target.value)}
                                            error={!!validationErrors[`answer_text_${index}`]}
                                            helperText={validationErrors[`answer_text_${index}`]}
                                        />

                                        <IconButton onClick={() => handleDeleteAnswer(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                                <Button onClick={handleAddAnswer} variant="text" style={{ width: "15%", marginLeft: "1rem", paddingLeft: "0rem !important", marginTop: "0.5rem" }}>+ Answer</Button>
                                {/* <Box display="flex" justifyContent="flex-end" marginTop="1rem">
                                    <Button onClick={handleModalSave} variant="contained" color="primary">Save</Button>
                                </Box> */}
                            </Box>
                        </>
                    )}
                    {/* </Box> */}
                </DialogContent>
            </Dialog>
            {/* </Modal> */}
            <Box style={{ padding: "0rem 2rem 2rem 2rem" }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={0} style={{ display: "block" }}  >
                        <Box style={{ padding: "0rem 0rem 2rem 0rem" }}>
                            <StyledContentBox className="answer-add-container-view-mode-tabulation-table">
                                <Box sx={{ width: '100%' }}>
                                    <MaterialReactTable
                                        columns={columns}
                                        data={questionList}
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

                                        enableEditing={true}
                                        displayColumnDefOptions={{
                                            'mrt-row-actions': {
                                                header: 'Edit',
                                                Cell: ({ row }) => {
                                                    return (
                                                        <ModeEditOutlineIcon style={{ cursor: "pointer", opacity: editConfig ? 1 : 0.5, pointerEvents: editConfig ? 'auto' : 'none' }}
                                                            onClick={() => handleEditClick(row.original)} />
                                                    )
                                                },
                                            },
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
                        <Box
                            style={{
                                width: "100%",
                                bottom: 0,
                                display: editConfig ? "flex" : "none",
                                justifyContent: "flex-end",
                                padding: "8px",
                                gap: "1rem",
                                backgroundColor: "#FFF",

                            }}
                        >
                            <Button variant="outlined" color="primary"
                                onClick={() => {
                                    setEditConfig(false)

                                }}
                                style={{ marginRight: '10px' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                // disabled={(!tabulationName || !risk || questionList?.length <= 0)}
                                // type="submit"
                                disabled={changedQuestionIds?.size <= 0}
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                    handleSubmit(e)
                                }}
                            >
                                Update Configurations
                            </Button>
                        </Box>
                    </Grid>

                </form>
            </Box>
        </>
    )
}
export default ChartsConfigurationsTable;