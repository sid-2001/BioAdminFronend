import { Box, Grid, Typography } from "@mui/material";
import TextField from "@/components/text-field";
import Button from "@mui/material/Button";
import Select from "@/components/select";
import { boxStyle } from "@/components/create-project/create-project.style";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { Inputs } from "./surveys-list.container";
import { ProjectService } from "@/services/projects.service";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { Project } from "@/types/project.type";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { URL_REGEX } from "@/constants/constants";
import LoadingSpinner from "@/components/loader";
import { ListService } from "@/services/list.service";
import MultipleSelectCheckmarks from "@/components/multiple-select";
import { useParams } from "react-router-dom";

export interface Inputs {
  id: number;
  project_id: number;
  survey_name: string;
  start_date: any;
  end_date: any;
  description: string;
  language_id: number;
  cpi: number;
  ir: number;
  loi: number;
  sample_size: number;
  device: number[];
  survey_type_id: number;
  industry_id: number;
  survey_live_link: string;
  survey_test_link: string;
  sp_project_id?: string;
  status_id?: number;
  market_name?: string;
  starts?: number;
  last_complete?: number;
  conversion?: number;
  terminate?: number;
  completed?: number;
}

export const SurveySchema = z.object({
  survey_live_link: z
    .string()
    .optional()
    .refine(
      (value): value is string =>
        typeof value === "string" && (value === "" || URL_REGEX.test(value)),
      {
        message: "Valid URL required",
      }
    ),
  survey_test_link: z
    .string()
    .optional()
    .refine(
      (value): value is string =>
        typeof value === "string" && (value === "" || URL_REGEX.test(value)),
      {
        message: "Valid URL required",
      }
    ),

  // project_id: z.number(),
  survey_name: z.string({
    required_error: "Survey Name required",
  }),
  start_date: z.string({
    required_error: "Start Date required",
  }),
  end_date: z.string({
    required_error: "End Date required",
  }),
  description: z.string({}).optional(),
  sp_project_id: z.string({}).optional(),
  language_id: z.number(),
  cpi: z.string({
    required_error: "Is required",
  }),
  ir: z.string({
    required_error: "Incident rate is required",
  }),
  // device: z.number({
  //   required_error: "Is required",
  // }),
  loi: z.string(),
  sample_size: z.string(),
  survey_type_id: z.number({
    required_error: "Is required",
  }),
  industry_id: z.number({
    required_error: "Is required",
  }),
});

interface CreateSurveyPropTypes {
  onSubmit: (obj: any) => void;
}

