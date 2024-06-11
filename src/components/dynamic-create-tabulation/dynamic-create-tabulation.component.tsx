import { QuestionNameInput } from "@/constants/cutom-question-name-input";
import {
    Box, Button, Checkbox, Dialog, DialogTitle, FormControlLabel, Grid, IconButton, ListSubheader, MenuItem, Switch, SwitchProps, Tooltip, Typography, styled,
    //  Paper,  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { StyledContentBox } from "./dynamic-create-tabulation.style";
import Select from "@/components/select";
import { Question, } from "./dynamic-create-tabulation.type";
import { AnswerFromAPI, QuestionListItem, postTabulationObject } from "@/types/project-data.type";
import TextFieldNew from "../text-field-new/text-field-new.component";
import { theme } from "@/constants/theme";
// import MultipleSelectCheckmarks from "../multiple-select";
import { nanoid } from 'nanoid';
// add material react table
import { MaterialReactTable } from 'material-react-table';

import OutlinedInput from '@mui/material/OutlinedInput';
import { Select as SingleSelect } from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface DynamicTabulationProps {
    showDialog: boolean;
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    PostDataTabulation: (payload: postTabulationObject) => Promise<void>;
    questionLists: QuestionListItem[]
    bannerList: AnswerFromAPI[];
    bannerUid: string;
    setBannerUid: React.Dispatch<React.SetStateAction<string>>;
    bannerPayload: Question[];

    tabulationCardData: any;
    disableState: boolean;
    PutDataTabulation: (object_uid: string, payload: postTabulationObject) => Promise<void>;
    setBannerPayload: React.Dispatch<React.SetStateAction<Question[]>>;

    tabStatus: boolean;
    setTabStatus: React.Dispatch<React.SetStateAction<boolean>>;
    ChangeStatus: (status: boolean) => Promise<any>;

}

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 34,
    height: 18,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#8E27D7',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 14,
        height: 14,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));


