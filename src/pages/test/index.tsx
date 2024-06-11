// import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddCard from "@/components/add-card";
import { Stack } from "@mui/material";
import Tabs from "@/components/tabs";
import { useState } from "react";
// import HorizontalLinearStepper from "@/components/tabs/tabs.component";
// import CustomizedSteppers from "@/components/stepper/stepper.component";

function Test() {
  const handleClick = () => {};
  const [value, setValue] = useState(0);
  return (
    <Box sx={{ width: "100vw", maxWidth: 500 }}>
      {/* <Typography variant="h1" gutterBottom>
        h1. Heading
      </Typography>
      <Typography variant="h2" gutterBottom>
        h2. Heading
      </Typography>
      <Typography variant="h3" gutterBottom>
        h3. Heading
      </Typography>
      <Typography variant="h4" gutterBottom>
        h4. Heading
      </Typography>
      <Typography variant="h5" gutterBottom>
        h5. Heading
      </Typography>
      <Typography variant="h6" gutterBottom>
        h6. Heading
      </Typography> */}
      {/* <CustomizedSteppers /> */}
      <Stack marginLeft={"20px"} spacing={2}>
        {/* <ProjectCard /> */}
        <AddCard handleClick={handleClick} />
        <Tabs
          setValue={setValue}
          value={value}
          labels={[
            { label: "User Details", isDisabled: false, icon: "DetailsIcon" },
            { label: "Projects", isDisabled: false, icon: "ProjectIcon" },
          ]}
          tabpanels={<div>Test</div>}
        />
      </Stack>
    </Box>
  );
}

export default Test;
