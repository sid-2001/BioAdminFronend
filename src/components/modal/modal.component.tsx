import Modal from "@mui/material/Modal";
import { ModalProps, SuccessContentProps } from "./modal.type";
import { FlexContainer, Desc } from "./modal.style";
// import { PageTitle } from "@/styles/page-title";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { GreenTick, 
    // Cross 
} from "@/assets/images";
// import CopyButton from "@/components/copy-button";
// import { Btn } from "@/styles/text-button";
import { Box, Typography, IconButton} from "@mui/material";
import { useEffect } from "react";
 
export function SuccessContent(props: SuccessContentProps) {
  const { 
    // id, 
    onClose, text, type } = props;
 
  // return (
  //   <FlexContainer>
  //     <img src={GreenTick} width={21} height={21} />
  //     <div style={{ flex: "1", flexDirection: "column" }}>
  //       <TitleContainer>
  //         <PageTitle>{text}</PageTitle>
  //         <Btn variant="text" onClick={onClose}>
  //           <img src={Cross} width={21} height={21} />
  //         </Btn>
  //       </TitleContainer>
  //       <CopyButton text={id} />
  //       <Desc variant="title1">
  //         Client {text} has been successfully added to the Client list !
  //       </Desc>
  //     </div>
  //   </FlexContainer>
  // );
 
  function truncateText(text: string, length: number) {
    if (text.length <= length) {
      return text;
    }
    return `${text.substr(0, length)}...`;
  }
 
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose])
 
 
  return (
    <FlexContainer>
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <Box style={{ display: "flex", gap: "1rem" }}>
          <img src={GreenTick} width={21} height={21} style={{ marginTop: "0.3rem" }} />
          <span style={{ display: "flex", flexDirection: "column" }}>
            <Typography style={{
              fontWeight: 700, color: "#033530", lineHeight: "140%", fontSize: "23px", fontStyle: "normal", wordWrap: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical"
            }}> {truncateText(text.charAt(0).toUpperCase() + text.slice(1), 30)}</Typography>
            {/* <CopyButton text={id} /> */}
          </span>
        </Box>
        {/* <img src={Cross} width={21} height={21} style={{ cursor: "pointer" }} onClick={onClose} /> */}
        <IconButton onClick={() => onClose()}>
        <CancelOutlinedIcon />
                          </IconButton>
      </Box>
      <Desc variant="title1" style={{ margin: "3rem 1rem 1rem 3rem", wordWrap: "break-word" }}>
        <span style={{ fontWeight: "bold" }}>{truncateText(text?.charAt(0)?.toUpperCase() + text?.slice(1), 30)}</span> has been successfully added to the {type} list !
      </Desc>
    </FlexContainer>
  );
}
 
const ModalComponent = (props: ModalProps) => {
  const {
    children,
    open,
    closeOnBackdropClick = false,
    onCloseCb,
    setOpen,
    style
  } = props;
 
  function onClose(_: object, reason: string) {
    if (reason === "backdropClick" && !closeOnBackdropClick) return;
 
    if (onCloseCb) onCloseCb();
 
    setOpen(false);
  }
 
  return (
    <Modal
      open={open}
      aria-labelledby="genric-modal"
      onClose={onClose}
      component="aside"
      style={style}
    // aria-describedby="modal-modal-description"
    >
      <>{children}</>
    </Modal>
  );
};
 
export default ModalComponent;