import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserService } from "@/services/auth.service";
import { logger } from "@/helpers/logger";
import LoadingSpinner from "@/components/loader";
import { useSnackbar } from "notistack";

const UserVerifyContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userService = new UserService();
  const token = new URLSearchParams(location.search).get("t");
  let { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
//   const [notVerified, setNotVerified] = useState(false);

  async function reset_details() {
    setLoading(true);
    try {
      await userService.user_token_verification(token ? token : "");
      navigate("/user-invitation", { state: { token } });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      //   if (error instanceof Error) {
      //     enqueueSnackbar(`${(error as any)?.response.data.data.message}`, {
      //       variant: "error",
      //     })
      //   } else {
      enqueueSnackbar("User is not verified.", {
        variant: "error",
      });
      //   }
    //   setNotVerified(true);
      logger.error(error);
    }
  }

  useEffect(() => {
    reset_details();
  }, []);

  return (
    <React.Fragment>
      {loading ? <LoadingSpinner /> : null}
      {/* {notVerified && <div style={{
        width: "200px",
        height: "200px",
        margin: "auto auto"
      }}>Please ask to invite again</div>} */}
    </React.Fragment>
  );
};

export default UserVerifyContainer;
