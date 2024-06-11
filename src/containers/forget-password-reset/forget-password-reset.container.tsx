import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthViewComponent from "@/components/auth-view";
import { Input } from "@/styles/common-auth";
import { UserService } from "@/services/auth.service";
import { logger } from "@/helpers/logger";
import LoadingSpinner from "@/components/loader";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";

const ForgetPasswordResetContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userService = new UserService();
  const token = new URLSearchParams(location.search).get("t");
  let { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reset_password(
    confirm_password: string,
    new_password: string
  ) {
    setLoading(true);
    if (confirm_password && new_password) {
      try {
        await userService.forget_password_reset_password({
          confirm_password: confirm_password,
          new_password: new_password,
          forget_reset_password_token: token || "",
        });
        enqueueSnackbar("Successfully pasword change", {
          variant: "success",
        });
        navigate("/login");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error instanceof Error) {
          enqueueSnackbar(`${(error as any)?.response.data.data.message}`, {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Unexpected error occurred.", {
            variant: "error",
          });
        }
        logger.error(error);
      }
    }
  }

  function submit_handler(e: React.SyntheticEvent) {
    e.preventDefault();
    setError(null);
    const target = e.target as typeof e.target & {
      newPassword: { value: string };
      confirmPassword: { value: string };
    };
    const newPassword = target.newPassword.value;
    const confirmPassword = target.confirmPassword.value;

    if (!newPassword) {
      setError("New password is required!");
      return;
    }

    if (newPassword?.length < 7) {
      setError("Password should be at least 7 characters.");
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setError("Include at least one lowercase letter.");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError("Include at least one uppercase letter.");
      return;
    }

    if (!/\d/.test(newPassword)) {
      setError("Include at least one number.");
      return;
    }

    if (!/[@$!%*?&#]/.test(newPassword)) {
      setError("Include at least one special character.");
      return;
    }

    if (!confirmPassword) {
      setError("Confirm password is required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    reset_password(confirmPassword, newPassword);
  }

  return (
    <React.Fragment>
      <AuthViewComponent heading="Reset Your Password">
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}
        <form onSubmit={submit_handler}>
          <Input
            fullWidth={true}
            label="New Password"
            type="password"
            name="newPassword"
          />
          <Input
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
          />
          <Button variant="contained" type="submit" fullWidth>
            Reset Password
          </Button>
        </form>
      </AuthViewComponent>
      {loading ? <LoadingSpinner /> : null}
    </React.Fragment>
  );
};

export default ForgetPasswordResetContainer;
