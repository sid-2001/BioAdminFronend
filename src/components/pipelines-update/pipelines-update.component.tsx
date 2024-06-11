import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    ListItemIcon,
    MenuItem,
    MenuList,
    Typography,
} from "@mui/material";
import TextField from "../text-field";
import { SetStateAction, useEffect, useState } from "react";
import { QuestionNameInput } from "@/constants/cutom-question-name-input";
import TextFieldNew from "../text-field-new/text-field-new.component";
import { styled } from "@mui/material/styles";
import MultipleSelectCheckmarks from "../multiple-select";
// import { logger } from "@/helpers/logger";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectDataService } from "@/services/project-data.services";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { theme } from "@/constants/theme";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { enqueueSnackbar } from "notistack";
import Select from "@/components/select";
import LoadingSpinner from "../loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { logger } from "@/helpers/logger";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

interface PipelinesCreateUpdateProps {
    // PostDataTabulation: (payload: any) => Promise<void>;
    PutDataTabulation: (pipeline_id: number, payload: any) => Promise<void>;
    pipelineData: any;
    setPipelineData: React.Dispatch<any>;
    // setViewMode: React.Dispatch<React.SetStateAction<boolean>>;
    ChangeStatus: (status: boolean) => Promise<any>;
    pipelineStatus: boolean;
    setPipelineStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DataValidationConfig {
    type: string;
    type_name: string;
    order: number;
    config: {
        type: string;
        type_name: string;
        order: number;
        enabled: boolean;
        fields: {
            name: string;
            display_name: string;
            datatype: string;
            default_value: boolean;
            value: boolean;
            order: number;
        }[];
    }[];
}


const StatusIOSSwitch = styled((props: SwitchProps) => (
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


const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "300ms",
        "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
                opacity: 1,
                border: 0,
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
            },
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
            color: "#33cf4d",
            border: "6px solid #fff",
        },
        "&.Mui-disabled .MuiSwitch-thumb": {
            color:
                theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        "&.Mui-disabled + .MuiSwitch-track": {
            opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
        },
    },
    "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22,
    },
    "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
            duration: 500,
        }),
    },
}));

