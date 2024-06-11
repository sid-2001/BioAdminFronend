import { useEffect, useState } from "react"
import { useSnackbar } from "notistack"
import Typography from "@mui/material/Typography"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import Button from "@mui/material/Button"
import DialogTitle from "@mui/material/DialogTitle"
import { useForm } from "react-hook-form"
import { Box, Stack, IconButton, Menu, Tooltip } from "@mui/material"
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"

import GridListComponent from "@/components/grid-list"
import { ClientsService } from "@/services/client.service"
// import AddCard from "@/components/add-card"
import { ClientPostDataType, ClientType } from "@/types/client.types"
// import Card from "@/components/card"
import TextField from "@/components/text-field"
import Select from "@/components/select"
// import FilesIcon from "@/assets/images/files.png"
import { PageWrapper } from "@/styles/page-wrapper"
import { textFieldStyle } from "./client-list.style"
import { useNavigate } from "react-router-dom"
// import { useParams } from "react-router-dom"
import AddBtn from "@/components/add-btn"
import LoadingSpinner from "@/components/loader"
import { ClientSchema } from "./create-client-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { StyledMenuItems } from "@/components/project-card-new/project-card-new.style"
import InfoIcon from "@mui/icons-material/Info"
import {
  NewCard,
  StatusBox,
  StatusBoxTypography,
  StyledDetails,
  StyledHeading,
  TextAvatar,
} from "@/styles/new-card"
import {
  CardNext,
  Email,
  // Web,
  SVGFilesIcon as FilesIcon,
} from "@/assets/images"
//
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
// import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1"
// import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled"
import {
  ListService,
  ProgrammingSoftwareListType,
} from "@/services/list.service"

type Inputs = {
  name: string
  email: string
  website_url: string
  contact: string
  sp_system_ids: number
}

export function getInitials(name: string) {
  if (!name) return ""

  const arr = name.split(" ")
  const initial = arr[0][0].toUpperCase()

  if (arr.length === 1) return initial
  if (!arr[arr.length - 1][0]) return initial

  return initial + arr[arr.length - 1][0]?.toUpperCase()
}

