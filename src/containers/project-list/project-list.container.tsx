// import AddCard from "@/components/add-card"
import { GridContainerProjectNew } from '@/styles/grid'
import { useEffect, useState } from 'react'
import { logger } from '@/helpers/logger'
// import ProjectCard from "@/components/project-card"
import LoadingSpinner from '@/components/loader'
import { Box, Stack, Typography, IconButton, Menu, Tooltip } from '@mui/material'
import { ProjectService } from '@/services/projects.service'
import { useSnackbar } from 'notistack'
import { Project } from '@/types/project.type'
import CreateProject from '@/components/create-project'
import { PageWrapper } from '@/styles/page-wrapper'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { ListService, StatusListType } from '@/services/list.service'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import CommentsIcon from '@/assets/images/comments.png'
import { styled } from '@mui/system'
import AddBtn from '@/components/add-btn'
import { useNavigate } from 'react-router-dom'
import InfoIcon from '@mui/icons-material/Info'
import {
  FileIconHovered,
  PinProjectIcon,
  ProjectCardFileIcon,
  ProjectCardFileIconHovered,
  ProjectCardInternetIcon,
  ProjectCardInternetIconHovered,
  // ProjectCardMessageIconHover,
  ProjectCardQuestionIcon,
  ProjectCardQuestionIconHovered,
  ProjectCardScratchIcon,
  ProjectCardScratchIconHovered,
  ScratchIconHovered,
  // ThreadIconNew,
} from '@/assets/images'
// import ProjectCardNew from "@/components/project-card-new"
import {
  CardNext,
  // Email,
  // Web,
  // SVGFilesIcon as FilesIcon,
} from '@/assets/images'
import {
  NewCard,
  ProjectDetails,
  StatusBox,
  StatusBoxTypography,
  StyledDetails,
  StyledDiscription,
  StyledHeading,
  // TextAvatar,
} from '@/styles/new-card'
// import { getInitials } from "../clients-list/clients-list.container"
import { StyledMenuItems } from '@/components/project-card-new/project-card-new.style'

export const FilterBox = styled(Box)(() => ({
  '& *:before': {
    borderBottom: 'none !important',
    fontSize: '12px !important',
  },

  '& label': {
    borderBottom: 'none !important',
    fontSize: '12px !important',
    fontWeight: '300',
  },

  '& div': {
    marginTop: '2px !important',
    fontWeight: '500',
    color: '#323232 !important',
  },

  '& svg': {
    color: '#323232 !important',
  },
}))

