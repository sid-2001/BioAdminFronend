import { Button, Grid } from "@mui/material";
import TextField from "@/components/text-field";
import { SubmitHandler, useForm } from "react-hook-form";
import { ClientPostDataType } from "@/types/client.types";
import { Box } from "@mui/system";
import { useOutletContext, useParams } from "react-router";
import { useSnackbar } from "notistack";
import { ClientsService } from "@/services/client.service";

interface Inputs {
  name: string;
  email: string;
  website_url: string;
  contact: string;
  profile_image_url: string;
}

interface ClientDetailsFormPropTypes {
  formState: any;
  setFormState: any;
  setLoading: any;
  setIsEdit: any;
  loading: any;
}

function ClientDetailsForm({
  formState,
  setFormState,
  setLoading,
  setIsEdit,
  loading,
}: ClientDetailsFormPropTypes) {
  const { register, handleSubmit } = useForm<Inputs>();
  const clientsService = new ClientsService();
  const { clientId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { getAndUpdateClient } = useOutletContext<any>();

  async function updateClient(client: ClientPostDataType) {
    setLoading(true);
    try {
      await clientsService.putClient(clientId || "", client);
      getAndUpdateClient();
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      });
      setLoading(false);
    }
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);

    updateClient(data as any).finally(() => {
      setIsEdit(false);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "60%" }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <label style={{ marginLeft: "5px" }}>Client Name*</label>
          <TextField
            {...register("name", { required: true })}
            sx={{ paddingTop: "5px" }}
            value={formState.name}
            onChange={(e) => {
              setFormState((prev: any) => {
                return {
                  ...prev,
                  name: e.target.value,
                };
              });
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <label style={{ marginLeft: "5px" }}>Client Email</label>
          <TextField
            {...register("email")}
            sx={{ paddingTop: "5px" }}
            value={formState.email}
            onChange={(e) => {
              setFormState((prev: any) => {
                return {
                  ...prev,
                  email: e.target.value,
                };
              });
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <label style={{ marginLeft: "5px" }}>Client Web Url</label>
          <TextField
            {...register("website_url")}
            sx={{ paddingTop: "5px" }}
            value={formState.website_url}
            onChange={(e) => {
              setFormState((prev: any) => {
                return {
                  ...prev,
                  website_url: e.target.value,
                };
              });
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <label style={{ marginLeft: "5px", marginBottom: "5px" }}>
            Contact
          </label>
          <TextField
            type="number"
            {...register("contact", { required: false })}
            sx={{ paddingTop: "5px" }}
            value={Number(formState.contact) || 0}
            onChange={(e) => {
              setFormState((prev: any) => {
                return {
                  ...prev,
                  contact: e.target.value,
                };
              });
            }}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          pt: 7,
          paddingBottom: "1rem",
        }}
      >
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          onClick={() => {
            setIsEdit(false);
          }}
          sx={{ mr: 1 }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          Save
        </Button>
      </Box>
    </form>
  );
}

export default ClientDetailsForm;
