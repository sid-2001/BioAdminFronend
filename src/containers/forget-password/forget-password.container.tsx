import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { UserService } from "@/services/auth.service";
import { logger } from "@/helpers/logger";
import AuthViewComponent from "@/components/auth-view";
import { Input, StyledForgetPassword } from "@/styles/common-auth";
import LoadingSpinner from "@/components/loader";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";

function ForgetPasswordContainer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  let { enqueueSnackbar } = useSnackbar();

  function isValidEmail(email: string) {
    // Simple email validation using regex
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }

  function handleForgetPassword(email: string) {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);
    const userService = new UserService();
    userService
      .forget_password({ user_email: email })
      .then(() => {
        enqueueSnackbar("Mail sent! Please check your Inbox.", {
          variant: "success",
        });
      })
      .catch((error) => {
        logger.error(error);
        enqueueSnackbar(`${error?.response.data.data.message}`, {
          variant: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
    };
    const email = target.email.value;
    handleForgetPassword(email);
  }

  return (
    <React.Fragment>
      <AuthViewComponent heading="Forgot Password">
        <form onSubmit={handleSubmit}>
          <Input
            fullWidth={true}
            label="Email"
            type="email"
            name="email"
            error={error ? true : false}
            helperText={error}
          />

          <Button type="submit" variant="contained" fullWidth>
            {loading ? "Sending..." : "Send Email"}
          </Button>
        </form>
        <StyledForgetPassword sx={{ marginTop: "1rem" }}>
          <RouterLink to="/login">Back to Login</RouterLink>
        </StyledForgetPassword>
      </AuthViewComponent>
      {loading ? <LoadingSpinner /> : null}
    </React.Fragment>
  );
}

export default ForgetPasswordContainer;
