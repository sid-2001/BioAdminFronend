import {
  Stack,
  // Tooltip
} from "@mui/material";
import {
  ContactType,
  FlexRowBox,
  PrimaryBox,
  StyledCard,
  StyledDiscriptionTypography,
  StyledTypography,
} from "./project-card.style";
// import { NotificationIcon } from "@/assets/images";
import "../../global.css";
import { ProjectCardProps } from "./project-card.type";
import { useNavigate } from "react-router-dom";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import CommentsIcon from "@/assets/images/comments.png";
import FilesIcon from "@/assets/images/files.png";

const ProjectCard = (props: ProjectCardProps) => {
  const { project } = props;
  const navigate = useNavigate();

  // const BackGroundColor = (bgId: any) => {
  //   if (bgId == 1) {
  //     return "#b2bdf38b";
  //   } else if (bgId == 2) {
  //     return "#F2EAA5";
  //   } else if (bgId == 3) {
  //     return "#FFD8AA";
  //   } else if (bgId == 4) {
  //     return "#D9D9D9";
  //   } else if (bgId == 5) {
  //     return "#7AFCCD";
  //   } else if (bgId == 6) {
  //     return "#76DDB7";
  //   } else if (bgId == 7) {
  //     return "#FFE4FF";
  //   }
  // };

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
        navigate(`/projects/${project.project_id}/overview`);
      }}
    >
      <Stack spacing={1} width="100%">
        <FlexRowBox>
          <PrimaryBox
            display="flex"
            justifyContent="center"
            sx={{
              background: BackGroundColor(project?.status_id),
              // opacity: 0.8,
            }}
          >
            <ContactType
              sx={{
                color: "black",
              }}
            >
              {project?.status_name && project?.status_name?.toUpperCase()}
            </ContactType>
          </PrimaryBox>
          <MoreHorizOutlinedIcon sx={{ color: "black" }} />
        </FlexRowBox>
        <FlexRowBox>
          {/* <Tooltip
            title={
              project.project_name?.charAt(0)?.toUpperCase() +
              project.project_name?.slice(1)
            }
            disableHoverListener={project.project_name?.length <= 30}
          > */}
          <StyledTypography variant="h6">
            {project.project_name}
          </StyledTypography>
          {/* </Tooltip> */}
        </FlexRowBox>
        {/* <Tooltip
          title={project.project_description}
          disableHoverListener={project.project_description?.length <= 60}
        > */}
        <StyledDiscriptionTypography variant="body2">
          {truncateText(project.project_description, 60)}
        </StyledDiscriptionTypography>
        {/* </Tooltip> */}
      </Stack>
      <FlexRowBox className="project-card-flex-box">
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "20px",
            }}
          >
            <img src={CommentsIcon} alt="" />
            <span style={{ paddingLeft: "5px", color: "darkgray" }}>
              {" "}
              {project?.thread_counts ? project?.thread_counts : 0}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={FilesIcon} alt="" />
            <span style={{ paddingLeft: "5px", color: "darkgray" }}>
              {" "}
              {project?.estimates_hrs ? project?.estimates_hrs : 0}
            </span>
          </div>
        </div>
      </FlexRowBox>
    </StyledCard>
  );
};

export default ProjectCard;
