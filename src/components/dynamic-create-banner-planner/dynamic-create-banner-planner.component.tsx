import { QuestionNameInput } from "@/constants/cutom-question-name-input";
import { Box, Button, Checkbox, Dialog, DialogTitle, Grid, IconButton, ListItemIcon, ListItemText, MenuItem, OutlinedInput, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from "@mui/material";
import React, { useEffect, useState } from "react";
// import MultipleSelectDoneCheckmarks from "../multiple-select-done";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { theme } from "@/constants/theme";
import { StyledContentBox } from "./dynamic-create-banner-planner.style";
import Select from "@/components/select";
import { Deactivate } from "@/assets/images";
import { Answer, AnswerFromAPI, CrossJoins, SelectedJoins, data_banner_plan_item } from "./dynamic-create-banner-planner.type";
import { QuestionBanner, QuestionListItem } from "@/types/project-data.type";
import { nanoid } from 'nanoid';
import { Select as MultiSelect } from "@mui/material"
// 
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// import Paper from '@mui/material/Paper';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
import EditIcon from "@mui/icons-material/Edit";
import QuestionTypeIcon from "@/constants/questionTypeIcon";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';



const answerListSorting = [
    { "text": "99% CL", "value": 99 },
    { "text": "95% CL", "value": 95 },
    { "text": "90% CL", "value": 90 }
]


interface DynamicTabulationProps {
    showDialog: boolean;
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    PostDataBanner: (payload: data_banner_plan_item) => Promise<void>;
    questionLists?: QuestionListItem[] | [];
    tabulationCardData: data_banner_plan_item;
}


const DynamicCreateBannerPlanner: React.FC<DynamicTabulationProps> = ({ showDialog, setShowDialog, PostDataBanner, questionLists, tabulationCardData }) => {

    const [tabulationName, setTabulationName] = useState<string>('')
    const [risk, setRisk] = useState<number>(95)
    const [questionList, setQuestionList] = useState<AnswerFromAPI[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const [openPreTab, setPreTab] = useState<boolean>(false)
    const [dataToEdit, setDataToEdit] = useState<QuestionBanner[] | []>([])
    const [dataToEditForBackend, setDataToEditForBackend] = useState<QuestionBanner[] | []>([])
    // const [dataToTabulation, setDataToTabulation] = useState<Question[] | []>([])
    // const [dataToTabulationForBackend, setDataToTabulationForBackend] = useState<Question[] | []>([])
    const [crossJoin, setCrossJoin] = useState<boolean>(false)
    const [crossJoin1, setCrossJoin1] = useState<CrossJoins[] | []>([])
    // const [crossJoin2, setCrossJoin2] = useState<CrossJoins[] | []>([])
    const [selectPairs, setSelectPairs] = useState<SelectedJoins[]>([{ joinIds: [] }]);
    // const [combinedJoins, setCombinedJoins] = useState([]);
    // removing datatotabulation

    // Main Dialog

    // function openMainDialog() {
    //     setShowDialog(true);
    // }

    // console.log(questionList, "questionListquestionListquestionList")

    function closeMainDialog() {
        setShowDialog(false);
    }

    // const [open, setOpen] = useState(false);


    function CloseCrossJoin() {
        setCrossJoin(false)
    }

    function OpenCrossJoin() {
        setCrossJoin(true)
    }

    function closeDialog() {
        setPreTab(false)
    }

    function openDialog() {
        setPreTab(true)
    }

    // function CustomPaper({ children, openDialog, setOpen, ...paperProps }: { children?: React.ReactNode, openDialog: () => void, setOpen: (open: boolean) => void, }) {
    //     return (
    //         <Paper {...paperProps}>
    //             {children}
    //             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "1rem", p: 1 }}>
    //                 <Button variant="outlined" onClick={() => setOpen(false)} onMouseDown={(event) => {
    //                     // Prevent input blur which triggers closing the Popper
    //                     event.preventDefault();
    //                 }}>Cancel</Button>
    //                 <Button variant="contained" onClick={() => {
    //                     openDialog()
    //                     setOpen(false)
    //                 }} onMouseDown={(event) => {
    //                     // Prevent input blur which triggers closing the Popper
    //                     event.preventDefault();
    //                 }}>Done</Button>
    //             </Box>
    //         </Paper>
    //     );
    // }

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(dataToEdit);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setDataToEdit(items);
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    function getStyles(name: string, personName: readonly string[], theme: Theme) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }


    const handleMultiSelectChange = (event: any, index: number) => {
        const {
            target: { value },
        } = event;

        // On autofill we get a stringified value.
        const joinIds = typeof value === 'string' ? value.split(',') : value;

        setSelectPairs((currentPairs) =>
            currentPairs.map((pair, idx) =>
                idx === index ? { ...pair, joinIds: joinIds } : pair
            )
        );
    };




    const addSelectPair = () => {
        setSelectPairs(currentPairs => [...currentPairs, { joinIds: [] }]);
    };

    const handleDeleteQuestion = (questionId: string | number) => {
        // console.log("Deleting question with ID:", questionId)
        setDataToEdit(prevData => prevData.filter(question => question.question_value !== questionId));
        setDataToEditForBackend(prevData => prevData.filter(question => question.question_value !== questionId));
    };

    // const handleSendForPublsih = (questionValue: string | number) => {

    //     setDataToEdit(prevData =>
    //         prevData.map((item) =>
    //             item.question_value === questionValue ? { ...item, export_to_viz: !item.export_to_viz } : item
    //         )
    //     );

    //     setDataToEditForBackend(prevData =>
    //         prevData.map((item) =>
    //             item.question_value === questionValue ? { ...item, export_to_viz: !item.export_to_viz } : item
    //         )
    //     );


    // };


    const handleChange = (_event: any, newValue: any[]) => {
        // newValue contains the selected items
        const selectedIds = newValue.map((item: any) => item?.value)
        setSelectedQuestions(selectedIds);
        // console.log(selectedIds, "selectedIdsselectedIdsselectedIds", newValue)
        // setOpen(true);

        setDataToEdit(prevData => {
            return prevData.filter((question: any) => {
                if (typeof question.question_value === 'string' && question.question_value.startsWith('new-')) {
                    const parts = question?.question_value?.split('-').slice(1); // "new-5-6-0" -> ["5", "6", "0"]
                    // Check if any part matches, not every part
                    return parts.some((part: any) => selectedIds.includes(Number(part)));
                }
                // Direct match for numbers
                return selectedIds.includes(question.question_value);
            });
        });



        setDataToEditForBackend(prevData => {
            return prevData.filter((question: any) => {
                if (typeof question.question_value === 'string' && question.question_value.startsWith('new-')) {
                    const parts = question?.question_value?.split('-').slice(1); // "new-5-6-0" -> ["5", "6", "0"]
                    // Check if any part matches, not every part
                    return parts.some((part: any) => selectedIds.includes(Number(part)));
                }
                // Direct match for numbers
                return selectedIds.includes(question.question_value);
            });
        });
    };


    const handleSubmit = (e: any) => {
        e.preventDefault()
        const nanoId = nanoid(7)

        const newdataToEdit = dataToEdit?.map((item) => {
            const { answerstoconfigure, ...rest } = item;
            return {
                ...rest,
                answers: answerstoconfigure || item.answers || [],
            };
        });

        const uniqueQuestionsMap = new Map();
        const filteredDataToEdit = newdataToEdit?.filter((item: any) => {
            if (item.grouped_question_code && item.grouped_question_code?.length > 0) {
                const groupedCode = item.grouped_question_code.join("-");
                if (!uniqueQuestionsMap.has(groupedCode)) {
                    uniqueQuestionsMap.set(groupedCode, true);
                    return true;
                }
                return false;
            }
            return true;
        });


        const dataToPost: data_banner_plan_item = {
            name: tabulationName,
            confidence_level: risk,
            ui_payload: dataToEdit,
            data_payload: filteredDataToEdit,
            object_uid: nanoId,
        }


        // console.log(filteredDataToEdit, uniqueQuestionsMap, "uniqueQuestionsMapuniqueQuestionsMap")

        console.log(tabulationName, risk, dataToEdit, tabulationName && risk && dataToEdit, newdataToEdit, dataToEditForBackend, JSON.stringify(dataToPost), "dataToPostdataToPost")
        if (tabulationName && risk && dataToEdit?.length > 0 && dataToEditForBackend?.length > 0) {
            PostDataBanner(dataToPost)
            // setDataToEdit([])
            closeMainDialog()
            setDataToEdit([])
            setDataToEditForBackend([])
            setTabulationName('')
            setRisk(1)
            setSelectPairs([])
        }
    }

    const handleRiskInputChange = (event: { target: { value: any; }; }) => {
        const selectedValue = event.target.value;
        setRisk(selectedValue);
    };
    // console.log(selectPairs, "selectPairsselectPairs")


    // const handleDoneClick = () => {
    //     let newQuestions: QuestionBanner[] = [];
    //     let combinedQuestionList: QuestionBanner[] = [];

    //     selectPairs.forEach(pair => {
    //         // Generate a list of questions based on selected IDs in joinIds
    //         let questions: (QuestionBanner | undefined)[] = pair.joinIds.map(id => dataToEdit.find(q => q.question_value === id)).filter(q => q);

    //         // questions = questions.filter(Boolean);
    //         // Check if we have questions to combine
    //         if (questions.length > 1) {
    //             let combinedAnswers: Answer[] = [];
    //             let combinedQuestionCodes = [];

    //             // Iterate over each question, combining incrementally
    //             for (let i = 0; i < questions.length; i++) {
    //                 combinedQuestionCodes.push(questions[i]?.question_code);

    //                 if (i === 0) {
    //                     // @ts-ignore
    //                     combinedAnswers = questions[i]?.answers?.map(answer => ({
    //                         answer_group_text: answer?.answer_group_text,
    //                         // ... include other answer properties here
    //                         answer_id: answer.answer_id,
    //                         answer_label: answer.answer_label,
    //                         answer_pre_code: answer.answer_pre_code,
    //                         answer_sort_order: answer.answer_sort_order,
    //                         answer_text: answer.answer_text,
    //                         answer_weightage: -1,
    //                         banner_id: answer.banner_id,
    //                         grouping_details: answer.grouping_details,
    //                         is_selected: answer.is_selected,
    //                     }));
    //                 } else {
    //                     let newCombinations: Answer[] = [];
    //                     combinedAnswers.forEach(combinedAnswer => {
    //                         questions[i]?.answers.forEach(answer => {
    //                             newCombinations.push({
    //                                 answer_group_text: `${combinedAnswer.answer_group_text} AND ${answer.answer_group_text}`,
    //                                 // ... combine other properties as needed
    //                                 grouping_details: `${combinedAnswer.grouping_details} AND ${answer.grouping_details}`,
    //                                 answer_id: answer.answer_id,
    //                                 answer_label: answer.answer_label,
    //                                 answer_pre_code: answer.answer_pre_code,
    //                                 answer_sort_order: answer.answer_sort_order,
    //                                 answer_text: answer.answer_text,
    //                                 answer_weightage: -1,
    //                                 banner_id: answer.banner_id,
    //                                 is_selected: answer.is_selected,
    //                             });
    //                         });
    //                     });
    //                     combinedAnswers = newCombinations;
    //                 }

    //                 // Push the new question from the current combination
    //                 combinedQuestionList.push({
    //                     // @ts-ignore
    //                     question_value: `new-${combinedQuestionCodes.join('*')}`,
    //                     question_code: combinedQuestionCodes.join(' AND '),
    //                     question_label: combinedQuestionCodes.join(' AND '),
    //                     question_text: questions[i]?.question_text || '', // Or combined text, if needed
    //                     question_type_id: Number(questions[i]?.question_type_id), // Assuming type_id is the same for all

    //                     export_to_viz: true,

    //                     // @ts-ignore
    //                     grouped_question_code: combinedQuestionCodes?.slice(),
    //                     answers: combinedAnswers,
    //                     question_sort_order: dataToEdit.length + newQuestions.length + 1,
    //                     // ... include other properties for the new question
    //                 });
    //             }

    //             // Add the latest combined question to newQuestions
    //             newQuestions.push(combinedQuestionList[combinedQuestionList.length - 1]);
    //         }
    //     });
    //     const finalData = combinedQuestionList.slice(1)

    //     let newQuestionsForBackend = finalData.slice(-1)

    //     // Log combinedQuestionList and newQuestions for verification
    //     console.log(finalData, newQuestionsForBackend, combinedQuestionList, newQuestions, "Combined Question List");
    //     console.log(newQuestions, "New Questions");


    //     // Update state with new combined questions
    //     setDataToEdit(prevData => [...prevData, ...finalData]);

    //     setDataToEditForBackend(prevData => [...prevData, ...newQuestionsForBackend])

    //     // Reset selectPairs to allow for new combinations
    //     setSelectPairs([{ joinIds: [] }]);

    //     // Close the join UI
    //     CloseCrossJoin();
    // };

    // function combineAnswers(dataToEdit, selectPairs) {

    //     if (selectPairs[0]?.joinIds?.length <= 1) return
    //     if (dataToEdit?.length <= 1) return

    //     const questions = selectPairs[0]?.joinIds?.map(id =>
    //         dataToEdit?.find(question => question.question_id === id)
    //     ).filter(question => question !== undefined);

    //     if (questions?.length < selectPairs[0]?.joinIds?.length) {
    //         console.error('Some questions from selectPairs.joinIds were not found in dataToEdit.');
    //         return [];
    //     }

    //     if (questions?.includes(undefined)) {
    //         console.error('One or more questions from selectPairs.joinIds were not found in dataToEdit.');
    //         return [];
    //     }


    //     const combinedData = [];

    //     let lastQuestion = questions[questions?.length - 1];

    //     let lastQuestionAnswers = questions[questions?.length - 1]?.answers;
    //     const allCombinations = [];

    //     // Generate all combinations of answers from the first questions (excluding the last one)
    //     //     function generateCombinations(questions, idx, currentCombo) {
    //     //         if (idx === questions.length - 1) {
    //     //             allCombinations.push(currentCombo);
    //     //             return;
    //     //         }

    //     //         questions[idx]?.answers?.forEach(answer => {
    //     //             generateCombinations(questions, idx + 1, currentCombo.concat(answer.answer_label + '-'));
    //     //         });
    //     //     }

    //     //     generateCombinations(questions, 0, '');

    //     //     console.log(allCombinations, "allCombinationsallCombinations")

    //     //     // Now create a new question for each combination with all the answers from the last question
    //     //     allCombinations?.forEach(combinationLabel => {
    //     //         console.log(combinationLabel, "combinationLabelcombinationLabel")
    //     //         const newQuestion = {
    //     //             question_value: `new-${combinationLabel}${questions[questions.length - 1].question_id}`,
    //     //             question_code: combinationLabel + questions[questions.length - 1].question_code,
    //     //             question_label: combinationLabel + questions[questions.length - 1].question_label,
    //     //             question_text: questions[questions.length - 1].question_text,
    //     //             question_type_id: questions[questions.length - 1].question_type_id,
    //     //             question_sort_order: dataToEdit.length + combinedData.length + 1,
    //     //             answers: lastQuestionAnswers.map(answer => ({
    //     //                 ...answer,
    //     //             }))
    //     //         };

    //     //         combinedData.push(newQuestion);
    //     //     });

    //     //     return combinedData;
    //     // }

    //     function generateCombinations(questions, idx, currentCombo) {
    //         if (idx === questions.length - 1) {
    //             allCombinations.push(currentCombo);
    //             return;
    //         }

    //         questions[idx].answers.forEach(answer => {
    //             generateCombinations(questions, idx + 1, [...currentCombo, {
    //                 label: answer.answer_label,
    //                 details: `${questions[idx].question_id}=${answer.answer_pre_code}`
    //             }]);
    //         });
    //     }

    //     generateCombinations(questions, 0, []);

    //     allCombinations.forEach(combination => {
    //         const combinationLabel = combination.map(a => a.label).join('-');
    //         const groupingDetails = combination.map(a => a.details).join(' and ');

    //         const newQuestion = {
    //             grouped_question_code: selectPairs[0]?.joinIds,
    //             question_value: `new-${combinationLabel}-${lastQuestion.question_id}`,
    //             question_code: `${combinationLabel}-${lastQuestion.question_code}`,
    //             question_label: `${combinationLabel}-${lastQuestion.question_label}`,
    //             question_text: lastQuestion.question_text,
    //             question_type_id: lastQuestion.question_type_id,
    //             question_sort_order: dataToEdit.length + 1,
    //             export_to_viz: false,
    //             answers: lastQuestionAnswers.map(answer => ({
    //                 ...answer,
    //                 grouping_details: `${groupingDetails} and ${lastQuestion.question_id}=${answer.answer_pre_code}`,
    //                 answer_weightage: -1,
    //             }))
    //         };

    //         combinedData.push(newQuestion);
    //     });

    //     return combinedData;
    // }

    // if (selectPairs[0]?.joinIds?.length > 1) {
    //     const combinedQuestions = combineAnswers(dataToEdit, selectPairs);
    //     console.log(combinedQuestions, "combinedQuestionscombinedQuestions");
    // }

    // const FinalCombination = () => {
    //     const combinedQuestions = combineAnswers(dataToEdit, selectPairs);
    //     setDataToEdit(prevData => [...prevData, ...combinedQuestions])


    //     let newQuestionsForBackend = combinedQuestions.slice(-1)
    //     setDataToEditForBackend(prevData => [...prevData, ...newQuestionsForBackend])
    //     setSelectPairs([{ joinIds: [] }]);
    //     CloseCrossJoin();
    // }


    function combineAnswers(dataToEdit: QuestionBanner[], selectPairs: { joinIds: any; }[]) {

        if (selectPairs[0]?.joinIds?.length <= 1) return
        if (dataToEdit?.length <= 1) return

        const questions = selectPairs[0]?.joinIds?.map((id: string | number) =>
            dataToEdit?.find(question => question.question_value === id)
        ).filter((question: any) => question !== undefined);

        if (questions?.length < selectPairs[0]?.joinIds?.length) {
            console.error('Some questions from selectPairs.joinIds were not found in dataToEdit.');
            return [];
        }

        if (questions?.includes(undefined)) {
            console.error('One or more questions from selectPairs.joinIds were not found in dataToEdit.');
            return [];
        }


        const combinedData: { grouped_question_code: any; question_value: string; question_code: string; question_label: string; question_text: any; question_type_id: any; question_sort_order: number; export_to_viz: boolean; answers: any; }[] = [];

        let lastQuestion = questions[questions?.length - 1];

        let lastQuestionAnswers = questions[questions?.length - 1]?.answers;
        const allCombinations: any[] = [];

        function generateCombinations(questions: any[], idx: number, currentCombo: any[]) {
            if (idx === questions.length - 1) {
                allCombinations.push(currentCombo);
                return;
            }

            questions[idx].answers.forEach((answer: { answer_label: string; answer_pre_code: string; }) => {
                generateCombinations(questions, idx + 1, [...currentCombo, {
                    label: answer.answer_label,
                    details: `${questions[idx].question_value}=${answer.answer_pre_code}`
                }]);
            });
        }

        generateCombinations(questions, 0, []);

        allCombinations.forEach(combination => {
            const combinationLabel = combination.map((a: { label: string; }) => a.label).join('-');
            const groupingDetails = combination.map((a: { details: string; }) => a.details).join(' and ');

            const newQuestion = {
                grouped_question_code: selectPairs[0]?.joinIds,
                question_value: `new-${combinationLabel}-${lastQuestion.question_value}`,
                question_code: `${combinationLabel}-${lastQuestion.question_code}`,
                question_label: `${combinationLabel}-${lastQuestion.question_label}`,
                question_text: lastQuestion.question_text,
                question_type_id: lastQuestion.question_type_id,
                question_sort_order: dataToEdit.length + 1,
                export_to_viz: false,
                answers: lastQuestionAnswers.map((answer: { answer_pre_code: string; }) => ({
                    ...answer,
                    grouping_details: `${groupingDetails} and ${lastQuestion.question_value}=${answer.answer_pre_code}`,
                    answer_weightage: -1,
                }))
            };

            combinedData.push(newQuestion);
        });

        return combinedData;
    }

    const FinalCombination = () => {
        const combinedQuestions = combineAnswers(dataToEdit, selectPairs);
        // @ts-ignore
        setDataToEdit(prevData => [...prevData, ...combinedQuestions])

        let newQuestionsForBackend = combinedQuestions?.slice(-1)
        setDataToEditForBackend(prevData => [...prevData, ...newQuestionsForBackend])
        setSelectPairs([{ joinIds: [] }]);
        CloseCrossJoin();
    }


    console.log(dataToEdit, dataToEditForBackend, "dataToTabulationForBackenddataToTabulationForBackend", selectPairs, openPreTab)

    function getBannerId(index: number) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let id = "";
        index += 1;

        while (index > 0) {
            index -= 1;
            id = alphabet[index % 26] + id;
            index = Math.floor(index / 26);
        }

        return id;
    }


    useEffect(() => {
        let bannerIdIndex = 0;
        const dataToEditQuestionIds = new Set(dataToEdit?.map((item) => item?.question_value))
        const matchedQuestions = (questionLists as any).filter((question: { question_value: string; }) =>
            selectedQuestions.includes(question.question_value) &&
            !dataToEditQuestionIds.has(question?.question_value)
        );

        // console.log(questionLists, matchedQuestions, "matchedQuestionsmatchedQuestionsmatchedQuestions")
        if (matchedQuestions) {
            const transformedData = (matchedQuestions as any).map((question: { question_value: any; question_id: any; question_text: any; question_type_id: any; answers: any[]; question_variable_id: string; question_type_name: string; }, index: number) => ({
                question_value: question.question_value,
                question_id: question.question_id,
                // question_code: question.question_id,
                // question_label: question.question_id,
                question_code: question?.question_variable_id,
                question_label: question?.question_variable_id,
                question_type_name: question?.question_type_name,
                question_text: question.question_text,
                export_to_viz: true,
                // adding new
                // question_variable_code: question?.question_variable_id,
                // question_variable_code: question?.question_variable_code,
                // question_agg_label: "Base:All Respondents",
                question_type_id: question.question_type_id,
                grouped_question_code: [],
                question_sort_order: index + 1,
                answers: question.answers.map((answer, index) => ({
                    answer_id: answer.answer_id,
                    answer_pre_code: answer.answer_pre_code,
                    answer_text: answer.answer_text,
                    answer_label: answer?.answer_text,
                    answer_group_text: '',
                    answer_weightage: -1,
                    answer_sort_order: index + 1,
                    banner_id: getBannerId(bannerIdIndex++),
                    is_selected: true,
                    grouping_details: '',
                })),
                // answerstoconfigure: question.answers.map((answer, index) => ({
                //     answer_id: answer.answer_id,
                //     answer_pre_code: answer.answer_pre_code,
                //     answer_text: answer.answer_text,
                //     answer_label: answer?.answer_text,
                //     answer_group_text: '',
                //     answer_weightage: 0,
                //     answer_sort_order: index + 1,
                //     banner_id: getBannerId(bannerIdIndex++),
                //     is_selected: true,
                //     grouping_details: '',
                // }))
            }));

            if (openPreTab) {
                setDataToEdit(prevData => [...prevData, ...transformedData]);
                setDataToEditForBackend(prevData => [...prevData, ...transformedData])
            }
        }
    }, [openPreTab, selectedQuestions]);

    useEffect(() => {
        if (dataToEdit) {
            const transformedData: CrossJoins[] = dataToEdit?.filter((item) => item?.question_code && !item?.question_code?.includes('-'))?.map(question => ({
                text: question.question_code,
                value: question.question_value,
                question_text: question?.question_text,
                question_type_id: question?.question_type_id,
            }));

            setCrossJoin1(transformedData);
            // setCrossJoin2(transformedData);
        }
    }, [dataToEdit]);

    // useEffect(() => {
    //     const serviceNames: Question = questionLists?.map((item: { question_id: string; question_text: string, question_value: number }) => ({
    //         value: item.question_value,
    //         text: item.question_text,
    //         label: item?.question_text
    //     }));
    //     setQuestionList(serviceNames);
    // }, [])

    // new questions structure

    useEffect(() => {
        // Check if questionLists is an array and has items
        if (Array.isArray(questionLists) && questionLists.length) {
            // console.log(questionLists, "questionListquestionListquestionListgffg")
            const serviceNames = questionLists.map((item) => ({
                // value: index + 1,
                value: item?.question_value,
                // value: item.question_value,
                text: item.question_variable_id,
                label: item.question_value,
                question_text: item?.question_text,
                question_type_id: item?.question_type_id,
            }));
            setQuestionList(serviceNames);
        }
    }, [questionLists]);


    const handleAnswerGroupTextChangeModal = (questionIndex: number, answerIndex: number, newValue: string) => {
        setDataToEdit(prevData => {
            const newData = [...prevData];
            (newData[questionIndex].answerstoconfigure || newData[questionIndex].answers)[answerIndex].answer_group_text = newValue;
            // console.log(newData, "newDatanewData")
            return newData;
        });
        setDataToEditForBackend(prevData => {
            const newData = [...prevData];
            // newData[questionIndex].answers[answerIndex].answer_group_text = newValue;
            if (newData[questionIndex] && (newData[questionIndex].answerstoconfigure || newData[questionIndex].answers) && (newData[questionIndex].answerstoconfigure || newData[questionIndex].answers)[answerIndex]) {
                (newData[questionIndex].answerstoconfigure || newData[questionIndex].answers)[answerIndex].answer_group_text = newValue;
            }
            // console.log(newData, "newDatanewData")
            return newData;
        });
    };

    // const handleAnswerGroupTextChange = (questionIndex, answerIndex, newValue) => {
    //     setDataToEdit(prevData => {
    //         const newData = [...prevData];
    //         newData[questionIndex].answers[answerIndex].answer_group_text = newValue;
    //         console.log(newData, "newDatanewData")
    //         return newData;
    //     });
    // };

    const handleQuestionCodeChange = (qIndex: number, newValue: string) => {
        setDataToEdit(prevData => {
            const newData = [...prevData];

            newData[qIndex].question_label = newValue;

            return newData;
        });
        setDataToEditForBackend(prevData => {
            const newData = [...prevData];
            if (newData[qIndex] && newData[qIndex].question_label) {
                newData[qIndex].question_label = newValue;
            }
            return newData;
        });
    };

    // const handleAnswerWeightageChange = (qIndex: number, aIndex: number, field: string, newValue: any) => {
    //     // if (newValue?.trim() === '' || isNaN(newValue)) {
    //     //     newValue = 0;
    //     // }

    //     // let numericValue = parseFloat(newValue);

    //     // numericValue = Math.max(0.1, Math.min(numericValue, 1));

    //     const trimmedValue = newValue.trim();
    //     if (trimmedValue === '' || isNaN(trimmedValue)) {
    //         newValue = 0;
    //     } else {
    //         const numericValue = trimmedValue;

    //         if (numericValue < 0 || numericValue > 100) {
    //             return;
    //         }

    //         setDataToEdit(prevData => {
    //             const newData: any = [...prevData];
    //             (newData[qIndex].answerstoconfigure || newData[qIndex].answers)[aIndex][field] = numericValue;
    //             return newData;
    //         });

    //         setDataToEditForBackend(prevData => {
    //             const newData: any = [...prevData];
    //             (newData[qIndex].answerstoconfigure || newData[qIndex].answers)[aIndex][field] = numericValue;
    //             return newData;
    //         });
    //     }
    // };

    // const handleAnswerWeightageChange = (qIndex: number, aIndex: number, field: string, newValue: any) => {
    //     if (newValue?.trim() === '' || isNaN(newValue)) {
    //         newValue = 0;
    //     }

    //     let numericValue = parseFloat(newValue);

    //     numericValue = Math.max(0.1, Math.min(numericValue, 1));

    //     setDataToEdit(prevData => {
    //         const newData: any = [...prevData];
    //         //@ts-ignore
    //         (newData[qIndex].answerstoconfigure || newData[qIndex].answers)[aIndex][field] = parseFloat(numericValue);
    //         return newData;
    //     });

    //     setDataToEditForBackend(prevData => {
    //         const newData: any = [...prevData];
    //         // @ts-ignore
    //         (newData[qIndex].answerstoconfigure || newData[qIndex].answers)[aIndex][field] = parseFloat(numericValue);
    //         return newData;
    //     });
    // };

    // const handleAnswerWeightageChange = (qIndex: number, aIndex: number, field: string, newValue: any) => {
    //     setDataToEdit(prevData => {
    //         const newData = [...prevData];
    //         const answers = newData[qIndex].answerstoconfigure || newData[qIndex].answers;
    //         // @ts-ignore
    //         answers[aIndex][field] = newValue;
    //         return newData;
    //     });

    //     if (newValue.trim() === '' || isNaN(newValue)) {
    //         newValue = '0';
    //     }

    //     let numericValue = parseFloat(newValue);
    //     numericValue = Math.max(0, Math.min(numericValue, 1));

    //     setDataToEditForBackend(prevData => {
    //         const newData = [...prevData];
    //         const answers = newData[qIndex].answerstoconfigure || newData[qIndex].answers;
    //         // @ts-ignore
    //         answers[aIndex][field] = numericValue;
    //         return newData;
    //     });
    // };


    // const handleAnswerWeightageChange = (qIndex: number, aIndex: number, field: string, newValue: any) => {
    //     setDataToEdit(prevData => {
    //         const newData = [...prevData];
    //         const answers = newData[qIndex].answerstoconfigure || newData[qIndex].answers;
    //         // @ts-ignore
    //         answers[aIndex][field] = newValue;
    //         return newData;
    //     });

    //     if (newValue.trim() === '' || isNaN(newValue)) {
    //         newValue = 0;
    //     }

    //     let numericValue = parseFloat(newValue);
    //     numericValue = Math.max(0, Math.min(numericValue, 1));

    //     setDataToEditForBackend(prevData => {
    //         const newData = [...prevData];
    //         const answers = newData[qIndex].answerstoconfigure || newData[qIndex].answers;
    //         // @ts-ignore
    //         answers[aIndex][field] = numericValue;
    //         return newData;
    //     });
    // };

    // const handleAnswerWeightageChange = (qIndex: number, aIndex: number, field: string, newValue: any) => {
    //     let numericValue: any = parseFloat(newValue);

    //     if (newValue.trim() === '' || isNaN(numericValue)) {
    //         numericValue = null;
    //     }

    //     // Update local state
    //     setDataToEdit(prevData => {
    //         const newData = [...prevData];
    //         const answers = newData[qIndex].answerstoconfigure || newData[qIndex].answers;
    //         // @ts-ignore
    //         answers[aIndex][field] = numericValue;
    //         return newData;
    //     });

    //     // Update backend state
    //     setDataToEditForBackend(prevData => {
    //         const newData = [...prevData];
    //         const answers = newData[qIndex].answerstoconfigure || newData[qIndex].answers;
    //         // @ts-ignore
    //         answers[aIndex][field] = numericValue;
    //         return newData;
    //     });
    // };


    const handleAnswerWeightageChange = (qIndex: number, aIndex: number, field: string, newValue: any) => {
        const numericValue: number | null = parseFloat(newValue);

        // Normalize the input; if it's an empty string or not a number, set it to null
        const validatedValue = (newValue.trim() === '' || isNaN(numericValue)) ? null : numericValue;

        // Update local state
        setDataToEdit(prevData => {
            const newData = [...prevData]; // Create a shallow copy of the array
            const answers = newData[qIndex]?.answerstoconfigure || newData[qIndex]?.answers || []; // Safely access the answers array or default to an empty array

            // Safely update the answer if it exists
            if (answers[aIndex] && field in answers[aIndex]) {
                (answers[aIndex] as any)[field] = validatedValue;
            } else {
                console.error('Invalid answer index or field:', { qIndex, aIndex, field });
            }

            return newData;
        });

        // Similarly, update backend state
        setDataToEditForBackend(prevData => {
            const newData = [...prevData];
            const answers = newData[qIndex]?.answerstoconfigure || newData[qIndex]?.answers || [];

            if (answers[aIndex] && field in answers[aIndex]) {
                (answers[aIndex] as any)[field] = validatedValue;
            } else {
                console.error('Invalid answer index or field in backend data:', { qIndex, aIndex, field });
            }

            return newData;
        });
    };



    // const handleCheckboxChange = (qIndex: number, aIndex: number) => {
    //     console.log(qIndex, aIndex, "qIndexqIndex", (dataToEdit[qIndex].answerstoconfigure || dataToEdit[qIndex].answers), (dataToEdit[qIndex].answerstoconfigure || dataToEdit[qIndex].answers)[aIndex].is_selected)
    //     setDataToEdit(prevData => {
    //         const newData = [...prevData];
    //         (newData[qIndex].answerstoconfigure || newData[qIndex].answers)[aIndex].is_selected = !(newData[qIndex].answerstoconfigure || newData[qIndex].answers)[aIndex].is_selected;
    //         return newData;
    //     });
    //     setDataToEditForBackend(prevData => {
    //         const newData = [...prevData];
    //         (newData[qIndex].answerstoconfigure || newData[qIndex].answers)[aIndex].is_selected = !(newData[qIndex].answerstoconfigure || newData[qIndex].answers)[aIndex].is_selected;
    //         return newData;
    //     });
    // };


    // const handleCheckboxChange = (qIndex: number, aIndex: number) => {
    //     // Update local state
    //     setDataToEdit(prevData => {
    //         const newData = [...prevData];
    //         // Prefer 'answerstoconfigure' if available, else fall back to 'answers'
    //         const answerList = (newData[qIndex].answerstoconfigure || newData[qIndex].answers);
    //         console.log(answerList, "answerList")
    //         const selectedAnswer = answerList[aIndex];
    //         console.log(selectedAnswer, "selectedAnswer")

    //         selectedAnswer.is_selected = !selectedAnswer.is_selected;
    //         // console.log(selectedAnswer.is_selected = !selectedAnswer.is_selected, "selectedAnswer.is_selected = !selectedAnswer.is_selected")
    //         return newData;
    //     });

    //     // Update backend state
    //     setDataToEditForBackend(prevData => {
    //         const newData = [...prevData];
    //         const answerList = newData[qIndex].answerstoconfigure || newData[qIndex].answers;
    //         answerList[aIndex].is_selected = !answerList[aIndex].is_selected;
    //         return newData;
    //     });
    // };

    // const handleCheckboxChange = (qIndex: number, aIndex: number) => {
    //     setDataToEdit(prevData => {
    //         const newData = [...prevData];
    //         if (newData[qIndex]?.answerstoconfigure?.length > 0) {
    //             console.log('answerstoconfigureanswerstoconfigure')
    //             newData[qIndex].answerstoconfigure[aIndex].is_selected = !newData[qIndex].answerstoconfigure[aIndex].is_selected;
    //             return newData;
    //         } else {
    //             if (newData[qIndex].answers[aIndex].is_selected === true) {
    //                 newData[qIndex].answers[aIndex].is_selected = false
    //             } else if (newData[qIndex].answers[aIndex].is_selected === false) {
    //                 newData[qIndex].answers[aIndex].is_selected = true
    //             }
    //             console.log(newData[qIndex].answers[aIndex], 'answersanswersanswersanswers', newData)
    //             return newData;
    //         }
    //     });

    //     setDataToEditForBackend(prevData => {
    //         const newData = [...prevData];
    //         (newData[qIndex]?.answerstoconfigure || newData[qIndex]?.answers)[aIndex].is_selected = !(newData[qIndex]?.answerstoconfigure || newData[qIndex]?.answers)[aIndex].is_selected;
    //         return newData;
    //     });
    // };

    // const handleCheckboxChange = (qIndex: number, aIndex: number) => {
    //     setDataToEdit(prevData => {
    //         const newData = [...prevData];
    //         const answers = newData[qIndex].answerstoconfigure || newData[qIndex].answers;
    //         const newAnswers = [...answers];
    //         newAnswers[aIndex] = { ...newAnswers[aIndex], is_selected: !newAnswers[aIndex].is_selected };

    //         if (newData[qIndex].answerstoconfigure) {
    //             newData[qIndex].answerstoconfigure = newAnswers;
    //         } else {
    //             console.log(newAnswers, "newAnswers")
    //             newData[qIndex].answers = newAnswers;
    //         }
    //         console.log(newData, "newDatanewData", newData[qIndex].answers)
    //         return newData;

    //     });

    //     setDataToEditForBackend(prevData => {
    //         const newData = [...prevData];
    //         const answers = newData[qIndex].answerstoconfigure || newData[qIndex].answers;
    //         const newAnswers = [...answers];
    //         newAnswers[aIndex] = { ...newAnswers[aIndex], is_selected: !newAnswers[aIndex].is_selected };

    //         if (newData[qIndex].answerstoconfigure) {
    //             newData[qIndex].answerstoconfigure = newAnswers;
    //         } else {
    //             newData[qIndex].answers = newAnswers;
    //         }

    //         return newData;
    //     });
    // };

    // const handleCheckboxChange = (qIndex: number, aIndex: number) => {
    //     // Update local state in a fully immutable way
    //     setDataToEdit(prevData => {
    //         // Creating a deep clone of the specific question object
    //         const newQuestion = {
    //             ...prevData[qIndex],
    //             answers: prevData[qIndex].answers.map((answer, index) =>
    //                 index === aIndex
    //                     ? { ...answer, is_selected: !answer.is_selected }
    //                     : answer
    //             )
    //         };

    //         // Creating a new array with the updated question
    //         return prevData.map((question, index) => index === qIndex ? newQuestion : question);
    //     });

    //     // Assuming you need to perform the same update for backend data
    //     setDataToEditForBackend(prevData => {
    //         // Repeat the same transformation for backend data if needed
    //         const newQuestion = {
    //             ...prevData[qIndex],
    //             answers: prevData[qIndex].answers.map((answer, index) =>
    //                 index === aIndex
    //                     ? { ...answer, is_selected: !answer.is_selected }
    //                     : answer
    //             )
    //         };
    //         return prevData.map((question, index) => index === qIndex ? newQuestion : question);
    //     });
    // };

    // const handleCheckboxChange = (qIndex: number, aIndex: number) => {
    //     // Helper function to update the answers list immutably
    //     const updateAnswersList: any = (answersList: any[], answerIndex: number) => answersList?.map((answer, index) =>
    //         index === answerIndex ? { ...answer, is_selected: !answer.is_selected } : answer
    //     );

    //     setDataToEdit(prevData => {
    //         const newData = [...prevData];
    //         const question = newData[qIndex];
    //         // Detect whether to use 'answers' or 'answerstoconfigure'
    //         const answerKey = question.answerstoconfigure ? 'answerstoconfigure' : 'answers';

    //         // Immutable update
    //         question[answerKey] = updateAnswersList(question[answerKey], aIndex);

    //         // This might not be necessary if newData has already been updated by reference, but this ensures immutability:
    //         newData[qIndex] = { ...question };

    //         return newData;
    //     });

    //     setDataToEditForBackend(prevData => {
    //         const newData = [...prevData];
    //         const question = newData[qIndex];
    //         const answerKey = question.answerstoconfigure ? 'answerstoconfigure' : 'answers';

    //         // Immutable update
    //         question[answerKey] = updateAnswersList(question[answerKey], aIndex);

    //         // Ensure immutability:
    //         newData[qIndex] = { ...question };

    //         return newData;
    //     });
    // };



    const handleCheckboxChange = (questionId: string, aIndex: number) => {
        // Helper function to update the answers list immutably
        const updateAnswersList = (answersList: any[], answerIndex: any) => answersList.map((answer, index) =>
            index === answerIndex ? { ...answer, is_selected: !answer.is_selected } : answer
        );

        const updateQuestionAnswers = (data: any[], qId: string, answerIndex: number) => {
            return data.map((question: { [x: string]: any[]; question_value: any; answerstoconfigure: any; }) => {
                if (question.question_value === qId) {
                    const answerKey = question.answerstoconfigure ? 'answerstoconfigure' : 'answers';
                    return {
                        ...question,
                        [answerKey]: updateAnswersList(question[answerKey], answerIndex)
                    };
                }
                return question;
            });
        };
        // @ts-ignore
        setDataToEdit(prevData => {
            return updateQuestionAnswers(prevData, questionId, aIndex);
        });
        // @ts-ignore
        setDataToEditForBackend(prevData => {
            return updateQuestionAnswers(prevData, questionId, aIndex);
        });
    };







    // const generateAlphabetId = (index) => {
    //     const upperCaseAlphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
    //     const lowerCaseAlphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i));
    //     const allAlphabets = upperCaseAlphabets.concat(lowerCaseAlphabets);

    //     if (index < allAlphabets.length) {
    //         return allAlphabets[index];
    //     } else {
    //         return '';
    //     }
    // };

    // const generateAlphabetId = (count: number) => {
    //     const alphabets = 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    //     return count < alphabets.length ? alphabets[count % alphabets.length] : '';
    // };

    let answerCount = 1;

    // useEffect(() => {
    //     // const selectedIds = Banner_planner_data?.payload?.map(question => question?.question_id).filter(id => typeof id === 'number')
    //     if (tabulationCardData && tabulationCardData.ui_payload) {
    //         const questionIds = tabulationCardData.ui_payload
    //             .map((question: { question_value: string | number; }) => question.question_value)
    //             // .map((question: { question_id: string | number; }) => question.question_id)
    //             .filter((id: any) => typeof id === 'number');
    //         // @ts-ignore
    //         setSelectedQuestions(questionIds);
    //     }
    // }, [tabulationCardData])


    useEffect(() => {
        // if (!tabulationCardData?.name) {
        // setDataToEdit([])
        // setDataToEditForBackend([])
        setDataToEdit([])
        setDataToEditForBackend([])
        setSelectedQuestions([])
        setSelectPairs([])
        setTabulationName('')
        // }
    }, [showDialog])

    useEffect(() => {
        if (tabulationCardData?.name) {
            setTabulationName(`${tabulationCardData?.name}_clone`)
            setRisk(Number(tabulationCardData?.confidence_level))
            setDataToEdit(tabulationCardData?.ui_payload)
            // setDataToEditForBackend(tabulationCardData?.data_payload)
            if (tabulationCardData?.data_payload) {
                setDataToEditForBackend(tabulationCardData.data_payload);
            }
        }
        if (tabulationCardData && tabulationCardData.ui_payload) {
            const questionIds = tabulationCardData.ui_payload
                .map((question: { question_value: string | number; }) => question.question_value)
            // .map((question: { question_id: string | number; }) => question.question_id)
            // .filter((id: any) => typeof id === 'number');
            // @ts-ignore
            setSelectedQuestions(questionIds);
        }
    }, [tabulationCardData])
    // ui_payload: dataToEdit,
    //             data_payload: dataToEditForBackend,


    // console.log(risk, questionList, questionLists, tabulationCardData, "questionList", selectedQuestions, dataToEdit, dataToEdit, dataToEditForBackend, dataToEditForBackend, crossJoin1, crossJoin2, selectPairs)
    // console.log("dataToEdit as String:", JSON.stringify(dataToEdit, null, 2), "dataToEditForBackend as string:", JSON.stringify(dataToEditForBackend, null, 2));
    // console.log("dataToEdit as String:", JSON.stringify(dataToEdit, null, 2), "dataToEditForBackend as string:", JSON.stringify(dataToEditForBackend, null, 2));
    console.log(dataToEdit, "dataToEditdataToEditdataToEdit", dataToEditForBackend, selectPairs)


    return (
        <>
            <Dialog
                scroll="paper"
                onClose={CloseCrossJoin}
                open={crossJoin}
                // maxWidth="xxl"
                PaperProps={{
                    style: {
                        width: '60%',
                        minHeight: '50%',
                        maxWidth: 'none',
                    }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginRight: "10px",
                        marginTop: "10px",
                    }}
                >
                    <DialogTitle id="alert-dialog-title" color="black">
                        Cross Joins
                    </DialogTitle>
                    <Box style={{ display: "flex" }}>
                        <IconButton onClick={CloseCrossJoin} sx={{ width: "40px", height: "40px" }}  >
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box style={{ padding: "0rem 2rem 2rem 2rem" }}>
                    <Grid container spacing={2}>
                        {selectPairs.map((pair, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={8}>
                                    {/* <Select
                                        className="configuration-box-select"
                                        value={pair.joinFrom}
                                        items={crossJoin1}
                                        onChange={(e) => handleSelectChange(index, 'joinFrom', e.target.value)}
                                        label="Join To"
                                        name="join_to"
                                        isRequired={true}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        className="configuration-box-select"
                                        value={pair.joinTo}
                                        items={crossJoin2}
                                        onChange={(e) => handleSelectChange(index, 'joinTo', e.target.value)}
                                        label="Join From"
                                        name="join_from"
                                        isRequired={true}
                                        size="small"
                                    /> */}
                                    {/* <FormControl sx={{ m: 1, width: 300, mt: 3 }}> */}
                                    <MultiSelect
                                        style={{ width: "100%" }}
                                        size="small"
                                        multiple
                                        value={pair?.joinIds}
                                        onChange={(e) => handleMultiSelectChange(e, index)}
                                        input={<OutlinedInput />}

                                        renderValue={(selected) => {
                                            return selected.map(value => {
                                                const selectedOption = crossJoin1.find(option => option.value == value)
                                                return selectedOption ? selectedOption?.text : value
                                            }).join(', ')
                                        }}

                                        MenuProps={MenuProps}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >

                                        {/* <li {...props}>
                                            <ListItemIcon  >
                                                <QuestionTypeIcon typeId={Number(option?.question_type_id)} />
                                            </ListItemIcon>
                                            <div  >
                                                <ListItemText primary={option.text} />
                                                <ListItemText primary={option.question_text} />
                                            </div>
                                        </li> */}

                                        {crossJoin1?.map((option) => (
                                            <MenuItem
                                                key={option?.value}
                                                value={option?.value}
                                                style={getStyles(option?.text, [String(pair?.joinIds)], theme)}
                                                sx={{ padding: "0rem 1rem", minHeight: "0px " }}
                                            >
                                                {/* {option?.text} */}
                                                <ListItemIcon>
                                                    {option?.question_type_id == 4 ?
                                                        <VisibilityOffIcon style={{ color: "#5f5f5f" }} />
                                                        :
                                                        <QuestionTypeIcon typeId={Number(option?.question_type_id)} />
                                                    }                                                </ListItemIcon>
                                                <div  >
                                                    <ListItemText primary={option.text} style={{ padding: "0rem", minHeight: "0px", margin: "0.1rem" }} />
                                                    <ListItemText primary={option.question_text} style={{ padding: "0rem", minHeight: "0px", margin: "0.1rem" }} />
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </MultiSelect>
                                    {/* </FormControl> */}
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                    <Button onClick={addSelectPair} style={{ marginTop: "1rem" }}>+ Joins</Button>
                    <Box style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem" }}>
                        <Button variant="outlined" onClick={() => {
                            setSelectPairs([{ joinIds: [] }])
                            CloseCrossJoin()
                        }}>Cancel</Button>
                        <Button variant="contained" disabled={crossJoin1?.length <= 0 || selectPairs?.length <= 0 || selectPairs[0]?.joinIds?.length <= 1} onClick={FinalCombination}>Done</Button>
                    </Box>
                </Box>

            </Dialog>
            <Dialog
                scroll="paper"
                onClose={closeDialog}
                open={openPreTab}
                // maxWidth="xxl"
                PaperProps={{
                    style: {
                        width: '80%',
                        height: '80%',
                        maxWidth: 'none',
                    }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginRight: "10px",
                        marginTop: "10px",
                    }}
                >
                    <DialogTitle id="alert-dialog-title" color="black">
                        Configure Banner
                    </DialogTitle>
                    <Box style={{ display: "flex" }}>
                        <IconButton onClick={closeDialog} sx={{ width: "40px", height: "40px" }}  >
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box style={{ padding: "0rem 2rem 2rem 2rem" }}>
                    <StyledContentBox className="answer-add-container-view-mode">
                        {dataToEdit && dataToEdit?.map((question, qIndex) => (
                            <Box key={qIndex} style={{ marginBottom: "1rem" }}>
                                <Box style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "1rem", marginBottom: '1rem' }}>

                                    <div style={{ width: "30%" }}>
                                        <QuestionNameInput
                                            placeholder="Question Code*"
                                            className="base-comp-question_code-input"
                                            size="small"
                                            // fullWidth
                                            sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, width: "100% !important" }}
                                            value={question?.question_label}
                                            onChange={(e) => handleQuestionCodeChange(qIndex, e.target.value)}
                                        />
                                    </div>
                                    <div style={{
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        whiteSpace: 'normal'
                                    }}>
                                        {question?.question_text}
                                    </div>

                                </Box>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Answer Text</TableCell>
                                                <TableCell>Group Text</TableCell>
                                                <TableCell>Weightage(%)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(question?.answerstoconfigure || question?.answers)?.map((answer, ansIndex) => (
                                                <TableRow key={ansIndex}>
                                                    <TableCell style={{ padding: "0rem" }}  ><Checkbox checked={answer?.is_selected} onChange={() => handleCheckboxChange(String(question.question_value), ansIndex)} />
                                                        <span style={{
                                                            wordWrap: 'break-word',
                                                            overflowWrap: 'break-word',
                                                            whiteSpace: 'normal'
                                                        }}> {answer.answer_text} </span>
                                                    </TableCell>
                                                    <TableCell style={{ padding: "0rem" }} >
                                                        <QuestionNameInput
                                                            placeholder="Grouping*"
                                                            className="base-comp-question_code-input"
                                                            size="small"
                                                            // fullWidth
                                                            sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, width: "30% !important" }}
                                                            value={answer.answer_group_text}
                                                            onChange={(e) => handleAnswerGroupTextChangeModal(qIndex, ansIndex, e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{ padding: "0rem" }} >
                                                        <QuestionNameInput
                                                            placeholder="Weightage*"
                                                            className="base-comp-question_code-input"
                                                            size="small"
                                                            type="number"
                                                            // fullWidth
                                                            sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, width: "30% !important" }}
                                                            value={answer.answer_weightage}
                                                            onChange={(e) => handleAnswerWeightageChange(qIndex, ansIndex, 'answer_weightage', e.target.value)}

                                                        />
                                                        {(() => {
                                                            const totalWeightage = (dataToEdit[qIndex].answerstoconfigure || dataToEdit[qIndex].answers).reduce((total, answer) => {
                                                                return answer.is_selected && (answer as any).answer_weightage != -1 ? total + (answer.answer_weightage ? parseFloat((answer as any).answer_weightage) : 0) : total;
                                                            }, 0);

                                                            if (answer.is_selected) {
                                                                //@ts-ignore
                                                                if (answer.answer_weightage === null || answer.answer_weightage === '') {
                                                                    return <p style={{ color: 'red' }}>Give some weightage.</p>;
                                                                }

                                                                if (totalWeightage !== 0 && totalWeightage !== 1 && (answer as any).answer_weightage != -1) {
                                                                    return <p style={{ color: 'red' }}>Total weightage must be between 0 and 1.</p>;
                                                                }
                                                            }
                                                        })()}

                                                        {/* {answer.answer_weightage == null ? 'Give some weightage' : null} */}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        ))}
                    </StyledContentBox>
                    <Box
                        style={{
                            width: "100%",
                            position: "sticky",
                            bottom: 0,
                            display: "flex",
                            justifyContent: "flex-end",
                            padding: "8px",
                            gap: "1rem",
                            backgroundColor: "#FFF",
                        }}
                    >
                        <Button variant="outlined" color="primary"
                            onClick={() => {
                                // setDataToEdit([])
                                // setDataToEditForBackend([])
                                closeDialog()
                            }}
                            style={{ marginRight: '10px' }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                const selectedData = dataToEdit.map(question => {
                                    // Process answers to combine them based on group text
                                    const processedAnswers = (question.answerstoconfigure || question.answers)
                                        .filter(answer => answer.is_selected)
                                        .map(answer => ({
                                            ...answer,
                                            answer_group_text: answer.answer_group_text || answer.answer_text
                                        }))
                                        .reduce<Answer[]>((acc, current) => {
                                            const existing = acc.find(a => a.answer_group_text === current.answer_group_text);
                                            if (existing) {
                                                existing.grouping_details += `,${current.answer_pre_code}`;
                                            } else {
                                                acc.push({ ...current, grouping_details: `${question.question_code}=${current.answer_pre_code}` });
                                            }
                                            return acc;
                                        }, []);

                                    const processedAnswerstoconfigure = (question.answerstoconfigure || question.answers)
                                        // .filter(answer => answer.is_selected)
                                        .map(answer => ({
                                            ...answer,
                                            answer_group_text: answer.answer_group_text || answer.answer_text
                                        }))

                                    // Create a list of answers for backend with the same group text
                                    // const answersForBackend = question.answers
                                    //     // .filter(answer => answer.is_selected)
                                    //     .map(answer => ({
                                    //         ...answer,
                                    //         answer_group_text: processedAnswers.find(a => a.answer_pre_code === answer.answer_pre_code)?.answer_group_text || answer.answer_group_text
                                    //     }));

                                    return {
                                        ...question,
                                        answers: processedAnswers,
                                        answerstoconfigure: processedAnswerstoconfigure,
                                        // answersForBackend
                                    };
                                });

                                setDataToEdit(selectedData);

                                const selectedDataForBackend = dataToEditForBackend.map(question => {
                                    // Process answers to combine them based on group text
                                    const processedAnswers = (question.answerstoconfigure || question.answers)
                                        // .filter(answer => answer.is_selected)
                                        .map(answer => ({
                                            ...answer,
                                            answer_group_text: answer.answer_group_text || answer.answer_text
                                        }))
                                    // .reduce<Answer[]>((acc, current) => {
                                    //     const existing = acc.find(a => a.answer_group_text === current.answer_group_text);
                                    //     if (existing) {
                                    //         existing.grouping_details += `,${current.answer_pre_code}`;
                                    //     } else {
                                    //         acc.push({ ...current, grouping_details: `${question.question_code}=${current.answer_pre_code}` });
                                    //     }
                                    //     return acc;
                                    // }, []);

                                    // Create a list of answers for backend with the same group text
                                    const answersForBackend = (question.answerstoconfigure || question.answers)
                                        // .filter(answer => answer.is_selected)
                                        .map(answer => ({
                                            ...answer,
                                            answer_group_text: processedAnswers.find(a => a.answer_pre_code === answer.answer_pre_code)?.answer_group_text || answer.answer_group_text
                                        }));

                                    return {
                                        ...question,
                                        answers: answersForBackend,
                                        // answersForBackend
                                    };
                                });

                                setDataToEditForBackend(selectedDataForBackend);
                                closeDialog();
                            }}
                        >
                            Done
                        </Button>





                    </Box>

                </Box>

            </Dialog>

            <Dialog
                scroll="paper"
                onClose={closeMainDialog}
                open={showDialog}
                // maxWidth="xxl"
                PaperProps={{
                    style: {
                        width: '80%',
                        minHeight: '50%',
                        maxWidth: 'none',
                    }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginRight: "10px",
                        marginTop: "10px",
                    }}
                >
                    <DialogTitle id="alert-dialog-title" color="black">
                        Create New Banner
                    </DialogTitle>
                    <Box style={{ display: "flex" }}>
                        <IconButton onClick={closeMainDialog} sx={{ width: "40px", height: "40px" }}  >
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box style={{ padding: "0rem 2rem 2rem 2rem" }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} >
                            <Grid item xs={4.5}>
                                <QuestionNameInput
                                    placeholder="Banner Name*"
                                    className="base-comp-question_code-input"
                                    size="small"
                                    fullWidth
                                    sx={{ "& .MuiInputBase-input": { fontWeight: 700, } }}
                                    value={tabulationName}
                                    onChange={(e) => setTabulationName(e?.target.value)}
                                />
                            </Grid>

                            <Grid item xs={1.5}>
                                <Select
                                    className="configuration-box-select"
                                    value={risk}
                                    items={answerListSorting}
                                    onChange={handleRiskInputChange}
                                    label="TSTAT Confidence Level"
                                    name="answer_sorting_order"
                                    isRequired={true}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6} style={{ padding: "0rem 0rem 1rem 1.5rem" }}>
                                {/* <MultipleSelectDoneCheckmarks
                                    label="Questions*"
                                    width="100%"
                                    items={questionList}
                                    handleChange={handleChange}
                                    selectedOptions={selectedQuestions}
                                    style={{ marginTop: "8px", width: "calc(37vw)" }}
                                    openDialog={openDialog}
                                /> */}
                                <Autocomplete
                                    multiple
                                    id="size-small-standard-multi"
                                    size="small"
                                    options={questionList}
                                    getOptionLabel={(option) => option.text}
                                    // defaultValue={[top100Films[13]]}
                                    value={questionList.filter(question => selectedQuestions.includes(question.value))}
                                    onChange={handleChange}
                                    // open={open}
                                    // onOpen={() => setOpen(true)}
                                    onClose={() => {
                                        if (selectedQuestions?.length > 0) {
                                            openDialog()
                                        }
                                    }}
                                    disableCloseOnSelect
                                    filterOptions={(options, { inputValue }) => {
                                        return options?.filter(option =>
                                            option?.text?.toLowerCase().includes(inputValue.toLowerCase()) ||
                                            option?.question_text?.toLowerCase().includes(inputValue.toLowerCase())
                                        );
                                    }}
                                    renderOption={(props, option) => (
                                        <li {...props} style={{ padding: "0rem 1rem", minHeight: "0px " }}>
                                            <ListItemIcon  >
                                                {option?.question_type_id == 4 ?
                                                    <VisibilityOffIcon style={{ color: "#5f5f5f" }} />
                                                    :
                                                    <QuestionTypeIcon typeId={Number(option?.question_type_id)} />
                                                }                                            </ListItemIcon>
                                            <div  >
                                                <ListItemText primary={option.text} style={{ padding: "0rem", minHeight: "0px", margin: "0.1rem" }} />
                                                <ListItemText primary={option.question_text} style={{ padding: "0rem", minHeight: "0px", margin: "0.1rem" }} />
                                            </div>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Questions"
                                            placeholder="Search Questions"
                                        />
                                    )}

                                    // PaperComponent={(props) => <CustomPaper openDialog={openDialog} setOpen={setOpen}  {...props} />}


                                    sx={{
                                        '& .MuiAutocomplete-inputRoot': {
                                            flexWrap: 'nowrap !important',
                                            overflowX: 'auto',
                                        },
                                        '& .MuiAutocomplete-tag': {
                                            margin: '2px',
                                            flexShrink: 0,
                                        },
                                        '& .MuiAutocomplete-tagList': {
                                            display: 'flex',
                                            flexDirection: 'row',
                                            overflowX: 'auto',
                                            flexWrap: 'nowrap',
                                        },
                                        '& .MuiAutocomplete-paper': {
                                            overflow: 'visible',
                                        },
                                        '& .MuiAutocomplete-endAdornment': {
                                            position: 'relative',
                                            right: 0,
                                            display: 'none',
                                        },
                                        '.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot': {
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            '& > :nth-last-child(-n+2)': {
                                                flexBasis: '100%',
                                                width: '100%',
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box style={{ display: dataToEdit?.length > 0 ? "flex" : "none", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
                            <Button onClick={() => OpenCrossJoin()}> + Cross join</Button>
                            <Button>
                                <EditIcon fontSize="small" style={{ cursor: "pointer", color: "#5D5D5D", }} onClick={() => openDialog()} />
                            </Button>
                        </Box>
                        <Grid container spacing={0} style={{ display: dataToEdit?.length > 0 ? "block" : "none" }}  >
                            <Box style={{ padding: "0rem 0rem 2rem 0rem", width: "100%" }}>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow sx={{ '& > *': { borderBottom: '2px solid #ccc' } }}>
                                                    <TableCell>Banner ID</TableCell>
                                                    <TableCell style={{ minWidth: "100px" }}>Banner Heading</TableCell>
                                                    <TableCell>Question Code</TableCell>
                                                    <TableCell align="left">Banner point</TableCell>
                                                    <TableCell align="left">Question No and codes</TableCell>
                                                    <TableCell align="left">Weightage(%)</TableCell>
                                                    {/* <TableCell align="left" style={{ minWidth: "120px" }}>Export Viz</TableCell> */}
                                                    <TableCell align="left">Actions</TableCell>
                                                </TableRow>
                                                <TableRow sx={{ '& > *': { borderBottom: '2px solid #ccc' } }}>
                                                    <TableCell style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, padding: "0.5rem" }}>A</TableCell>
                                                    <TableCell style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, padding: "0.5rem" }}>Total</TableCell>
                                                    <TableCell style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, padding: "0.5rem" }}></TableCell>
                                                    <TableCell align="left" style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, padding: "0.5rem" }}>Total</TableCell>
                                                    <TableCell align="left" style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, padding: "0.5rem" }}>All respondents</TableCell>
                                                    <TableCell align="left" style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, padding: "0.5rem" }}></TableCell>
                                                    {/* <TableCell align="left" style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, }}></TableCell> */}
                                                    <TableCell align="left" style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, }}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <Droppable droppableId="table">
                                                {(provided) => (
                                                    <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                                                        {dataToEdit && dataToEdit.map((question, index) => (
                                                            <Draggable key={question?.question_value} draggableId={question?.question_value} index={index}>
                                                                {(provided) => (
                                                                    <TableRow
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}

                                                                        key={question.question_value}
                                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                    >
                                                                        <TableCell component="th" scope="row" style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, padding: "0px" }}>
                                                                            {question.answers.map((_answer, idx) => (
                                                                                <div key={idx} style={{ padding: "0.5rem", borderBottom: `1px solid ${theme.palette.grey[300]}`, minHeight: question?.question_id ? "60px" : question?.question_value?.split('-').length >= 4 ? '80px' : question?.question_value?.split('-').length == 3 ? "70px" : question?.question_value?.split('-').length == 2 ? '60px' : '40px' }}>
                                                                                    {getBannerId(answerCount++)}<br />

                                                                                </div>
                                                                            ))}

                                                                            {/* {generateAlphabetId(index)} */}
                                                                        </TableCell>
                                                                        <TableCell component="th" scope="row" style={{ padding: "0.5rem", borderRight: `1px solid ${theme.palette.grey[300]}` }}>
                                                                            {question.question_label}
                                                                        </TableCell>

                                                                        <TableCell component="th" scope="row" style={{ padding: "0.5rem", borderRight: `1px solid ${theme.palette.grey[300]}` }}>
                                                                            {question.question_code}
                                                                        </TableCell>

                                                                        <TableCell align="left" style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, padding: "0px" }}>
                                                                            {question.answers.map((answer, idx) => (
                                                                                <div key={idx} style={{ padding: "0.5rem", borderBottom: `1px solid ${theme.palette.grey[300]}`, minHeight: question?.question_id ? "60px" : question?.question_value?.split('-').length >= 4 ? '80px' : question?.question_value?.split('-').length == 3 ? "70px" : question?.question_value?.split('-').length == 2 ? '60px' : '40px' }}>
                                                                                    {answer.answer_group_text}<br />

                                                                                </div>
                                                                            ))}
                                                                        </TableCell>
                                                                        <TableCell align="left" style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, padding: "0px" }}>
                                                                            {question.answers.map((answer, idx) => (
                                                                                <div key={idx} style={{ padding: "0.5rem", borderBottom: `1px solid ${theme.palette.grey[300]}`, minHeight: question?.question_id ? "60px" : question?.question_value?.split('-').length >= 4 ? '80px' : question?.question_value?.split('-').length == 3 ? "70px" : question?.question_value?.split('-').length == 2 ? '60px' : '40px' }}>
                                                                                    {answer.grouping_details}<br />

                                                                                </div>
                                                                            ))}
                                                                        </TableCell>

                                                                        <TableCell align="left" style={{ borderRight: `1px solid ${theme.palette.grey[300]}`, padding: "0px" }}>
                                                                            {question?.answers?.map((answer, idx) => (
                                                                                <div key={idx} style={{ padding: "0.5rem", borderBottom: `1px solid ${theme.palette.grey[300]}`, minHeight: question?.question_id ? "60px" : question?.question_value?.split('-').length >= 4 ? '80px' : question?.question_value?.split('-').length == 3 ? "70px" : question?.question_value?.split('-').length == 2 ? '60px' : '40px' }}>
                                                                                    {answer.answer_weightage == -1 ? 'NA' : (answer.answer_weightage * 100 + '%')}<br />
                                                                                </div>
                                                                            ))}
                                                                        </TableCell>
                                                                        {/* <TableCell align="center" style={{ padding: "0px", borderRight: `1px solid ${theme.palette.grey[300]}` }}>
                                                                            <Checkbox checked={question?.export_to_viz} onChange={() => handleSendForPublsih(question?.question_value)} />
                                                                        </TableCell> */}

                                                                        <TableCell align="center" style={{ padding: "0px", borderRight: `1px solid ${theme.palette.grey[300]}` }}>
                                                                            <img src={Deactivate} width={12} height={12} style={{ cursor: "pointer" }} onClick={() => handleDeleteQuestion(question.question_value)} />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                    </TableBody>
                                                )}
                                            </Droppable>
                                        </Table>
                                    </TableContainer>
                                </DragDropContext>


                            </Box>
                            <Box
                                style={{
                                    width: "100%",
                                    position: "sticky",
                                    bottom: 0,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    padding: "8px",
                                    gap: "1rem",
                                    backgroundColor: "#FFF",
                                    marginTop: "1rem"
                                }}
                            >
                                <Button variant="outlined" color="primary"
                                    onClick={() => {
                                        setDataToEdit([])
                                        setDataToEditForBackend([])
                                        setDataToEdit([])
                                        closeMainDialog()
                                        // setDataToEdit([])
                                        setTabulationName('')
                                        setRisk(1)
                                        setSelectPairs([])
                                    }}
                                    style={{ marginRight: '10px' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={(!tabulationName || !risk)}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                        handleSubmit(e)

                                    }}
                                >
                                    Create Banner
                                </Button>
                            </Box>
                        </Grid>

                    </form>
                </Box>
            </Dialog >
        </>
    )


}
export default DynamicCreateBannerPlanner;