function ClientsListContainer() {
  const navigate = useNavigate()
  const clientService = new ClientsService()
  const listServices = new ListService()
  const [clients, setClients] = useState<Array<ClientType>>([])
  const { enqueueSnackbar } = useSnackbar()
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [emailExists, setEmailExists] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentObjectId, setCurrentObjectId] = useState<string | null>(null)
  const [programmingSoftwareList, setProgrammingSoftwareList] = useState<
    Array<ProgrammingSoftwareListType>
  >([])

  useEffect(() => {
    listServices
      .get_software_list()
      .then((data) => setProgrammingSoftwareList(data))
  }, [])

  const openOptions = Boolean(anchorEl)

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    objectUid: string,
  ) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setCurrentObjectId(objectUid)
  }

  const handleMenuClose = (event: any) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(ClientSchema),
  })

  const onSubmit = async (data: Inputs) => {
    const { email, name, website_url, contact, sp_system_ids } = data

    if (await isEmailExists(email)) {
      setEmailExists(true)
      console.log("Email exists:", email)
      return
    }

    createNewClient({
      email,
      name,
      website_url,
      contact,
      sp_system_ids: [sp_system_ids],
    })
  }

  const isEmailExists = async (email: string) => {
    try {
      const existingClients = await clientService.getClients()
      const exists = existingClients.some((client) => client.email === email)
      return exists
    } catch (error) {
      console.error("Error checking email existence:", error)
      return false
    }
  }

  function openDialog() {
    setShowDialog(true)
  }

  function closeDialog() {
    setShowDialog(false)
    reset()
    setEmailExists(false)
  }

  async function createNewClient(client: ClientPostDataType) {
    try {
      setLoading(true)
      await clientService.postClient(client)
      fetchAllClients()
      setLoading(false)
      enqueueSnackbar(
        <Typography variant='body1'>Client created.</Typography>,
        {
          variant: "success",
        },
      )
      closeDialog()
      reset({
        name: "",
        contact: "",
        email: "",
        website_url: "",
      })
    } catch (error) {
      enqueueSnackbar(
        <Typography variant='body1'>Creating client failed</Typography>,
        {
          variant: "error",
        },
      )
      setLoading(false)
      closeDialog()
      reset({
        name: "",
        contact: "",
        email: "",
        website_url: "",
      })
    }
  }

  async function fetchAllClients() {
    setLoading(true)
    try {
      const temp = await clientService.getClients()

      setClients(temp)
      setLoading(false)
    } catch (error) {
      enqueueSnackbar(
        <Typography variant='body1'>Fetching clients failed</Typography>,
        {
          variant: "error",
        },
      )
      setLoading(false)
    }
  }

  // const updateClient = async (activity: boolean): Promise<void> => {
  //   setLoading(true)
  //   try {
  //     if (clientId) await clientService.updateClient(clientId, activity)
  //     fetchAllClients()
  //     setLoading(false)
  //   } catch (error) {
  //     setLoading(false)
  //     if ((error as any)?.response?.status === 403) {
  //       enqueueSnackbar("Access denied: Insufficient permissions.", {
  //         variant: "error",
  //       })
  //     } else {
  //       enqueueSnackbar("An error occurred. Please try again.", {
  //         variant: "error",
  //       })
  //     }
  //   }
  // }

  useEffect(() => {
    fetchAllClients()
  }, [])

  function reOrderClients(arr: Array<ClientType>) {
    const disabledClients = arr.filter((obj) => !obj.is_active)
    const activeClients = arr.filter((obj) => obj.is_active)

    return [...activeClients, ...disabledClients]
  }

  // async function updateClientState(id: number | string, state: boolean) {
  //   setLoading(true)
  //   try {
  //     await clientService.putClient(id, {
  //       is_active: state,
  //     })

  //     fetchAllClients()
  //     setLoading(false)
  //   } catch (error) {
  //     enqueueSnackbar(
  //       <Typography variant='body1'>Updating client failed</Typography>,
  //       {
  //         variant: "error",
  //       },
  //     )
  //     setLoading(false)
  //   }
  // }

  return (
    <>
      <Dialog onClose={closeDialog} open={showDialog} maxWidth='md'>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "10px",
            marginTop: "10px",
          }}
        >
          <DialogTitle id='alert-dialog-title' color='black'>
            Create New Client
          </DialogTitle>
          <IconButton
            onClick={closeDialog}
            sx={{ width: "40px", height: "40px" }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              overflowY: "scroll",
              "&::-webkit-scrollbar": {
                width: "0.5em",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(2,1fr)",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginLeft: "5px" }}>Name*</label>
                <TextField
                  required
                  {...register("name")}
                  name='name'
                  placeholder='Name'
                  sx={textFieldStyle}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginLeft: "5px" }}>Email*</label>
                <TextField
                  required
                  {...register("email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                    // validate: async (value) => {
                    //   const exists = await isEmailExists(value)
                    //   if (exists) {
                    //     return "This email already exists"
                    //   }
                    // },
                  })}
                  name='email'
                  placeholder='Email'
                  sx={textFieldStyle}
                />
                {/* <Typography
                  variant='body1'
                  sx={{ color: "red", margin: "1rem" }}
                >
                  {errors.email?.message}
                </Typography> */}
                {errors.email && (
                  <Typography
                    variant='body1'
                    sx={{ color: "red", marginTop: "10px" }}
                  >
                    {errors.email.message}
                  </Typography>
                )}
                {emailExists && (
                  <Typography
                    variant='body1'
                    sx={{ color: "red", marginTop: "1rem" }}
                  >
                    This email already exists
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "1rem",
                }}
              >
                <label style={{ marginLeft: "5px" }}>Url</label>
                <TextField
                  {...register("website_url")}
                  name='website_url'
                  placeholder='Url'
                  sx={textFieldStyle}
                />
                <Typography
                  variant='body1'
                  sx={{ color: "red", margin: "1rem" }}
                >
                  {errors.website_url?.message}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "1rem",
                }}
              >
                <label style={{ marginLeft: "5px" }}>Contact</label>
                <TextField
                  {...register("contact")}
                  name='contact'
                  placeholder='Contact'
                  sx={textFieldStyle}
                  type='number'
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "-1rem",
                }}
              >
                <label style={{ marginLeft: "5px", marginBottom: "10px" }}>
                  Programming Software*
                </label>
                <Select
                  // value={watch("programming_software")?.toString() || ""}
                  defaultValue={
                    programmingSoftwareList.length > 0
                      ? programmingSoftwareList[0].id.toString()
                      : ""
                  }
                  items={programmingSoftwareList.map((software) => ({
                    text: software.name,
                    value: software.id?.toString() || "",
                  }))}
                  register={register as any}
                  name='sp_system_ids'
                  label=''
                  isRequired={true}
                />
              </Box>
            </Box>
          </DialogContent>
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              flexDirection: "row-reverse",
              margin: "2rem 1.5rem 2rem 0",
            }}
          >
            {/* <Button onClick={closeDialog}>Cancel</Button> */}
            <Button type='submit' variant='contained'>
              Create
            </Button>
          </Box>
        </form>
        {loading ? <LoadingSpinner /> : null}
      </Dialog>
      <PageWrapper
        style={{
          // background: "transparent",
          borderRadius: "12px",
          height: "calc(100vh - 142px)",
        }}
      >
        <Box
          style={{
            width: "100%",
            position: "sticky",
            top: "0px",
            // background: "transparent",
            zIndex: 500,
            padding: "1rem 2rem 0rem 2rem",
          }}
        >
          <Stack direction='row' gap='1rem'>
            <Typography variant='h6' sx={{ marginBottom: "1rem" }}>
              Clients
            </Typography>
            <AddBtn onClick={openDialog} />
          </Stack>
        </Box>
        <Box sx={{ padding: "0rem 2rem 2rem 2rem" }}>
          {clients.length <= 0 && !loading ? (
            <Box display='flex' alignItems='center' justifyContent='center'>
              <Typography>There is no Client</Typography>
            </Box>
          ) : (
            <GridListComponent>
              {reOrderClients(clients).map((client) => (
                <NewCard
                  className={!client.is_active ? "disabled" : ""}
                  key={client.id}
                  onClick={() => {
                    navigate(`/clients/${client.id}`)
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      paddingBottom: "12px",
                      borderBottom: "2px solid #FDB447",
                    }}
                  >
                    <TextAvatar>
                      {client.name ? getInitials(client?.name) : ""}
                    </TextAvatar>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      {openOptions && currentObjectId === String(client.id) && (
                        <Menu
                          id={`menu-${client.id}`}
                          anchorEl={anchorEl}
                          open={openOptions}
                          onClose={handleMenuClose}
                          MenuListProps={{
                            "aria-labelledby": `button`,
                          }}
                        >
                          <StyledMenuItems
                            onClick={() => {
                              navigate(`/clients/${client.id}`)
                            }}
                          >
                            <InfoIcon width={20} height={20} />
                            <Typography variant='body2'>
                              Show Details
                            </Typography>
                          </StyledMenuItems>
                          {/* {client.is_active ? (
                            <StyledMenuItems
                              onClick={() =>
                                updateClientState(client.id, false)
                              }
                            >
                              <PersonAddDisabledIcon width={20} height={20} />
                              <Typography variant='body2'>
                                Deactivate
                              </Typography>
                            </StyledMenuItems>
                          ) : (
                            <StyledMenuItems
                              onClick={() => updateClientState(client.id, true)}
                            >
                              <PersonAddAlt1Icon width={20} height={20} />
                              <Typography variant='body2'>Activate</Typography>
                            </StyledMenuItems>
                          )} */}
                        </Menu>
                      )}
                      <Box
                        sx={{
                          height: "24px",
                          marginBottom: "12px",
                          display: "flex",
                          flexDirection: "row-reverse",
                          boxShadow: "none",
                        }}
                      >
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
                          id={`options`}
                          aria-controls={openOptions ? `options` : undefined}
                          aria-haspopup='true'
                          aria-expanded={openOptions ? "true" : undefined}
                          onClick={(e) => {
                            handleMenuOpen(e, String(client.id))
                          }}
                          // onClick={() => updateClient(client.is_active)}
                        >
                          <MoreHorizOutlinedIcon sx={{ color: "#9C9C9C" }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    <Tooltip
                      title={
                        client?.name && client.name.length > 40
                          ? client.name
                          : ""
                      }
                    >
                      <StyledHeading variant='h1' className='clname'>
                        {client.name}
                      </StyledHeading>
                    </Tooltip>
                    {/* <StyledDetails variant='h4' className='cldetails'>
                      {client.email}
                    </StyledDetails> */}
                  </Box>

                  <Stack sx={{ marginTop: "auto", gap: "8px" }}>
                    <Stack
                      direction='row'
                      gap='2px'
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img src={Email} alt='' />
                      <Tooltip
                        title={
                          client?.email && client.email.length > 30
                            ? client.email
                            : ""
                        }
                      >
                        <StyledDetails className='cldetails'>
                          {client.email}
                        </StyledDetails>
                      </Tooltip>
                    </Stack>
                    <Stack
                      direction='row'
                      gap='2px'
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img src={FilesIcon} alt='' />
                      <Typography
                        sx={{
                          color: "#6F10C0",
                          fontSize: "12px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                        component='span'
                        className='iconstext'
                      >
                        {client?.project_counts} (Projects)
                      </Typography>
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
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <StatusBox
                      className='statusbox'
                      sx={{
                        borderColor: !client?.is_active ? "#DE6C1A" : "",
                      }}
                    >
                      <StatusBoxTypography
                        className='statustext'
                        sx={{
                          color: !client?.is_active ? "#DE6C1A" : "",
                        }}
                      >
                        {client?.is_active ? "ACTIVE" : "INACTIVE"}
                      </StatusBoxTypography>
                    </StatusBox>
                    <IconButton
                      sx={{
                        borderRadius: "0",
                        padding: "4px",
                      }}
                      className='nextBtn'
                      onClick={() => {
                        navigate(`/clients/${client.id}`)
                      }}
                    >
                      <img src={CardNext} alt='' />
                    </IconButton>
                  </Stack>
                </NewCard>
              ))}
            </GridListComponent>
          )}
          {loading ? <LoadingSpinner /> : null}
        </Box>
      </PageWrapper>
    </>
  )
}

export default ClientsListContainer