const ProjectListContainer = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState(false)
  const listService = new ListService()
  const [statuses, setStatuses] = useState<Array<StatusListType>>([])
  const [clients, setClients] = useState<Array<StatusListType>>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentObjectId, setCurrentObjectId] = useState<string | null>(null)

  const projectsService = new ProjectService()
  const { enqueueSnackbar } = useSnackbar()

  const [selectedStatus, setSelectedStatus] = useState<Array<number>>([])
  const [selectedClient, setSelectedClient] = useState<Array<number>>([])

  const openOptions = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, objectUid: string) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setCurrentObjectId(objectUid)
  }

  const handleMenuClose = (event: any) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return `${description.slice(0, maxLength)}...`
    }
    return description
  }

  // const getProjects = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await projectsService.get_projects();
  //     setProjects(data);
  //     setLoading(false);
  //   } catch (error) {
  //     logger.error(error);
  //     setLoading(false);
  //     if ((error as any)?.response?.status === 403) {
  //       enqueueSnackbar("Access denied: Insufficient permissions.", {
  //         variant: "error",
  //       });
  //     } else {
  //       enqueueSnackbar("An error occurred while retrieving the projects.", {
  //         variant: "error",
  //       });
  //     }
  //   }
  // };

  const TypoColor = (bgId: any) => {
    if (bgId == 1) {
      return "#4169E1"  // Opportunity
    } else if (bgId == 2) {
      return "#228B22"  // Live
    } else if (bgId == 3) {
      return "#FF8C00"  // Completed
    } else if (bgId == 4) {
      return "#008080"  // Invoiced
    } else if (bgId == 5) {
      return "#DAA520"  // Won
    } else if (bgId == 6) {
      return "#A020F0"  // Closed
    } else if (bgId == 7) {
      return "#708090"  // On Hold
    } else if (bgId == 8) {
      return "#DC143C"  // Lost
    }
  }

  const BackGroundColor = (bgId: any) => {
    if (bgId == 1) {
      return '#FFFFFF'
    } else if (bgId == 2) {
      return '#FFFFFF'
    } else if (bgId == 3) {
      return '#FFFFFF'
    } else if (bgId == 4) {
      return '#FFFFFF'
    } else if (bgId == 5) {
      return '#FFFFFF'
    } else if (bgId == 6) {
      return '#FFFFFF'
    } else if (bgId == 7) {
      return '#FFFFFF'
    } else if (bgId == 8) {
      return '#FFFFFF'
    }
  }

  const ProjectIcons = (typeId: any) => {
    if (typeId === 1) {
      return ProjectCardScratchIcon
    } else if (typeId === 2) {
      return ProjectCardFileIcon
    } else {
      return ProjectCardFileIcon
    }
  }

  // const ProjectIconsHover = (typeId: any) => {
  //   if (typeId === 1) {
  //     return ProjectCardFileIconHovered
  //   } else if (typeId === 2) {
  //     return ProjectCardScratchIconHovered
  //   } else {
  //     return ProjectCardFileIconHovered
  //   }
  // }

  async function filterProjects(statuses: number[], clients: number[]) {
    setLoading(true)
    try {
      const data = await projectsService.projectFilterList({
        statuses: statuses,
        clients: clients,
      })
      setProjects(data)
      setLoading(false)
    } catch (error) {
      logger.error(error)
      setLoading(false)
      if ((error as any)?.response?.status === 403) {
        enqueueSnackbar('Access denied: Insufficient permissions.', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar('An error occurred while retrieving the projects.', {
          variant: 'error',
        })
      }
    }
  }

  console.log(setProjects, 'abcd')

  useEffect(() => {
    // getProjects();
    filterProjects([], [])
  }, [])

  const handleClick = () => {
    setOpenModal(true)
  }
  const handleClose = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    listService.get_project_status().then((data) => setStatuses(data))
  }, [])

  useEffect(() => {
    listService.get_client_list().then((data) => setClients(data))
  }, [])

  function statusChangeHandler(e: any) {
    if (Number(e.target.value) === 999) setSelectedStatus([])
    else setSelectedStatus([Number(e.target.value)])
  }

  function clientsChangeHandler(e: any) {
    if (Number(e.target.value) === 999) setSelectedClient([])
    else setSelectedClient([Number(e.target.value)])
  }

  useEffect(() => {
    filterProjects(selectedStatus, selectedClient)
  }, [selectedStatus, selectedClient])

  const [pinnedProjects, setPinnedProjects] = useState<Array<string | number>>(
    localStorage.getItem('admin-pinnedProjectsIds') ? JSON.parse(localStorage.getItem('admin-pinnedProjectsIds') || '') : [],
  )

  function toggleProjectPin(id: string | number) {
    let temp = [...pinnedProjects]

    if (temp.includes(id)) temp = temp.filter((pid) => pid !== id)
    else temp.push(id)

    setPinnedProjects(temp)
    localStorage.setItem('admin-pinnedProjectsIds', JSON.stringify(temp))
  }

  function reorderProjects(projects: Project[]) {
    const temp1: Project[] = []
    const temp2: Project[] = []

    projects.forEach((project) => {
      if (pinnedProjects.includes(project.project_id || '')) temp1.push(project)
      else temp2.push(project)
    })
    return [...temp1, ...temp2]
  }

  return (
    <PageWrapper
      style={{
        // background: "white",
        borderRadius: '12px',
        height: 'calc(100vh - 142px)',
      }}
    >
      <Box
        style={{
          width: '100%',
          position: 'sticky',
          top: '0px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          // background: "white",
          zIndex: 10,
          padding: '1rem 2rem 0rem 2rem',
          marginBottom: '1rem',
        }}
      >
        <Stack direction="row" gap="1rem">
          <Typography variant="h6">Projects</Typography>
          <AddBtn onClick={handleClick} />
        </Stack>

        <Box
          sx={{
            display: 'flex',
            gap: '86px',
          }}
        >
          <FilterBox>
            <FormControl
              variant="standard"
              sx={{
                minWidth: 120,
                maxWidth: 120,
                border: 'none',
                outline: 'none',
              }}
            >
              <InputLabel id="status">Status</InputLabel>
              <Select
                onChange={statusChangeHandler}
                labelId="status"
                value={selectedStatus.length === 0 ? 999 : selectedStatus[0]}
                id="status-select"
                sx={{ fontSize: '14px' }}
                label="Status"
              >
                <MenuItem value={999}>All</MenuItem>
                {statuses.map((status) => (
                  <MenuItem value={status.id}> {status.name} </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FilterBox>

          <FilterBox>
            <FormControl
              variant="standard"
              sx={{
                minWidth: 120,
                maxWidth: 120,
                border: 'none',
                outline: 'none',
              }}
            >
              <InputLabel id="status">Clients</InputLabel>
              <Select
                onChange={clientsChangeHandler}
                value={selectedClient.length === 0 ? 999 : selectedClient[0]}
                labelId="clients"
                id="clients-select"
                sx={{ fontSize: '14px' }}
                label="Clients"
              >
                <MenuItem value={999}>All</MenuItem>
                {clients.map((client) => (
                  <MenuItem value={client.id}> {client.name} </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FilterBox>
        </Box>
      </Box>
      <Box sx={{ padding: '0rem 2rem 0rem 2rem' }}>
        <CreateProject open={openModal} handleClose={handleClose} getProjects={() => filterProjects([], [])} />
        {projects.length <= 0 && !loading ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography>There is no Project</Typography>
          </Box>
        ) : (
          <GridContainerProjectNew style={{ marginBottom: '2rem' }}>
            {/* <AddCard handleClick={handleClick} /> */}
            {reorderProjects(projects)?.map((project) => {
              return (
                <NewCard
                  key={project.project_id}
                  className="newCardContainer"
                  onClick={() => {
                    navigate(`/projects/${project.project_id}/overview`)
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      paddingBottom: '12px',
                      borderBottom: '2px solid #FDB447',
                    }}
                  >
                    <Tooltip
                      title={project.type_id === 2 ? 'Questionnaire' : project.type_id === 1 ? 'Self Created' : 'Questionnaire'}
                      placement="top"
                      arrow
                    >
                      <Box className="projectIconContainer">
                        <img src={ProjectIcons(project.type_id)} height={32} className="defaultIcon" />
                        {project.type_id === 2 ? (
                          <img src={FileIconHovered} height={32} style={{ display: 'none', position: 'absolute' }} className="hoverIconCard" />
                        ) : project.type_id === 1 ? (
                          <img src={ScratchIconHovered} height={32} style={{ display: 'none' }} className="hoverIconCard" />
                        ) : (
                          <img src={FileIconHovered} height={32} style={{ display: 'none' }} className="hoverIconCard" />
                        )}
                        {project.type_id === 2 ? (
                          <img src={ProjectCardFileIconHovered} height={32} style={{ display: 'none', position: 'absolute' }} className="hoverIcon" />
                        ) : project.type_id === 1 ? (
                          <img src={ProjectCardScratchIconHovered} height={32} style={{ display: 'none' }} className="hoverIcon" />
                        ) : (
                          <img src={ProjectCardFileIconHovered} height={32} style={{ display: 'none' }} className="hoverIcon" />
                        )}
                      </Box>
                    </Tooltip>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      {openOptions && currentObjectId === String(project.project_id) && (
                        <Menu
                          id={`menu-${project.project_id}`}
                          anchorEl={anchorEl}
                          open={openOptions}
                          onClose={handleMenuClose}
                          MenuListProps={{
                            'aria-labelledby': `button`,
                          }}
                        >
                          <StyledMenuItems
                            onClick={() => {
                              navigate(`/projects/${project.project_id}/overview`)
                            }}
                          >
                            <InfoIcon width={20} height={20} />
                            <Typography variant="body2">Show Details</Typography>
                          </StyledMenuItems>
                        </Menu>
                      )}
                      <Box
                        sx={{
                          height: '24px',
                          // marginBottom: "12px",
                          display: 'flex',
                          flexDirection: 'row-reverse',
                          boxShadow: 'none',
                          gap: '8px',
                        }}
                      >
                        <IconButton
                          sx={{
                            width: '24px',
                            height: '24px',
                            padding: '0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'rgba(156, 156, 156, 1)',
                            borderRadius: '0.25rem',
                          }}
                          id={`options`}
                          aria-controls={openOptions ? `options` : undefined}
                          aria-haspopup="true"
                          aria-expanded={openOptions ? 'true' : undefined}
                          onClick={(e) => {
                            handleMenuOpen(e, String(project.project_id))
                          }}
                          // onClick={() => updateClient(client.is_active)}
                        >
                          <MoreHorizOutlinedIcon sx={{ color: '#9C9C9C' }} />
                        </IconButton>
                        <IconButton
                          sx={{
                            width: '24px',
                            height: '24px',
                            padding: '0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'rgba(156, 156, 156, 1)',
                            borderRadius: '0.25rem',
                            backgroundColor: pinnedProjects.includes(project.project_id || '') ? '#FDB447' : '',

                            '&:hover': {
                              backgroundColor: pinnedProjects.includes(project.project_id || '') ? '#FDB447' : '',
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleProjectPin(project.project_id || '')
                          }}
                        >
                          <img src={PinProjectIcon} alt="" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ marginTop: '-10px' }}>
                    <Tooltip title={project?.client_name && project.client_name.length > 40 ? project.client_name : ''}>
                      <ProjectDetails className="cldetails">{project.client_name}</ProjectDetails>
                    </Tooltip>
                    <Tooltip title={project?.project_name && project.project_name.length > 40 ? project.project_name : ''}>
                      <StyledHeading variant="h1" className="clname">
                        {project.project_name}
                      </StyledHeading>
                    </Tooltip>
                    <Tooltip title={project?.project_description.length > 90 ? project?.project_description : ''}>
                      <StyledDiscription variant="h4" className="cldesc">
                        {truncateDescription(project.project_description, 90)}
                      </StyledDiscription>
                    </Tooltip>
                    {/* <StyledDetails variant='h4' className='cldetails'>
                      {client.email}
                    </StyledDetails> */}
                  </Box>

                  <Stack sx={{ marginTop: 'auto', gap: '8px' }}>
                    <Stack direction={'row'} alignItems={'center'} gap="20px">
                      <Tooltip title="Threads" placement="top">
                        <Stack
                          direction="row"
                          gap="4px"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <img src={CommentsIcon} alt="" className="allIcons1" />
                          <StyledDetails className="cldetails">{project.thread_counts}</StyledDetails>
                        </Stack>
                      </Tooltip>
                      <Tooltip title="Markets" placement="top">
                        <Stack
                          direction="row"
                          gap="4px"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <img src={ProjectCardInternetIcon} className="allIcons" />
                          <img src={ProjectCardInternetIconHovered} alt="" className="allIconsHover" style={{ display: 'none' }} />

                          <StyledDetails className="cldetails">{project?.market_id.length}</StyledDetails>
                        </Stack>
                      </Tooltip>
                      <Tooltip title="Questions" placement="top">
                        <Stack
                          direction="row"
                          gap="4px"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <img src={ProjectCardQuestionIcon} className="allIcons" />
                          <img src={ProjectCardQuestionIconHovered} alt="" className="allIconsHover" style={{ display: 'none' }} />
                          <StyledDetails className="cldetails">{project?.questions_count ? project?.questions_count : 0}</StyledDetails>
                        </Stack>
                      </Tooltip>
                    </Stack>
                    {/* <Stack
                      direction='row'
                      gap='2px'
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img src={Web} alt='' />
                      <StyledDetails className='cldetails'>
                        {client.website_url}
                      </StyledDetails>
                    </Stack> */}
                  </Stack>
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    sx={{
                      width: '100%',
                    }}
                  >
                    <StatusBox
                      sx={{
                        backgroundColor: BackGroundColor(project.status_id),
                        borderColor: TypoColor(project.status_id),
                      }}
                    >
                      <StatusBoxTypography
                        sx={{
                          color: TypoColor(project.status_id),
                        }}
                      >
                        {project.status_name}
                      </StatusBoxTypography>
                    </StatusBox>
                    <IconButton
                      sx={{
                        borderRadius: '0',
                        padding: '4px',
                      }}
                      className="nextBtn"
                      onClick={() => {
                        navigate(`/projects/${project.project_id}/overview`)
                      }}
                    >
                      <img src={CardNext} alt="" />
                    </IconButton>
                  </Stack>
                </NewCard>
              )
            })}
          </GridContainerProjectNew>
        )}

        {loading ? <LoadingSpinner /> : null}
      </Box>
    </PageWrapper>
  )
}

export default ProjectListContainer
