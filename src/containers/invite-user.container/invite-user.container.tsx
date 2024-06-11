import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthViewComponent from "@/components/auth-view";
import { Input } from "@/styles/common-auth";
import { UserService } from "@/services/auth.service";
import { logger } from "@/helpers/logger";
import LoadingSpinner from "@/components/loader";
import { Button, Typography } from "@mui/material";
import { useSnackbar } from "notistack";

const UserInviteContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userService = new UserService();
  const token = location.state?.token;
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reset_details(confirm_password: string, new_password: string) {
    setLoading(true);
    if (confirm_password && new_password) {
      try {
        await userService.user_invite({
          password: confirm_password,

          reset_password_token: token ? token : "",
        });
        enqueueSnackbar("Successfully set password", {
          variant: "success",
        });
        navigate("/login", { replace: true });
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

    reset_details(confirmPassword, newPassword);
  }

  return (
    <React.Fragment>
      <AuthViewComponent>
        {/* {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )} */}
        <form
          onSubmit={submit_handler}
          style={{
            marginTop: "5.5rem",
          }}
        >
          <Typography
            variant="h2"
            style={{
            //   color: "var(--Grey-0, #FBF8F8)",
              font: "500 20px Inter, sans-serif",
              lineHeight: "14px",
              marginBottom: "2rem",
            }}
          >
            Please set your password
          </Typography>
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
          {error && (
            <div
              style={{ color: "red", marginBottom: "30px", marginTop: "-15px" }}
            >
              {error}
            </div>
          )}
          <Button variant="contained" type="submit" fullWidth>
            Submit
          </Button>
        </form>
      </AuthViewComponent>
      {loading ? <LoadingSpinner /> : null}
    </React.Fragment>
  );
};

export default UserInviteContainer;
