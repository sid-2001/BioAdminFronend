import { Box } from "@mui/system";
import {
  DetailsBox,
  StyledKeys,
  StyledValues,
  StyledValueswithIcons,
} from "@/components/project-details/project-details.style";
import { Button, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TextField from "@/components/text-field";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import LoadingSpinner from "@/components/loader";
import EditIcon from "@mui/icons-material/Edit";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router";
import {
  SuppliersService,
  SupplierRequestType,
} from "@/services/supplier.sevice";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { URL_REGEX } from "@/constants/constants";

const SupplierSchema = z.object({
  website_url: z
    .string()
    .optional()
    .refine(
      (value): value is string =>
        typeof value === "string" && (value === "" || URL_REGEX.test(value)),
      {
        message: "Valid URL required",
      }
    ),
  // profile_image_url: z
  //   .string()
  //   .url({
  //     message: "Valid url only",
  //   })
  //   .regex(URL_REGEX, "Valid url only")
  //   .optional(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is required",
    }),
  // name: z.string({
  //   required_error: "Name is required",
  // }),
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
});

function SupplierOverviewContainer() {
  const { supplier, getAndUpdateSupplier, isLoading } = useOutletContext<any>();

  const [loading, setLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const suppliersService = new SuppliersService();
  const { supplierId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierRequestType>({
    resolver: zodResolver(SupplierSchema),
  });
  const [formState, setFormState] = useState<SupplierRequestType>({
    name: supplier?.name || "",
    email: supplier?.email || "",
    website_url: supplier?.website_url || "",
    profile_image_url: supplier?.profile_image_url || "",
    description: supplier?.description || "",
  });

  useEffect(() => {
    if (supplier) {
      setFormState({
        name: supplier?.name || "",
        email: supplier?.email || "",
        website_url: supplier?.website_url || "",
        profile_image_url: supplier?.profile_image_url || "",
        description: supplier?.description || "",
      });
    }
  }, [supplier]);

  async function updatesupplier(supplier: SupplierRequestType) {
    setLoading(true);
    try {
      await suppliersService.putSupplier(supplierId || "", supplier);
      getAndUpdateSupplier();
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      });
      setLoading(false);
    }
  }

  useEffect(() => {
    getAndUpdateSupplier();
  }, []);

  const onSubmit: SubmitHandler<SupplierRequestType> = async (data) => {
    console.log(data);

    updatesupplier(data as any).finally(() => {
      setIsEdit(false);
    });
  };

  console.log(supplier, "suppliersupplier");

  function truncateText(text: any, length: number) {
    // Check if the input is a string and if it exceeds the required length
    if (typeof text === "string" && text.length > length) {
      return `${text.substr(0, length)}...`;
    }
    return text; // This will return the input as is, if it's not a string or if it's within the length limit
  }

  return (
    <DetailsBox sx={{ padding: "2rem", display: "flex" }}>
      {isEdit ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "60%" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>Name*</label>
                <TextField
                  {...register("name")}
                  sx={{ paddingTop: "5px" }}
                  value={formState.name}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        name: e.target.value,
                      };
                    });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>Email</label>
                <TextField
                  {...register("email")}
                  sx={{ paddingTop: "5px" }}
                  value={formState.email}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        email: e.target.value,
                      };
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <label style={{ marginLeft: "5px" }}>Website Url</label>
                <TextField
                  {...register("website_url")}
                  sx={{ paddingTop: "5px" }}
                  value={formState.website_url}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        website_url: e.target.value,
                      };
                    });
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{ color: "red", margin: "1rem" }}
                >
                  {errors.website_url?.message}
                </Typography>
              </Grid>
              {/* <Grid item xs={12}>
                <label style={{ marginLeft: "5px" }}>Profile Url</label>
                <TextField
                  {...register("profile_image_url")}
                  sx={{ paddingTop: "5px" }}
                  value={formState.profile_image_url}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        profile_image_url: e.target.value,
                      };
                    });
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{ color: "red", margin: "1rem" }}
                >
                  {errors.profile_image_url?.message}
                </Typography>
              </Grid> */}
              <Grid item xs={12}>
                <label style={{ marginLeft: "5px", marginBottom: "5px" }}>
                  Description
                </label>
                <TextField
                  multiline={true}
                  rows={3}
                  {...register("description", { required: false })}
                  sx={{ paddingTop: "5px" }}
                  value={formState.description}
                  onChange={(e) => {
                    setFormState((prev) => {
                      return {
                        ...prev,
                        description: e.target.value,
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
        </>
      ) : (
        <Box
          component="div"
          sx={{ display: "flex", gap: "2rem", width: "60%" }}
        >
          <Box component="div" sx={{ flex: 1 }}>
            <Grid container spacing={2} sx={{ marginBottom: "3rem" }}>
              <Grid item xs={6} md={6} sx={{ wordBreak: "break-word" }}>
                <StyledKeys>Supplier</StyledKeys>
                <StyledValues>
                  {supplier &&
                    supplier?.name &&
                    supplier?.name?.charAt(0)?.toUpperCase() +
                      supplier?.name?.slice(1)}
                </StyledValues>
              </Grid>
              <Grid item xs={6} md={6}>
                <StyledKeys>Email</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{supplier?.email || ""}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
              <Grid item xs={12}>
                <StyledKeys>Website Url</StyledKeys>
                <StyledValueswithIcons>
                  {supplier?.website_url.length > 115 ? 
                  <Tooltip title={supplier?.website_url} placement="right">
                  <StyledValues>{truncateText(supplier?.website_url,115) || ""}</StyledValues>
                  </Tooltip> : <StyledValues>{truncateText(supplier?.website_url,115) || ""}</StyledValues>
                }
                </StyledValueswithIcons>
              </Grid>
              {/* <Grid item xs={12}>
                <StyledKeys>Supplier Profile Image Url</StyledKeys>
                <StyledValueswithIcons>
                  <StyledValues>
                    {supplier?.profile_image_url || ""}
                  </StyledValues>
                </StyledValueswithIcons>
              </Grid> */}
              <Grid item xs={12}>
                <StyledKeys>Description</StyledKeys>
                <StyledValueswithIcons>
                  {/* <FolderIcon sx={{paddingRight: "10px" , width: "30px", height: "30px", color: "#9C9C9C"}}/> */}
                  <StyledValues>{supplier?.description || ""}</StyledValues>
                </StyledValueswithIcons>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-top",
              height: "32px",
            }}
          >
            <IconButton
              aria-controls="menu"
              aria-haspopup="true"
              onClick={() => {
                setIsEdit(true);
                // handleClose(e)
              }}
              size="small"
              style={{ alignItems: "start" }}
            >
              {/* <EditIcon fontSize="medium" style={{ color: "#5D5D5D" }} /> */}
              <EditIcon fontSize="medium" style={{ color: "#5D5D5D" }} />
            </IconButton>
          </Box>
        </Box>
      )}
      {loading || isLoading ? <LoadingSpinner /> : null}
    </DetailsBox>
  );
}

export default SupplierOverviewContainer;
