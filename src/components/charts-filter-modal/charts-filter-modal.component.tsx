import { Box, Button, Checkbox, Dialog, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";
// import questionLists from "./questions.json"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { StyledContentBox } from "./charts-filter-modal.style";
import { Answer } from "./charts-filter-modal.type";


// function CustomPaper({ children, openDialog, setOpen, ...paperProps }: { children?: React.ReactNode, openDialog: () => void, setOpen: (open: boolean) => void, }) {
//     return (
//         <Paper {...paperProps}>
//             {children}
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "1rem", p: 1 }}>
//                 <Button variant="text" onClick={() => setOpen(false)} onMouseDown={(event) => {
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

// @ts-ignore
const ChartFilterModal = ({ dataToEdit, setDataToEdit, questionLists, openPreTab, setPreTab, questionsWithAnswers, setQuestionWithAnswers }) => {
    // const [allQues, setAllQues] = useState([])
    // const [questionList, setQuestionList] = useState([]);
    // const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    // const [open, setOpen] = useState(false);
    // const [openPreTab, setPreTab] = useState<boolean>(false)
    // const [dataToEdit, setDataToEdit] = useState<Question[] | []>([])
    // console.log(selectedQuestions, dataToEdit, "dataToEditdataToEditdataToEdit")
    function closeDialog() {
        setPreTab(false)
    }

    // function openDialog() {
    //     setPreTab(true)
    // }

    // function closeMainDialog() {
    //     setShowDialog(false);
    // }
    // const handleChange = (event, newValue) => {
    //     console.log(newValue, "newValuenewValue")
    //     // newValue contains the selected items
    //     const selectedIds = newValue.map((item: any) => Number(item?.value))
    //     setSelectedQuestions(selectedIds);
    //     console.log(selectedIds, "selectedIdsselectedIdsselectedIds")
    //     setOpen(true);
    //     setDataToEdit(prevData => {
    //         return prevData.filter(question => {
    //             if (selectedIds.includes(question.question_value)) {
    //                 return true;
    //             }

    //             if (typeof question.question_value === 'string' && (question as any).question_value.startsWith('new-')) {
    //                 const parts = (question as any).question_value.split('-').slice(1);
    //                 return parts.every((part: any) => selectedIds.includes(Number(part)));
    //             }

    //             return false;
    //         });
    //     });
    //     // setDataToEdit(prevData => {
    //     //     return prevData.filter((question: any) => {
    //     //         if (typeof question.question_value === 'string' && question.question_value.startsWith('new-')) {
    //     //             const parts = question?.question_value?.split('-').slice(1); // "new-5-6-0" -> ["5", "6", "0"]
    //     //             // Check if any part matches, not every part
    //     //             return parts.some((part: any) => selectedIds.includes(Number(part)));
    //     //         }
    //     //         // Direct match for numbers
    //     //         return selectedIds.includes(question.question_value);
    //     //     });
    //     // });
    // }


    const handleCheckboxChange = (qIndex: number, aIndex: number) => {
        setDataToEdit((prevData: any) => {
            const newData = [...prevData];
            newData[qIndex].answers[aIndex].is_selected = !newData[qIndex].answers[aIndex].is_selected;
            return newData;
        });
    }

    // function filterQuestionsWithSelectedAnswers(dataToEdit, questionsWithAnswers) {
    //     // Create a map of question_ids to selected answer_codes from dataToEdit
    //     const selectedAnswersMap = new Map();
    //     dataToEdit?.forEach(question => {
    //         const selectedAnswers = question.answers
    //             .filter(answer => answer.is_selected)
    //             .map(answer => answer.answer_pre_code);
    //         if (selectedAnswers.length > 0) {
    //             selectedAnswersMap.set(question.question_id, selectedAnswers);
    //         }
    //     });

    //     // Only update questions that have selected answers in dataToEdit
    //     const filteredQuestionsWithAnswers = questionsWithAnswers?.map(question => {
    //         // Check if the current question has selected answers
    //         if (selectedAnswersMap.has(question.question_id)) {
    //             const selectedAnswers = selectedAnswersMap.get(question.question_id);
    //             const filteredAnswers = question.answers.filter(answer =>
    //                 selectedAnswers.includes(answer.answer_code)
    //             );
    //             return {
    //                 ...question,
    //                 answers: filteredAnswers
    //             };
    //         }
    //         // If the question does not have selected answers, return it unchanged
    //         return question;
    //     });
    //     setQuestionWithAnswers(filteredQuestionsWithAnswers)

    //     // return filteredQuestionsWithAnswers;
    // }


    console.log(questionsWithAnswers, "questionsWithAnswersquestionsWithAnswers")
    // const handleSubmit = (e: any) => {
    //     e.preventDefault()

    //     // const filteredData = filterQuestionsWithSelectedAnswers(dataToEdit, questionsWithAnswers);
    //     // console.log(filteredData, "filteredDatafilteredDatafilteredDatafilteredData");
    //     // console.log(dataToEdit, "filteredDatafilteredData", filteredData)

    // }

    // useEffect(() => {
    //     // Check if questionLists is an array and has items
    //     if (Array.isArray(allQues) && allQues.length) {
    //         // const excludedTypes = ['quantity', 'date', 'time', 'opentext', 'opentextlist', 'numericlist'];

    //         // const filteredData = allQues.filter(item =>
    //         //     !excludedTypes.includes(item.question_type_name) && item.question_variable_type !== 'HIDDEN'
    //         // );

    //         // const updatedData = filteredData.map((item, index) => ({
    //         //     ...item,
    //         //     question_value: index + 1
    //         // }));
    //         // console.log(questionList, "questionListquestionListquestionList")
    //         const serviceNames = allQues.map((item, index) => ({
    //             value: index + 1,
    //             // value: item.question_value,
    //             text: item.question_variable_id,
    //             label: item.question_value
    //         }));
    //         setQuestionList(serviceNames);
    //     }
    // }, [allQues]);

    // useEffect(() => {
    //     // Check if questionLists is an array and has items
    //     if (Array.isArray(questionLists) && questionLists.length) {
    //         const excludedTypes = ['quantity', 'date', 'time', 'opentext', 'opentextlist', 'numericlist'];

    //         const filteredData = questionLists.filter(item =>
    //             !excludedTypes.includes(item.question_type_name) && item.question_variable_type !== 'HIDDEN'
    //         );

    //         const updatedData = filteredData.map((item, index) => ({
    //             ...item,
    //             question_value: index + 1
    //         }));

    //         if (updatedData) {
    //             const transformedData = (updatedData as any).map((question: { question_value: any; question_id: any; question_text: any; question_type_id: any; answers: any[]; question_variable_id: string; question_type_name: string; }, index: number) => ({
    //                 question_value: question.question_value,
    //                 question_id: question.question_id,
    //                 // question_code: question.question_id,
    //                 // question_label: question.question_id,
    //                 question_code: question?.question_variable_id,
    //                 question_label: question?.question_variable_id,
    //                 question_type_name: question?.question_type_name,
    //                 question_text: question.question_text,
    //                 // adding new
    //                 // question_variable_code: question?.question_variable_id,
    //                 // question_variable_code: question?.question_variable_code,
    //                 // question_agg_label: "Base:All Respondents",
    //                 question_type_id: question.question_type_id,
    //                 grouped_question_code: [],
    //                 question_sort_order: index + 1,
    //                 answers: question.answers.map((answer, index) => ({
    //                     answer_id: answer.answer_id,
    //                     answer_pre_code: answer.answer_pre_code,
    //                     answer_text: answer.answer_text,
    //                     answer_label: answer?.answer_text,
    //                     answer_group_text: '',
    //                     answer_weightage: 0,
    //                     answer_sort_order: index + 1,
    //                     is_selected: true,
    //                     grouping_details: '',
    //                 }))
    //             }));

    //             if (transformedData) {
    //                 setDataToEdit(transformedData);
    //                 // setDataToEdit(prevData => [...prevData, ...transformedData]);
    //             }
    //         }
    //         // setAllQues(updatedData)
    //     }
    // }, [questionLists]);



    // useEffect(() => {
    //     const dataToEditQuestionIds = new Set(dataToEdit?.map((item) => item?.question_value))
    //     const matchedQuestions = (allQues as any).filter((question: { question_value: number; }) =>
    //         selectedQuestions.includes(question.question_value) &&
    //         !dataToEditQuestionIds.has(question?.question_value)
    //     );
    //     console.log(dataToEditQuestionIds, "matchedQuestionsmatchedQuestionsmatchedQuestions", matchedQuestions)
    //     if (matchedQuestions) {
    //         const transformedData = (matchedQuestions as any).map((question: { question_value: any; question_id: any; question_text: any; question_type_id: any; answers: any[]; question_variable_id: string; question_type_name: string; }, index: number) => ({
    //             question_value: question.question_value,
    //             question_id: question.question_id,
    //             // question_code: question.question_id,
    //             // question_label: question.question_id,
    //             question_code: question?.question_variable_id,
    //             question_label: question?.question_variable_id,
    //             question_type_name: question?.question_type_name,
    //             question_text: question.question_text,
    //             // adding new
    //             // question_variable_code: question?.question_variable_id,
    //             // question_variable_code: question?.question_variable_code,
    //             // question_agg_label: "Base:All Respondents",
    //             question_type_id: question.question_type_id,
    //             grouped_question_code: [],
    //             question_sort_order: index + 1,
    //             answers: question.answers.map((answer, index) => ({
    //                 answer_id: answer.answer_id,
    //                 answer_pre_code: answer.answer_pre_code,
    //                 answer_text: answer.answer_text,
    //                 answer_label: answer?.answer_text,
    //                 answer_group_text: '',
    //                 answer_weightage: 0,
    //                 answer_sort_order: index + 1,
    //                 is_selected: true,
    //                 grouping_details: '',
    //             }))
    //         }));

    //         if (openPreTab) {
    //             setDataToEdit(prevData => [...prevData, ...transformedData]);
    //         }
    //     }
    // }, [openPreTab, selectedQuestions]);

    // console.log("questionListquestionListquestionList", questionLists, dataToEdit)
    return (
        <>

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
                        Configure questions
                    </DialogTitle>
                    <Box style={{ display: "flex" }}>
                        <IconButton onClick={closeDialog} sx={{ width: "40px", height: "40px" }}  >
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box style={{ padding: "0rem 2rem 2rem 2rem" }}>
                    <StyledContentBox className="answer-add-container-view-mode">
                        {dataToEdit && dataToEdit?.map((question: { question_label: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal; question_text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; answers: any[]; }, qIndex: number) => (
                            <Box key={qIndex} style={{ marginBottom: "1rem" }}>
                                <Box style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "1rem", marginBottom: '1rem' }}>

                                    <div style={{ width: "30%" }}>
                                        {question?.question_label}
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
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {question?.answers?.map((answer, ansIndex) => (
                                                <TableRow key={ansIndex}>
                                                    <TableCell style={{ padding: "0rem" }}  ><Checkbox checked={answer?.is_selected} onChange={() => handleCheckboxChange(qIndex, ansIndex)} />
                                                        <span style={{
                                                            wordWrap: 'break-word',
                                                            overflowWrap: 'break-word',
                                                            whiteSpace: 'normal'
                                                        }}> {answer.answer_text} </span>
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
                        <Button variant="text" color="primary"
                            onClick={() => {
                                // setDataToEdit([])
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
                                const selectedData = dataToEdit.map((question: { answers: any[]; question_code: any; }) => {
                                    // Process answers to combine them based on group text
                                    const processedAnswers = question.answers
                                        // .filter(answer => answer.is_selected)
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


                                    return {
                                        ...question,
                                        answers: processedAnswers,
                                        // answersForBackend
                                    };
                                });
                                setDataToEdit(selectedData);
                                // filterQuestionsWithSelectedAnswers(selectedData, questionsWithAnswers)
                                closeDialog();
                                // closeMainDialog()
                            }}
                        >
                            Done
                        </Button>





                    </Box>

                </Box>

            </Dialog>

        </>
    )
}

export default ChartFilterModal;