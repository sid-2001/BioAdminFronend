import React, { useState, useEffect, useRef } from 'react';
// import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, Button, Box, Grid, Typography, Divider, Link, IconButton } from '@mui/material';
// 
import TextField from '../text-field';
// import { StyledLabel } from './dynamic-job-form.style';
import { ProjectDataType } from '@/types/project-data.type';
import { useOutletContext, useParams } from 'react-router-dom';
import { ProjectDataService } from '@/services/project-data.services';
import { logger } from '@/helpers/logger';
import { DynamicFormProps } from './dynamic-job-form.type';
import { theme } from '@/constants/theme';
import { styled } from '@mui/material/styles';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import MultipleSelectCheckmarks from "../multiple-select";
import { Project } from '@/types/project.type';
import LoadingSpinner from '../loader';

interface SubSectionEnabledState {
    [key: string]: boolean;
}

interface FormStateType {
    [key: string]: any;
}

interface FileStateType {
    [key: string]: File;
}

interface ProjectContext {
    project: Project;
}



const DynamicForm = ({ initialConfig, closeDialog, getProjectData, summary, viewMode, nanoId }: DynamicFormProps) => {
    const { project } = useOutletContext<ProjectContext>()

    const { projectId } = useParams()
    const projectDataService = new ProjectDataService()
    const [loading, setLoading] = useState(false)

    const [formState, setFormState] = useState<FormStateType>({});
    const [fileState, setFileState] = useState<FileStateType>({});
    const [fileName, setFileName] = useState<any>({});
    const [jobName, setJobName] = useState(initialConfig?.job?.name || '');
    const [subSectionEnabled, setSubSectionEnabled] = useState<SubSectionEnabledState>({});
    const [description, setDescription] = useState(summary);
    const [errors, setErrors] = useState({});
    const [marketList, setMarketList] = useState<any>([]);
    const [selectedMarketIds, setSelectedMarketIds] = useState([]);


    useEffect(() => {
        const initialState: FormStateType = {};
        const initialSubSectionEnabled: SubSectionEnabledState = {};
        initialConfig?.config?.forEach((section: any) => {
            section?.config?.forEach((subSection: any) => {
                initialSubSectionEnabled[`${section.type}_${subSection.type}`] = subSection.enabled;
                subSection?.fields?.forEach((field: { name: any; value: any; default_value: any; }) => {
                    initialState[`${section.type}_${subSection.type}_${field.name}`] = field.value || field.default_value;
                });
            });
        });
        setFormState(initialState);
        setSubSectionEnabled(initialSubSectionEnabled);
        console.log("Initial subSectionEnabled:", initialSubSectionEnabled);
    }, [initialConfig]);

    const handleSubSectionEnabledChange = (sectionType: any, subSectionType: any, enabled: boolean) => {
        setSubSectionEnabled(prevState => {
            const updatedState = { ...prevState, [`${sectionType}_${subSectionType}`]: enabled };
            console.log("Updated subSectionEnabled:", updatedState);
            return updatedState;
        });
    };

    const handleInputChange = (sectionType: any, subSectionType: any, fieldName: any, value: string | boolean) => {
        setFormState(prevState => ({
            ...prevState,
            [`${sectionType}_${subSectionType}_${fieldName}`]: value
        }));
    };

    // const handleFileChange = (fileKey: any, file: File) => {
    //     setFileState(prevState => ({
    //         ...prevState,
    //         [fileKey]: file
    //     }));
    // };

    const GetAllDataJobQuestionsList = async () => {
        setLoading(true)
        try {
            const data = await projectDataService.GetAllDataJobQuestions(Number(projectId));
            console.log(data, 'datadata')
            if (data && data) {
                const serviceNames = data.map((item: { id: any; name: any, question_code: string }) => ({
                    value: item.id,
                    text: item.name,
                    label: item?.question_code
                }));
                setMarketList(serviceNames);
                // Set all market IDs as default selected values
                const allMarketIds = serviceNames.map((item: any) => item.value);
                setSelectedMarketIds(allMarketIds);
            }
        } catch (error) {
            logger.error(error);
        } finally {
            setLoading(false)
        }
    };

    const handleChange = (selected: any) => {
        // Update the local state with the selected market IDs
        const selectedIds = selected.map((item: any) => Number(item.value));
        setSelectedMarketIds(selectedIds);
    };

    const mapSelectedMarketIdsToQuestions = () => {
        return selectedMarketIds.map((id) => {
            const foundItem = marketList.find((item: any) => item.value === id);
            return {
                id: String(foundItem?.label),
                label: String(foundItem?.text)
            };
        });
    };

    const handleFileChange = async (fileKey: React.Key | null | undefined, file: string | Blob) => {
        setLoading(true)
        const objectTypeId = 3
        const objectId = projectId || ''
        const formData = new FormData();
        formData.append('files', file);

        formData.append('object_type_id', objectTypeId.toString());
        formData.append('object_id', objectId.toString());
        // formData.append('object_nanoid', nanoId?.toString())
        formData.append('target_path', `j-${nanoId?.toString()}/i`)

        console.log(formData, "formData", file, fileKey);
        setFileName((prev: any) => ({
            ...prev,
            [fileKey ? fileKey.toString() : '']: (file as any).name
        }))

        // setFileState(prevState => ({
        //     ...prevState,
        //     [fileKey]: { file, name: file.name }
        // }));

        try {
            const response = await projectDataService.postProjectAttachments(
                formData,
                (_progressEvent: any) => { }
            );
            console.log("File upload response:", response);
            const logFilePath = response?.description?.log_file_path;

            setFileState(prevState => ({
                ...prevState,
                // @ts-ignore
                [fileKey]: logFilePath
            }));

            console.log(logFilePath, "logFilePathlogFilePath")
            setFormState(prevState => ({
                ...prevState,
                [`${fileKey}_path`]: logFilePath
            }));
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false)
        }
    };

    // console.log(fileState, "fileState", formState, "formState", initialConfig, viewMode)

    // const convertFileToBase64 = (file: Blob) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onload = () => resolve(reader.result);
    //         reader.onerror = error => reject(error);
    //         reader.readAsDataURL(file);
    //     });
    // };

    const EmptyStates = () => {
        setFileState({})
        setJobName('')
        setSubSectionEnabled({})
        setDescription('')
    }

    const initializeErrors = () => {
        setErrors({
            jobName: '',
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors: any = {};

        if (!jobName.trim()) {
            newErrors.jobName = "Job name is required.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };
    // const ResponseFileName = fileName['RESPONSE_FILE'] ? fileName['RESPONSE_FILE'] : null

    // console.log(ResponseFileName, "ResponseFileName")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        setLoading(true)
        const token = localStorage.getItem('user');
        const randomId = nanoId;
        // const randomId = nanoid(10);
        let account_id
        if (token) {
            const payload = token.split('.')[1];
            if (payload) {
                const decodedPayload = atob(payload);
                const payloadObj = JSON.parse(decodedPayload);
                const accountId = payloadObj.user ? payloadObj.user.account_id : null;
                account_id = accountId

                console.log('Account ID:', accountId, account_id);
            }
        }
        // let questions = [];
        // if (subSection?.type === 'DATA_CLEANING_STRAIGHT_LINER') {
        //     questions = mapSelectedMarketIdsToQuestions();
        // }
        const output = {}

        function removeXlsxExtension(filename: string) {
            if (filename.endsWith('.xlsx')) {
                return filename.slice(0, -5);
            }
            console.log(filename, "filenamefilename")
            return filename;
        }

        const ResponseFileName = fileName['RESPONSE_FILE'] ? removeXlsxExtension(fileName['RESPONSE_FILE']) : null

        // console.log(ResponseFileName, "fileName['RESPONSE_FILE']", fileName['RESPONSE_FILE'])
        // const output = {};
        const transformedData = JSON.parse(JSON.stringify(initialConfig));
        transformedData.job.name = jobName;
        transformedData.job.project_id = projectId;
        if (randomId && projectId && account_id && ResponseFileName) {
            // transformedData.job.output_path = `p/p-${projectId}/_jobs/j-${randomId}/i/${ResponseFileName}_${randomId}.xlsx`;
            // transformedData.job.output_path = `p/p-${projectId}/_jobs/j-${randomId}/i/${ResponseFileName}_${randomId}.xlsx`;
            // transformedData.job.output_path = `${ENV?.BASE_ADMIN_STORAGE_URL}/account-${account_id}/p/p-${projectId}/_jobs/j-${randomId}/i/${ResponseFileName}_${randomId}.xlsx`;
        }
        // transformedData.job.output_path = `https://biobraindevstorage.blob.core.windows.net/account-${account_id}/p/p-${project?.object_uid}/_jobs/j-${randomId}/i/filename_${randomId}.xml`;

        transformedData.job.object_uid = String(nanoId);
        transformedData?.config?.forEach((section: { config: any[]; type: any; }) => {
            section?.config?.forEach(subSection => {
                const subSectionKey = `${section.type}_${subSection.type}`;
                subSection.enabled = subSectionEnabled[subSectionKey];
                // subSection?.type == 'DATA_CLEANING_STRAIGHT_LINER' ? subSection?.questions == 
                if (subSection.type === 'DATA_CLEANING_STRAIGHT_LINER') {
                    subSection.questions = mapSelectedMarketIdsToQuestions();
                }
                subSection.fields.forEach((field: { value: any; name: any; }) => {
                    field.value = formState[`${section.type}_${subSection.type}_${field.name}`];
                });
            });
        });

        transformedData?.files?.forEach((fileInput: { input_data: any; key: string | number; }) => {
            fileInput.input_data = fileState[fileInput.key];
        });


        const inputFilesData = await Promise?.all(transformedData?.files?.map(async (fileInput: { key: string | number; url: any; }) => {
            console.log(fileInput, "fileInput123")
            return {
              key: fileInput.key,
              url:
                fileInput.key == "SCHEMA_FILE"
                  ? project?.data_file_url
                  : fileInput.key == "DEFiNITION_FILE"
                    ? project?.schema_url
                    : fileState[fileInput.key]
                      ? await fileState[fileInput.key]
                      : null,
              // input_data: fileState[fileInput.key] ? await fileState[fileInput.key] : null
            };
        }));

        const projectData: ProjectDataType = {
            name: jobName,
            type_id: 1,
            project_id: Number(projectId),
            status_id: null,
            status_reason: '',
            start_time: null,
            object_uid: String(nanoId),
            end_time: null,
            summary: description,
            configuration: { ...transformedData, files: inputFilesData },
            output: output
        };

        console.log("Data to sendtransformedData:", transformedData, projectData);

        try {
            const response = await projectDataService.postDataJob(Number(projectId), projectData);
            console.log("Response:", response);
            getProjectData()
            EmptyStates()
            closeDialog()
        } catch (error) {
            logger.error(error)
        } finally {
            setLoading(false)
        }
    };

    console.log(project, "project123", fileName['RESPONSE_FILE'])

    const renderField = (sectionType: string, subSectionType: string, field: { name: string; datatype: string; display_name: any }) => {
        const fieldKey = `${sectionType}_${subSectionType}_${field.name}`;
        console.log(sectionType, subSectionType, "sectionTypesectionType", field)
        switch (field.datatype) {
            case 'INTEGER':
            case 'DECIMAL':
                return (
                    <Grid item xs={3} style={{ display: "flex", flexDirection: "column", paddingLeft: "1.5rem " }} >
                        {viewMode ?
                            <>
                                <label style={{ marginLeft: "5px", }}>{field.display_name}</label>
                                <h4 style={{ padding: "0.5rem" }}>{formState[fieldKey]} </h4>
                            </>
                            :
                            <>
                                <label style={{ marginLeft: "5px", }}>{field.display_name}</label>
                                <TextField
                                    // label={field.display_name}
                                    value={formState[fieldKey]}
                                    onChange={e => handleInputChange(sectionType, subSectionType, field.name, e.target.value)}
                                    style={{ paddingTop: "6px", maxWidth: '100%' }}
                                    type='number'
                                />
                            </>
                        }
                    </Grid>
                );
            case 'BOOLEAN':
                return (
                    <Grid item xs={3.5} style={{ paddingLeft: "1.5rem " }}>
                        <Box style={{ display: "flex", }}>
                            <FormControlLabel
                                style={{ pointerEvents: viewMode ? "none" : "auto" }}
                                control={
                                    <Checkbox
                                        sx={{ opacity: viewMode ? 0.5 : 1, }}
                                        checked={formState[fieldKey] ? true : false}
                                        onChange={e => handleInputChange(sectionType, subSectionType, field.name, e.target.checked)}
                                    />
                                }
                                label={field.display_name}
                            />
                            {/* <Tooltip title={(field as any)?.status_reason} arrow>
                                <IconButton color={(field as any)?.status == "Successful" ? "success" : 'error'}>
                                    <ErrorOutlineIcon />
                                </IconButton>
                            </Tooltip> */}
                            {(field as any)?.file_url &&
                                <Link href={`${(field as any)?.file_url}`} target="_blank" rel="noopener noreferrer">
                                    <IconButton color='primary'>
                                        <DownloadForOfflineIcon />
                                    </IconButton>
                                </Link>}
                        </Box>
                    </Grid>
                );
            default:
                return null;
        }
    };


    const renderFileInput = (fileInput: { key: React.Key | null | undefined; }) => {

        console.log(fileInput, "fileInputfileInputfileInputfileInput")
        // const fileName: string | undefined = fileState[fileInput.key]?.name || fileInput.key;
        let fileNames: string | undefined;
        const fileInputRef = useRef<HTMLInputElement>(null);
        if (typeof fileInput.key === 'string' || typeof fileInput.key === 'number') {
            fileNames = fileState[fileInput.key]?.name || fileInput.key.toString();
        } else {
            fileNames = 'Unknown File';
        }

        const handleIconClick = () => {
            fileInputRef.current?.click();
        };

        // const handleRemoveFile = (fileKey: string | number) => {

        //     setFileState(prevState => {
        //         const newState = { ...prevState };
        //         delete newState[fileKey];
        //         return newState;
        //     });
        // };

        // console.log(fileName[`${fileInput?.key}`],"fileName[`${fileInput?.key}`]fileName[`${fileInput?.key}`]",fileInput?.key)
        // console.log(fileName[fileInput?.key], "fileName[fileInput?.key]", fileInput?.key);

        return (
            <Box key={fileInput.key} style={{ padding: "0.5rem", display: (fileInput?.key == 'SCHEMA_FILE' || fileInput?.key == 'DEFNITION_FILE') ? "none" : "block" }}>
                {/* <StyledLabel>
                    <Typography variant="body1" component="span">
                        {fileName}
                    </Typography>
                    <input
                        style={{ display: 'none' }}
                        type="file"
                        onChange={(e) => handleFileChange(fileInput.key, (e as any).target.files[0])}
                    />

                    {fileState[fileInput.key] && (
                 <IconButton size="small" >
                   <CloseIcon  onClick={(e) => {
                     e.stopPropagation();
                     handleRemoveFile(fileInput.key)
                     }}/>
                 </IconButton>
               )}

                </StyledLabel> */}

                <Typography variant="body1" component="span">
                    <h4>{fileNames}</h4>
                </Typography>
                {viewMode ?
                    <>

                        <Link href={`${(fileInput as any)?.input_data}`} target="_blank" rel="noopener noreferrer">
                            <IconButton color='primary'  >
                                <CloudDownloadIcon />
                            </IconButton>
                        </Link>
                    </>
                    :
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={`${fileInput?.key == 'SCHEMA_FILE' ? '.xlsx' : fileInput?.key == 'RESPONSE_FILE' ? '.xlsx' : fileInput?.key == 'DEFNITION_FILE' ? '.xml' : '.xml, .xlxs'}`}
                            // accept=".xml, .xlsx"
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileChange(fileInput.key, (e as any).target.files[0])}
                        />
                        <IconButton color='primary' onClick={handleIconClick} style={{ display: "flex", gap: "0.5rem" }}>
                            <CloudUploadIcon />
                        </IconButton>
                        <h6> {fileName[`${fileInput?.key}`]}</h6>
                    </>}

            </Box>
        );
    };

    const CustomFormControlLabel = styled(FormControlLabel)({
        '& .MuiFormControlLabel-label': {
            fontSize: '1rem',
            fontWeight: 'bold',
        }
    });

    useEffect(() => {
        initializeErrors();
    }, []);

    useEffect(() => {
        GetAllDataJobQuestionsList()
    }, [])

    console.log(selectedMarketIds, "selectedMarketIdsselectedMarketIds", marketList, fileName)

    return (
        <>
            {loading ? <LoadingSpinner /> : null}
            {/* {viewMode ?
                <>
                    <Grid container spacing={2} style={{ padding: "1rem 1rem 1rem 2rem" }}>
                        <Grid container spacing={2} >
                            <Grid item xs={5.5} >
                                <label style={{ marginLeft: "5px" }}>Job Title*</label>
                                <h3 style={{ padding: "0.5rem" }}>{jobName}</h3>
                            </Grid>
                            <Grid item xs={12} style={{}}>
                                <label style={{ marginLeft: "5px" }}>Description</label>
                                <h4 style={{ padding: "0.5rem" }}>{description}</h4>
                            </Grid>
                        </Grid>
                        <h2 style={{ marginTop: "1rem" }}>Configurations</h2>
                        <Grid container spacing={2} >
                            <Grid item xs={9} style={{ marginTop: "1rem", paddingRight: "1rem", borderRight: `1px solid ${theme.palette.grey[300]}` }}>
                                {initialConfig?.config?.map((section: { type: React.Key | null | undefined; type_name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; config: any[]; }) => (
                                    <Grid item xs={12} key={section.type}>
                                        <Box style={{ display: "flex", alignItems: "center", marginBottom: '0.5rem', }}>

                                            <h3>{section?.type_name}</h3>
                                            <Box>
                                                <Tooltip title={(section as any)?.status_reason} arrow>
                                                    <IconButton color={(section as any)?.status == "Successful" ? "success" : 'error'}>
                                                        <ErrorOutlineIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                {(section as any)?.file_url &&
                                                    <Link href={`${(section as any)?.file_url}`} target="_blank" rel="noopener noreferrer">
                                                        <IconButton color='primary'>
                                                            <DownloadForOfflineIcon />
                                                        </IconButton>
                                                    </Link>}
                                            </Box>
                                        </Box>
                                        {section?.config?.map((subSection) => (
                                            <Box key={subSection.type} sx={{}}>
                                                <Box style={{ display: "flex", alignItems: "center", marginBottom: '0.5rem', }}>

                                                    <CustomFormControlLabel
                                                        style={{ pointerEvents: "none" }}
                                                        control={
                                                            <Checkbox
                                                                sx={{ opacity: 0.5, }}
                                                                checked={subSectionEnabled[`${section.type}_${subSection.type}`] ? true : false}
                                                                onChange={(e) => handleSubSectionEnabledChange(section.type, subSection.type, e.target.checked)}
                                                            />
                                                        }
                                                        label={subSection?.type_name}
                                                    />
                                                    
                                                </Box>
                                                <Grid container spacing={0}>
                                                    {subSection?.fields?.map((field: { name: string; datatype: string; display_name: any; }) => (
                                                        renderField((section as any)?.type, subSection?.type, field)
                                                    ))}
                                                </Grid>
                                            </Box>
                                        ))}
                                        <Divider style={{ margin: "1rem 0rem 1rem 0rem" }} />
                                    </Grid>
                                ))}
                            </Grid>


                            <Grid item xs={3}>
                                {initialConfig?.files &&
                                    <Box >
                                        <h3>Files</h3>
                                        {initialConfig.files?.map((fileInput: any) => renderFileInput(fileInput))}
                                    </Box>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </>
                : */}
            <form onSubmit={e => {
                e.preventDefault();
                handleSubmit(e);
            }}>
                <Grid container spacing={2} style={{ padding: "1rem 1rem 1rem 2rem" }}>
                    <Grid container spacing={2} >
                        <Grid item xs={5.5} >
                            <label style={{ marginLeft: "5px" }}>Job Title*</label>
                            <TextField
                                // label="Job Title"
                                value={jobName}
                                onChange={(e) => setJobName(e.target.value)}
                                style={{ paddingTop: "6px", }}
                                error={Boolean((errors as any).jobName)}
                                helperText={(errors as any).jobName}
                            />
                        </Grid>
                        <Grid item xs={12} style={{}}>
                            <label style={{ marginLeft: "5px" }}>Description</label>
                            <TextField
                                // label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={5}
                                style={{ paddingTop: "6px", }}
                                sx={{
                                    textarea: {
                                        resize: 'vertical',
                                        overflow: 'auto'
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                    <h2 style={{ marginTop: "1rem" }}>Configurations</h2> 
                    <Grid container spacing={2} >

                        <Grid item xs={9} style={{ marginTop: "1rem", paddingRight: "1rem", borderRight: `1px solid ${theme.palette.grey[300]}` }}>
                            {initialConfig?.config?.map((section: { type: React.Key | null | undefined; type_name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; config: any[]; }) => (
                                <Grid item xs={12} key={section.type}>
                                    <Box style={{ display: "flex", alignItems: "center", marginBottom: '0.5rem', }}>
                                        <h3>{section?.type_name}</h3>
                                        {/* <Link href={`${section?.file_url}`} target="_blank" rel="noopener noreferrer">
                                                Learn More {section?.file_url}
                                            </Link> */}
                                    </Box>
                                    {section?.config?.map((subSection) => (
                                        <Box key={subSection.type} sx={{}}>
                                            <Box style={{ display: "flex", alignItems: "center", marginBottom: '0.5rem', }}>

                                                <CustomFormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={subSectionEnabled[`${section.type}_${subSection.type}`] ? true : false}
                                                            onChange={(e) => handleSubSectionEnabledChange(section.type, subSection.type, e.target.checked)}
                                                        />
                                                    }
                                                    label={subSection?.type_name}
                                                />
                                                {/* <Link href={`${subSection?.file_url}`} target="_blank" rel="noopener noreferrer">
                                                        Learn More {subSection?.file_url}
                                                    </Link> */}
                                            </Box>
                                            {subSection?.type == 'DATA_CLEANING_STRAIGHT_LINER' &&

                                                <Grid container spacing={0}>
                                                    <Grid item xs={6} style={{ padding: "0rem 0rem 1rem 1.5rem" }}>
                                                        <label style={{ marginLeft: "5px" }}>Questions</label>
                                                        <MultipleSelectCheckmarks
                                                            label=""
                                                            width="100%"
                                                            items={marketList}
                                                            handleChange={handleChange}
                                                            selectedOptions={selectedMarketIds}
                                                            style={{ marginTop: "8px" }}
                                                        />
                                                    </Grid>
                                                </Grid>}
                                            <Grid container spacing={0}>
                                                {subSection?.fields?.map((field: { name: string; datatype: string; display_name: any; }) => (
                                                    renderField((section as any)?.type, subSection?.type, field)
                                                ))}
                                            </Grid>
                                        </Box>
                                    ))}
                                    <Divider style={{ margin: "1rem 0rem 1rem 0rem" }} />
                                </Grid>
                            ))}
                        </Grid>


                        <Grid item xs={3}>
                            {initialConfig?.files &&
                                <Box >
                                    <h3>Files</h3>
                                    {initialConfig.files?.map((fileInput: any) => renderFileInput(fileInput))}
                                </Box>
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Box style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    <Button onClick={() => {
                        EmptyStates()
                        closeDialog()
                    }} variant="outlined">Cancel</Button>
                    <Button type="submit" variant="contained">Submit</Button>

                </Box>
            </form>
            {/* } */}
        </>
    );
};

export default DynamicForm;