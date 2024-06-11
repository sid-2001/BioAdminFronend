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
import { SuppliersService } from "@/services/supplier.sevice"
import CreateSupplier from "./create-supplier"
import {
  NewCard,
  StatusBox,
  StatusBoxTypography,
  StyledDetails,
  StyledDiscription,
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

export interface SupplierType {
  id: number
  name: string
  email: string
  account_id: 1
  description: string
  website_url: string
  profile_image_url: string
  is_active: boolean
  created_by: number
  updated_by: number
}

function SuppliersListContainer() {
  const navigate = useNavigate()
  const supplierService = new SuppliersService()
  const [suppliers, setSuppliers] = useState<Array<SupplierType>>([])
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

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return `${description.slice(0, maxLength)}...`
    }
    return description
  }

  async function fetchAllSuppliers() {
    setLoading(true)
    try {
      const temp = await supplierService.getSuppliers()

      setSuppliers(temp)
      setLoading(false)
    } catch (error) {
      enqueueSnackbar(
        <Typography variant='body1'>Fetching Suppliers failed</Typography>,
        {
          variant: "error",
        },
      )
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllSuppliers()
  }, [])

  function reOrderSuppliers(arr: Array<SupplierType>) {
    const disabledSuppliers = arr.filter((obj) => !obj.is_active)
    const activeSuppliers = arr.filter((obj) => obj.is_active)

    return [...activeSuppliers, ...disabledSuppliers]
  }

  return (
    <>
      <CreateSupplier
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        fetchAllSuppliers={fetchAllSuppliers}
        usedEmails={suppliers.map((supplier) => supplier.email)}
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
              Suppliers
            </Typography>
            <AddBtn onClick={() => setShowDialog(true)} />
          </Stack>
        </Box>
        <Box sx={{ padding: "0rem 2rem 2rem 2rem" }}>
          {suppliers.length <= 0 && !loading ? (
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
              {reOrderSuppliers(suppliers).map((supplier) => (
                <NewCard
                  className={!supplier.is_active ? "disabled" : ""}
                  key={supplier.id}
                  onClick={() => {
                    navigate(`/suppliers/${supplier.id}`)
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
                      {supplier.name ? getInitials(supplier?.name) : ""}
                    </TextAvatarSupplier>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      {openOptions &&
                        currentObjectId === String(supplier.id) && (
                          <Menu
                            id={`menu-${supplier.id}`}
                            anchorEl={anchorEl}
                            open={openOptions}
                            onClose={handleMenuClose}
                            MenuListProps={{
                              "aria-labelledby": `button`,
                            }}
                          >
                            <StyledMenuItems
                              onClick={() => {
                                navigate(`/suppliers/${supplier.id}`)
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
                            handleMenuOpen(e, String(supplier.id))
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
                        supplier?.name && supplier.name.length > 40
                          ? supplier.name
                          : ""
                      }
                    >
                      <StyledHeading variant='h1' className='clname'>
                        {supplier.name}
                      </StyledHeading>
                    </Tooltip>
                    <Tooltip
                      title={
                        supplier?.description.length > 90
                          ? supplier?.description
                          : ""
                      }
                    >
                      <StyledDiscription variant='h4' className='cldesc'>
                        {truncateDescription(supplier.description, 90)}
                      </StyledDiscription>
                    </Tooltip>
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
                          supplier?.email && supplier.email.length > 30
                            ? supplier.email
                            : ""
                        }
                      >
                        <StyledDetails className='cldetails'>
                          {supplier.email}
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
                          supplier?.website_url &&
                          supplier.website_url.length > 30
                            ? supplier.website_url
                            : ""
                        }
                      >
                        <StyledDetails className='cldetails'>
                          {supplier.website_url}
                        </StyledDetails>
                      </Tooltip>
                    </Stack>
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
                        borderColor: !supplier?.is_active ? "#DE6C1A" : "",
                      }}
                    >
                      <StatusBoxTypography
                        className='statustext'
                        sx={{
                          color: !supplier?.is_active ? "#DE6C1A" : "",
                        }}
                      >
                        {supplier?.is_active ? "ACTIVE" : "INACTIVE"}
                      </StatusBoxTypography>
                    </StatusBox>
                    <IconButton
                      sx={{
                        borderRadius: "0",
                        padding: "4px",
                      }}
                      className='nextBtn'
                      onClick={() => {
                        navigate(`/suppliers/${supplier.id}`)
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

export default SuppliersListContainer
