import { useEffect, useState } from "react"
import { useSnackbar } from "notistack"
import Typography from "@mui/material/Typography"
import { Box, Stack, IconButton, Menu, Tooltip } from "@mui/material"
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"

import GridListComponent from "@/components/grid-list"
// import AddCard from "@/components/add-card"
// import Card from "@/components/card"
// import FilesIcon from "@/assets/images/files.png"
import { PageWrapper } from "@/styles/page-wrapper"
import { useNavigate } from "react-router-dom"
import AddBtn from "@/components/add-btn"
import LoadingSpinner from "@/components/loader"
import { TenantService } from "@/services/tenant.service"
import CreateTenant from "./create-tenant"
import {
  NewCard,
  // StatusBox,
  // StatusBoxTypography,
  StyledDetails,
  // StyledDiscription,
  StyledHeading,
  // TextAvatar,
  TextAvatarSupplier,
} from "@/styles/new-card"
import {
  CardNext,
  Email,
  Web,
  // SVGFilesIcon as FilesIcon,
} from "@/assets/images"
import { getInitials } from "../clients-list/clients-list.container"
import { StyledMenuItems } from "@/components/project-card-new/project-card-new.style"
import InfoIcon from "@mui/icons-material/Info"

export interface TenantType {
  name: string
  email: string
  account_id: number
  // description: string
  website_url: string
  image: string
  // is_active: boolean
  // created_by: number
  // updated_by: number
}

function TenantsListContainer() {
  const navigate = useNavigate()
  const tenantService = new TenantService()
  const [tenants, setTenants] = useState<Array<TenantType>>([])
  const { enqueueSnackbar } = useSnackbar()
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentObjectId, setCurrentObjectId] = useState<string | null>(null)

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

  // const truncateDescription = (description: string, maxLength: number) => {
  //   if (description.length > maxLength) {
  //     return `${description.slice(0, maxLength)}...`
  //   }
  //   return description
  // }

  async function fetchAllTenants() {
    setLoading(true)
    try {
      const temp = await tenantService.get_tenant_list()

      setTenants(temp)
      setLoading(false)
    } catch (error) {
      enqueueSnackbar(
        <Typography variant='body1'>Fetching Tenants failed</Typography>,
        {
          variant: "error",
        },
      )
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllTenants()
  }, [])

  // function reOrderSuppliers(arr: Array<TenantType>) {
  //   const disabledSuppliers = arr.filter((obj) => !obj.is_active)
  //   const activeSuppliers = arr.filter((obj) => obj.is_active)

  //   return [...activeSuppliers, ...disabledSuppliers]
  // }

  return (
    <>
      <CreateTenant
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        fetchAllTenants={fetchAllTenants}
        usedEmails={tenants.map((tenant) => tenant.email)}
      />
      <PageWrapper
        style={{
          // background: "white",
          borderRadius: "12px",
          height: "calc(100vh - 142px)",
        }}
      >
        <Box
          style={{
            width: "100%",
            position: "sticky",
            top: "0px",
            // background: "white",
            zIndex: 500,
            padding: "1rem 2rem 0rem 2rem",
          }}
        >
          <Stack direction='row' gap='1rem'>
            <Typography variant='h6' sx={{ marginBottom: "1rem" }}>
              Tenants
            </Typography>
            <AddBtn onClick={() => setShowDialog(true)} />
          </Stack>
        </Box>
        <Box sx={{ padding: "0rem 2rem 2rem 2rem" }}>
          {tenants.length <= 0 && !loading ? (
            <Box display='flex' alignItems='center' justifyContent='center'>
              <Typography>There is no Supplier</Typography>
            </Box>
          ) : (
            <GridListComponent>
              {/* <AddCard
              handleClick={openDialog}
              height={"170px"}
              width={"300px"}
            /> */}
              {tenants.map((tenant) => (
                <NewCard
                  // className={!tenant.is_active ? "disabled" : ""}
                  className="shortCard"
                  key={tenant.account_id}
                  onClick={() => {
                    navigate(`/tenants/${tenant.account_id}`)
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
                    <TextAvatarSupplier>
                      {tenant.name ? getInitials(tenant?.name) : ""}
                    </TextAvatarSupplier>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      {openOptions &&
                        currentObjectId === String(tenant.account_id) && (
                          <Menu
                            id={`menu-${tenant.account_id}`}
                            anchorEl={anchorEl}
                            open={openOptions}
                            onClose={handleMenuClose}
                            MenuListProps={{
                              "aria-labelledby": `button`,
                            }}
                          >
                            <StyledMenuItems
                              onClick={() => {
                                navigate(`/tenants/${tenant.account_id}`)
                              }}
                            >
                              <InfoIcon width={20} height={20} />
                              <Typography variant='body2'>
                                Show Details
                              </Typography>
                            </StyledMenuItems>
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
                            handleMenuOpen(e, String(tenant.account_id))
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
                        tenant?.name && tenant.name.length > 40
                          ? tenant.name
                          : ""
                      }
                    >
                      <StyledHeading variant='h1' className='clname'>
                        {tenant.name}
                      </StyledHeading>
                    </Tooltip>
                    {/* <Tooltip
                      title={
                        tenant?.description.length > 90
                          ? tenant?.description
                          : ""
                      }
                    >
                      <StyledDiscription variant='h4' className='cldesc'>
                        {truncateDescription(tenant.description, 90)}
                      </StyledDiscription>
                    </Tooltip> */}
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
                          tenant?.email && tenant.email.length > 30
                            ? tenant.email
                            : ""
                        }
                      >
                        <StyledDetails className='cldetails'>
                          {tenant.email}
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
                      <img src={Web} alt='' />
                      <Tooltip
                        title={
                          tenant?.website_url &&
                          tenant.website_url.length > 30
                            ? tenant.website_url
                            : ""
                        }
                      >
                        <StyledDetails className='cldetails'>
                          {tenant.website_url}
                        </StyledDetails>
                      </Tooltip>
                    </Stack>
                  </Stack>
                  <Stack
                    direction={"row-reverse"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    sx={{
                      width: "100%",
                    }}
                  >
                    {/* <StatusBox
                      className='statusbox'
                      sx={{
                        borderColor: !tenant?.is_active ? "#DE6C1A" : "",
                      }}
                    >
                      <StatusBoxTypography
                        className='statustext'
                        sx={{
                          color: !tenant?.is_active ? "#DE6C1A" : "",
                        }}
                      >
                        {tenant?.is_active ? "ACTIVE" : "INACTIVE"}
                      </StatusBoxTypography>
                    </StatusBox> */}
                    <IconButton
                      sx={{
                        borderRadius: "0",
                        padding: "4px",
                      }}
                      className='nextBtn'
                      onClick={() => {
                        navigate(`/tenants/${tenant.account_id}`)
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

export default TenantsListContainer
