import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import { Box, Stack, IconButton, Menu } from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import GridListComponent from "@/components/grid-list";
import {
  LayoutsService,
  LayoutType,
  LayoutInput,
} from "@/services/layout.service";
// import AddCard from "@/components/add-card"
// import Card from "@/components/card"
import TextField from "@/components/text-field";
// import FilesIcon from "@/assets/images/files.png"
import { PageWrapper } from "@/styles/page-wrapper";
import { textFieldStyle } from "@/containers/clients-list/client-list.style";
import { useNavigate } from "react-router-dom";
import AddBtn from "@/components/add-btn";
import LoadingSpinner from "@/components/loader";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {
  NewCard,
  StatusBox,
  StatusBoxTypography,
  StyledHeading,
  TextAvatarUser,
} from "@/styles/new-card";
import { getInitials } from "../clients-list/clients-list.container";
import { StyledMenuItems } from "@/components/project-card-new/project-card-new.style";
import InfoIcon from "@mui/icons-material/Info";
import { CardNext } from "@/assets/images";

function LayoutsContainer() {
  const navigate = useNavigate();
  const layoutService = new LayoutsService();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentObjectId, setCurrentObjectId] = useState<string | null>(null);
  const openOptions = Boolean(anchorEl);
  const [layouts, setLayouts] = useState<Array<LayoutType>>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { register, handleSubmit, reset } = useForm<LayoutInput>();

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    objectUid: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentObjectId(objectUid);
  };

  const handleMenuClose = (event: any) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const onSubmit = (data: LayoutInput) => {
    createNewLayout(data);
  };

  function openDialog() {
    setShowDialog(true);
  }

  function closeDialog() {
    setShowDialog(false);
  }

  async function createNewLayout(layout: LayoutInput) {
    try {
      await layoutService.postLayout(layout);

      fetchAllLayouts();
      closeDialog();
      reset({
        name: "",
        is_default: false,
      });
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Creating layout failed</Typography>,
        {
          variant: "error",
        }
      );
      closeDialog();
      reset({
        name: "",
        is_default: false,
      });
    }
  }

  async function fetchAllLayouts() {
    setLoading(true);
    try {
      const temp = await layoutService.getLayouts();

      setLayouts(temp);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Fetching layouts failed</Typography>,
        {
          variant: "error",
        }
      );
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllLayouts();
  }, []);

  return (
    <>
      <Dialog onClose={closeDialog} open={showDialog} maxWidth="md">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "10px",
            marginTop: "10px",
          }}
        >
          <DialogTitle id="alert-dialog-title" color="black">
            Create New Layout
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
            <Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginLeft: "5px" }}>Name*</label>
                <TextField
                  required
                  {...register("name")}
                  name="name"
                  placeholder="Name"
                  sx={textFieldStyle}
                />
              </Box>
            </Box>
            <Box
              sx={{
                marginTop: "2rem",
              }}
            >
              <FormControlLabel
                {...register("is_default")}
                control={<Switch />}
                label="Is default"
              />
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
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Box>
        </form>
      </Dialog>
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
          <Stack direction="row" gap="1rem">
            <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
              Layouts
            </Typography>
            <AddBtn onClick={openDialog} />
          </Stack>
        </Box>
        <Box sx={{ padding: "0rem 2rem 2rem 2rem" }}>
          {layouts.length <= 0 && !loading ? (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography>There is no layout</Typography>
            </Box>
          ) : (
            <GridListComponent>
              {/* <AddCard
              handleClick={openDialog}
              height={"170px"}
              width={"300px"}
            /> */}
              {layouts.map((layout) => (
                <NewCard
                  className="shortCard"
                  onClick={() => {
                    navigate(`/layouts/${layout.id}`);
                  }}
                  key={layout.id}
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
                    <TextAvatarUser>
                      {layout.name ? getInitials(layout?.name) : ""}
                    </TextAvatarUser>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      {openOptions && currentObjectId === String(layout.id) && (
                        <Menu
                          id={`menu-${layout.id}`}
                          anchorEl={anchorEl}
                          open={openOptions}
                          onClose={handleMenuClose}
                          MenuListProps={{
                            "aria-labelledby": `button`,
                          }}
                        >
                          <StyledMenuItems
                            onClick={() => {
                              navigate(`/layouts/${layout.id}`);
                            }}
                          >
                            <InfoIcon width={20} height={20} />
                            <Typography variant="body2">
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
                          aria-haspopup="true"
                          aria-expanded={openOptions ? "true" : undefined}
                          onClick={(e) => {
                            handleMenuOpen(e, String(layout.id));
                          }}
                        >
                          <MoreHorizOutlinedIcon sx={{ color: "#9C9C9C" }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                  <Stack
                    justifyContent={"space-between"}
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Box>
                      <StyledHeading variant="h1" className="clname">
                        {layout.name}
                      </StyledHeading>
                    </Box>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      sx={{
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          height: "24px",
                          marginBottom: "12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          boxShadow: "none",
                        }}
                      >
                        {layout.is_default ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              // padding: "4px 16px",
                              // background: "#FAF6CF",
                              borderRadius: "4px",
                            }}
                          >
                            <StatusBox
                              sx={{
                                fontWeight: 400,
                                fontSize: "11px",
                                lineHeight: "140%",
                                textTransform: "capitalize",
                                color: "#2444EA",
                              }}
                              className="statusbox"
                            >
                              <StatusBoxTypography className="statustext">
                                DEFAULT
                              </StatusBoxTypography>
                            </StatusBox>
                          </Box>
                        ) : (
                          <div />
                        )}
                      </Box>
                      <IconButton
                        sx={{
                          borderRadius: "0",
                          padding: "4px",
                        }}
                        className="nextBtn"
                        onClick={() => {
                          navigate(`/layouts/${layout.id}`);
                        }}
                      >
                        <img src={CardNext} alt="" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </NewCard>
              ))}
            </GridListComponent>
          )}
          {loading ? <LoadingSpinner /> : null}
        </Box>
      </PageWrapper>
    </>
  );
}

export default LayoutsContainer;
