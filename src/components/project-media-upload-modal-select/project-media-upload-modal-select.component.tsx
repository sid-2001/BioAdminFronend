import { SetStateAction, useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Tab, Tabs, Dialog, DialogTitle, IconButton, Stack, ImageList, ImageListItem, ImageListItemBar, Radio } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { ProjectService } from '@/services/projects.service';
import { useParams } from 'react-router-dom';
import { logger } from '@/helpers/logger';
import { QuestionNameInput } from '@/constants/cutom-question-name-input';
import { FilesTypes, UploadModalProps } from './project-media-upload-modal-select.type';
import LoadingSpinner from '../loader';
import { enqueueSnackbar } from 'notistack';

// import { StyledAudioItem } from './project-media-upload-modal.style';

const Input = styled('input')({
    display: 'none',
});

export default function UploadModalSelect({ open, onClose,
    // setSelectedFileQuestionTitle, selectedFileQuestionAnswer, setSelectedFileQuestionAnswer, 
    uploadAnswerIndex, questionAns, setQuestionAns, questionBase, setQuestionBase }: UploadModalProps) {
    const { projectId, surveyId } = useParams()
    const projectService = new ProjectService()
    const [imagesFiles, setImagesFiles] = useState<FilesTypes[] | []>([]);
    const [videoFiles, setVideoFiles] = useState<FilesTypes[] | []>([]);
    const [audioFiles, setAudioFiles] = useState<FilesTypes[] | []>([]);
    const [loading, setLoading] = useState(true)
    const [tabValue, setTabValue] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<FilesTypes | null>(null);

    useEffect(() => {
        GetAllUploadConceptsFiles()
    }, [projectId, surveyId, open])


    const GetAllUploadConceptsFiles = async () => {
        setLoading(true)
        try {
            const data = await projectService.get_UploadConceptsFiles(Number(projectId), Number(surveyId))
            console.log(data, "classifyAndSetFiles")

            const updatedData = data?.map((item) => ({ ...item, file_url: item?.watermark_file_url ? item?.watermark_file_url : item?.file_url }))
            classifyAndSetFiles(updatedData)
        } catch (error) {
            logger.error(error)
        } finally {
            setLoading(false)
        }
    }

    const classifyAndSetFiles = (files: any[]) => {
        const imageFiles: FilesTypes[] = [];
        const videoFiles: FilesTypes[] = [];
        const audioFiles: FilesTypes[] = [];

        files?.forEach(file => {
            const fileObj: FilesTypes = {
                file_url: file.file_url,
                type: file.type === 1 ? 'image' : file.type === 2 ? 'video' : 'audio',
                file_name: file.file_name,
                concept_name: file.concept_name,
                file_extension: file?.file_extension,
                file_size: file?.file_size,
                id: file?.id,
                is_active: file?.is_active,
            };
            console.log(fileObj, "fileObjfileObj", imageFiles)
            if (file.type === 1) {
                imageFiles.push(fileObj);
            } else if (file.type === 2) {
                videoFiles.push(fileObj);
            } else if (file.type === 3) {
                audioFiles.push(fileObj);
            }
        });

        setImagesFiles(imageFiles);
        setVideoFiles(videoFiles);
        setAudioFiles(audioFiles);
    };
    const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        const filesArray = Array.from(event.target.files as FileList);
        console.log(filesArray, "filesArrayfilesArray")
        const uploadedFiles = filesArray?.map((file, index) => ({
            file_url: URL.createObjectURL(file),
            file,
            type: file.type,
            file_name: file.name,
            concept_name: `Concept ${(imagesFiles?.length || 0) + (videoFiles?.length || 0) + (audioFiles?.length || 0) + index + 1}`
            // concept_name: `Concept ${(tabValue === 0 ? imagesFiles?.length : tabValue === 1 ? (videoFiles?.length + imagesFiles?.length) : tabValue === 2 ? (audioFiles?.length + videoFiles?.length + imagesFiles?.length) : '') + (index + 1)}`
        }));

        switch (tabValue) {
            case 0:
                setImagesFiles(prev => [...uploadedFiles, ...prev]);
                break;
            case 1:
                setVideoFiles(prev => [...uploadedFiles, ...prev]);
                break;
            case 2:
                setAudioFiles(prev => [...uploadedFiles, ...prev]);
                break;
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            setLoading(false)
        }
    };

    const handleConceptNameChangeImage = (index: number, value: string) => {
        console.log(index, value, "image, valueindex, value")
        const updatedFiles = [...imagesFiles];
        updatedFiles[index].concept_name = value;
        setImagesFiles(updatedFiles);
    };
    const handleConceptNameChangeVideos = (index: number, value: string) => {
        console.log(index, value, "video, valueindex, value")

        const updatedFiles = [...videoFiles];
        updatedFiles[index].concept_name = value;
        setVideoFiles(updatedFiles);
    };
    const handleConceptNameChangeAudios = (index: number, value: string) => {
        console.log(index, value, "audio, valueindex, value")

        const updatedFiles = [...audioFiles];
        updatedFiles[index].concept_name = value;
        setAudioFiles(updatedFiles);
    };


    const handleDeleteFile = (index: number, fileType: string) => {
        setLoading(true)
        switch (fileType) {
            case 'image':
                setImagesFiles(files => files.filter((_, i) => i !== index));
                break;
            case 'video':
                setVideoFiles(files => files.filter((_, i) => i !== index));
                break;
            case 'audio':
                setAudioFiles(files => files.filter((_, i) => i !== index));
                break;
        }
        setLoading(false)
    };


    const handleTabChange = (_event: any, newValue: SetStateAction<number>) => {
        setTabValue(newValue);
    };


    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const uploadFiles = async () => {
        setLoading(true)
        const combinedData = [...imagesFiles, ...videoFiles, ...audioFiles]
        const finalData = combinedData?.filter((item: FilesTypes) => !item?.id)

        if (finalData?.length > 0) {
            const data = finalData?.map(file => ({
                concept_name: file?.concept_name,
                type: file.type.startsWith('image') ? 1 : file.type.startsWith('video') ? 2 : 3,
                file: file.file
            }));

            const formData = new FormData();
            data.forEach(item => {
                if (item?.file) {
                    formData.append('concepts', JSON.stringify({ concept_name: item.concept_name, type: item.type }));
                    formData.append('files', item?.file);
                }
            });

            console.log(data, "datadata", finalData)

            try {
                const response = await projectService.UploadConceptsFiles(Number(projectId), Number(surveyId), formData);
                // console.log('Success:', response.status == 'SUCCESS');
                if (response.status == 'SUCCESS') {
                    enqueueSnackbar('Concepts have been successfully uploaded!', { variant: 'success' })
                    GetAllUploadConceptsFiles()
                }
            } catch (error) {
                logger.error(error)
            } finally {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    };

    const handleFileSelect = (fileUrl: FilesTypes) => {
        setSelectedFile(fileUrl);
    };

    let isUploadDisabled = [...imagesFiles, ...videoFiles, ...audioFiles]?.filter((item) => !item?.id)?.length

    useEffect(() => {
        setTabValue(0)
        setSelectedFile(null)
    }, [onClose])


    // console.log(questionAns, "qwertyyquestionAnsquestionAns")
    // console.log(imagesFiles, videoFiles, audioFiles, "finalDatafinalDatafinalData", selectedFile, uploadAnswerIndex, (uploadAnswerIndex != null))

    return (
        <>
            {loading && <LoadingSpinner />}
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth
                PaperProps={{
                    style: {
                        // width: '100%',
                        position: 'relative',
                        height: '80%',

                    }
                }}
            >
                <Box sx={{ bgcolor: 'background.paper', padding: '1rem 2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper' }}>
                        <DialogTitle id="alert-dialog-title" color="black" >
                            Concepts
                        </DialogTitle>
                        <Box style={{ display: "flex" }}>
                            <Button onClick={() => {
                                onClose()
                            }}>Cancel </Button>
                            {(isUploadDisabled > 0) &&
                                <Button variant='contained' disabled={!(isUploadDisabled > 0)} onClick={uploadFiles}>Upload Concepts {isUploadDisabled ? `(${isUploadDisabled})` : ''}</Button>
                            }
                            {selectedFile &&
                                <Button disabled={!selectedFile} onClick={() => {
                                    if (uploadAnswerIndex == null) {
                                        // setSelectedFileQuestionTitle(selectedFile)
                                        let payload: any = { ...questionBase }
                                        payload.concept_id = selectedFile?.id
                                        payload.concept = selectedFile
                                        setQuestionBase(payload)
                                        // setSelectedFileQuestionTitle(null);
                                    } else if (uploadAnswerIndex || uploadAnswerIndex == 0) {
                                        let payload: any[] = [...questionAns]
                                        payload[uploadAnswerIndex].concept_id = selectedFile?.id
                                        payload[uploadAnswerIndex].concept = selectedFile
                                        setQuestionAns(payload)
                                        // setSelectedFileQuestionAnswer(selectedFile)
                                    }
                                    onClose()
                                }} variant='contained'>Save </Button>
                            }
                            {/* <IconButton onClick={onClose} sx={{ width: "40px", height: "40px" }}  >
                                <CloseOutlinedIcon />
                            </IconButton> */}
                        </Box>
                    </Box>

                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="media tabs">
                        <Tab label={`Images ${imagesFiles?.filter((item) => !item?.id)?.length > 0 ? `(${imagesFiles?.filter((item) => !item?.id)?.length})` : ''}`} />
                        <Tab label={`Videos ${videoFiles?.filter((item) => !item?.id)?.length > 0 ? `(${videoFiles?.filter((item) => !item?.id)?.length})` : ''}`} />
                        <Tab label={`Audios ${audioFiles?.filter((item) => !item?.id)?.length > 0 ? `(${audioFiles?.filter((item) => !item?.id)?.length})` : ''}`} />
                        {/* <Tab label="Videos" />
                        <Tab label="Audios" /> */}
                    </Tabs>


                    <Box className="file-upload-box" onClick={handleButtonClick} style={{ margin: "0.5rem", minHeight: "50px" }}>
                        <Input ref={fileInputRef} accept={tabValue === 0 ? 'image/*' : tabValue === 1 ? 'video/*' : tabValue === 2 ? 'audio/*' : ''} multiple type="file" id="contained-button-file" onChange={handleUploadChange} />
                        <Stack spacing={2} alignItems="center" justifyContent="center">
                            <Typography sx={{ fontSize: "14px", fontWeight: 400, cursor: 'pointer' }}>
                                Drag & drop your files here or <span className="choose-file-text">choose files</span>
                            </Typography>
                        </Stack>
                    </Box>

                    <ImageList sx={{ width: '100%', height: 'auto' }}>
                        {imagesFiles?.filter(file =>
                            (tabValue === 0 && file?.type?.startsWith('image') && !file?.id)
                        ).map((file, index) => (
                            <ImageListItem key={index}>
                                {file.type.startsWith('image') && <img src={file.file_url} alt={file.file_name} loading="lazy" style={{ width: '100%', maxHeight: "300px", objectFit: "contain" }} />}
                                <Box sx={{ display: 'flex', width: '100%', flexDirection: "row" }}>
                                    <QuestionNameInput
                                        placeholder="Concept Name"
                                        className="base-comp-question_code-input"
                                        size="small"
                                        fullWidth
                                        disabled={file?.id ? true : false}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                fontWeight: 700,
                                            },
                                        }}
                                        value={file.concept_name}
                                        onChange={(e) => handleConceptNameChangeImage(index, e.target.value)}
                                    />
                                    <IconButton style={{ display: file?.id ? "none" : "auto" }} onClick={() => handleDeleteFile(index, 'image')}>
                                        <CloseOutlinedIcon />
                                    </IconButton>
                                </Box>
                                {/* <ImageListItemBar
                                    title={file.concept_name}
                                    subtitle={file.concept_name}
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                            aria-label={`info about ${file.concept_name}`}
                                        >
                                            <InfoIcon />
                                        </IconButton>
                                    }
                                /> */}
                            </ImageListItem>
                        ))}

                        {videoFiles?.filter(file =>
                            (tabValue === 1 && file.type.startsWith('video') && !file?.id)
                        ).map((file, index) => (
                            <ImageListItem key={index}>
                                {/* {file.type.startsWith('image') && <img src={file.file_url} alt={file.file_name} loading="lazy" />} */}
                                {file.type.startsWith('video') && <video src={file.file_url} controls style={{ width: '100%', maxHeight: "300px", }} />}
                                <Box sx={{ display: 'flex', width: '100%', flexDirection: "row" }}>
                                    <QuestionNameInput
                                        placeholder="Concept Name"
                                        className="base-comp-question_code-input"
                                        size="small"
                                        fullWidth
                                        disabled={file?.id ? true : false}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                fontWeight: 700,
                                            },
                                        }}
                                        value={file.concept_name}
                                        onChange={(e) => handleConceptNameChangeVideos(index, e.target.value)}
                                    />
                                    <IconButton style={{ display: file?.id ? "none" : "auto" }} onClick={() => handleDeleteFile(index, 'video')}>
                                        <CloseOutlinedIcon />
                                    </IconButton>
                                </Box>
                            </ImageListItem>
                        ))}

                        {audioFiles?.filter(file =>
                            (tabValue === 2 && file.type.startsWith('audio') && !file?.id)
                        ).map((file, index) => (
                            <ImageListItem key={index} style={{}}>
                                {/* {file.type.startsWith('image') && <img src={file.file_url} alt={file.file_name} loading="lazy" />}
                            {file.type.startsWith('video') && <video src={file.file_url} controls style={{ width: '100%' }} />} */}
                                {file.type.startsWith('audio') && <audio src={file.file_url} controls style={{ width: '100%', }} />}
                                <Box sx={{ display: 'flex', width: '100%', flexDirection: "row" }}>
                                    <QuestionNameInput
                                        placeholder="Concept Name"
                                        className="base-comp-question_code-input"
                                        size="small"
                                        fullWidth
                                        disabled={file?.id ? true : false}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                fontWeight: 700,
                                            },
                                        }}
                                        value={file.concept_name}
                                        onChange={(e) => handleConceptNameChangeAudios(index, e.target.value)}
                                    />
                                    <IconButton style={{ display: file?.id ? "none" : "auto" }} onClick={() => handleDeleteFile(index, 'audio')}>
                                        <CloseOutlinedIcon />
                                    </IconButton>
                                </Box>
                            </ImageListItem>
                        ))}
                        {/* </ImageList>


                    <ImageList sx={{ width: '100%', height: 'auto' }}> */}
                        {[...imagesFiles, ...videoFiles, ...audioFiles]?.filter(file =>
                            (tabValue === 0 && file?.type?.startsWith('image') && file?.id) ||
                            (tabValue === 1 && file?.type?.startsWith('video') && file?.id) ||
                            (tabValue === 2 && file?.type?.startsWith('audio') && file?.id)
                        ).map((file, index) => (
                            <ImageListItem key={index} onClick={() => handleFileSelect(file)}>
                                {file.type.startsWith('image') && <img src={file.file_url} alt={file.file_name} loading="lazy" style={{ width: '100%', maxHeight: "300px", objectFit: "contain" }} />}
                                {file.type.startsWith('video') && <video src={file.file_url} controls style={{ width: '100%', maxHeight: "300px", }} />}
                                {file.type.startsWith('audio') && <audio src={file.file_url} controls style={{ width: '100%', }} />}
                                <ImageListItemBar
                                    title={file.concept_name}
                                    position="below"
                                    // actionPosition="right"

                                    // subtitle={file.concept_name}
                                    actionIcon={
                                        // <IconButton
                                        //     // sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                        //     aria-label={`star ${file.concept_name}`}
                                        // >
                                        <Radio
                                            checked={selectedFile?.id === file?.id}
                                            // onChange={() => handleFileSelect(file.id)}
                                            value={file.id}
                                            name="selectedFile"
                                        />
                                        // </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}

                    </ImageList>
                </Box>
            </Dialog >
        </>
    );
}
