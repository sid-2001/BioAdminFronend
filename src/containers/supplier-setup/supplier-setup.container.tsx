import { BlueTick, GreenTickSupplier, Tick } from "@/assets/images";
import CustomDividerComponent from "@/components/custom-divider";
import { DetailsBox } from "@/components/project-details/project-details.style";
import SupplierRedirectionComponent from "@/components/supplier-redirection";
import SupplierS2SComponent from "@/components/supplier-s2s";
import SupplierVariablesComponent from "@/components/supplier-variables/supplier-variables.component";
import { Box, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import { theme } from "@/constants/theme";
import { SuppliersService } from "@/services/supplier.sevice";
import { useParams } from "react-router-dom";
import LoadingSpinner from "@/components/loader";

const Steps = [
  {
    name: "Variable",
    value: 1,
  },
  {
    name: "Redirection URL(s)",
    value: 2,
  },
  {
    name: "S2S URL(s)",
    value: 3,
  },
];

interface variablePayload {
  variable_1: string;
  variable_2: string;
  variable_3: string;
  variable_4: string;
  incomingAutoPunch: any;
}

interface redirectionPayload {
  vendorCompleted: any;
  vendorQuotaFull: any;
  vendorTerminate: any;
  vendorSecurity: any;
}

interface s2sPayload {
  s2sCompleted: any;
  s2sQuotaFull: any;
  s2sTerminate: any;
  s2sSecurity: any;
  s2sEnable: any;
}

const SupplierSetupContainer = () => {
  const [val, setVal] = useState(1);
  const [completeStepsId, setCompleteStepsId] = useState<number[]>([]);
  const [variableData, setVariableData] = useState<variablePayload | null>(null);
  const [redirectionData, setRedirectionData] = useState<redirectionPayload | null>(null);
  const [s2sData, setS2sData] = useState<s2sPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [rowId, setRowId] = useState<null | number>(null);
  const suppliersService = new SuppliersService();
  let { supplierId } = useParams();

  const GetData = async () => {
    setLoading(true);
    try {
      let result: any = await suppliersService.getSupplierConfig(Number(supplierId));
      let payload: SetStateAction<number[]> = [];
      if (!result) {
      } else {
        if (result.variable_1) {
          payload.push(1);
        } else {
          let indexToDelete = payload.indexOf(1);
          if (indexToDelete !== -1) {
            payload.splice(indexToDelete, 1);
          }
        }
        if (result.redirect_completed && result.redirect_completed !== "") {
          payload.push(2);
        } else {
          let indexToDelete = payload.indexOf(2);
          if (indexToDelete !== -1) {
            payload.splice(indexToDelete, 1);
          }
        }

        if (result.s2s_enable != null) {
          payload.push(3);
        } else {
          let indexToDelete = payload.indexOf(3);
          if (indexToDelete !== -1) {
            payload.splice(indexToDelete, 1);
          }
        }
        let variablePayload = {
          variable_1: result.variable_1,
          variable_2: result.variable_2,
          variable_3: result.variable_3,
          variable_4: result.variable_4,
          incomingAutoPunch: result.incoming_auto_punch,
        };

        let redirectionPayload = {
          vendorCompleted: result.redirect_completed,
          vendorQuotaFull: result.redirect_quota_full,
          vendorTerminate: result.redirect_terminate,
          vendorSecurity: result.redirect_security,
        };

        let s2sPayload = {
          s2sCompleted: result.s2s_completed,
          s2sQuotaFull: result.s2s_quota_full,
          s2sTerminate: result.s2s_terminate,
          s2sSecurity: result.s2s_security,
          s2sEnable: result.s2s_enable,
        };
        setRowId(Number(result.id));
        setCompleteStepsId(payload);
        setVariableData(variablePayload);
        setRedirectionData(redirectionPayload);
        setS2sData(s2sPayload);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  useEffect(() => {
    GetData();
  }, [supplierId]);

  return (
    <DetailsBox sx={{ padding: "1rem" }}>
      <Grid container spacing={2}>
        {loading ? <LoadingSpinner /> : ""}
        <Grid item xs={2.5} sx={{ paddingTop: "10px !important" }}>
          <List
            sx={{
              borderRight: "1px solid #E4E4E4",
              height: "calc(100vh - 260px)",
              overflowY: "auto",
            }}
          >
            <Stack mb={1} sx={{ width: "96%" }}>
              <Typography sx={{ fontSize: "20px", fontWeight: "600", paddingLeft: "8px" }} color="dark" mb={1}>
                Configuration
              </Typography>
              <CustomDividerComponent />
            </Stack>
            {Steps.map(step => {
              return (
                <ListItem
                  sx={{
                    borderBottom: completeStepsId.includes(step.value) ? `1px solid ${theme.palette.primary.main}` : val === step.value ? "1px solid #D4ACEF" : "1px solid #E4E4E4",
                    height: "56px",
                    paddingLeft: "10px",
                    width: "96%",
                    cursor: "pointer",
                    background: val === step.value ? `#e8d0fdd8 !important` : "",
                    "&:hover": {
                      background: "#f5f5f5",
                    },
                  }}
                  onClick={() => {
                    setVal(step.value);
                  }}
                >
                  <ListItemIcon>
                  <img src={completeStepsId.includes(step.value) ? BlueTick : val === step.value ? GreenTickSupplier : Tick} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ fontSize: "18px", fontWeight: "600" }} color="dark">
                      {step.name}
                    </Typography>
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Grid>

        <Grid item xs={9.5} sx={{ paddingTop: "10px !important" }}>
          <Box sx={{ height: "calc(100vh - 260px)", overflowY: "auto" }}>
            {val === 1 ? <SupplierVariablesComponent data={variableData} GetData={GetData} rowId={rowId} /> : val === 2 ? <SupplierRedirectionComponent data={redirectionData} GetData={GetData} rowId={rowId} /> : val === 3 ? <SupplierS2SComponent data={s2sData} GetData={GetData} rowId={rowId} /> : ""}
          </Box>
        </Grid>
      </Grid>
    </DetailsBox>
  );
};

export default SupplierSetupContainer;