function CreateSurvey({ onSubmit }: CreateSurveyPropTypes) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(SurveySchema),
  });
  const listService = new ListService();
  const projectService = new ProjectService();
  const { enqueueSnackbar } = useSnackbar();

  const [projects, setProjects] = useState<Array<Project>>([]);
  const [marketList, setMarketList] = useState<any>([]);
  const [surveyTypeList, setSurveyTypeList] = useState<any>([]);
  const [industryList, setIndustryList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [currentEndDate, setCurrentEndDate] = useState(() => {
    const startDate = new Date(currentDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    return endDate.toISOString().substr(0, 10);
  });
  // useEffect(() => {
  //   const startDate = new Date(currentDate);
  //   const endDate = new Date(startDate);
  //   endDate.setMonth(endDate.getMonth() + 1);
  //   setCurrentEndDate(endDate.toISOString().substr(0, 10));
  // }, []);
  const { projectId } = useParams();

  async function getProjects() {
    try {
      const data = await projectService.projectFilterList({
        statuses: [],
        clients: [],
      });

      setProjects(data);
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Fetching projects failed</Typography>,
        {
          variant: "error",
        }
      );
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  async function getMarket() {
    try {
      const data = await listService.get_market_list();
      if (data && data) {
        const marketListData = data.map((item: { id: any; name: any }) => ({
          value: item.id,
          text: item.name,
        }));
        setMarketList(marketListData);
      }
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Fetching Market List failed</Typography>,
        {
          variant: "error",
        }
      );
    }
  }

  useEffect(() => {
    if (watch("project_id")) getMarket();
  }, [watch("project_id")]);

  async function surveyType() {
    try {
      const data = await listService.get_survey_type_list();
      if (data && data) {
        const surveyTypeData = data.map((item: { id: any; name: any }) => ({
          value: item.id,
          text: item.name,
        }));
        setSurveyTypeList(surveyTypeData);
      }
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">
          Fetching Survey Type List failed
        </Typography>,
        {
          variant: "error",
        }
      );
    }
  }
  async function getIndustry() {
    try {
      const data = await listService.get_industry_list();
      if (data && data) {
        const industryData = data.map((item: { id: any; name: any }) => ({
          value: item.id,
          text: item.name,
        }));
        setIndustryList(industryData);
      }
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">
          Fetching Survey Type List failed
        </Typography>,
        {
          variant: "error",
        }
      );
    }
  }

  useEffect(() => {
    surveyType();
    getIndustry();
  }, []);

  async function submitHandler(obj: Inputs) {
    try {
      setIsLoading(true);
      let payload = { ...obj, project_id: projectId };
      payload.device = watch("device");
      payload.ir = Number(watch("ir"));
      payload.sample_size = Number(watch("sample_size"));
      payload.loi = Number(watch("loi"));
      payload.cpi = Number(parseFloat(String(obj.cpi)).toFixed(2));
      await onSubmit(payload);
      reset();
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Creating survey failed</Typography>,
        {
          variant: "error",
        }
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (
    selected: { value: string | number; text: string }[]
  ) => {
    setValue(
      "device",
      selected.map((item) => Number(item.value))
    );
  };

  useEffect(() => {
    setValue(
      "device",
      [1, 2, 3]
    );
  }, [])

  const handleKeyPressCpi = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-') {
      e.preventDefault();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === '.') {
      e.preventDefault();
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <Grid container spacing={2} marginTop={"0.10rem"}>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}>Project*</label>
            <Select
              disabled={true}
              value={projectId?.toString() || ""}
              items={projects.map((project) => ({
                text: project.project_name,
                value: project.project_id as any,
              }))}
              name="project_id"
              label=""
              register={register as any}
              isRequired={true}
              sx={{
                display: "flex",
                flexDirection: "column",
                borderColor: "#9C9C9C",
                paddingTop: "10px",
                "@media (max-width: 963px)": {
                  width: "300px",
                },
                "@media (max-width: 733px)": {
                  width: "250px",
                },
                "@media (max-width: 627px)": {
                  width: "200px",
                },
                "@media (max-width: 523px)": {
                  width: "150px",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}>Survey Name*</label>
            <Box sx={boxStyle}>
              <TextField
                placeholder="Name"
                {...register("survey_name", { required: true })}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}>Cpi($)*</label>
            <Box sx={boxStyle}>
              <TextField
                onKeyPress={handleKeyPressCpi}
                autoSelectOnFocus
                value={watch('cpi')}
                InputProps={{
                  inputProps: {
                    min: 0,
                  }
                }}
                type="number"
                placeholder="Cpi"
                {...register("cpi", { required: true })}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}>Loi*</label>
            <Box sx={boxStyle}>
              <TextField
                onKeyPress={handleKeyPress}
                autoSelectOnFocus
                value={watch('loi')}
                InputProps={{
                  inputProps: {
                    min: 0,
                  }
                }}
                type="number"
                placeholder="Loi"
                {...register("loi", { required: true })}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}>Sample Size*</label>
            <Box sx={boxStyle}>
              <TextField
                onKeyPress={handleKeyPress}
                autoSelectOnFocus
                value={watch('sample_size')}
                InputProps={{
                  inputProps: {
                    min: 0,
                  }
                }}
                type="number"
                placeholder="Sample Size"
                {...register("sample_size", { required: true })}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}>Incident rate*</label>
            <Box sx={boxStyle}>
              <TextField
                onKeyPress={handleKeyPress}
                autoSelectOnFocus
                value={watch('ir')}
                InputProps={{
                  inputProps: {
                    min: 0,
                  }
                }}
                type="number"
                placeholder="Incident rate"
                {...register("ir", { required: true })}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}>Start Date*</label>
            <Box sx={boxStyle}>
              <TextField
                type="date"
                placeholder="Start Date"
                value={currentDate}
                {...register("start_date", { required: true })}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}>End Date*</label>
            <Box sx={boxStyle}>
              <TextField
                type="date"
                placeholder="End Date"
                value={currentEndDate}
                {...register("end_date", { required: true })}
                onChange={(e) => setCurrentEndDate(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}>Device*</label>
            <MultipleSelectCheckmarks
              width="100%"
              items={[
                {
                  value: 1,
                  text: "Mobile",
                },
                {
                  value: 2,
                  text: "Tablet",
                },
                {
                  value: 3,
                  text: "Desktop",
                },
              ]}
              label=""
              handleChange={handleChange}
              selectedOptions={watch("device")}
              style={{ paddingTop: "10px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}> Survey Type*</label>
            <Select
              items={surveyTypeList}
              name="survey_type_id"
              label=""
              register={register as any}
              isRequired={true}
              sx={{
                display: "flex",
                flexDirection: "column",
                borderColor: "#9C9C9C",
                paddingTop: "10px",
                "@media (max-width: 963px)": {
                  width: "300px",
                },
                "@media (max-width: 733px)": {
                  width: "250px",
                },
                "@media (max-width: 627px)": {
                  width: "200px",
                },
                "@media (max-width: 523px)": {
                  width: "150px",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}>Market*</label>
            <Select
              items={marketList}
              name="language_id"
              label=""
              register={register as any}
              isRequired={true}
              sx={{
                display: "flex",
                flexDirection: "column",
                borderColor: "#9C9C9C",
                paddingTop: "10px",
                "@media (max-width: 963px)": {
                  width: "300px",
                },
                "@media (max-width: 733px)": {
                  width: "250px",
                },
                "@media (max-width: 627px)": {
                  width: "200px",
                },
                "@media (max-width: 523px)": {
                  width: "150px",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}> Industry*</label>
            <Select
              items={industryList}
              name="industry_id"
              label=""
              register={register as any}
              isRequired={true}
              sx={{
                display: "flex",
                flexDirection: "column",
                borderColor: "#9C9C9C",
                paddingTop: "10px",
                "@media (max-width: 963px)": {
                  width: "300px",
                },
                "@media (max-width: 733px)": {
                  width: "250px",
                },
                "@media (max-width: 627px)": {
                  width: "200px",
                },
                "@media (max-width: 523px)": {
                  width: "150px",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <label style={{ marginLeft: "5px" }}>Sp Project Id</label>
            <Box sx={boxStyle}>
              <TextField
                placeholder="Sp Project Id"
                {...register("sp_project_id")}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <label
              style={{
                marginLeft: "5px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Survey test link
            </label>
            <TextField
              placeholder="Type here"
              fullWidth
              {...register("survey_test_link", { required: false })}
            />
            <Typography variant="body1" sx={{ color: "red", margin: "1rem" }}>
              {errors.survey_test_link?.message}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <label
              style={{
                marginLeft: "5px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Survey live link
            </label>
            <TextField
              placeholder="Type here"
              fullWidth
              {...register("survey_live_link", { required: false })}
            />
            <Typography variant="body1" sx={{ color: "red", margin: "1rem" }}>
              {errors.survey_live_link?.message}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <label style={{ marginLeft: "5px" }}>Description</label>
            <TextField
              placeholder="Type here"
              fullWidth
              multiline={true}
              rows={5}
              InputProps={{
                style: {
                  padding: "10px",
                },
              }}
              {...register("description", { required: false })}
              sx={{ paddingTop: "10px", paddingBottom: "40px" }}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Box>
      </form>
    </>
  );
}

export default CreateSurvey;
