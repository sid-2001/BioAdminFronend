import { ArrowUp } from "@/assets/images"
import QuestionTypeIcon from "@/constants/questionTypeIcon"
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
import { useState } from "react"

const BuilderSwitchQuestions = ({ setSelectedQuestion, swapList, questionTypeList }: any) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    let singlegridobject = {
        // prompt_id: 20849,
        prompt_code: "1",
        prompt_text: "",
        add_other_option: false,
        keep_answer_position: false,
        sort_order: 1,
        is_active: true,
        is_exclusive: false
    }

    return (
        <Tooltip
            placement="right"
            title=''

        >
            <Box style={{ display: swapList?.length ? "" : "none" }} >
                <IconButton style={{ margin: "0rem 0rem 0rem 0rem", padding: "0.8rem 0.5rem 0.8rem 0.5rem" }} onClick={(e: any) => {
                    e.stopPropagation()
                    handleClick(e)
                }}>

                    <img src={ArrowUp} />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >

                    {questionTypeList?.filter((value: any) => swapList?.includes(value?.id))?.map((value: any, i: any) => (
                        <MenuItem
                            key={i}

                            onClick={(e) => {
                                e.stopPropagation()

                                // setChangedQuestionId(1)

                                setSelectedQuestion((prevState: any) => ({
                                    ...prevState,
                                    question_type_id: value.id,
                                    // prompt_answer: value?.id === 12 ? [{ ...singlegridobject }] : value?.id === 1 ? undefined : undefined
                                    // prompt_answer: value?.prompt_answer ? value.prompt_answer : (value?.id === 12 ? [{ ...singlegridobject }] : value?.id === 1 ? undefined : undefined)
                                    // prompt_answer: (value?.id === 12 || value?.id === 13 || value?.id === 17) ? value.prompt_answer?.length > 0 ? value.prompt_answer : [{ ...singlegridobject }] : []
                                    prompt_answer: (value?.id === 12 || value?.id === 13 || value?.id === 17) ? value.prompt_answer?.length > 0 ? value.prompt_answer : [{ ...singlegridobject }] : []
                                }));



                                handleClose()
                            }}
                        >
                            <QuestionTypeIcon typeId={Number(value.id)} />
                            {'  '}&nbsp;
                            <Typography variant="caption">{value.name}</Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </Tooltip >
    )
}

export default BuilderSwitchQuestions;