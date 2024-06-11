import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import { Typography } from "@mui/material";
import { theme } from "@/constants/theme";
import { CustomizedSteppersProps, StepperLabels } from "./stepper.type";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  //   width: "700px",
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.dark,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.dark,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: theme.palette.primary.dark,
    }),
    "& .QontoStepIcon-completedIcon": {
      color: theme.palette.primary.dark,
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

export default function CustomizedSteppers(props: CustomizedSteppersProps) {
  const { stepperLabels, activeStep } = props;

  return (
    <Stepper
      activeStep={activeStep}
      connector={<QontoConnector />}
      sx={{ width: "800px", boxSizing: "border-box'" }}
    >
      {stepperLabels.map((label: StepperLabels, index: number) => (
        <Step key={index}>
          <StepLabel StepIconComponent={QontoStepIcon}>
            <Stack direction="row" alignItems="center">
              <Typography variant="h1" fontSize="50px">
                0{index + 1}
              </Typography>
              <Stack
                direction="column"
                justifyContent="space-between"
                marginLeft="10px"
              >
                <Typography variant="body1" fontSize="14px" fontWeight="700">
                  {label.heading}
                </Typography>
                <Typography
                  variant="caption"
                  fontSize="11px"
                  color={theme.palette.grey[500]}
                >
                  {label.subHeading}
                </Typography>
              </Stack>
            </Stack>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
