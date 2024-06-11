import React from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useSnackbar } from "notistack";

import { UserService } from "@/services/auth.service";
import { LocalStorageService } from "@/helpers/local-storage-service";
import { logger } from "@/helpers/logger";
import AuthViewComponent from "@/components/auth-view";
import { Input, StyledForgetPassword } from "@/styles/common-auth";
import LoadingSpinner from "@/components/loader";

function LoginContainer() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const [formErrors, setFormErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 8;
  };

  function submit_handler(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    let errors = {};

    if (!email) {
      errors = { ...errors, email: "Please enter email address" };
    }

    if (!isValidEmail(email) && email) {
      errors = { ...errors, email: "Please enter a valid email address." };
    }

    if (!password) {
      errors = { ...errors, password: "Please enter a password" };
    }

    if (!isValidPassword(password) && password) {
      errors = {
        ...errors,
        password: "Password should be at least 8 characters long.",
      };
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    setFormErrors({});

    const userService = new UserService();

    userService
      .login({ email, password })
      .then((user: any) => {
        const localstorageService = new LocalStorageService();
        localstorageService.set("user", user);
        localstorageService.set("access_token", user.token.replaceAll(`"`, ""));
        localStorage.setItem("userEmail", email);
        enqueueSnackbar("Successfully Login.", { variant: "success" });
        setLoading(false);
        navigate("/projects");
      })
      .catch((err: any) => {
        logger.error(err);
        setLoading(false);
        if ((err as any)?.response?.status === 400) {
          enqueueSnackbar(`${(err as any)?.response?.data?.message}`, {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Please check your email and pasword.", {
            variant: "error",
          });
        }
      });
  }

  return (
    <React.Fragment>
      <AuthViewComponent
        heading="Welcome to Bio Brain! 👋🏻"
        subHeading="Please sign-in to your account and start the adventure"
      >
        <form onSubmit={submit_handler}>
          <Box>
            <Input
              fullWidth={true}
              label="Email"
              type="email"
              name="email"
              error={!!formErrors.email}
              helperText={formErrors?.email}
            />

            <Input
              fullWidth={true}
              label="Password"
              type="password"
              name="password"
              error={!!formErrors.password}
              helperText={formErrors?.password}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "2.75rem",
            }}
          >
            <RouterLink to="/password-recovery">
              <StyledForgetPassword>Forgot Password?</StyledForgetPassword>
            </RouterLink>
          </Box>
          <Button type="submit" variant="contained" fullWidth color="primary">
            Login
          </Button>
        </form>
      </AuthViewComponent>
      {loading ? <LoadingSpinner /> : null}
    </React.Fragment>
  );
}

export default LoginContainer;
