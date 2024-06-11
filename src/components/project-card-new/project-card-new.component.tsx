import {
  Box,
  IconButton,
  Menu,
  Stack,
  Tooltip,
  Typography,
  // Tooltip
} from "@mui/material";
import {
  ContactType,
  FlexRowBox,
  PrimaryBox,
  StyledCard,
  StyledDiscriptionTypography,
  StyledMenuItems,
  StyledStatusTypography,
  StyledTypography,
} from "./project-card-new.style";
// import { NotificationIcon } from "@/assets/images";
import "../../global.css";
import { ProjectCardProps } from "./project-card-new.type";
import { useNavigate } from "react-router-dom";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import CommentsIcon from "@/assets/images/comments.png";
// import FilesIcon from "@/assets/images/files.png"
import {
  ProjectCardFileIcon,
  ProjectCardFileIconHovered,
  ProjectCardInternetIcon,
  ProjectCardInternetIconHovered,
  ProjectCardMessageIconHover,
  ProjectCardQuestionIcon,
  ProjectCardQuestionIconHovered,
  ProjectCardScratchIcon,
  ProjectCardScratchIconHovered,
  FileIconHovered,
  ScratchIconHovered
} from "@/assets/images";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen"
// import GetAppIcon from "@mui/icons-material/GetApp"
import { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";

const ProjectCardNew = (props: ProjectCardProps) => {
  const { project } = props;
  let navigate = useNavigate();

  const [downloadEl, setDownloadEl] = useState<null | HTMLElement>(null);

  const openDownloadOptions = Boolean(downloadEl);

  const handleDownloadOptionsClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setDownloadEl(event.currentTarget);
  };

  const handleDownloadOptionsClose = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setDownloadEl(null);
  };

  const handleDetailsOptionsClose = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setDownloadEl(null);
    navigate(`/projects/${project.project_id}/overview`);
  };
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
  //   } else if (bgId == 6) {
  //     return "#76DDB7"
  //   } else if (bgId == 7) {
  //     return "#FFE4FF"
  //   }
  // }

  // const TypoColor = (bgId: any) => {
  //   if (bgId == 1) {
  //     return "#2444EA";
  //   } else if (bgId == 2) {
  //     return "#B2A31E";
  //   } else if (bgId == 3) {
  //     return "##DC821A";
  //   } else if (bgId == 4) {
  //     return "#4A4949";
  //   } else if (bgId == 5) {
  //     return "#0BB97A";
  //   } else if (bgId == 6) {
  //     return "#15450D";
  //   } else if (bgId == 7) {
  //     return "#9620B4";
  //   }
  // };

  const TypoColor = (bgId: any) => {
    if (bgId == 1) {
      return "#2444EA";
    } else if (bgId == 2) {
      return "#B2A31E";
    } else if (bgId == 3) {
      return "##DC821A";
    } else if (bgId == 4) {
      return "#4A4949";
    } else if (bgId == 5) {
      return "#0BB97A";
    } else if (bgId == 6) {
      return "#15450D";
    } else if (bgId == 7) {
      return "#9620B4";
    }
  };

  const BackGroundColor = (bgId: any) => {
    if (bgId == 1) {
      return "#b2bdf38b";
    } else if (bgId == 2) {
      return "#F2EAA5";
    } else if (bgId == 3) {
      return "#FFD8AA";
    } else if (bgId == 4) {
      return "#D9D9D9";
    } else if (bgId == 5) {
      return "#7AFCCD";
    } else if (bgId == 6) {
      return "#76DDB7";
    } else if (bgId == 7) {
      return "#FFE4FF";
    }
  };

  const ProjectIcons = (typeId: any) => {
    if (typeId === 1) {
      return ProjectCardScratchIcon
    } else if (typeId === 2) {
      return ProjectCardFileIcon
    } else {
      return ProjectCardFileIcon
    }
  }

  function truncateText(text: string, length: number) {
    if (text.length <= length) {
      return text;
    }
    return `${text.substr(0, length)}...`;
  }

  return (
    <StyledCard
      sx={{ boxShadow: "none" }}
      onClick={() => {
        // event.stopPropagation()
        navigate(`/projects/${project.project_id}/overview`);
      }}
      className='newCardContainer'
    >
      <Stack spacing={1} width="100%">
        <FlexRowBox>
          {/* <img src={ProjectCardFileIcon} height={32} className="allIcons" />
          <img
            src={ProjectCardFileIconHovered}
            height={32}
            style={{ display: "none" }}
            className="allIconsHover"
          /> */}
          <Tooltip
            title={
              project.type_id === 2
                ? "Questionnaire"
                : project.type_id === 1
                  ? "Self Created"
                  : "Questionnaire"
            }
            placement="top"
            arrow
          >
            <Box className="projectIconContainer">
              <img
                src={ProjectIcons(project.type_id)}
                height={32}
                className="defaultIcon"
              />
              {project.type_id === 2 ? (
                <img
                  src={FileIconHovered}
                  height={32}
                  style={{ display: "none", position: "absolute" }}
                  className="hoverIconCard"
                />
              ) : project.type_id === 1 ? (
                <img
                  src={ScratchIconHovered}
                  height={32}
                  style={{ display: "none" }}
                  className="hoverIconCard"
                />
              ) : (
                <img
                  src={FileIconHovered}
                  height={32}
                  style={{ display: "none" }}
                  className="hoverIconCard"
                />
              )}
              {project.type_id === 2 ? (
                <img
                  src={ProjectCardFileIconHovered}
                  height={32}
                  style={{ display: "none", position: "absolute" }}
                  className="hoverIcon"
                />
              ) : project.type_id === 1 ? (
                <img
                  src={ProjectCardScratchIconHovered}
                  height={32}
                  style={{ display: "none" }}
                  className="hoverIcon"
                />
              ) : (
                <img
                  src={ProjectCardFileIconHovered}
                  height={32}
                  style={{ display: "none" }}
                  className="hoverIcon"
                />
              )}
            </Box>
          </Tooltip>
          {/* <PrimaryBox
            display='flex'
            justifyContent='center'
            sx={{
              background: BackGroundColor(project?.status_id),
              // background: "rgba(223, 168, 116, 0.20)",
              // opacity: 0.8,
            }}
          >
            <ContactType
              sx={{
                color: "black",
                // color: "rgba(213, 141, 73, 1)",
              }}
            >
              {project?.status_name && project?.status_name?.toUpperCase()}
            </ContactType>
          </PrimaryBox> */}
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
              onClick={(e:any) => {
                handleDownloadOptionsClick(e);
              }}
            >
              {/* <MoreHorizIcon width={10} height={10} /> */}
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
            <StyledMenuItems
              onClick={(event: any) => handleDetailsOptionsClose(event)}
            >
              <InfoIcon width={20} height={20} />
              <Typography variant="body2">Show Details</Typography>
            </StyledMenuItems>
          </Menu>
        </FlexRowBox>
        <FlexRowBox style={{ marginTop: "2rem" }}>
          <Tooltip
            title={
              project.project_name?.charAt(0)?.toUpperCase() +
              project.project_name?.slice(1)
            }
            disableHoverListener={project.project_name?.length <= 30}
          >
            <StyledTypography variant="h6" className="nametypo">
              {project.project_name}
            </StyledTypography>
          </Tooltip>
        </FlexRowBox>
        <Tooltip
          title={project.project_description}
          disableHoverListener={project.project_description?.length <= 99}
        >
          <StyledDiscriptionTypography variant="body2" className="nametypodesc">
            {truncateText(project.project_description, 99)}
          </StyledDiscriptionTypography>
        </Tooltip>
        <div
          style={{
            marginRight: "auto",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem",
            // justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              // marginRight: "20px",
            }}
          >
            <img src={CommentsIcon} alt="" className="allIcons" />
            <img
              src={ProjectCardMessageIconHover}
              alt=""
              className="allIconsHover"
              style={{ display: "none" }}
            />
            <span style={{ paddingLeft: "5px" }} className="nametypodesc">
              {project?.thread_counts ? project?.thread_counts : 0}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={ProjectCardInternetIcon} className="allIcons" />
            <img
              src={ProjectCardInternetIconHovered}
              alt=""
              className="allIconsHover"
              style={{ display: "none" }}
            />
            <span style={{ paddingLeft: "5px" }} className="nametypodesc">
              {project?.market_id.length}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={ProjectCardQuestionIcon} alt="" className="allIcons" />
            <img
              src={ProjectCardQuestionIconHovered}
              alt=""
              className="allIconsHover"
              style={{ display: "none" }}
            />
            <span style={{ paddingLeft: "5px" }} className="nametypodesc">
              {project?.questions_count ? project?.questions_count : 0}
            </span>
          </div>
        </div>
      </Stack>
      <FlexRowBox className="project-card-flex-box">
        <PrimaryBox
          display="flex"
          justifyContent="center"
          sx={{
            background: BackGroundColor(project?.status_id),
            // background: "rgba(223, 168, 116, 0.20)",
            // opacity: 0.8,
          }}
        >
          <ContactType
            sx={{
              color: TypoColor(project?.status_id),
              // color: "rgba(213, 141, 73, 1)",
            }}
          >
            <StyledStatusTypography>
              {project?.status_name && project?.status_name?.toUpperCase()}
            </StyledStatusTypography>
          </ContactType>
        </PrimaryBox>
      </FlexRowBox>
    </StyledCard>
  );
};

export default ProjectCardNew;
