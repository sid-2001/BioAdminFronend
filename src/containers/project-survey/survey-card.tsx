import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
// import CommentsIcon from "@/assets/images/comments.png"
// import FilesIcon from "@/assets/images/files.png"
import {
  ContactType,
  FlexRowBox,
  PrimaryBox,
  // StyledCard,
  StyledCard1,
  StyledDiscriptionTypography,
  StyledMenuItems,
  StyledStatusTypography,
  StyledTypography,
} from "@/components/project-card-new/project-card-new.style";
import InfoIcon from "@mui/icons-material/Info";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Inputs as SurveyType } from "@/containers/surveys-list/surveys-list.container";
import {
  Box,
  Stack,
  IconButton,
  Typography,
  Menu,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
// import {
//   ProjectCardInternetIcon,
//   ProjectCardInternetIconHovered,
//   ProjectCardMessageIconHover,
//   ProjectCardQuestionIcon,
//   ProjectCardQuestionIconHovered,
// } from "@/assets/images"
// import CommentsIcon from "@/assets/images/comments.png"
import LinearProgress from "@mui/material/LinearProgress";
// import PollIcon from "@mui/icons-material/Poll"

interface CardWrapperPropTypes {
  survey: SurveyType;
  clickHandler?: (e: any) => void;
}

function truncateText(text: string, length: number) {
  if (text.length <= length) {
    return text;
  }
  return `${text.substr(0, length)}...`;
}

// const TypoColor = (bgId: any) => {
//   if (bgId == 1) {
//     return "#2444EA"
//   } else if (bgId == 2) {
//     return "#B2A31E"
//   } else if (bgId == 3) {
//     return "##DC821A"
//   } else if (bgId == 4) {
//     return "#4A4949"
//   } else if (bgId == 5) {
//     return "#0BB97A"
//   }
// }

// const BackGroundColor = (bgId: any) => {
//   if (bgId == 1) {
//     return "#b2bdf38b"
//   } else if (bgId == 2) {
//     return "#F2EAA5"
//   } else if (bgId == 3) {
//     return "#FFD8AA"
//   } else if (bgId == 4) {
//     return "#D9D9D9"
//   } else if (bgId == 5) {
//     return "#7AFCCD"
//   }
// }

const BackGroundColor = (statusId: number) => {
  if (statusId === 1) {
    return "#FFFFFF";
  } else if (statusId === 2) {
    return "#FFFFFF";
  } else if (statusId === 3) {
    return "#FFFFFF";
  } else if (statusId === 4) {
    return "#FFFFFF";
  } else if (statusId === 5) {
    return "#FFFFFF";
  }
  return "#FFFFFF"
};

const TypoColor = (statusId: number) => {
  if (statusId === 7) {
    return "#006400"
  } else if (statusId === 8) {
    return "#b22222"
  } else if (statusId === 9) {
    return "#1e90ff"
  } else if (statusId === 10) {
    return "#006400"
  } else if (statusId === 11) {
    return "#757575"
  } else if (statusId === 1) {
    return "#003366"
  } else if (statusId === 2) {
    return "#FF6F00"
  } else if (statusId === 3) {
    return "#000099"
  } else if (statusId === 4) {
    return "#800080"
  } else if (statusId === 5) {
    return "#B22222"
  } else if (statusId === 6) {
    return "#0000ff"
  }
  return "#B9200B"
}

// import { statusList } from "@/containers/survey-overview/survey-overview.container";
import { CardNext } from "@/assets/images";

function CardWrapper({ survey, clickHandler }: CardWrapperPropTypes) {
  const [downloadEl, setDownloadEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const openDownloadOptions = Boolean(downloadEl);

  const handleDownloadOptionsClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setDownloadEl(event.currentTarget);
  };

  const handleDownloadOptionsClose = (event: any) => {
    event.stopPropagation();
    setDownloadEl(null);
  };

  function onClick(e: any) {
    if (clickHandler) clickHandler(e);
  }

  function menuClickHandler(event: any, option: number) {
    switch (option) {
      case 1:
        onClick("");
        handleDownloadOptionsClose(event);
        break;

      default:
        break;
    }
  }

  console.log(survey);

  return (
    <StyledCard1
      onClick={onClick}
      style={{ width: "298px", maxHeight: "361px", minHeight: "340px" }}
    >
      <Stack spacing={1} width="100%">
        <FlexRowBox>
          <Typography variant="h6" className="nametypodesc">
            {survey?.market_name ? survey?.market_name : "NA"}
          </Typography>
          <Box>
            <IconButton
              sx={{
                width: "24px",
                height: "24px",
                padding: "0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "rgba(156, 156, 156, 1)",
                borderRadius: "0.25rem",
              }}
              id="download-options"
              aria-controls={
                openDownloadOptions ? "download-options" : undefined
              }
              aria-haspopup="true"
              aria-expanded={openDownloadOptions ? "true" : undefined}
              onClick={(e) => {
                handleDownloadOptionsClick(e);
              }}
            >
              <MoreHorizOutlinedIcon sx={{ color: "#9C9C9C" }} />
            </IconButton>
          </Box>
          <Menu
            id="download-menu"
            anchorEl={downloadEl}
            open={openDownloadOptions}
            onClose={handleDownloadOptionsClose}
            MenuListProps={{
              "aria-labelledby": "download-button",
            }}
          >
            <StyledMenuItems onClick={(e) => menuClickHandler(e, 1)}>
              <InfoIcon width={20} height={20} />
              <Typography variant="body2">Show Details</Typography>
            </StyledMenuItems>
          </Menu>
        </FlexRowBox>
        <LinearProgress
          value={100}
          variant="determinate"
          color="info"
          sx={{
            height: "2px",
            width: "100%",
          }}
        />
        <FlexRowBox style={{ marginTop: "0.8rem" }}>
          <Tooltip
            title={
              survey.survey_name?.charAt(0)?.toUpperCase() +
              survey.survey_name?.slice(1)
            }
            disableHoverListener={survey.survey_name?.length <= 30}
          >
            <StyledTypography variant="h6" className="nametypo">
              {survey.survey_name}
            </StyledTypography>
          </Tooltip>
        </FlexRowBox>
        <Tooltip
          title={survey.description}
          disableHoverListener={survey.description?.length <= 99}
        >
          <StyledDiscriptionTypography
            variant="body2"
            className="nametypodesc"
            marginTop="0.8rem"
          >
            {truncateText(survey.description, 99)}
          </StyledDiscriptionTypography>
        </Tooltip>
      </Stack>
      <Stack spacing={3}>
        <Stack>
          <div
            style={{
              // marginRight: "auto",
              display: "grid",
              alignItems: "center",
              gap: "1rem 0.3rem",
              // marginTop: "1rem",
              // width: "200px",
              // height: "32px",
              gridTemplateColumns: "86px 86px 86px",
              gridTemplateRows: "32px 32px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  paddingLeft: "5px",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "16.94px",
                }}
                className="nametypodesc"
              >
                {survey?.last_complete
                  ? `${moment(survey?.last_complete).fromNow()}`
                  : "NA"}
              </span>
              <span
                style={{
                  paddingLeft: "5px",
                  fontSize: "13px",
                  color: "#7A7A7A",
                }}
                className="nametypodesctext"
              >
                last com.
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // marginLeft: "-14px",
                // marginRight: "15px"
              }}
            >
              <span
                className="nametypodesc"
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "16.94px",
                }}
              >
                ${survey?.cpi ? survey?.cpi.toFixed(2) : '0.00'}
              </span>
              <span
                style={{
                  // paddingLeft: "5px",
                  fontSize: "13px",
                  color: "#7A7A7A",
                }}
                className="nametypodesctext"
              >
                CPI
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                className="green"
                style={{
                  color: "#1DA522",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "16.94px",
                }}
              >
                &nbsp; {survey?.conversion ? `${survey?.conversion.toFixed(2)}%` : "0%"}
              </span>
              <span
                style={{
                  paddingLeft: "5px",
                  fontSize: "13px",
                  color: "#1DA522",
                }}
                className="green"
              >
                Conv.
              </span>
            </div>
            {/* <div style={{ display: "flex", alignItems: "center" }}>
            <img src={ProjectCardInternetIcon} className='allIcons' />
            <img
              src={ProjectCardInternetIconHovered}
              alt=''
              className='allIconsHover'
              style={{ display: "none" }}
            />
            <span style={{ paddingLeft: "5px" }} className='nametypodesc'>
              {survey?.loi ? survey?.loi : 0}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={ProjectCardQuestionIcon} alt='' className='allIcons' />
            <img
              src={ProjectCardQuestionIconHovered}
              alt=''
              className='allIconsHover'
              style={{ display: "none" }}
            />
            <span style={{ paddingLeft: "5px" }} className='nametypodesc'>
              {survey?.sample_size ? survey?.sample_size : 0}
            </span>
          </div> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  paddingLeft: "5px",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "16.94px",
                }}
                className="nametypodesc"
              >
                {survey?.starts ? survey?.starts : "N/A"}
              </span>
              <span
                style={{
                  paddingLeft: "5px",
                  fontSize: "13px",
                  color: "#7A7A7A",
                }}
                className="nametypodesctext"
              >
                Starts
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // marginLeft: "10px",
              }}
            >
              <span
                className="nametypodesc"
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "16.94px",
                }}
              >
                {survey?.terminate ? survey?.terminate : 0}
              </span>
              <span
                style={{
                  // paddingLeft: "5px",
                  fontSize: "13px",
                  color: "#7A7A7A",
                }}
                className="nametypodesctext"
              >
                Terms.
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                className="green"
                style={{
                  color: "#1DA522",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "16.94px",
                }}
              >
                &nbsp;{" "}
                {survey?.completed && survey?.sample_size
                  ? `${survey.completed}/${survey.sample_size}`
                  : "N/A"}
              </span>
              <span
                style={{
                  paddingLeft: "5px",
                  fontSize: "13px",
                  color: "#1DA522",
                }}
                className="green"
              >
                Compl.
              </span>
            </div>
          </div>
          {/* <div style={{ display: "flex", alignItems: "center" }}>
            <img src={ProjectCardInternetIcon} className='allIcons' />
            <img
              src={ProjectCardInternetIconHovered}
              alt=''
              className='allIconsHover'
              style={{ display: "none" }}
            />
            <span style={{ paddingLeft: "5px" }} className='nametypodesc'>
              {survey?.loi ? survey?.loi : 0}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={ProjectCardQuestionIcon} alt='' className='allIcons' />
            <img
              src={ProjectCardQuestionIconHovered}
              alt=''
              className='allIconsHover'
              style={{ display: "none" }}
            />
            <span style={{ paddingLeft: "5px" }} className='nametypodesc'>
              {survey?.sample_size ? survey?.sample_size : 0}
            </span>
          </div> */}
        </Stack>
        <FlexRowBox className="project-card-flex-box">
          <PrimaryBox
            display="flex"
            justifyContent="center"
            sx={{
              background: BackGroundColor(Number(survey?.status_id)),
              // background: "rgba(223, 168, 116, 0.20)",
              // opacity: 0.8,
              border: `1px solid ${TypoColor(Number(survey?.status_id))}`,
            }}
          >
            <ContactType
              sx={{
                color: TypoColor(Number(survey?.status_id)),
                // color: "rgba(213, 141, 73, 1)",
              }}
            >
              <StyledStatusTypography>
                {/* {survey?.status_id &&
                  statusList.find((item) => item.id === survey?.status_id)
                    ?.name} */}
                {
                  survey?.survey_status_name
                }
              </StyledStatusTypography>
            </ContactType>
          </PrimaryBox>
          <IconButton
            sx={{
              borderRadius: "0",
              padding: "4px",
            }}
            className="nextBtn"
            onClick={() => {
              navigate(`/projects/${survey.project_id}/surveys/${survey.id}`);
            }}
          >
            <img src={CardNext} alt="" />
          </IconButton>
        </FlexRowBox>
      </Stack>
    </StyledCard1>
  );
}

export default CardWrapper;