const DynamicCreateTabulation: React.FC<DynamicTabulationProps> = ({ showDialog, setShowDialog, PostDataTabulation,
    bannerList, questionLists, setBannerUid, bannerPayload, tabulationCardData, disableState, PutDataTabulation, setBannerPayload, tabStatus, setTabStatus, ChangeStatus }) => {
    // console.log(tabulationCardData, "tabulationCardDatatabulationCardData")
    const [tabulationName, setTabulationName] = useState<string>('')
    const [risk, setRisk] = useState<number>()
    const [desc, setDesc] = useState<string>('')
    const [questionList, setQuestionList] = useState<Question[]>([]);
    const [dataToTabulation, setDataToTabulation] = useState<Question[] | []>([])
    // const [selectGrids, setSelectGrids] = useState<any>(false)
    const nanoId = nanoid(7)
    const [cloneBanner, setCloneBanner] = useState([])


    const handleCheckboxChange = (questionId: number, newReverseScaleValue: boolean) => {
        setQuestionList(prevList => {
            return prevList.map(question => {
                if (question.question_value === questionId) {
                    return { ...question, reverse_scale: newReverseScaleValue };
                }
                return question;
            });
        });
    };

    const generateOptions = (answers: any[]) => {
        return answers.map(answer => ({
            value: answer.answer_pre_code,
            label: answer.answer_text,
        }));
    };

    const handleBoxAnalysisChange = (questionId: number, newValue: any) => {
        setQuestionList(prevList => {
            return prevList.map(question => {
                if (question.question_value == questionId) {
                    return { ...question, box_analysis: newValue }
                }
                return question;
            })
        })
    }

    const columns = [
        {
            accessorKey: 'question_code',
            header: 'Question Code',
            size: 250,
            // isVisible: selectGrids,
            Cell: ({ row }: { row: any }) => (
                <Tooltip placement="right" title={
                    <Box style={{ backgroundColor: "#ffffff !important", width: "100%" }}>
                        <Box>
                            <h3>{row.original?.question_text}</h3>
                        </Box>
                        {row.original.answers.map((answer: { answer_text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                            // @ts-ignore
                            <div key={index}>{index + 1}.   {answer.answer_text}</div>
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
                    <span>{row.original.question_code}</span>
                </Tooltip>
            ),
        },
        {
            accessorKey: 'question_type_name',
            header: 'Question Type',
            size: 200,
        },
        {
            accessorKey: 'respondent_text',
            header: 'Base Label',
            size: 250,
            Cell: ({ row }: { row: any }) => (
                <QuestionNameInput
                    placeholder="Exclude Pre Codes"
                    className="base-comp-question_code-input"
                    size="small"
                    // disabled={disableState}
                    // fullWidth
                    sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, width: "90% !important" }}
                    value={row.original.question_agg_label}
                    onChange={(e) => handleInputChangeRespondents(row.original.question_value, e.target.value)}
                />
            ),
        },
        {
            accessorKey: 'exclude_pre_codes',
            header: 'Exclude Pre Codes',
            size: 250,
            Cell: ({ row }: { row: any }) => {
                const options = generateOptions(row.original.answers);
                const selectedValues = Array.isArray(row.original.exclude_pre_codes)
                    ? row.original.exclude_pre_codes
                    : [];

                console.log(options, "optionsoptions", selectedValues, row?.original)

                return (
                    < SingleSelect
                        // style={{
                        //     display: (row.original?.question_type_id == 12 || row.original?.question_type_id == 13 || row.original?.question_type_id == -1) ? "block" : "none"
                        // }}
                        multiple
                        size="small"
                        sx={{ width: "90%" }}
                        // disabled={disableState}
                        value={selectedValues}
                        onChange={(e) => handleInputChangePreCodes(row.original.question_value, e.target.value)}
                        input={< OutlinedInput label="" />}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {
                            options.map((option) => (
                                <MenuItem key={option.value} value={option.value} style={{ maxWidth: "calc(50vw)" }}>
                                    {option.value + (option.label ? ":- " : "") + option.label}
                                </MenuItem>
                            ))
                        }
                    </ SingleSelect>
                );
            },

        },
        {
            accessorKey: 'reverse_scale',
            header: 'Reverse Scale',
            size: 200,
            Cell: ({ row }: { row: any }) => (
                <Checkbox
                    // disabled={disableState} 
                    checked={row.original.reverse_scale} value={row.original.reverse_scale} onChange={(e) => {
                        handleCheckboxChange(row.original.question_value, e.target.checked)
                    }
                    }
                    style={{
                        display: (row.original?.question_type_id == 12 || row.original?.question_type_id == 13 || row.original?.question_type_id == -1) ? "block" : "none"
                    }}
                />
            ),
            // muiTableBodyCellEditTextFieldProps: ({ row }) => ({
            //     type: 'checkbox',
            //     value: row.original.reverse_scale ? 'checked' : '',
            //     onChange: (e) => {
            //         handleCheckboxChange(row.original.question_value, e.target.checked);
            //     },
            // }),
        },
        {
            accessorKey: 'box_analysis',
            header: 'Box Analysis',
            size: 300,
            Cell: ({ row }: { row: any }) => {
                // const options = getScaleOptions(row.original.answers.length)
                // const numericListptions = getScaleOptions(row.original.level_id)
                const standardOptions = getScaleOptions(row.original.answers.length);
                const customOptions = getScaleCustomsOptions(row.original.answers.length);
                const selectedValues = Array.isArray(row.original.box_analysis) ? row.original.box_analysis : [];
                return (
                    <>
                        <SingleSelect
                            multiple
                            value={selectedValues}
                            // disabled={disableState}
                            size="small"
                            sx={{
                                width: "100%", display: (row.original?.question_type_id == 12 || row.original?.question_type_id == 13 || row.original?.question_type_id == -1)
                                    && row.original.answers.length > 4
                                    ? "block" : "none"
                            }}
                            onChange={(e) => handleBoxAnalysisChange(row.original.question_value, e.target.value)}
                            input={<OutlinedInput />}
                            // renderValue={(selected) => selected?.slice(0, 5).join(',') + selected?.length > 5 ? '...' : null}
                            renderValue={(selected) => selected?.slice(0, 5).join(',') + (selected?.length > 5 ? '...' : '')}

                        >
                            {/* {options?.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.text}
                                </MenuItem>
                            ))} */}
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
                        </SingleSelect>
                    </>
                )
            },
        },
        {
            accessorKey: 'bin_buckets',
            header: 'Binning',
            size: 400,
            Cell: ({ row }: { row: any }) => {

                // const { bin_buckets } = row.original;
                // const defaultMin = row.original.min_value
                // const defaultMax = row.original.max_value

                const [openModal, setOpenModal] = useState(false)
                const [minValue, setMinValue] = useState('');
                const [maxValue, setMaxValue] = useState('');
                const [binRanges, setBinRanges] = useState(row.original.bin_buckets || []);
                const [error, setError] = useState('');
                const CloseModal = () => {
                    setOpenModal(false)
                    setError('')
                    setMinValue('')
                    setMaxValue('')
                    setBinRanges([])
                }

                const validateRange = (start: string, end: string, existingRanges: any) => {
                    const startNum = Number(start);
                    const endNum = Number(end);

                    // Validation for non-numeric values
                    if (isNaN(startNum) || isNaN(endNum)) {
                        setError("Range must be numeric.");
                        return false;
                    }

                    // Validation for equal values
                    if (startNum == endNum) {
                        setError("Start of the range must be different than the end of the range .");
                        return false;
                    }

                    // Validation for start > end
                    if (startNum > endNum) {
                        setError("Start of the range must be less than the end of the range.");
                        return false;
                    }

                    // // Validation for specified range limits
                    // if (startNum < defaultMin || endNum > defaultMax) {
                    //     setError(`Range must be within ${defaultMin} and ${defaultMax}.`);
                    //     return false;
                    // }

                    // Check for overlapping or identical ranges
                    const rangeRegex = /(-?\d+)-(-?\d+)/;
                    for (const range of existingRanges) {
                        const match = rangeRegex.exec(range);
                        if (match) {
                            const existingStart = parseInt(match[1], 10);
                            const existingEnd = parseInt(match[2], 10);

                            if ((startNum <= existingEnd && endNum >= existingStart) || (startNum === existingStart && endNum === existingEnd)) {
                                setError("Ranges cannot overlap or repeat.");
                                return false;
                            }
                        }
                    }

                    return true; // Passed all validations
                };

                const handleDeleteRange = (indexToDelete: number) => {
                    setBinRanges((currentRanges: any[]) => currentRanges.filter((_, index) => index !== indexToDelete));
                };

                const handleAddRange = () => {
                    setError('');
                    if (validateRange(minValue, maxValue, binRanges)) {
                        const newRange = `${minValue}-${maxValue}`;
                        setBinRanges((oldRanges: any) => [...oldRanges, newRange]);
                        setMinValue('');
                        setMaxValue('');
                    }
                };




                useEffect(() => {
                    // console.log(row.original.bin_buckets, "row.original.survey_idrow.original.bin_buckets")
                    if (row.original.bin_buckets) {
                        setBinRanges(row.original.bin_buckets);
                    }
                }, [row.original.bin_buckets, openModal]);

                // console.log(binRanges, "binRangesbinRangesbinRanges")



                const handleRangesChange = (questionId: number, newRanges: any) => {
                    setQuestionList(prevList => {
                        return prevList.map(question => {
                            if (question.question_value === questionId) {
                                return { ...question, bin_buckets: newRanges };
                            }
                            return question;
                        });
                    });
                    CloseModal()
                };



                return (
                    <>
                        {row.original?.question_type_id == 4 &&
                            <>
                                <Dialog
                                    scroll="paper"
                                    onClose={CloseModal}
                                    open={openModal}
                                    // maxWidth="xxl"
                                    PaperProps={{
                                        style: {
                                            width: '40%',
                                            // minHeight: '50%',
                                            maxWidth: 'none',
                                            overflow: 'scroll', // Ensures no internal content can overflow
                                            borderRadius: '10px', // Rounded corners for a modern look
                                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)', // Subtle shadow for depth
                                            backgroundColor: '#f7f7f7',
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            // marginRight: "10px",
                                            // marginTop: "10px",
                                            // padding: "16px 24px", // Consistent padding around the header
                                            // borderBottom: '1px solid #e0e0e0',
                                        }}
                                    >
                                        <DialogTitle id="alert-dialog-title" color="black" sx={{ fontWeight: 'bold', color: '#333' }}>
                                            {"Binning configurations"}
                                            {/* {row.original.question_code} */}
                                        </DialogTitle>
                                        <Box style={{ display: "flex" }}>
                                            <IconButton onClick={CloseModal} sx={{ width: "40px", height: "40px", color: '#666' }}  >
                                                <CloseOutlinedIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Box style={{ padding: "0px 24px" }}>
                                        {/* <Box style={{ display: "flex", justifyContent: "space-between", width: "60%", marginBottom: "1rem", gap: "2rem" }}>
                                            <Typography variant="h6" sx={{ color: '#333', fontWeight: 'medium' }}>Min Value: {defaultMin}</Typography>
                                            <Typography variant="h6" sx={{ color: '#333', fontWeight: 'medium' }}>Max Value: {defaultMax}</Typography>
                                        </Box> */}
                                        {/* <Grid container spacing={2}>
                                            <Grid item md={4}>
                                                <Typography variant="h6" sx={{ color: '#333', fontWeight: 'medium' }}>Min Value: {defaultMin}</Typography>
                                            </Grid>
                                            <Grid item md={4}>
                                                <Typography variant="h6" sx={{ color: '#333', fontWeight: 'medium' }}>Max Value: {defaultMax}</Typography>
                                            </Grid>
                                        </Grid> */}
                                        {/* {binRanges && binRanges.map((range, index) => (
                                    <Box key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: '8px' }}>
                                        <Typography sx={{ color: '#333' }}>{range}</Typography>
                                        <IconButton onClick={() => handleDeleteRange(index)} size="small" sx={{ color: '#666' }}>
                                            <DeleteRoundedIcon fontSize="inherit" />
                                        </IconButton>
                                    </Box>
                                ))} */}
                                        <List dense={true} style={{ width: "60%", marginBottom: "1rem" }}>
                                            {binRanges && binRanges?.map((range: any, index: number) => (
                                                <ListItem
                                                    key={index}
                                                    secondaryAction={
                                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRange(index)} sx={{ color: '#666' }}>
                                                            <DeleteRoundedIcon style={{ color: "red" }} />
                                                        </IconButton>
                                                    }
                                                    sx={{
                                                        bgcolor: 'background.paper',
                                                        mb: 0.5,
                                                        boxShadow: 1, // Optional: adds a shadow for depth
                                                        borderRadius: '4px', // Optional: rounds the corners for a softer look
                                                    }}
                                                >
                                                    <ListItemText primary={range} sx={{ color: '#333' }} />
                                                </ListItem>
                                            ))}
                                        </List>
                                        {error && <Typography sx={{ color: 'error.main', marginBottom: '1rem' }}>{error}</Typography>}
                                        <Grid container spacing={5} style={{ marginBottom: "2rem" }}>
                                            <Grid item md={4}>
                                                <label>Min Value</label>
                                                <QuestionNameInput
                                                    placeholder="Type Min Value"
                                                    className="base-comp-question_code-input"
                                                    size="small"
                                                    sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, marginTop: "0.5rem" }}
                                                    value={minValue}
                                                    onChange={(e) => setMinValue(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item md={4}>
                                                <label>Max Value</label>
                                                <QuestionNameInput
                                                    placeholder="Type Max Value"
                                                    className="base-comp-question_code-input"
                                                    size="small"
                                                    sx={{ "& .MuiInputBase-input": { fontWeight: 400, }, marginTop: "0.5rem" }}
                                                    value={maxValue}
                                                    onChange={(e) => setMaxValue(e.target.value)}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Button variant="contained" onClick={handleAddRange} disabled={!minValue || !maxValue} >+ Range</Button>
                                        <Box style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                                            <Button variant="outlined" onClick={CloseModal}  >cancel</Button>
                                            <Button variant="contained" onClick={() => handleRangesChange(row.original.question_value, binRanges)}  >Save Ranges</Button>
                                        </Box>
                                    </Box>
                                </Dialog>
                                <Box style={{ display: "flex", gap: "1rem", alignItems: "center", width: "100%" }}>
                                    < SingleSelect
                                        size="small"
                                        sx={{ width: "80%" }}
                                        value={row.original?.bin_buckets}
                                        input={< OutlinedInput label="" />}
                                        renderValue={(selected) => selected?.slice(0, 4).join(',') + (selected?.length > 4 ? '...' : '')}
                                    >
                                        {
                                            row.original?.bin_buckets && row.original?.bin_buckets?.map((option: any) => (
                                                <MenuItem key={option} style={{ maxWidth: "calc(50vw)" }}>
                                                    {option}
                                                </MenuItem>
                                            ))
                                        }
                                        {
                                            (row.original?.bin_buckets?.length == 0 || !row.original?.bin_buckets) &&
                                            <MenuItem style={{ maxWidth: "calc(50vw)", justifyContent: "center" }}>
                                                No range added
                                            </MenuItem>
                                        }
                                    </ SingleSelect>
                                    <AddCircleIcon color="primary" onClick={() => setOpenModal(true)} />
                                </Box>
                            </>
                        }
                    </>
                );
            },
        }


    ];


    function closeMainDialog() {
        setShowDialog(false);
        setTabStatus(false)
    }
    const handleSubmit = (e: any) => {
        e.preventDefault()

        const selectedBanner = bannerList.find(banner => banner.value === risk);
        // Filter questions based on specified conditions
        const filteredQuestions = questionList.filter(question =>
            question.question_agg_label !== "All Respondents" ||
            question.reverse_scale !== false ||
            (question.exclude_pre_codes && question.exclude_pre_codes.length > 0) ||
            (question?.box_analysis && question?.box_analysis?.length > 0) ||
            (question?.bin_buckets && question?.bin_buckets?.length > 0)
            // (question?.level_id && question.level_id)
        );

        const dataToPost: postTabulationObject = {
            confidence_level: Number(selectedBanner?.confidence_level),
            name: tabulationName,
            banner_id: risk ? risk : 0,
            description: desc,
            tab_config: filteredQuestions,
            // @ts-ignore
            banner_config: bannerPayload?.length > 0 ? bannerPayload : cloneBanner,
            // banner_config: cloneBanner?.length > 0 ? cloneBanner : bannerPayload,
            object_uid: disableState ? tabulationCardData?.object_uid : nanoId,
        }
        // console.log("selectedBanner?.data_payload", JSON.stringify(selectedBanner.data_payload, null, 2), "questionList", JSON.stringify(questionList, null, 2), selectedBanner, "selectedBannerselectedBanner", questionList)
        console.log(JSON.stringify(dataToPost), "dataToPost", filteredQuestions, dataToPost, selectedBanner?.confidence_level, selectedBanner)
        if (tabulationName && risk && !disableState) {
            PostDataTabulation(dataToPost)
            setQuestionList([])
        } else if (tabulationName && risk && disableState && tabulationCardData?.object_uid) {
            PutDataTabulation(tabulationCardData?.object_uid, dataToPost)
            setQuestionList([])
        }
    }

    const handleRiskInputChange = (event: { target: { value: any; }; }) => {
        const selectedValue = event.target.value;
        setRisk(selectedValue);


    };



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


    useEffect(() => {
        const selectedBanner = bannerList.find(banner => banner.value === risk);
        setBannerUid((selectedBanner as any)?.object_uid)
    }, [risk])
    // console.log(bannerUid, "selectedBannerselectedBanner", risk, bannerList)

    useEffect(() => {
        if (questionLists) {
            // if (questionLists && !tabulationCardData?.name) {
            const transformedData = (questionLists as any).map((question: { bin_buckets: any; max_value: any; min_value: any; survey_id: any; question_value: any; question_id: any; question_text: any; question_type_id: any; answers: any[]; question_variable_code: string; question_variable_id: string; question_type_name: string; }, index: number) => ({
                question_id: question.question_id,
                question_value: question?.question_value,
                question_code: question?.question_variable_id,
                question_variable_id: question?.question_variable_id,
                question_label: question?.question_variable_id,
                question_type_name: question?.question_type_name,

                // question_code: question.question_id,
                // question_label: question.question_text,
                question_text: question.question_text,
                // add new property
                question_variable_code: question?.question_variable_code,
                question_agg_label: "All Respondents",
                question_type_id: question.question_type_id,
                question_sort_order: index + 1,
                survey_id: question?.survey_id,
                min_value: question?.min_value,
                max_value: question?.max_value,
                bin_buckets: question?.bin_buckets || [],
                // box_analysis_count: [],
                is_grouped: false,
                // new
                reverse_scale: false,
                exclude_pre_codes: '',
                box_analysis: [],
                // box_analysis_options: getScaleOptions(question?.answers?.length),
                answers: question.answers.map((answer, index) => ({
                    answer_id: answer.answer_id,
                    answer_pre_code: answer.answer_pre_code,
                    answer_text: answer.answer_text,
                    answer_label: '',
                    answer_group_text: '',
                    answer_weightage: 0,
                    answer_sort_order: index + 1,
                    // banner_id: 1,
                    // is_selected: true,
                    // grouping_details: '',
                }))
            }));

            const matchedfilter = transformedData?.filter((tQuestion: { question_variable_id: string; }) =>
                !tabulationCardData?.tab_config?.some((tabQuestion: { question_variable_id: string; }) => tabQuestion?.question_variable_id === tQuestion?.question_variable_id)
            );

            const combinedData = [...(tabulationCardData?.tab_config || []), ...matchedfilter]
            setQuestionList(combinedData)
        }
    }, [questionLists, showDialog, tabulationCardData]);



    const handleInputChangePreCodes = (questionId: number, newValue: any) => {
        setQuestionList(prevList => {
            return prevList.map(question => {
                if (question.question_value === questionId) {
                    let updatedExcludePreCodes;

                    if (Array.isArray(newValue)) {
                        // newValue is an array of all selected option values
                        updatedExcludePreCodes = newValue;
                    } else {
                        // newValue is a single value (for addition or removal)
                        const numberValue = Number(newValue);
                        if ((question as any).exclude_pre_codes.includes(numberValue)) {
                            // Remove the value if it's already in the array
                            updatedExcludePreCodes = (question as any).exclude_pre_codes.filter((item: number) => item !== numberValue);
                        } else {
                            // Add the value if it's not in the array
                            updatedExcludePreCodes = [...(question as any).exclude_pre_codes, numberValue];
                        }
                    }

                    return { ...question, exclude_pre_codes: updatedExcludePreCodes };
                }
                return question;
            });
        });
    };


    const handleInputChangeRespondents = (questionId: string | number, newValue: string) => {
        setQuestionList(prevList => {
            return prevList.map(question => {
                if (question.question_value === questionId) {
                    return { ...question, question_agg_label: newValue };
                }
                return question;
            });
        });
    };

    useEffect(() => {
        if (!tabulationCardData?.name) {
            // @ts-ignore
            setRisk(null)
        }
        setDataToTabulation([])
        setTabulationName('')
        setDesc('')
        setCloneBanner([])
        setBannerPayload([])
        setBannerUid('')
    }, [showDialog])

    useEffect(() => {
        if (tabulationCardData?.name) {
            setRisk(Number(tabulationCardData?.banner_id))
            setTabulationName(disableState ? tabulationCardData?.name : `${tabulationCardData?.name}_clone`)
            setCloneBanner(tabulationCardData?.banner_config)
            // setQuestionList(tabulationCardData?.tab_config);
        }
        if (tabulationCardData?.banner_id) {

        }

    }, [tabulationCardData]);
    console.log(questionLists, questionList, "questionListquestionList")

    // console.log(risk, questionList, questionLists, "bannerListbannerListbannerList", bannerList, nanoId, cloneBanner, tabulationCardData)

    // console.log(tabulationCardData, "tabulationCardDatatabulationCardData", cloneBanner, bannerPayload)

    return (
        <>


            <Dialog
                scroll="paper"
                onClose={closeMainDialog}
                open={showDialog}
                // maxWidth="xxl"
                PaperProps={{
                    style: {
                        width: '80%',
                        // minHeight: '50%',
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
                        {tabulationName ? tabulationName : "Create New Tabulation"}
                    </DialogTitle>
                    <Box style={{ display: "flex" }}>
                        {disableState &&
                            <FormControlLabel
                                control={<IOSSwitch size="small" sx={{ m: 1 }} checked={tabStatus} onChange={() => {
                                    ChangeStatus(!tabStatus)
                                    setTabStatus(!tabStatus)
                                }} />}
                                label={tabStatus ? 'Active' : 'Inactive'} labelPlacement="start"
                            />}
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
                                    // disabled={disableState}
                                    placeholder="Tabulation Name*"
                                    className="base-comp-question_code-input"
                                    size="small"
                                    fullWidth
                                    sx={{ "& .MuiInputBase-input": { fontWeight: 700, } }}
                                    value={tabulationName}
                                    onChange={(e) => setTabulationName(e?.target.value)}
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <Select
                                    // disabled={disableState}
                                    className="configuration-box-select"
                                    value={Number(risk)}
                                    items={bannerList}
                                    onChange={handleRiskInputChange}
                                    label="Banners"
                                    name="answer_sorting_order"
                                    isRequired={true}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: "0.5rem" }} >
                            <Grid item xs={12}>
                                <TextFieldNew
                                    // disabled={disableState}
                                    multiline
                                    rows={1}
                                    sx={{
                                        textarea: {
                                            resize: "vertical",
                                            overflow: "auto",
                                        },
                                        marginLeft: "0.1rem",
                                    }}
                                    value={desc}
                                    placeholder="Description"
                                    onChange={(e) => setDesc(e?.target.value)}
                                />
                            </Grid>
                        </Grid>
                        {/* <Box style={{ display: dataToTabulation?.length > 0 ? "none" : "none", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
                            <Button onClick={() => setSelectGrids(!selectGrids
                                // selectGrids?.box_analysis ? { box_analysis: false, exclude_pre_codes: false, reverse_scale: false } : { box_analysis: true, exclude_pre_codes: true, reverse_scale: true }
                            )}><Switch checked={selectGrids} /> Grids Only</Button>
                        </Box> */}
                        <Grid container spacing={0} style={{ display: dataToTabulation?.length > 0 ? "block" : "block" }}  >


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
                                            initialState={{
                                                density: 'compact',
                                                columnPinning: { left: ['mrt-row-actions', 'question_code', 'question_type_name'] },
                                                pagination: { pageSize: 25, pageIndex: 0 }
                                            }}
                                        // state={{ selectGrids }}
                                        // onColumnVisibilityChange={{ setSelectGrids }}
                                        // initialState={{ columnVisibility: { box_analysis: selectGrids ? true : false, exclude_pre_codes: selectGrids ? true : false, reverse_scale: selectGrids ? true : false } }}
                                        // enableRowVirtualization
                                        // rowVirtualizerInstanceRef
                                        // rowVirtualizerOptions={{ overscan: 1 }}
                                        // displayColumnDefOptions={{
                                        //     'mrt-row-actions': {
                                        //         visibleInShowHideMenu: false //hide the built-in row actions column from the show hide menu
                                        //     }
                                        // }}
                                        // enableEditing
                                        // editDisplayMode='cell'
                                        // createDisplayMode='row'

                                        />
                                    </Box>

                                </StyledContentBox>

                            </Box>
                            <Box
                                style={{
                                    width: "100%",
                                    // position: "sticky",
                                    bottom: 0,
                                    display: !tabStatus && disableState ? "none" : 'flex',
                                    justifyContent: "flex-end",
                                    padding: "8px",
                                    gap: "1rem",
                                    backgroundColor: "#FFF",
                                    // marginTop: "5rem",
                                    zIndex: 9991,
                                }}
                            >
                                <Button variant="outlined" color="primary"
                                    onClick={() => {
                                        closeMainDialog()
                                        setDataToTabulation([])
                                        setTabulationName('')
                                        setBannerPayload([])
                                        setBannerUid('')
                                        setCloneBanner([])
                                        setDesc('')
                                        // @ts-ignore
                                        setRisk(null)
                                    }}
                                    style={{ marginRight: '10px' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={(!tabulationName || !risk || questionList?.length <= 0)}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                        handleSubmit(e)
                                        closeMainDialog()
                                        setTabulationName('')
                                        setCloneBanner([])
                                        setBannerPayload([])
                                        setBannerUid('')
                                        setDesc('')
                                        // @ts-ignore
                                        setRisk(null)
                                    }}
                                >
                                    {disableState ? "Update" : 'Create'} Tabulation
                                </Button>
                            </Box>
                        </Grid>

                    </form>
                </Box>
            </Dialog >
        </>
    )
}
export default DynamicCreateTabulation;