import { Box } from "@mui/system"
import {
  // CardMenu,
  // CardSubMenu,
  DetailsBox,
  StyledKeys,
  StyledValues,
  StyledValueswithIcons,
} from "@/components/project-details/project-details.style"
import { Button, Grid, IconButton, Typography, Tooltip } from "@mui/material"
import { useEffect, useState } from "react"
import TextField from "@/components/text-field"
import { SubmitHandler, useForm } from "react-hook-form"
import { useSnackbar } from "notistack"
import LoadingSpinner from "@/components/loader"
import EditIcon from "@mui/icons-material/Edit"
import { useParams } from "react-router-dom"
import { useOutletContext } from "react-router"
import { ClientsService } from "@/services/client.service"
import { ClientPostDataType } from "@/types/client.types"
import { ClientSchema1 } from "@/containers/clients-list/create-client-schema"
import { zodResolver } from "@hookform/resolvers/zod"

interface Inputs {
  name: string
  email: string
  website_url: string
  contact: string
  profile_image_url: string
}

function ClientOverviewContainer() {
  const { client, getAndUpdateClient, isLoading } = useOutletContext<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState(false)
  const clientsService = new ClientsService()
  const { clientId } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(ClientSchema1),
  })
  const [formState, setFormState] = useState({
    name: client?.name || "",
    email: client?.email || "",
    website_url: client?.website_url || "",
    contact: "",
  })

  useEffect(() => {
    if (client) {
      setFormState({
        name: client?.name || "",
        email: client?.email || "",
        website_url: client?.website_url || "",
        contact: client?.contact || "",
      })
    }
  }, [client])

  async function updateClient(client: ClientPostDataType) {
    setLoading(true)
    try {
      await clientsService.putClient(clientId || "", client)
      getAndUpdateClient()
      setLoading(false)
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    getAndUpdateClient()
  }, [])

  const onSubmit: SubmitHandler<Inputs> = async (data:any) => {
    console.log(data)

    updateClient(data as any).finally(() => {
      setIsEdit(false)
    })
  }

  console.log(client)
  console.log(formState)

  function truncateText(text: any, length: number) {
    // Check if the input is a string and if it exceeds the required length
    if (typeof text === "string" && text.length > length) {
      return `${text.substr(0, length)}...`;
    }
    return text; // This will return the input as is, if it's not a string or if it's within the length limit
  }

  return (
    <DetailsBox sx={{ padding: "2rem", display: "flex" }}>
      {isEdit ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "60%" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>Client Name*</label>
                <TextField
                  {...register("name")}
                  sx={{ paddingTop: "5px" }}
                  value={formState.name}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        name: e.target.value,
                      }
                    })
                  }}
                />
                <Typography
                  variant='body1'
                  sx={{ color: "red", margin: "1rem" }}
                >
                  {errors.name?.message}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>Client Email</label>
                <TextField
                  {...register("email")}
                  sx={{ paddingTop: "5px" }}
                  value={formState.email}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        email: e.target.value,
                      }
                    })
                  }}
                />
                <Typography
                  variant='body1'
                  sx={{ color: "red", margin: "1rem" }}
                >
                  {errors.email?.message}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>Client Web Url</label>
                <TextField
                  {...register("website_url")}
                  sx={{ paddingTop: "5px" }}
                  value={formState.website_url}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        website_url: e.target.value,
                      }
                    })
                  }}
                />
                <Typography
                  variant='body1'
                  sx={{ color: "red", margin: "1rem" }}
                >
                  {errors.website_url?.message}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px", marginBottom: "5px" }}>
                  Contact
                </label>
                <TextField
                  type='number'
                  {...register("contact", { required: false })}
                  sx={{ paddingTop: "5px" }}
                  value={formState.contact}
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        contact: e.target.value,
                      }
                    })
                  }}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                pt: 7,
                paddingBottom: "1rem",
              }}
            >
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={() => {
                  setIsEdit(false)
                }}
                sx={{ mr: 1 }}
                variant='outlined'
              >
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                Save
              </Button>
            </Box>
          </form>
          {/* <Divider orientation="vertical" variant="middle" flexItem sx={{ marginLeft: "30px", borderRightWidth: 2, backgroundColor: "#5D5D5D"}}/> */}
        </>
      ) : (
        <Box
          component='div'
          sx={{ display: "flex", gap: "2rem", width: "60%" }}
        >
          <Box component='div' sx={{ flex: 1 }}>
            <Grid container spacing={2} sx={{ marginBottom: "3rem" }}>
              <Grid item xs={6} md={6} sx={{ wordBreak: "break-word" }}>
                <StyledKeys>Client</StyledKeys>
                <StyledValues>
                  {client &&
                    client?.name &&
                    client?.name?.charAt(0)?.toUpperCase() +
                      client?.name?.slice(1)}
                </StyledValues>
              </Grid>
              <Grid item xs={6} md={6}>
                <StyledKeys>Client Email</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{client?.email || ""}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>Client Web Url</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  {client?.website_url.length > 50 ? 
                  <Tooltip title={client?.website_url}>
                  <StyledValues sx={{wordBreak: "break-all"}}>{truncateText(client?.website_url,50) || ""}</StyledValues>
                  </Tooltip> : <StyledValues sx={{wordBreak: "break-all"}}>{truncateText(client?.website_url,50) || ""}</StyledValues>
                }
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledKeys>Contact</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{client?.contact || ""}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-top",
              height: "32px",
            }}
          >
            <IconButton
              aria-controls='menu'
              aria-haspopup='true'
              onClick={() => {
                setIsEdit(true)
                // handleClose(e)
              }}
              size='small'
              style={{ alignItems: "start" }}
            >
              {/* <EditIcon fontSize="medium" style={{ color: "#5D5D5D" }} /> */}
              <EditIcon fontSize='medium' style={{ color: "#5D5D5D" }} />
            </IconButton>
          </Box>
        </Box>
      )}
      {loading || isLoading ? <LoadingSpinner /> : null}
    </DetailsBox>
  )
}

export default ClientOverviewContainer
