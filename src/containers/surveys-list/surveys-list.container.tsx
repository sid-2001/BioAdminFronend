import { GridContainerSurvey } from "@/styles/grid";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/loader";
import { useSnackbar } from "notistack";
import { PageWrapper } from "@/styles/page-wrapper";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { styled } from "@mui/system";
import AddBtn from "@/components/add-btn";
import { Box, Stack, IconButton, Typography } from "@mui/material";
import CreateSurvey from "./create-survey";
import { SurveysService } from "@/services/surveys.service";
import Card from "./survey-card";
import { useNavigate } from "react-router-dom";

export const FilterBox = styled(Box)(() => ({
  "& *:before": {
    borderBottom: "none !important",
    fontSize: "12px !important",
  },

  "& label": {
    borderBottom: "none !important",
    fontSize: "12px !important",
    fontWeight: "300",
  },

  "& div": {
    marginTop: "2px !important",
    fontWeight: "500",
    color: "#323232 !important",
  },

  "& svg": {
    color: "#323232 !important",
  },
}));

export interface Inputs {
  id: number
  project_id: number
  survey_name: string
  start_date: any
  end_date: any
  description: string
  language_id: number
  ir: number;
  cpi: number
  loi: number
  sample_size: number
  device: number[]
  survey_type_id: number
  industry_id: number
  survey_live_link: string
  survey_test_link: string
  status_id?: number
  market_name?: string
  starts?: number
  last_complete?: number
  conversion?: number
  terminate?: number
  completed?: number
  // 
  data_file_url?: string;
  definition_file_url?: string;
  schema_url?: string;

  survey_status_name?: string;

  sp_live_link?: string;
  sp_test_link?: string;
  language_name?: string;

  sp_project_id?: string;
}

function SurveysListContainer() {
  const [surveys, setSurveys] = useState<Array<Inputs>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const surveysService = new SurveysService();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  function openDialog() {
    setShowDialog(true);
  }

  function closeDialog() {
    setShowDialog(false);
  }

  async function getSurveys() {
    setIsLoading(true);
    try {
      const data = await surveysService.getsurveys();

      setSurveys(data);
      setIsLoading(false);
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Creating survey failed</Typography>,
        {
          variant: "error",
        }
      );
      setIsLoading(false);
    }
  }

  async function submitHandler(obj: Inputs) {
    let payload: any = {
      is_mobile_allowed: false,
      is_tablet_allowed: false,
      is_desktop_allowed: false,
    };
    payload = { ...obj };
    payload.is_mobile_allowed = obj.device.includes(1) ? true : false;
    payload.is_tablet_allowed = obj.device.includes(2) ? true : false;
    payload.is_desktop_allowed = obj.device.includes(3) ? true : false;
    delete payload.device;
    try {
      await surveysService.postsurvey(payload);
      getSurveys();
      closeDialog();
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Creating survey failed</Typography>,
        {
          variant: "error",
        }
      );
    }
  }

  function cardClickHandler(survey: Inputs) {
    navigate(`/surveys/${survey.id}`);
  }

  useEffect(() => {
    getSurveys();
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
            Create New Survey
          </DialogTitle>
          <IconButton
            onClick={closeDialog}
            sx={{ width: "40px", height: "40px" }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
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
          <CreateSurvey onSubmit={submitHandler} />
        </DialogContent>
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // background: "white",
            // zIndex: 500,
            padding: "1rem 2rem 0rem 2rem",
            marginBottom: "1rem",
          }}
        >
          <Stack direction="row" gap="1rem">
            <Typography variant="h6">Surveys</Typography>
            <AddBtn onClick={openDialog} />
          </Stack>
        </Box>
        <Box sx={{ padding: "0rem 2rem 0rem 2rem" }}>
          {surveys.length <= 0 && !isLoading ? (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography>There is no Survey</Typography>
            </Box>
          ) : (
            <GridContainerSurvey style={{ marginBottom: "2rem" }}>
              {/* <AddCard handleClick={handleClick} /> */}
              {surveys?.map((survey) => {
                return (
                  <Card
                    key={survey.id}
                    clickHandler={() => cardClickHandler(survey)}
                    survey={survey}
                  />
                );
              })}
            </GridContainerSurvey>
          )}
          {isLoading ? <LoadingSpinner /> : null}
        </Box>
      </PageWrapper>
    </>
  );
}

export default SurveysListContainer;
