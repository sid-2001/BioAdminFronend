interface CustomizedSteppersProps {
  stepperLabels: StepperLabels[];
  activeStep: number;
}

interface StepperLabels {
  heading: string;
  subHeading: string;
}

export type { CustomizedSteppersProps, StepperLabels };
