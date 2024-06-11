import { Chip, IconButton, Stack, Tooltip } from "@mui/material"
import { DetailsBox } from "./project-sidebar.style"
import { ProjectSidebarComponentProps } from "./project-sidebar.type"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Box } from "@mui/material"
import { theme } from "@/constants/theme"
import { CommentIcon } from "@/assets/images"
import { SettingsOutlined } from "@mui/icons-material"

const ProjectSidebarComponent = ({
  sideBarImages,
  survey,
}: ProjectSidebarComponentProps) => {

  console.log(sideBarImages, "qwertyuisideBarImagessideBarImages")
  let navigate = useNavigate()
  let location = useLocation()
  let { projectId, surveyId } = useParams()
  // console.log(location.pathname.split('/').pop(), "location.pathname")

  const CustomChip = (label: string, path: string) => {
    return (
      <Chip
        onClick={() => navigate(`/projects/${projectId}/survey/${surveyId}/data/${path}`)}
        color='primary'
        label={label}
        variant={
          location.pathname.split("/").pop() == path.split("/").pop()
            ? "filled"
            : "outlined"
        }
        style={{ padding: "0rem 1rem" }}
      />
    )
  }

  return (
    <>
      <Box
        style={{
          width: "calc(100vw - 120px)",
          zIndex: 500,
          display:
            location.pathname.split("/").pop() == "cleaning" ||
              location.pathname.split("/").pop() == "banner" ||
              location.pathname.split("/").pop() == "tabulation" ||
              location.pathname.split("/").pop() == "exports"
              ? "flex"
              : "none",
          flex: 1,
          justifyContent: "space-between",
          marginLeft: "4rem",
        }}
      >
        <Stack direction='row' alignItems='center' spacing={2}>
          {CustomChip("Cleaning", "config/cleaning")}
          {CustomChip("Banner", "config/banner")}
          {CustomChip("Tabulation", "config/tabulation")}
          {CustomChip("Exports", "config/exports")}
        </Stack>

        <Stack direction='row' alignItems='center' spacing={2}>
          <IconButton size='small'>
            <img src={CommentIcon} />
          </IconButton>
          <IconButton size='small'>
            <SettingsOutlined
              sx={{
                color: "white",
                backgroundColor: theme.palette.primary.main,
                borderRadius: "0.5rem",
              }}
            />
          </IconButton>
        </Stack>
      </Box>
      <Stack
        spacing={1}
        alignItems='center'
        sx={{
          height: "calc(100vh - 230px)",
          borderRadius: "1rem",
          position: "absolute",
          marginTop:
            location.pathname.split("/").pop() == "cleaning" ||
              location.pathname.split("/").pop() == "banner" ||
              location.pathname.split("/").pop() == "tabulation" ||
              location.pathname.split("/").pop() == "exports"
              ? "-2.2rem"
              : "0px",
        }}
      >
        {sideBarImages && sideBarImages?.map((value, index) => {
          let title = value?.state
            ?.split("/")
          [value?.state?.split("/")?.length - 1].toLowerCase()
            .split(" ")
            .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ")
          // console.log(value?.state, location.pathname, "value?.state?.url === location.pathnamevalue?.state?.url === location.pathnamevalue?.state?.url === location.pathname")

          return (
            <Tooltip title={title ? title : ""} placement='right-end'>
              <DetailsBox
                key={index}
                sx={{ padding: survey ? "0.5rem" : "" }}
                isActive={value?.state === location.pathname ? true : false}
                onClick={() => {
                  if (value?.navigate) {
                    navigate(value?.navigate)
                  } else {
                  }
                }}
              >
                <img
                  src={`${value.image}`}
                  height={
                    survey
                      ? value?.state?.split("/")[
                        value?.state?.split("/")?.length - 1
                      ] === "qualification"
                        ? "20px"
                        : value?.state?.split("/")[
                          value?.state?.split("/")?.length - 1
                        ] === "supply"
                          ? "28px"
                          : "24px"
                      : "40px"
                  }
                />
              </DetailsBox>
            </Tooltip>
          )
        })}
      </Stack>
    </>
  )
}

export default ProjectSidebarComponent
