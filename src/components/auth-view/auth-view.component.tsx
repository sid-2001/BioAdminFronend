import { AuthViewProps } from "./auth-view.type";
import {
  MainContainer,
  LeftContainer,
  RightContainer,
  FormContainer,
  Heading,
  SubHeading,
} from "./auth-view.style"
import { Grid } from "@mui/material"
import { LongLogo } from "@/assets/images"

function AuthViewComponent(props: AuthViewProps) {
  const { children, heading, subHeading } = props;

  return (
    <MainContainer container spacing={0}>
      <Grid item sm={8} sx={{ background: "#f5f5f5" }}>
        <LeftContainer></LeftContainer>
      </Grid>
      <RightContainer item xs={12} sm={4}>
        <FormContainer component='main'>
          <img src={LongLogo} />
          <Heading variant='h6'>{heading}</Heading>
          {subHeading ? (
            <SubHeading variant='body2'>{subHeading}</SubHeading>
          ) : (
            ""
          )}
          {children}
        </FormContainer>
      </RightContainer>
    </MainContainer>
  );
}

export default AuthViewComponent;
