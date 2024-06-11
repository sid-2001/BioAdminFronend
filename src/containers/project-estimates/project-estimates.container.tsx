// import "@/containers/project-estimates/project-estimates.css"
import { ProjectRequestService } from "@/services/project-request.service";
import { ProjectRequest } from "@/types/project-request.type";
import {
  Box,
  Tooltip,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  // Grid,
  // Button
  //   TablePagination,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import LoadingSpinner from "@/components/loader";
import {
  DetailsBox,
  GridContainerProjectTable,
  // GridContainerProject
} from "./project-estimates.style";
import AddBtn from "@/components/add-btn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateEstimate from "@/components/create-esimates/create-estimates.component";
import EditEstimate from "@/components/create-esimates/edit-estimates.component";
import { ProjectService } from "@/services/projects.service";

const EstimatesContainer = () => {
  let projectService = new ProjectService();
  // const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [effort, setEffort] = useState(null);
  const [loading, setLoading] = useState(false);
  const [_effortData, setEffortData] = useState(null);
  const [openModal1, setOpenModal1] = useState(false);
  const [retriveData, setRetriveData] = useState<Array<ProjectRequest>>([]);
  const [editData, setEditData] = useState(null);
  const service = new ProjectRequestService();
  const { projectId, surveyId } = useParams();

  const { selectedSurvey }: any = useOutletContext()

  console.log(surveyId, "surveyIdsurveyIdsurveyIdadsfgvbn",selectedSurvey)

  async function getProjectRetriveByID() {
    try {
      const data = await service.getProjectRetriveById(Number(projectId), Number(surveyId));

      setRetriveData(data);
      console.log(data, "data");
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Fetching requests failed</Typography>,
        {
          variant: "error",
        }
      );
    }
  }

  useEffect(() => {
    // getProjectRequests()
    if (projectId && surveyId) {
      getProjectRetriveByID();
    }
  }, [projectId, surveyId]);

  const stripHtmlTags = (htmlString: any) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  const handleClick = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };
  const handleClick1 = (item: any) => {
    setEditData(item);
    console.log(item);
    setEffortData(item);
    setEffort(item?.id);
    setOpenModal1(true);
  };
  const handleDelete = async (request: any) => {
    setLoading(true);
    const effortId = request?.id;
    // setEffort(item?.id);
    if (projectId && effortId)
      try {
        await projectService.delete_effort(projectId, effortId);
        await getProjectRetriveByID();
        setLoading(false);
        enqueueSnackbar(
          <Typography variant="body1">Estimate Succesfully Deleted</Typography>,
          {
            variant: "success",
          }
        );
      } catch (e) {
        console.log(e);
        enqueueSnackbar("Oops somthing went wrong !!", {
          variant: "error",
        });
        setLoading(false);
      }
  };
  const handleClose1 = () => {
    setOpenModal1(false);
  };

  const totalCost = retriveData.reduce(
    (total, request) => total + Number(request.cost) * Number(request.effort),
    0
  );

  const formatCost = (cost: number) => {
    return cost.toLocaleString("en-US", {
      // minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <DetailsBox sx={{ padding: "2rem" }}>
      <CreateEstimate
        open={openModal}
        getProjectRetriveByID={getProjectRetriveByID}
        handleClose={handleClose}
      />
      <EditEstimate
        editData={editData}
        open={openModal1}
        // @ts-ignore
        effortId={effort}
        getProjectRetriveByID={getProjectRetriveByID}
        handleClose={handleClose1}
      />
      <Box
        sx={{
          display: "flex",
          marginBottom: "20px",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Estimates</Typography>
        <AddBtn onClick={handleClick} />
      </Box>
      <GridContainerProjectTable>
        <Paper sx={{ overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 640 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Cost ($/hr)</TableCell>
                  <TableCell>Efforts (in hrs)</TableCell>
                  <TableCell>Thread</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {retriveData?.length > 0 ? (
                  retriveData &&
                  retriveData?.map((request, i) => (
                    <TableRow key={`${i}`}>
                      <TableCell>{request.title}</TableCell>
                      <TableCell>
                        {request && request?.description?.length > 29 ? (
                          <Tooltip title={stripHtmlTags(request.description)}>
                            <span>{`${stripHtmlTags(
                              request.description
                            ).substring(0, 29)}...`}</span>
                          </Tooltip>
                        ) : request?.description?.length > 0 ? (
                          stripHtmlTags(request.description)
                        ) : (
                          <Typography variant="body2">No text</Typography>
                        )}
                      </TableCell>
                      <TableCell>{formatCost(Number(request.cost))}</TableCell>
                      <TableCell>{request.effort}</TableCell>
                      <TableCell>
                        {request.thread_title ? (
                          request.thread_title
                        ) : (
                          <Typography variant="body2">
                            No threads
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatCost(
                          Number(request.cost) * Number(request.effort)
                        )}
                      </TableCell>
                      <TableCell width={120}>
                        <IconButton onClick={() => handleClick1(request)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(request)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography align="center">No data</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={tableData?.response_data?.length || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /> */}
        </Paper>
      </GridContainerProjectTable>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          marginRight: "50px",
          marginTop: "40px",
        }}
      >
        <Typography fontSize={18}>
          Total Balance: $
          {totalCost.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </Typography>
      </Box>
      {loading && <LoadingSpinner />}
    </DetailsBox>
  );
};

export default EstimatesContainer;