const PipelinesUpdateComponent: React.FC<PipelinesCreateUpdateProps> = ({
    // PostDataTabulation,
    // setViewMode,
    pipelineData,
    PutDataTabulation,
    setPipelineData,
    pipelineStatus, setPipelineStatus, ChangeStatus
}) => {
    const { projectId, surveyId } = useParams();
    const navigate = useNavigate()

    const projectDataService = new ProjectDataService();
    const [loading, setLoading] = useState(false);
    const [jobName, setJobName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedMenuItem, setSelectedMenuItem] = useState("Data_Cleaning");
    const [marketList, setMarketList] = useState<any>([]);
    const [selectedMarketIds, setSelectedMarketIds] = useState([]);

    const [selectedChartsIds, setSelectedChartsIds] = useState([]);
    //   const [formState, setFormState] = useState({});
    const [dataPreProcessingCheck, setDataPreProcessingCheck] = useState(true)

    const [filterCheck, setFilterCheck] = useState(true)

    const [chartsCheck, setChartsCheck] = useState(true);
    const [cleainingCheck, setCleaningCheck] = useState(true);
    const [validationCheck, setValidationCheck] = useState(true);
    const [tabulationCheck, setTabulationCheck] = useState(true);
    const [exportsCheck, setExportsCheck] = useState(true);
    const [insightsCheck, setInsightsCheck] = useState(true);
    const [otaCheck, setOtaCheck] = useState(true);

    const [pptCheck, setPptCheck] = useState(false);


    const [allTabulations, setAllTabulations] = useState<Array<any>>([]);
    const [risk, setRisk] = useState<number>();
    const [tabulationData, setTabulationData] = useState<any>();


    const [decimal, setDecimal] = useState<any>();
    const [minimumSampleSize, setMinimumSampleSize] = useState<any>(30);


    const [visValue, setVisValue] = useState<number | null>(null);
    const [allVisualizations, setAllVisualizations] = useState<Array<any>>([]);
    const [selectedVisData, setSelectedVisData] = useState<any>([]);

    const [runWeight, setRunWeight] = useState(false)


    console.log(allVisualizations, "allVisualizationsallVisualizations", selectedVisData, visValue)
    async function getAllVisualizationsData() {
        setLoading(true);

        try {
            const data = await projectDataService.GetAllVisualizations(Number(projectId), Number(surveyId));

            if (data) {
                if (Array.isArray(data) && data.length > 0) {
                    const serviceNames = data?.map((item) => ({
                        value: item.id,
                        text: item.name,
                        label: item.name,
                        // data_payload: item.data_payload,
                        // confidence_level: item?.confidence_level,
                        object_uid: item?.object_uid,
                        isDisabled: !item?.is_active
                    }));

                    setAllVisualizations(serviceNames);
                }
            }
        } catch (error) {
            enqueueSnackbar(
                <Typography variant="body1">Fetching requests failed</Typography>,
                {
                    variant: "error",
                }
            );
        } finally {
            setLoading(false);
        }
    }

    const decimalConfig = [
        { value: 0, text: '0', label: '0' },
        { value: 1, text: '1', label: '1' },
        { value: 2, text: '2', label: '2' },
        { value: 3, text: '3', label: '3' },
    ]
    const handleRiskInputChange = async (event: { target: { value: any } }) => {
        const selectedValue = event.target.value;

        setRisk(selectedValue);
        const selectedOption = allTabulations.find(
            (option) => option.value == selectedValue
        );
        // console.log(selectedValue, "selectedValueselectedValue", selectedOption);

        if (projectId && surveyId && selectedOption) {
            try {
                const data = await projectDataService.GetTabulationByProjectId(
                    Number(projectId),
                    Number(surveyId),
                    selectedOption.object_uid
                );

                console.log(data, "dataqwert");
                if (!data) {
                    enqueueErrorSnackbar("No tabulation found");
                    return;
                }
                if (data?.tab_config && data?.tab_config?.length > 0) {
                    // setShowDialog(true)
                    setTabulationData(data);
                } else {
                    enqueueErrorSnackbar("No configurations found");
                }
            } catch (error) {
                enqueueSnackbar(
                    <Typography variant="body1">Fetching requests failed</Typography>,
                    {
                        variant: "error",
                    }
                );
            }
        }
    };

    const initialPreProcessing = {
        type: 'DATA_PRE_PROCESSING',
        type_name: 'Data Pre-Processing',
        order: 1,
        config: [],
    };

    const [dataPreProcessing, _setDataPreProcessing] = useState<any>(initialPreProcessing)


    const initialFiltering = {
        type: 'FILTER',
        type_name: 'Data FILTER',
        order: 1,
        config: [],
    };

    const [dataFilterConfig, _setDataFilterConfig] = useState<any>(initialFiltering)


    const initialCharts = {
        type: "DATA_CHARTING",
        type_name: "Data Charting",
        order: 1,
        config: [
            {
                type: "DATA_CHARTING",
                type_name: "Data Charting",
                order: 1,
                enabled: true,
                questions: [
                    //   {
                    //     id: "AGE",
                    //     label: "What is you age ?"
                    //   },
                    //   {
                    //     id: "GENDER",
                    //     label: "What is you gender ?"
                    //   },
                ],
                fields: []
            }
        ],
        visualization_config: []
    }

    const [dataChartsConfig, setDataChartsConfig] = useState(initialCharts);
    const [questionList, setQuestionList] = useState([])
    const service = new ProjectDataService();

    // console.log(questionList, "questionListquestionList")

    async function GetProjectBannerALLQuestions() {
        setLoading(true);

        try {
            const data = await service.getProjectBannerALLQuestions(
                Number(projectId),
                Number(surveyId)
            );
            if (data?.length > 0) {
                const excludedTypes = [
                    "quantity",
                    "date",
                    "time",
                    "opentext",
                    "opentextlist",
                    "numericlist",
                ];

                // const filteredData = data.filter(item =>
                //   !excludedTypes.includes(item.question_type_name)
                // );
                // question_variable_type

                const filteredData = data.filter(
                    (item) =>
                        !excludedTypes.includes(item.question_type_name) &&
                        item.question_variable_type !== "HIDDEN"
                );

                const updatedData = filteredData.map((item, index) => ({
                    ...item,
                    question_value: index + 1,
                }));

                const chartFilterData = data.filter(
                    (item: any) =>
                        item.is_chartable_question === true && item.question_variable_type !== "HIDDEN"
                );

                const finalChartDAta = chartFilterData.map((item, index) => ({
                    ...item,
                    question_value: index + 1,
                }));

                if (finalChartDAta && finalChartDAta) {
                    const serviceNames = finalChartDAta.map(
                        // @ts-ignore
                        (item: {
                            question_value: any;
                            question_text: any;
                            question_variable_id: string;
                        }) => ({
                            value: item.question_value,
                            text: item.question_text,
                            label: item?.question_variable_id,
                        })
                    );
                    // @ts-ignore
                    setMarketList(serviceNames);
                }

                // console.log(updatedData, "updatedDataupdatedData")

                if (updatedData && updatedData) {
                    const serviceNames = updatedData.map(
                        // @ts-ignore
                        (item: {
                            question_value: any;
                            question_text: any;
                            question_variable_id: string;
                        }) => ({
                            value: item.question_value,
                            text: item.question_text,
                            label: item?.question_variable_id,
                        })
                    );
                    // @ts-ignore
                    setQuestionList(serviceNames);
                }
            }
        } catch (error) {
            enqueueSnackbar(
                <Typography variant="body1">Fetching questions failed</Typography>,
                {
                    variant: "error",
                }
            );
        } finally {
            setLoading(false);
        }
    }

    const handleDataChartsConfigChange = (configType: any, fieldName: any, newValue: any) => {
        setDataChartsConfig((prevConfig) => {
            const updatedConfig = { ...prevConfig };

            const configIndex = updatedConfig && updatedConfig.config.findIndex(
                (c) => c.type === configType
            );
            if (configIndex !== -1) {
                if (fieldName === "enabled") {
                    updatedConfig.config[configIndex].enabled = newValue;
                } else {
                    const fieldIndex = updatedConfig.config[configIndex].fields.findIndex(
                        (f: any) => f.name === fieldName
                    );
                    if (fieldIndex !== -1) {
                        // @ts-ignore
                        updatedConfig.config[configIndex].fields[fieldIndex].value =
                            newValue;
                    }
                }
            }

            return updatedConfig;
        });
    };

    const initialCleaning = {
        type: "DATA_CLEANING",
        type_name: "Data Cleaning",
        order: 1,
        config: [
            {
                type: "DATA_CLEANING_STRAIGHT_LINER",
                type_name: "Straight liner check",
                order: 1,
                enabled: true,
                fields: [
                    {
                        name: "statement_count",
                        display_name: " Minimum Statement Count",
                        datatype: "INTEGER",
                        default_value: 4,
                        value: 4,
                        order: 1,
                    },
                    {
                        name: "option_count",
                        display_name: " Minimum Options Count",
                        datatype: "INTEGER",
                        default_value: 5,
                        value: 5,
                        order: 2,
                    },
                    {
                        name: "threashold",
                        display_name: "Threashold",
                        datatype: "DECIMAL",
                        default_value: 0.5,
                        value: 0.5,
                        order: 3,
                    },
                ],
                questions: [],
                // selectedQuestions.map(q => ({ id: q.id, label: q.label })).
            },
            {
                type: "DATA_CLEANING_SPEEDER",
                type_name: "Speeder check",
                order: 2,
                enabled: true,
                fields: [
                    {
                        name: "loi",
                        display_name: "LOI %",
                        datatype: "DECIMAL",
                        default_value: 0.33,
                        value: 0.33,
                        order: 1,
                    },
                ],
            },
            {
                type: 'DATA_CLEANING_IP_DUP_CHECK',
                order: 3,
                enabled: true,
                type_name: 'IP Dup Check',
                fields: [],
            },
            {
                type: 'DATA_CLEANING_OPEN_TEXT_DUP_CHECK',
                order: 4,
                enabled: true,
                type_name: 'Open text Dup Check',
                fields: [],
            },
        ],
    }

    const [dataCleaningConfig, setDataCleaningConfig] = useState(initialCleaning);

    // const handleDataCleaningConfigChange = (configType: string, field: string, value: any) => {
    //     setDataCleaningConfig(prevConfig => {
    //         return {
    //             ...prevConfig,
    //             config: prevConfig.config.map(configItem => {
    //                 if (configItem.type === configType) {
    //                     return {
    //                         ...configItem,
    //                         [field]: value,
    //                         fields: configItem.fields.map(fieldItem => {
    //                             if (fieldItem.name === field) {
    //                                 return { ...fieldItem, value };
    //                             }
    //                             return fieldItem;
    //                         }),
    //                     };
    //                 }
    //                 return configItem;
    //             }),
    //         };
    //     });
    // };

    const handleDataCleaningConfigChange = (configType: any, fieldName: any, newValue: any) => {

        if (newValue < 0) {
            newValue = 0;
        }
        setDataCleaningConfig((prevConfig) => {
            const updatedConfig = { ...prevConfig };

            const configIndex = updatedConfig && updatedConfig.config.findIndex(
                (c) => c.type === configType
            );
            if (configIndex !== -1) {
                if (fieldName === "enabled") {
                    updatedConfig.config[configIndex].enabled = newValue;
                } else {
                    const fieldIndex = updatedConfig.config[configIndex].fields.findIndex(
                        (f) => f.name === fieldName
                    );
                    if (fieldIndex !== -1) {
                        updatedConfig.config[configIndex].fields[fieldIndex].value =
                            newValue;
                    }
                }
            }

            return updatedConfig;
        });
    };

    const initialValidation = {
        type: "DATA_VALIDATION",
        type_name: "Data Validation",
        order: 2,
        config: [
            {
                type: "DATA_VALIDATION_CONDITION_CHECK",
                type_name: "Validate programming conditions",
                order: 1,
                enabled: true,
                fields: [
                    {
                        name: "condition_check",
                        display_name: "Check programming conditions",
                        datatype: "BOOLEAN",
                        default_value: true,
                        value: true,
                        order: 1,
                    },
                    {
                        name: "datavalidation_check",
                        display_name: "Run data validation",
                        datatype: "BOOLEAN",
                        default_value: true,
                        value: true,
                        order: 2,
                    },
                ],
            },
        ],
    }

    const [dataValidationConfig, setDataValidationConfig] =
        useState<DataValidationConfig>(initialValidation);

    // const handleDataValidationConfigChange = (field: string, value: boolean) => {
    //     setDataValidationConfig(prevConfig => {
    //         return {
    //             ...prevConfig,
    //             config: prevConfig.config.map(configItem => {
    //                 if (configItem.type === "DATA_VALIDATION_CONDITION_CHECK") {
    //                     return {
    //                         ...configItem,
    //                         fields: configItem.fields.map(fieldItem => {
    //                             if (fieldItem.name === field) {
    //                                 return { ...fieldItem, value: value };
    //                             }
    //                             return fieldItem;
    //                         })
    //                     };
    //                 }
    //                 return configItem;
    //             })
    //         };
    //     });
    // };

    const handleDataValidationEnabledChange = (enabled: boolean) => {
        setDataValidationConfig((prevConfig) => ({
            ...prevConfig,
            config: prevConfig && prevConfig.config.map((configItem) => {
                if (configItem.type === "DATA_VALIDATION_CONDITION_CHECK") {
                    return { ...configItem, enabled };
                }
                return configItem;
            }),
        }));
    };

    const handleDataValidationFieldChange = (
        fieldName: string,
        value: boolean
    ) => {
        setDataValidationConfig((prevConfig) => ({
            ...prevConfig,
            config: prevConfig && prevConfig.config.map((configItem) => {
                if (configItem.type === "DATA_VALIDATION_CONDITION_CHECK") {
                    return {
                        ...configItem,
                        fields: configItem.fields.map((fieldItem) => {
                            if (fieldItem.name === fieldName) {
                                return { ...fieldItem, value };
                            }
                            return fieldItem;
                        }),
                    };
                }
                return configItem;
            }),
        }));
    };

    const initialExport = {
        type: "DATA_PROCESSING_OUTPUTS",
        type_name: "Required outputs",
        order: 3,
        config: [
            {
                type: "DATA_OUTPUT_FILE",
                type_name: "Output Files ",
                order: 1,
                enabled: true,
                fields: [
                    {
                        name: "fixed_width_file_output",
                        display_name: "Fixed width file",
                        datatype: "BOOLEAN",
                        default_value: true,
                        value: true,
                        order: 1,
                    },
                    {
                        name: "spss_file_output",
                        display_name: "SPSS file",
                        datatype: "BOOLEAN",
                        default_value: true,
                        value: true,
                        order: 2,
                    },
                    {
                        name: "sav_file_output",
                        display_name: "SAV file",
                        datatype: "BOOLEAN",
                        default_value: true,
                        value: true,
                        order: 3,
                    },
                    {
                        name: "script_file_output",
                        display_name: "Script files",
                        datatype: "BOOLEAN",
                        default_value: true,
                        value: true,
                        order: 4,
                    },
                ],
            },
        ],
    }

    const [dataExportConfig, setDataExportConfig] =
        useState<DataValidationConfig>(initialExport);

    const handleDATAEXPORTSEnabledChange = (enabled: boolean) => {
        setDataExportConfig((prevConfig) => ({
            ...prevConfig,
            config: prevConfig.config.map((configItem) => {
                if (configItem.type === "DATA_OUTPUT_FILE") {
                    return { ...configItem, enabled };
                }
                return configItem;
            }),
        }));
    };

    const handleDATAEXPORTSFieldChange = (fieldName: string, value: boolean) => {
        setDataExportConfig((prevConfig) => ({
            ...prevConfig,
            config: prevConfig.config.map((configItem) => {
                if (configItem.type === "DATA_OUTPUT_FILE") {
                    return {
                        ...configItem,
                        fields: configItem.fields.map((fieldItem) => {
                            if (fieldItem.name === fieldName) {
                                return { ...fieldItem, value };
                            }
                            return fieldItem;
                        }),
                    };
                }
                return configItem;
            }),
        }));
    };

    // const handleDataCleaningConfigChange = (configType, field, value) => {
    //     setDataCleaningConfig(prevConfig => ({
    //         ...prevConfig,
    //         [configType]: {
    //             ...prevConfig[configType],
    //             [field]: value,
    //         },
    //     }));
    // };


    const initialInsights = {
        type: "DATA_INSIGHTS",
        type_name: "Data Insights",
        order: 2,
        config: [
            {
                type: "DATA_INSIGHTS_CHECK",
                type_name: "Run Insights",
                order: 1,
                enabled: true,
                fields: [],
            },
        ],
        visualization_config: []
    }

    const [dataInsightsConfig, setDataInsightsConfig] =
        useState<DataValidationConfig>(initialInsights);


    const handleDataInsightsEnabledChange = (enabled: boolean) => {
        setDataInsightsConfig((prevConfig) => ({
            ...prevConfig,
            config: prevConfig && prevConfig.config.map((configItem) => {
                if (configItem.type === "DATA_INSIGHTS_CHECK") {
                    return { ...configItem, enabled };
                }
                return configItem;
            }),
        }));
    };


    const initialOta = {
        type: "DATA_OTA",
        type_name: "Data OTA",
        order: 2,
        config: [
            {
                type: "DATA_OTA_CHECK",
                type_name: "Run Open Text Analysis",
                order: 1,
                enabled: true,
                fields: [],
            },
        ],
    }

    const [dataOtaConfig, setDataOtaConfig] =
        useState<DataValidationConfig>(initialOta);


    const handleDataOtaEnabledChange = (enabled: boolean) => {
        setDataOtaConfig((prevConfig) => ({
            ...prevConfig,
            config: prevConfig && prevConfig.config.map((configItem) => {
                if (configItem.type === "DATA_OTA_CHECK") {
                    return { ...configItem, enabled };
                }
                return configItem;
            }),
        }));
    };



    const initialPPT = {
        type: "PPT_GEN",
        type_name: "Data PPT",
        order: 2,
        config: [
            // {
            //   type: "DATA_PPT_CHECK",
            //   type_name: "Run PPT",
            //   order: 1,
            //   enabled: false,
            //   fields: [],
            // },
        ],
        visualization_config: []
    };



    const handleVisualizationsInputChange = async (event: { target: { value: any } }) => {
        const selectedValue = event.target.value;

        setVisValue(selectedValue);
        // const selectedOption = allTabulations.find(
        //   (option) => option.value == selectedValue
        // );
        // console.log(selectedValue, "selectedValueselectedValue", selectedOption);

        if (projectId && surveyId && selectedValue) {
            try {
                const data = await projectDataService.GetVisualizationById(
                    Number(projectId),
                    Number(surveyId),
                    selectedValue
                );

                // console.log(data, "dataqwert");
                if (!data) {
                    enqueueErrorSnackbar("No tabulation found");
                    return;
                }
                // if (data?.tab_config && data?.tab_config?.length > 0) {
                // setShowDialog(true)
                setSelectedVisData(data.question_config);

                setDataPPTConfig((pre) => ({
                    ...pre,
                    visualization_config: data.question_config || []
                }))

                setDataInsightsConfig((pre) => ({
                    ...pre,
                    visualization_config: data.question_config || []
                }))
                setDataChartsConfig((pre) => ({
                    ...pre,
                    visualization_config: data?.question_config || []
                }))
                // } else {
                // enqueueErrorSnackbar("No configurations found");
                // }
            } catch (error) {
                enqueueSnackbar(
                    <Typography variant="body1">Fetching requests failed</Typography>,
                    {
                        variant: "error",
                    }
                );
            }
        }
    };



    const handleVisualizationsByUser = async () => {
        const selectedValue = visValue

        // setVisValue(selectedValue);
        // const selectedOption = allTabulations.find(
        //   (option) => option.value == selectedValue
        // );
        // console.log(selectedValue, "selectedValueselectedValue", selectedOption);
        setLoading(true)
        if (projectId && surveyId && selectedValue) {
            try {
                const data = await projectDataService.GetVisualizationById(
                    Number(projectId),
                    Number(surveyId),
                    selectedValue
                );

                // console.log(data, "dataqwert");
                if (!data) {
                    enqueueErrorSnackbar("No tabulation found");
                    return;
                }
                // if (data?.tab_config && data?.tab_config?.length > 0) {
                // setShowDialog(true)
                setSelectedVisData(data.question_config);

                setDataPPTConfig((pre) => ({
                    ...pre,
                    visualization_config: data.question_config || []
                }))

                setDataInsightsConfig((pre) => ({
                    ...pre,
                    visualization_config: data.question_config || []
                }))
                setDataChartsConfig((pre) => ({
                    ...pre,
                    visualization_config: data?.question_config || []
                }))
                // } else {
                // enqueueErrorSnackbar("No configurations found");
                // }
            } catch (error) {
                enqueueSnackbar(
                    <Typography variant="body1">Fetching requests failed</Typography>,
                    {
                        variant: "error",
                    }
                );
            }
        }
        setLoading(false)
    };


    const [dataPPTConfig, setDataPPTConfig] =
        useState<DataValidationConfig>(initialPPT);

    // const handleDataPPTEnabledChange = (enabled: boolean) => {
    //     setDataPPTConfig((prevConfig) => ({
    //         ...prevConfig,
    //         config:
    //             prevConfig &&
    //             prevConfig.config.map((configItem) => {
    //                 if (configItem.type === "DATA_PPT_CHECK") {
    //                     return { ...configItem, enabled };
    //                 }
    //                 return configItem;
    //             }),
    //     }));
    // };


    // console.log(dataInsightsConfig, "dataInsightsConfigdataInsightsConfigdataInsightsConfig", dataOtaConfig)



    const handleMenuItemClick = (menuItem: SetStateAction<string>) => {
        setSelectedMenuItem(menuItem);
    };

    const CustomFormControlLabel = styled(FormControlLabel)({
        "& .MuiFormControlLabel-label": {
            fontSize: "1rem",
            fontWeight: "bold",
        },
    });

    // const GetAllDataJobQuestionsList = async () => {
    //     setLoading(true);
    //     try {
    //         const data = await projectDataService.GetAllDataJobQuestions(
    //             Number(projectId)
    //         );
    //         console.log(data, "datadata");
    //         if (data && data) {
    //             const serviceNames = data.map(
    //                 (item: { id: any; name: any; question_code: string }) => ({
    //                     value: item.id,
    //                     text: item.name,
    //                     label: item?.question_code,
    //                 })
    //             );
    //             setMarketList(serviceNames);
    //             // Set all market IDs as default selected values
    //             // const allMarketIds = serviceNames.map((item: any) => item.value);
    //             // if (!pipelineData?.pipeline_name) {
    //             //     setSelectedMarketIds(allMarketIds);
    //             // }
    //         }
    //     } catch (error) {
    //         logger.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    async function getAllTabulationData() {
        setLoading(true);

        try {
            const data = await projectDataService.GetAllTabulation(Number(projectId), Number(surveyId));

            if (data) {
                if (Array.isArray(data) && data.length > 0) {
                    const serviceNames = data?.map((item) => ({
                        value: item.id,
                        text: item.name,
                        label: item.name,
                        // data_payload: item.data_payload,
                        // confidence_level: item?.confidence_level,
                        object_uid: item?.object_uid,
                        isDisabled: !item?.is_active
                    }));

                    setAllTabulations(serviceNames);
                }
            }
            // setAllTabulations(data);
        } catch (error) {
            logger.error(error)
            enqueueSnackbar(
                <Typography variant="body1">Fetching requests failed</Typography>,
                {
                    variant: "error",
                }
            );
        } finally {
            setLoading(false);
        }
    }

    function enqueueErrorSnackbar(message: string) {
        enqueueSnackbar(<Typography variant="body1">{message}</Typography>, {
            variant: "error",
        });
    }

    const handleChange = (selected: any) => {
        // Update the local state with the selected market IDs
        const selectedIds = selected.map((item: any) => Number(item.value));
        setSelectedMarketIds(selectedIds);
    };

    const handleChartsChange = (selected: any) => {
        // Update the local state with the selected market IDs
        const selectedIds = selected.map((item: any) => Number(item.value));
        setSelectedChartsIds(selectedIds);
    };

    const mapSelectedMarketIdsToQuestions = () => {
        return selectedMarketIds.map((id) => {
            const foundItem = marketList.find((item: any) => item.value === id);
            return {
                id: String(foundItem?.label),
                label: String(foundItem?.text),
                value: foundItem?.value
            };
        });
    };

    const mapSelectedChartsIdsToQuestions = () => {
        return selectedChartsIds.map((id) => {
            const foundItem: any = questionList.find((item: any) => item.value === id);
            return {
                id: String(foundItem?.label),
                label: String(foundItem?.text),
                value: foundItem?.value
            };
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const configPayload = [];

        if (dataPreProcessing) {
            configPayload.push({
                job_type_id: 13,
                config_payload: dataPreProcessing,
                job_name: 'Data Pre-Processing',
                is_Active: dataPreProcessingCheck,
            })
        }

        if (dataFilterConfig) {
            configPayload.push({
                job_type_id: 10,
                config_payload: dataFilterConfig,
                job_name: 'Data FILTER',
                is_Active: filterCheck,
            })
        }

        if (dataCleaningConfig) {
            (dataCleaningConfig as any).config[0].questions = mapSelectedMarketIdsToQuestions()
            configPayload.push({
                job_type_id: 2,
                config_payload: dataCleaningConfig,
                job_name: "Data Cleaning",
                is_Active: cleainingCheck,
            });
        }

        if (dataValidationConfig) {
            configPayload.push({
                job_type_id: 3,
                config_payload: dataValidationConfig,
                job_name: "Data Validation",
                is_Active: validationCheck,
            });
        }


        if (tabulationData) {
            configPayload.push({
                job_type_id: 4,
                config_payload: {
                    banner_config: tabulationData?.banner_config,
                    tab_config: tabulationData?.tab_config,
                    id: tabulationData?.id,
                    confidence_level: tabulationData?.confidence_level,
                    banner_id: tabulationData?.banner_id,
                    min_sample_size: minimumSampleSize,
                    decimal_config: decimal,
                    run_weighted: runWeight,
                    // fields: [
                    //     {
                    //         name: "min_sample_size",
                    //         display_name: "Minimum Sample Size",
                    //         datatype: "INTEGER",
                    //         default_value: 30,
                    //         value: Number(minimumSampleSize),
                    //         order: 1,
                    //     },
                    //     {
                    //         name: "decimal_config",
                    //         display_name: "Decimal Configurations",
                    //         datatype: "INTEGER",
                    //         default_value: 1,
                    //         value: decimal,
                    //         order: 1,
                    //     }]
                },
                job_name: "Data Tabulation",
                is_Active: tabulationCheck,
            });
        }

        if (dataExportConfig) {
            configPayload.push({
                job_type_id: 5,
                config_payload: dataExportConfig,
                job_name: "Data File Exports",
                is_Active: exportsCheck,
            });
        }

        if (dataInsightsConfig) {
            configPayload.push({
                job_type_id: 9,
                config_payload: dataInsightsConfig,
                job_name: "Data Insights",
                is_Active: insightsCheck,
            });
        }

        if (dataChartsConfig) {
            (dataChartsConfig as any).config[0].questions = mapSelectedChartsIdsToQuestions()
            configPayload.push({
                job_type_id: 6,
                config_payload: dataChartsConfig,
                job_name: "Data Charts",
                is_Active: chartsCheck,
            });
        }

        if (dataOtaConfig) {
            configPayload.push({
                job_type_id: 7,
                config_payload: dataOtaConfig,
                job_name: "Data OTA",
                is_Active: otaCheck,
            });
        }

        if (dataPPTConfig) {
            configPayload.push({
                job_type_id: 12,
                config_payload: dataPPTConfig,
                job_name: "Data PPT",
                is_Active: pptCheck,
            });
        }


        const finalPayload = {
            pipeline_name: jobName,
            description: description,
            config_payload: configPayload,
        };
        if (pipelineData?.id) {
            PutDataTabulation(pipelineData?.id, finalPayload)
            emptyStates()
            navigate(`/projects/${projectId}/survey/${surveyId}/data/pipelines`)
        }
        // else {
        //     PostDataTabulation(finalPayload);
        //     emptyStates()
        // }

        // PutDataTabulation()

        console.log("Final Payload to Post:", finalPayload);
    };

    const emptyStates = () => {
        setPipelineData([])
        setJobName('')
        setDescription('')
        setDataChartsConfig(initialCharts)
        setDataCleaningConfig(initialCleaning)
        setDataValidationConfig(initialValidation)
        setTabulationData({})
        setDataExportConfig(initialExport)
        setDataInsightsConfig(initialInsights)
        setDataOtaConfig(initialOta)
        setDataPPTConfig(initialPPT)
        setCleaningCheck(false)
        setValidationCheck(false)
        setTabulationCheck(false)
        setExportsCheck(false)
        setChartsCheck(false)
        setOtaCheck(false)
        setPptCheck(false)
        setInsightsCheck(false)
        // @ts-ignore
        setRisk()
        setSelectedMarketIds([])
        setSelectedChartsIds([])
        setDecimal(null)
        setMinimumSampleSize(30)
    }

    useEffect(() => {
        // GetAllDataJobQuestionsList();
        // getAllTabulationData();
        if (projectId && surveyId) {
            getAllTabulationData();
            GetProjectBannerALLQuestions()
        }
    }, [projectId, surveyId]);

    useEffect(() => {
        if (pipelineData?.id) {
            setJobName(pipelineData?.pipeline_name)
            setDescription(pipelineData?.description)
            const dataProcessingData = pipelineData?.config_payload?.filter((item: { job_type_id: number; }) => item?.job_type_id == 13)

            const filteringData = pipelineData?.config_payload?.filter((item: { job_type_id: number; }) => item?.job_type_id == 10)
            const cleainingData = pipelineData?.config_payload?.filter((item: { job_type_id: number; }) => item?.job_type_id == 2)
            const validationdata = pipelineData?.config_payload?.filter((item: { job_type_id: number; }) => item?.job_type_id == 3)
            const tabulationData = pipelineData?.config_payload?.filter((item: { job_type_id: number; }) => item?.job_type_id == 4)
            const exportData = pipelineData?.config_payload?.filter((item: { job_type_id: number; }) => item?.job_type_id == 5)
            const chartingData = pipelineData?.config_payload?.filter((item: { job_type_id: number; }) => item?.job_type_id == 6)
            const insightsData = pipelineData?.config_payload?.filter((item: { job_type_id: number; }) => item?.job_type_id == 9)
            const otaData = pipelineData?.config_payload?.filter((item: { job_type_id: number; }) => item?.job_type_id == 7)

            const pptData = pipelineData?.config_payload?.filter((item: { job_type_id: number; }) => item?.job_type_id == 12)
            // console.log(chartingData, cleainingData, 'cleainingDatacleainingData', insightsData, pptData)
            setDataChartsConfig(chartingData[0]?.config_payload)
            setDataCleaningConfig(cleainingData[0]?.config_payload)
            setDataValidationConfig(validationdata[0]?.config_payload)
            setTabulationData(tabulationData[0]?.config_payload)
            setDataExportConfig(exportData[0]?.config_payload)
            setDataInsightsConfig(insightsData[0]?.config_payload)
            setDataOtaConfig(otaData[0]?.config_payload)

            setDataPPTConfig(pptData[0]?.config_payload)


            setDataPreProcessingCheck(dataProcessingData[0]?.is_Active)

            setFilterCheck(filteringData[0]?.is_Active)

            setCleaningCheck(cleainingData[0]?.is_Active)
            setValidationCheck(validationdata[0]?.is_Active)
            setTabulationCheck(tabulationData[0]?.is_Active)
            setExportsCheck(exportData[0]?.is_Active)
            setChartsCheck(chartingData[0]?.is_Active)
            setInsightsCheck(insightsData[0]?.is_Active)
            setOtaCheck(otaData[0]?.is_Active)
            setPptCheck(pptData[0]?.is_Active)
            setRisk(tabulationData[0]?.config_payload?.id)

            setDecimal(tabulationData[0]?.config_payload?.decimal_config)
            setMinimumSampleSize(tabulationData[0]?.config_payload?.min_sample_size)
            setRunWeight(tabulationData[0]?.config_payload?.run_weighted)

            setSelectedVisData(pptData[0]?.config_payload?.visualization_config || [])

            setVisValue(pptData[0]?.config_payload?.visualization_config && pptData[0]?.config_payload?.visualization_config[0] && pptData[0]?.config_payload?.visualization_config[0]?.data_visualization_id || null)

            // setDataPPTConfig((pre) => ({
            //     ...pre,
            //     visualization_config: pptData[0]?.config_payload?.visualization_config || []
            // }))

            // setDataInsightsConfig((pre) => ({
            //     ...pre,
            //     visualization_config: insightsData[0]?.config_payload?.visualization_config || []
            // }))

        }
    }, [pipelineData])

    useEffect(() => {
        const selectedQuestion = (dataCleaningConfig as any)?.config[0]?.questions?.map((item: any) => item.value);
        if (selectedQuestion) {
            setSelectedMarketIds(selectedQuestion)
        }
    }, [dataCleaningConfig])

    useEffect(() => {
        const selectedQuestion = (dataChartsConfig as any)?.config[0]?.questions?.map((item: any) => item.value);
        if (selectedQuestion) {
            setSelectedChartsIds(selectedQuestion)
        }
    }, [dataChartsConfig])

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === '-') {
            e.preventDefault();
        }
    };

    const handleKeyPressDot = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === '-' || e.key === '.') {
            e.preventDefault();
        }
    };

    useEffect(() => {
        getAllVisualizationsData()
    }, [])

    console.log(dataInsightsConfig, dataPPTConfig, "insightsDatainsightsData", visValue)

    console.log(runWeight, "runWeightrunWeightrunWeight")

    return (
        <>
            {loading ? <LoadingSpinner /> : ""}
            <Box
                sx={{ flex: "1", overflow: "scroll" }}
                style={{
                    background: "white",
                    borderRadius: "12px",
                    height: "calc(100vh - 273px)",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        marginBottom: "0.5rem",
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        padding: "0.5rem 2.5rem 0rem 1rem",
                        justifyContent: "space-between"
                    }}
                >
                    <Box style={{ display: "flex", gap: "1rem", alignItems: "center", }}>
                        <IconButton
                            sx={{
                                paddingLeft: "0",
                            }}
                            onClick={() => {
                                navigate(`/projects/${projectId}/survey/${surveyId}/data/pipelines`)
                            }}
                        >
                            <ArrowBackIcon width={16} height={16} />
                        </IconButton>
                        <Typography variant="h6">
                            {pipelineData?.pipeline_name}
                        </Typography>
                    </Box>
                    <Box style={{ display: "flex", gap: "1rem", alignItems: "center", }}>
                        <Button style={{ color: '#8E27D7' }} onClick={() => handleVisualizationsByUser()}>
                            <RotateLeftIcon style={{ marginRight: "1rem" }} />Update Configuration
                        </Button>
                        <FormControlLabel
                            control={<StatusIOSSwitch size="small" sx={{ m: 1 }} checked={pipelineStatus} onChange={() => {
                                if (!pipelineStatus) {
                                    ChangeStatus(!pipelineStatus)
                                    setPipelineStatus(!pipelineStatus)
                                } else {
                                    ChangeStatus(!pipelineStatus)
                                    setPipelineStatus(!pipelineStatus)
                                    navigate(`/projects/${projectId}/survey/${surveyId}/data/pipelines`)
                                }
                            }} />}
                            label={pipelineStatus ? 'Active' : 'Inactive'} labelPlacement="start"
                        />
                    </Box>

                </Box>
                <Box style={{ padding: "0rem 2rem 2rem 2rem" }}>
                    <Box style={{ padding: "1rem 0rem 2rem 0rem" }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={4.5}>
                                    <QuestionNameInput
                                        // disabled={disableState}
                                        placeholder="Pipeline Name*"
                                        className="base-comp-question_code-input"
                                        size="small"
                                        fullWidth
                                        sx={{ "& .MuiInputBase-input": { fontWeight: 700 } }}
                                        value={jobName}
                                        onChange={(e) => setJobName(e?.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={7.5}  >
                                    <Box
                                        style={{
                                            display: pipelineStatus ? "flex" : 'none',
                                            justifyContent: "flex-end",
                                            gap: "1rem",
                                        }}
                                    >
                                        <Button
                                            onClick={() => {
                                                // setViewMode(false);
                                                navigate(`/projects/${projectId}/survey/${surveyId}/data/pipelines`)
                                                emptyStates()
                                                // EmptyStates()
                                                // closeDialog()
                                            }}
                                            variant="outlined"
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="contained" disabled={
                                            !jobName ||
                                            (tabulationCheck && (
                                                !tabulationData ||
                                                tabulationData?.banner_config?.length <= 0 ||
                                                (!decimal && decimal !== 0) ||
                                                !minimumSampleSize
                                            )) ||
                                            (pptCheck && (
                                                !dataPPTConfig ||
                                                !(dataPPTConfig as any)?.visualization_config ||
                                                (dataPPTConfig as any)?.visualization_config?.length <= 0
                                            ))
                                        }>
                                            Submit
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} style={{ marginTop: "0.5rem" }}>
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
                                        value={description}
                                        placeholder="Description"
                                        onChange={(e) => setDescription(e?.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                style={{ marginTop: "1rem", height: "100%", gap: "1rem" }}
                            >
                                <Grid
                                    item
                                    xs={3.8}
                                    style={
                                        {
                                            // height: "calc(100vh - 500px)",
                                        }
                                    }
                                >
                                    {/* <Paper style={{ border: "0px !important" }}> */}
                                    <MenuList>

                                        <MenuItem
                                            style={{
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                backgroundColor: selectedMenuItem === 'DATA_PRE_PROCESSING' ? `${theme.palette.grey[200]}` : 'inherit',
                                            }}
                                            onClick={() => handleMenuItemClick('DATA_PRE_PROCESSING')}
                                        >
                                            <ListItemIcon>
                                                <FormControlLabel
                                                    control={<IOSSwitch sx={{ m: 1 }} checked={dataPreProcessingCheck} onChange={() => setDataPreProcessingCheck(!dataPreProcessingCheck)} />}
                                                    label=""
                                                />
                                            </ListItemIcon>
                                            Data Pre-Processing
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    width: '100%',
                                                }}
                                            >
                                                <SettingsOutlinedIcon
                                                    color="primary"
                                                    style={{
                                                        // opacity: dataCleaningConfig?.config?.length > 0 ? 1 : 0.3,
                                                    }}
                                                />
                                            </div>
                                        </MenuItem>

                                        <MenuItem
                                            style={{
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                backgroundColor: selectedMenuItem === 'FILTER' ? `${theme.palette.grey[200]}` : 'inherit',
                                            }}
                                            onClick={() => handleMenuItemClick('FILTER')}
                                        >
                                            <ListItemIcon>
                                                <FormControlLabel
                                                    control={<IOSSwitch sx={{ m: 1 }} checked={filterCheck} onChange={() => setFilterCheck(!filterCheck)} />}
                                                    label=""
                                                />
                                            </ListItemIcon>
                                            Data FILTER
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    width: '100%',
                                                }}
                                            >
                                                <SettingsOutlinedIcon
                                                    color="primary"
                                                    style={{
                                                        // opacity: dataCleaningConfig?.config?.length > 0 ? 1 : 0.3,
                                                    }}
                                                />
                                            </div>
                                        </MenuItem>

                                        <MenuItem
                                            style={{
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                backgroundColor:
                                                    selectedMenuItem === "Data_Cleaning"
                                                        ? `${theme.palette.grey[200]}`
                                                        : "inherit",
                                            }}
                                            onClick={() => handleMenuItemClick("Data_Cleaning")}
                                        >
                                            <ListItemIcon>
                                                <FormControlLabel
                                                    control={
                                                        <IOSSwitch
                                                            sx={{ m: 1 }}
                                                            checked={cleainingCheck}
                                                            onChange={() => setCleaningCheck(!cleainingCheck)}
                                                        />
                                                    }
                                                    label=""
                                                />
                                            </ListItemIcon>
                                            Data Cleaning
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    width: "100%",
                                                }}
                                            >
                                                <SettingsOutlinedIcon
                                                    color="primary"
                                                    style={{
                                                        opacity:
                                                            dataCleaningConfig?.config?.length > 0 ? 1 : 0.3,
                                                    }}

                                                />
                                            </div>
                                        </MenuItem>
                                        <MenuItem
                                            style={{
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                backgroundColor:
                                                    selectedMenuItem === "Data_Validation"
                                                        ? `${theme.palette.grey[200]}`
                                                        : "inherit",
                                            }}
                                            onClick={() => handleMenuItemClick("Data_Validation")}
                                        >
                                            <ListItemIcon>
                                                <FormControlLabel
                                                    control={
                                                        <IOSSwitch
                                                            sx={{ m: 1 }}
                                                            onChange={() =>
                                                                setValidationCheck(!validationCheck)
                                                            }
                                                            checked={validationCheck}
                                                        />
                                                    }
                                                    label=""
                                                />
                                            </ListItemIcon>
                                            Data Validation
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    width: "100%",
                                                }}
                                            >
                                                <SettingsOutlinedIcon
                                                    color="primary"
                                                    style={{
                                                        opacity:
                                                            dataValidationConfig?.config?.length > 0 ? 1 : 0.3,
                                                    }}

                                                />
                                            </div>
                                        </MenuItem>
                                        <MenuItem
                                            style={{
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                backgroundColor:
                                                    selectedMenuItem === "Data_Tabulation"
                                                        ? `${theme.palette.grey[200]}`
                                                        : "inherit",
                                            }}
                                            onClick={() => handleMenuItemClick("Data_Tabulation")}
                                        >
                                            <ListItemIcon>
                                                <FormControlLabel
                                                    control={
                                                        <IOSSwitch
                                                            sx={{ m: 1 }}
                                                            onChange={() =>
                                                                setTabulationCheck(!tabulationCheck)
                                                            }
                                                            checked={tabulationCheck}
                                                        />
                                                    }
                                                    label=""
                                                />
                                            </ListItemIcon>
                                            Data Tabulation
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    width: "100%",
                                                }}
                                            >
                                                <SettingsOutlinedIcon
                                                    color="primary"
                                                    style={{
                                                        opacity:
                                                            tabulationData?.banner_config?.length > 0 && (decimal || decimal == 0) && minimumSampleSize ? 1 : 0.3,
                                                    }}

                                                />
                                            </div>
                                        </MenuItem>
                                        <MenuItem
                                            style={{
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                backgroundColor:
                                                    selectedMenuItem === "Exports"
                                                        ? `${theme.palette.grey[200]}`
                                                        : "inherit",
                                            }}
                                            onClick={() => handleMenuItemClick("Exports")}
                                        >
                                            <ListItemIcon>
                                                <FormControlLabel
                                                    control={
                                                        <IOSSwitch
                                                            sx={{ m: 1 }}
                                                            onChange={() => setExportsCheck(!exportsCheck)}
                                                            checked={exportsCheck}
                                                        />
                                                    }
                                                    label=""
                                                />
                                            </ListItemIcon>
                                            Exports
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    width: "100%",
                                                }}
                                            >
                                                <SettingsOutlinedIcon
                                                    color="primary"
                                                    style={{
                                                        opacity:
                                                            dataExportConfig?.config?.length > 0 ? 1 : 0.3,
                                                    }}

                                                />
                                            </div>
                                        </MenuItem>

                                        <MenuItem
                                            style={{
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                backgroundColor:
                                                    selectedMenuItem === "Data_Insights"
                                                        ? `${theme.palette.grey[200]}`
                                                        : "inherit",
                                            }}
                                            onClick={() => handleMenuItemClick("Data_Insights")}
                                        >
                                            <ListItemIcon>
                                                <FormControlLabel
                                                    control={
                                                        <IOSSwitch
                                                            sx={{ m: 1 }}
                                                            onChange={() =>
                                                                setInsightsCheck(!insightsCheck)
                                                            }
                                                            checked={insightsCheck}
                                                        />
                                                    }
                                                    label=""
                                                />
                                            </ListItemIcon>
                                            Data Insights
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    width: "100%",
                                                }}
                                            >
                                                <SettingsOutlinedIcon color="primary" />
                                            </div>
                                        </MenuItem>
                                        <MenuItem
                                            style={{
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                backgroundColor:
                                                    selectedMenuItem === "DATA_CHARTING"
                                                        ? `${theme.palette.grey[200]}`
                                                        : "inherit",
                                            }}
                                            onClick={() => handleMenuItemClick("DATA_CHARTING")}
                                        >
                                            <ListItemIcon>
                                                <FormControlLabel
                                                    control={
                                                        <IOSSwitch
                                                            sx={{ m: 1 }}
                                                            checked={chartsCheck}
                                                            onChange={() => setChartsCheck(!chartsCheck)}
                                                        />
                                                    }
                                                    label=""
                                                />
                                            </ListItemIcon>
                                            Data Charts
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    width: "100%",
                                                }}
                                            >
                                                <SettingsOutlinedIcon
                                                    color="primary"
                                                    style={{
                                                        opacity:
                                                            dataChartsConfig?.config?.length > 0 ? 1 : 0.3,
                                                    }}

                                                />
                                            </div>
                                        </MenuItem>
                                        <MenuItem
                                            style={{
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                backgroundColor:
                                                    selectedMenuItem === "Data_OTA"
                                                        ? `${theme.palette.grey[200]}`
                                                        : "inherit",
                                            }}
                                            onClick={() => handleMenuItemClick("Data_OTA")}
                                        >
                                            <ListItemIcon>
                                                <FormControlLabel
                                                    control={
                                                        <IOSSwitch
                                                            sx={{ m: 1 }}
                                                            onChange={() =>
                                                                setOtaCheck(!otaCheck)
                                                            }
                                                            checked={otaCheck}
                                                        />
                                                    }
                                                    label=""
                                                />
                                            </ListItemIcon>
                                            Data Open Text Analysis
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    width: "100%",
                                                }}
                                            >
                                                <SettingsOutlinedIcon color="primary" />
                                            </div>
                                        </MenuItem>

                                        <MenuItem
                                            style={{
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                backgroundColor:
                                                    selectedMenuItem === "PPT_GEN"
                                                        ? `${theme.palette.grey[200]}`
                                                        : "inherit",
                                            }}
                                            onClick={() => handleMenuItemClick("PPT_GEN")}
                                        >
                                            <ListItemIcon>
                                                <FormControlLabel
                                                    control={
                                                        <IOSSwitch
                                                            sx={{ m: 1 }}
                                                            onChange={() => setPptCheck(!pptCheck)}
                                                            checked={pptCheck}
                                                        />
                                                    }
                                                    label=""
                                                />
                                            </ListItemIcon>
                                            PPT Generator
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    width: "100%",
                                                }}
                                            >
                                                <SettingsOutlinedIcon
                                                    style={{
                                                        opacity:
                                                            selectedVisData?.length > 0
                                                                ? 1
                                                                : 0.3,
                                                    }}
                                                    color="primary" />
                                            </div>
                                        </MenuItem>
                                    </MenuList>
                                    {/* </Paper> */}
                                </Grid>
                                <Grid
                                    item
                                    xs={8}
                                    style={{
                                        // height: "calc(100vh - 400px)",
                                        maxHeight: "540px",
                                        border: `1px solid ${theme.palette.grey[300]}`,
                                        borderRadius: "0.5rem",
                                    }}
                                >

                                    {selectedMenuItem === 'DATA_PRE_PROCESSING' && (
                                        <>
                                            <Box
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: '0.5rem',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Data Pre-Processing{' '}
                                            </Box>
                                        </>
                                    )}

                                    {selectedMenuItem === 'FILTER' && (
                                        <>
                                            <Box
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: '0.5rem',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Data FILTER{' '}
                                            </Box>
                                        </>
                                    )}
                                    {selectedMenuItem === "Data_Cleaning" && (
                                        <>
                                            <Box
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "0.5rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Data Cleaning
                                            </Box>
                                            <Box style={{ padding: "0rem 0rem 1rem 1.5rem" }}>
                                                <CustomFormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={dataCleaningConfig?.config[0]?.enabled}
                                                            onChange={(e) =>
                                                                handleDataCleaningConfigChange(
                                                                    "DATA_CLEANING_STRAIGHT_LINER",
                                                                    "enabled",
                                                                    e?.target?.checked
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={"Straight liner check"}
                                                />

                                                <Box
                                                    style={{
                                                        width: "50%",
                                                        padding: "0.5rem 0.5rem 0.5rem 1.5rem",
                                                    }}
                                                >
                                                    <label style={{ marginLeft: "5px" }}>Questions</label>
                                                    <MultipleSelectCheckmarks
                                                        label=""
                                                        width="100%"
                                                        items={marketList}
                                                        handleChange={handleChange}
                                                        selectedOptions={selectedMarketIds}
                                                        style={{ marginTop: "8px" }}
                                                    />
                                                </Box>
                                                <Grid
                                                    container
                                                    spacing={2}
                                                    style={{ padding: "0.5rem 1.5rem 1.5rem 1.5rem" }}
                                                >
                                                    <Grid item xs={3}>
                                                        <label style={{ marginLeft: "5px" }}>
                                                            Minimum Statement Count
                                                        </label>
                                                        <TextField
                                                            type="number"
                                                            onKeyPress={handleKeyPress}
                                                            InputProps={{ inputProps: { min: 0 } }}
                                                            value={
                                                                dataCleaningConfig?.config[0]?.fields?.find(
                                                                    (f) => f.name === "statement_count"
                                                                )?.value
                                                            }
                                                            onChange={(e) =>
                                                                handleDataCleaningConfigChange(
                                                                    "DATA_CLEANING_STRAIGHT_LINER",
                                                                    "statement_count",
                                                                    Number(e?.target?.value)
                                                                )
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <label style={{ marginLeft: "5px" }}>
                                                            Minimum Options Count
                                                        </label>
                                                        <TextField
                                                            type="number"
                                                            onKeyPress={handleKeyPress}
                                                            InputProps={{ inputProps: { min: 0 } }}
                                                            value={
                                                                dataCleaningConfig?.config[0]?.fields?.find(
                                                                    (f) => f.name === "option_count"
                                                                )?.value
                                                            }
                                                            onChange={(e) =>
                                                                handleDataCleaningConfigChange(
                                                                    "DATA_CLEANING_STRAIGHT_LINER",
                                                                    "option_count",
                                                                    Number(e?.target?.value)
                                                                )
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <label style={{ marginLeft: "5px" }}>
                                                            Threashold
                                                        </label>
                                                        <TextField
                                                            type="number"
                                                            onKeyPress={handleKeyPress}
                                                            // InputProps={{ inputProps: { min: 0 } }}
                                                            value={
                                                                dataCleaningConfig?.config[0]?.fields?.find(
                                                                    (f) => f.name === "threashold"
                                                                )?.value
                                                            }
                                                            onChange={(e) =>
                                                                handleDataCleaningConfigChange(
                                                                    "DATA_CLEANING_STRAIGHT_LINER",
                                                                    "threashold",
                                                                    parseFloat(e?.target?.value)
                                                                )
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Box>
                                                    <CustomFormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={dataCleaningConfig?.config[1]?.enabled}
                                                                onChange={(e) =>
                                                                    handleDataCleaningConfigChange(
                                                                        "DATA_CLEANING_SPEEDER",
                                                                        "enabled",
                                                                        e?.target?.checked
                                                                    )
                                                                }
                                                            />
                                                        }
                                                        label={"Speeder check"}
                                                    />

                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        style={{ padding: "0.5rem 1.5rem 1.5rem 1.5rem" }}
                                                    >
                                                        <Grid item xs={3}>
                                                            <label style={{ marginLeft: "5px" }}>LOI %</label>
                                                            <TextField
                                                                type="number"
                                                                onKeyPress={handleKeyPress}
                                                                // InputProps={{ inputProps: { min: 0 } }}
                                                                value={
                                                                    dataCleaningConfig?.config[1]?.fields?.find(
                                                                        (f) => f.name === "loi"
                                                                    )?.value
                                                                }
                                                                onChange={(e) =>
                                                                    handleDataCleaningConfigChange(
                                                                        "DATA_CLEANING_SPEEDER",
                                                                        "loi",
                                                                        parseFloat(e?.target?.value)
                                                                    )
                                                                }
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Box>

                                                <Box>
                                                    <CustomFormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={dataCleaningConfig?.config[2]?.enabled}
                                                                onChange={(e) => handleDataCleaningConfigChange('DATA_CLEANING_IP_DUP_CHECK', 'enabled', e?.target?.checked)}
                                                            />
                                                        }
                                                        label={'IP Dup Check'}
                                                    />
                                                </Box>
                                                <Box>
                                                    <CustomFormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={dataCleaningConfig?.config[3]?.enabled}
                                                                onChange={(e) => handleDataCleaningConfigChange('DATA_CLEANING_OPEN_TEXT_DUP_CHECK', 'enabled', e?.target?.checked)}
                                                            />
                                                        }
                                                        label={'Open text Dup Check'}
                                                    />
                                                </Box>

                                            </Box>
                                        </>
                                    )}
                                    {selectedMenuItem === "Data_Validation" && (
                                        <>
                                            <Box
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "0.5rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Data Validation{" "}
                                            </Box>
                                            <Box style={{ padding: "0rem 0rem 1rem 1.5rem" }}>
                                                <CustomFormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={dataValidationConfig?.config[0]?.enabled}
                                                            onChange={(e) =>
                                                                handleDataValidationEnabledChange(
                                                                    e?.target?.checked
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={"Validate programming conditions"}
                                                />

                                                <Grid
                                                    container
                                                    spacing={2}
                                                    style={{ padding: "0rem 1.5rem 1.5rem 1.5rem" }}
                                                >
                                                    <Grid item xs={4}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={
                                                                        dataValidationConfig?.config[0]?.fields?.find(
                                                                            (f) => f.name === "condition_check"
                                                                        )?.value
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleDataValidationFieldChange(
                                                                            "condition_check",
                                                                            e?.target?.checked
                                                                        )
                                                                    }
                                                                />
                                                            }
                                                            label={"Check programming conditions"}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={
                                                                        dataValidationConfig?.config[0]?.fields?.find(
                                                                            (f) => f.name === "datavalidation_check"
                                                                        )?.value
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleDataValidationFieldChange(
                                                                            "datavalidation_check",
                                                                            e?.target?.checked
                                                                        )
                                                                    }
                                                                />
                                                            }
                                                            label={"Run data validation"}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </>
                                    )}
                                    {selectedMenuItem === "Data_Tabulation" && (
                                        <>
                                            <Box
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "0.5rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Data Tabulation{" "}
                                            </Box>
                                            {/* <Box
                                                style={{ padding: "0rem 0rem 1rem 1.5rem", width: "40%" }}
                                            >
                                                <Select
                                                    // disabled={disableState}
                                                    className="configuration-box-select"
                                                    value={risk}
                                                    items={allTabulations}
                                                    onChange={handleRiskInputChange}
                                                    label="Tabulations"
                                                    name="answer_sorting_order"
                                                    isRequired={true}
                                                    size="small"
                                                />
                                            </Box> */}
                                            <Grid container spacing={2}
                                                style={{
                                                    padding: "0rem 0rem 1rem 1.5rem",
                                                    width: "100%",
                                                    marginTop: "0.5rem"
                                                }}>
                                                <Grid item md={4} xs={12}>
                                                    <Box
                                                        style={{
                                                            width: "100%",
                                                            padding: "0rem 0.5rem 0.5rem 0rem",
                                                        }}
                                                    >
                                                        <label style={{ marginLeft: "5px" }}>Tabulations*</label>
                                                        <Select
                                                            // disabled={disableState}
                                                            className="configuration-box-select"
                                                            value={risk}
                                                            items={allTabulations}
                                                            onChange={handleRiskInputChange}
                                                            // label="Tabulations*"
                                                            name="answer_sorting_order"
                                                            isRequired={true}
                                                            size="small"
                                                            style={{ marginTop: "0.5rem" }}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item md={4} xs={12}>
                                                    <Box
                                                        style={{
                                                            width: "100%",
                                                            padding: "0rem 0.5rem 0.5rem 0rem",
                                                        }}
                                                    >
                                                        <label style={{ marginLeft: "5px" }}>Decimal configuration*</label>
                                                        <Select
                                                            // disabled={disableState}
                                                            className="configuration-box-select"
                                                            value={decimal}
                                                            items={decimalConfig}
                                                            onChange={(event: any) => setDecimal(event.target.value)}
                                                            // label="Decimal configurations*"
                                                            name="decimal_config"
                                                            isRequired={true}
                                                            size="small"
                                                            style={{ marginTop: "0.5rem" }}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item md={4} xs={12}>
                                                    <label style={{ marginLeft: "5px" }}>
                                                        Minimum Sample Size*
                                                    </label>
                                                    <TextField
                                                        size="small"
                                                        onKeyPress={handleKeyPressDot}
                                                        InputProps={{ inputProps: { min: 0 } }}
                                                        type="number"
                                                        value={minimumSampleSize}
                                                        onChange={(e: any) => setMinimumSampleSize(e.target.value)}
                                                        style={{ marginTop: "0.5rem" }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2} style={{ padding: '0rem 1.5rem 1.5rem 2rem' }}>
                                                <Grid item xs={3}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={runWeight}
                                                                onChange={(e) => setRunWeight(e?.target?.checked)}
                                                            />
                                                        }
                                                        label={'Run Weightage'}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}

                                    {selectedMenuItem === "Exports" && (
                                        <>
                                            <Box
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "0.5rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Data File Exports{" "}
                                            </Box>
                                            <Box style={{ padding: "0rem 0rem 1rem 1.5rem" }}>
                                                <CustomFormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={dataExportConfig?.config[0]?.enabled}
                                                            onChange={(e) =>
                                                                handleDATAEXPORTSEnabledChange(e?.target?.checked)
                                                            }
                                                        />
                                                    }
                                                    label={"Output Files"}
                                                />

                                                <Grid
                                                    container
                                                    spacing={2}
                                                    style={{ padding: "0rem 1.5rem 1.5rem 1.5rem" }}
                                                >
                                                    <Grid item xs={3}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={
                                                                        dataExportConfig?.config[0]?.fields?.find(
                                                                            (f) => f.name === "fixed_width_file_output"
                                                                        )?.value
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleDATAEXPORTSFieldChange(
                                                                            "fixed_width_file_output",
                                                                            e?.target?.checked
                                                                        )
                                                                    }
                                                                />
                                                            }
                                                            label={"Fixed width file"}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={
                                                                        dataExportConfig?.config[0]?.fields?.find(
                                                                            (f) => f.name === "spss_file_output"
                                                                        )?.value
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleDATAEXPORTSFieldChange(
                                                                            "spss_file_output",
                                                                            e?.target?.checked
                                                                        )
                                                                    }
                                                                />
                                                            }
                                                            label={"SPSS file"}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={
                                                                        dataExportConfig?.config[0]?.fields?.find(
                                                                            (f) => f.name === "sav_file_output"
                                                                        )?.value
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleDATAEXPORTSFieldChange(
                                                                            "sav_file_output",
                                                                            e?.target?.checked
                                                                        )
                                                                    }
                                                                />
                                                            }
                                                            label={"SAV file"}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={
                                                                        dataExportConfig?.config[0]?.fields?.find(
                                                                            (f) => f.name === "script_file_output"
                                                                        )?.value
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleDATAEXPORTSFieldChange(
                                                                            "script_file_output",
                                                                            e?.target?.checked
                                                                        )
                                                                    }
                                                                />
                                                            }
                                                            label={"Script file"}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </>
                                    )}


                                    {selectedMenuItem === "Data_Insights" && (
                                        <>
                                            <Box
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "0.5rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Data Insights{" "}
                                            </Box>
                                            <Box style={{ padding: "0rem 0rem 1rem 1.5rem" }}>
                                                <CustomFormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={dataInsightsConfig?.config[0]?.enabled}
                                                            onChange={(e) =>
                                                                handleDataInsightsEnabledChange(
                                                                    e?.target?.checked
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={"Run Insights"}
                                                />
                                            </Box>
                                        </>
                                    )}

                                    {selectedMenuItem === "DATA_CHARTING" && (
                                        <>
                                            <Box
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "0.5rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Data Charts{" "}
                                            </Box>
                                            <Box style={{ padding: "0rem 0rem 1rem 1.5rem" }}>
                                                <CustomFormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={dataChartsConfig?.config[0]?.enabled}
                                                            onChange={(e) =>
                                                                handleDataChartsConfigChange(
                                                                    "DATA_CHARTING",
                                                                    "enabled",
                                                                    e?.target?.checked
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={"Data Charting"}
                                                />

                                                <Box
                                                    style={{
                                                        width: "50%",
                                                        padding: "0.5rem 0.5rem 0.5rem 1.5rem",
                                                    }}
                                                >
                                                    <label style={{ marginLeft: "5px" }}>Questions</label>
                                                    <MultipleSelectCheckmarks
                                                        label=""
                                                        width="100%"
                                                        items={questionList}
                                                        handleChange={handleChartsChange}
                                                        selectedOptions={selectedChartsIds}
                                                        style={{ marginTop: "8px" }}
                                                    />
                                                </Box>
                                            </Box>
                                        </>
                                    )}

                                    {selectedMenuItem === "Data_OTA" && (
                                        <>
                                            <Box
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "0.5rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Data Open Text Analysis{" "}
                                            </Box>
                                            <Box style={{ padding: "0rem 0rem 1rem 1.5rem" }}>
                                                <CustomFormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={dataOtaConfig?.config[0]?.enabled}
                                                            onChange={(e) =>
                                                                handleDataOtaEnabledChange(
                                                                    e?.target?.checked
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={"Run Open Text Analysis"}
                                                />
                                            </Box>
                                        </>
                                    )}

                                    {selectedMenuItem === "PPT_GEN" && (
                                        <>
                                            <Box
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "0.5rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                PPT Generator{" "}
                                            </Box>
                                            {/* <Box style={{ padding: "0rem 0rem 1rem 1.5rem" }}>
                                                <CustomFormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={dataPPTConfig?.config[0]?.enabled}
                                                            onChange={(e) =>
                                                                handleDataPPTEnabledChange(e?.target?.checked)
                                                            }
                                                        />
                                                    }
                                                    label={"Run PPT"}
                                                />
                                            </Box> */}

                                            <Grid item md={4} xs={12}>
                                                <Box
                                                    style={{
                                                        width: "100%",
                                                        padding: "1rem 0.5rem 0.5rem 0rem",
                                                    }}
                                                >
                                                    <label style={{ marginLeft: "5px" }}>Visualizations*</label>
                                                    <Select
                                                        // disabled={disableState}
                                                        className="configuration-box-select"
                                                        value={visValue || ''}
                                                        items={allVisualizations}
                                                        onChange={handleVisualizationsInputChange}
                                                        // label="Tabulations*"
                                                        name="answer_sorting_order"
                                                        isRequired={true}
                                                        size="small"
                                                        style={{ marginTop: "0.5rem" }}
                                                    />
                                                </Box>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default PipelinesUpdateComponent;
