

import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { Box, IconButton, Modal, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface ShowConceptAnswersProps {
    answer: any;
    index: number | null;
    selectedFileQuestionAnswer: any;

    questionAns: any[];
    setQuestionAns: React.Dispatch<React.SetStateAction<any[]>>;

    hide?: boolean;
}

export default function ShowConceptForAnswers({
    // selectedFileQuestionTitle,
    // questionBase,
    // setSelectedFileQuestionTitle,
    // setQuestionBase

    answer, index, selectedFileQuestionAnswer, questionAns, setQuestionAns, hide
}: ShowConceptAnswersProps) {

    const [open, setOpen] = useState(false);

    if (!answer?.concept?.file_url) {
        return null;
    }

    const file = selectedFileQuestionAnswer || answer?.concept;

    let fileType;
    if (typeof file?.type === 'string') {
        if (file.type.startsWith('image')) {
            fileType = 1;
        } else if (file.type.startsWith('video')) {
            fileType = 2;
        } else if (file.type.startsWith('audio')) {
            fileType = 3;
        }
    } else if (answer?.concept?.type) {
        fileType = answer.concept.type;
    }

    const handleDelete = () => {
        if (index || index == 0) {
            let payload: any[] = [...questionAns]
            payload[index].concept_id = null
            payload[index].concept = null
            setQuestionAns(payload)
        }
    }

    const handleFullscreen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // console.log(file, fileType, "file_urlfile_urlfile_urlfile_urlfile_urlfile_url");

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    maxWidth: '90%',
                    maxHeight: '90%',
                    overflow: 'auto',
                }}>
                    <IconButton onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            color: 'rgba(0, 0, 0, 0.7)',
                        }} >
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                    {fileType === 1 && (
                        <img
                            src={file.file_url}
                            alt={file.file_name}
                            loading="lazy"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    )}
                </Box>
            </Modal>
            <Tooltip title={answer?.concept?.concept_name} placement='left'>
                {/* <div style={{ width: hide ? 'auto' : '50px', position: 'relative', display: 'inline-block' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        {fileType === 1 && (
                            <img
                                src={file.file_url}
                                alt={file.file_name}
                                loading="lazy"
                                style={{ maxHeight: "160px", objectFit: "contain", maxWidth: "100%", borderRadius: hide ? "0.5rem" : "4px" }}
                                className="media-item"
                            />
                        )}
                        {hide && fileType === 2 ?
                            <video
                                src={file.file_url}
                                controls
                                style={{ maxHeight: "160px", minWidth: "auto", maxWidth: "100%", objectFit: "contain", borderRadius: "0.5rem" }}
                                className="media-item"
                            />
                            :
                            fileType === 2 && (
                                <VideoLibraryIcon className="media-item" />
                            )}
                        {hide && fileType === 3 ?
                            <audio
                                src={file.file_url}
                                controls
                                style={{ maxHeight: 'auto', maxWidth: "auto", }}
                                className="media-item"
                            />
                            :
                            fileType === 3 && (
                                <AudiotrackIcon className="media-item" />
                            )}
                        {!hide &&
                            <IconButton
                                className="delete-icon"
                                style={{
                                    position: 'absolute',
                                    top: -15,
                                    right: -15,
                                    padding: '2px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease',
                                }}
                                onClick={handleDelete}
                            >
                                <DeleteOutlineIcon fontSize="small" color="error" style={{ height: "15px" }} />
                            </IconButton>}
                    </div>

                    {hide && fileType === 1 &&
                        <FullscreenIcon fontSize="large" onClick={handleFullscreen} style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            padding: '2px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            cursor: 'pointer'
                        }} />
                    }
                </div>
            </Tooltip>
            <style>
                {`
                .media-item {
                    position: relative;
                    display: inline-block;
                }

                .delete-icon {
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    padding: 2px;
                    background-color: rgba(255, 255, 255, 0.7);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .media-item:hover .delete-icon {
                    opacity: 1;
                }
                `}
            </style> */}


                <div style={{ width: hide ? 'auto' : '50px', position: 'relative', display: 'inline-block' }} className="media-container">
                    {fileType === 1 && (
                        <img
                            src={file.file_url}
                            alt={file.file_name}
                            loading="lazy"
                            style={{ maxHeight: "160px", objectFit: "contain", maxWidth: "100%", borderRadius: hide ? "0.5rem" : "4px" }}
                            className="media-item"
                        />
                    )}
                    {hide && fileType === 2 ?
                        <video
                            src={file.file_url}
                            controls
                            style={{ maxHeight: "160px", minWidth: "auto", maxWidth: "100%", objectFit: "contain", borderRadius: "0.5rem" }}
                            className="media-item"
                        />
                        :
                        fileType === 2 && (
                            <VideoLibraryIcon className="media-item" />
                        )}
                    {hide && fileType === 3 ?
                        <audio
                            src={file.file_url}
                            controls
                            style={{ maxHeight: 'auto', maxWidth: "auto", }}
                            className="media-item"
                        />
                        :
                        fileType === 3 && (
                            <AudiotrackIcon className="media-item" />
                        )}
                    {!hide &&
                        <IconButton
                            className="delete-icon"
                            onClick={handleDelete}
                        >
                            <DeleteOutlineIcon fontSize="small" color="error" style={{ height: "15px" }} />
                        </IconButton>}
                    {hide && fileType === 1 &&
                        <FullscreenIcon fontSize="large" onClick={handleFullscreen} style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            padding: '2px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            cursor: 'pointer'
                        }} />
                    }
                </div>
            </Tooltip>
            <style>
                {`
          .media-container {
            position: relative;
            display: inline-block;
          }
          .delete-icon {
            position: absolute;
            top: -15px;
            right: -15px;
            padding: 2px;
            background-color: rgba(255, 255, 255, 0.7);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .media-container:hover .delete-icon {
            opacity: 1;
          }
        `}
            </style>
        </>
    );
}