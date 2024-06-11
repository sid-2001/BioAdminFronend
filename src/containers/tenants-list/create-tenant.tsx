import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import {
   Avatar,
   Box, 
   IconButton,
    ListItem, ListItemAvatar, ListItemText, 
    Stack, Typography } from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import TextField from '@/components/text-field'
import LoadingSpinner from '@/components/loader'
import { textFieldStyle } from '@/containers/clients-list/client-list.style'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ImageIcon from '@mui/icons-material/Image'
// import {
//   TenantService,
//   SupplierRequestType as Inputs,
// } from "@/services/supplier.sevice";
import { TenantService, TenantRequestType as Inputs } from '@/services/tenant.service'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { URL_REGEX } from '@/constants/constants'
import { useState } from 'react'

export const TenantSchema = z.object({
  website_url: z
    .string()
    .optional()
    .refine((value): value is string => typeof value === 'string' && (value === '' || URL_REGEX.test(value)), {
      message: 'Valid URL required',
    }),
  // image: z
  //   .string()
  //   .optional()
  //   .refine(
  //     (value): value is string =>
  //       typeof value === "string" && (value === "" || URL_REGEX.test(value)),
  //     {
  //       message: "Valid URL required",
  //     }
  //   ),

  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({
      message: 'Email is required',
    }),
  name: z.string({
    required_error: 'Name is required',
  }),
  // description: z.string().optional(),
})

interface CreateTenantPropTypes {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
  showDialog: boolean
  fetchAllTenants: () => void
  usedEmails: string[]
}

function CreateTenant({ setShowDialog, showDialog, fetchAllTenants, usedEmails }: CreateTenantPropTypes) {
  const { enqueueSnackbar } = useSnackbar()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(TenantSchema),
  })

  function closeDialog() {
    reset()
    setShowDialog(false)
  }

  const [showUniqueEmailError, setShowUniqueEmailError] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [images,setImages] = useState("")

  const tenantService = new TenantService()

// const handleImageUpload = () => { 
// const fileInput = document.getElementById('imageUploadInput');   
// const file = fileInput.files[0];   
// if (file) {     
//   const reader = new FileReader();     
//   reader.onload = function(event) {       
//     setImages(event.target.result)    
//     console.log(event.target.result, "resultresult") 
//   }
// }
// console.log("image upload")
// }

const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]; // Get the uploaded file
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      if (event.target && event.target.result) {
        const imageDataUrl = event.target.result.toString(); // Convert image data to URL
        setImages(imageDataUrl); // Update state with image data URL
      }
    };
    reader.readAsDataURL(file); // Read the file as data URL
  }
};

  async function createNewSupplier(tenant: Inputs) {
    try {
      setLoading(true)
      await tenantService.postTenant(tenant)
      fetchAllTenants()
      setLoading(false)
      enqueueSnackbar(<Typography variant="body1">Posted Tenant succesfully</Typography>, {
        variant: 'success',
      })
      closeDialog()
      reset({
        name: '',
        // description: "",
        email: '',
        image: '',
        website_url: '',
      })
    } catch (error) {
      if ((error as any).error_code == '409') {
        enqueueSnackbar(<Typography variant="body1">Emails cannot be repeated</Typography>, {
          variant: 'error',
        })
        setLoading(false)
      } else {
        enqueueSnackbar(<Typography variant="body1">Creating Tenant failed</Typography>, {
          variant: 'error',
        })
        setLoading(false)
      }

      closeDialog()
      reset({
        name: '',
        // description: "",
        email: '',
        image: '',
        website_url: '',
      })
    }
  }

  const onSubmit = (data: Inputs) => {
    let { email, name, website_url } = data
    if (showUniqueEmailError) return

    // if (image == undefined) {
    //   image = ''
    // }

    const image = images || '';

    createNewSupplier({
      email,
      name,
      image,
      website_url,
    })
  }

  return (
    <Dialog
      sx={{
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
          width: '0.5em',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'transparent',
        },
      }}
      onClose={closeDialog}
      open={showDialog}
      maxWidth="md"
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginRight: '10px',
          marginTop: '10px',
        }}
      >
        <DialogTitle id="alert-dialog-title" color="black">
          Create New Tenant
        </DialogTitle>
        <IconButton onClick={closeDialog} sx={{ width: '40px', height: '40px' }}>
          <CloseOutlinedIcon />
        </IconButton>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            overflowY: 'scroll',
            '&::-webkit-scrollbar': {
              width: '0.5em',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(2,1fr)',
              marginTop: '1rem',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginLeft: '5px' }}>Name*</label>
              <TextField required {...register('name', { required: true })} name="name" placeholder="Name" sx={textFieldStyle} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginLeft: '5px' }}>Email*</label>
              <TextField
                required
                {...register('email', {
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                name="email"
                placeholder="Email"
                sx={textFieldStyle}
                onChange={(e) => {
                  if (usedEmails.find((email) => email === e.target.value)) {
                    setShowUniqueEmailError(true)
                  } else {
                    setShowUniqueEmailError(false)
                  }
                }}
              />
              <Typography variant="body1" sx={{ color: 'red', margin: '1rem' }}>
                {errors.email?.message}
              </Typography>
              {showUniqueEmailError ? (
                <Typography variant="body1" sx={{ color: 'red', marginTop: '-8px' }}>
                  Emails cannot be reused
                </Typography>
              ) : null}
            </Box>
          </Box>

          <Stack gap={'1rem'}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <label style={{ marginLeft: '5px' }}>Website Url</label>
              <TextField
                {...register('website_url')}
                name="website_url"
                placeholder="Website Url"
                sx={{
                  ...textFieldStyle,
                  width: '100%',
                }}
              />
              {/* Display error message if it exists */}
              {errors.website_url && (
                <Typography variant="body1" sx={{ color: 'red', margin: '1rem' }}>
                  {errors.website_url?.message}
                </Typography>
              )}
            </Box>
            <ListItem
              sx={{
                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                marginBottom: '10px',
                marginTop: "1rem",
                maxWidth: "50%"
              }}
              secondaryAction={
                <Stack direction="row" spacing={0.5}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} id="imageUploadInput" onChange={handleImageUpload}/>
                  <label htmlFor="imageUploadInput">
                    <IconButton component="span">
                      <CloudUploadIcon />
                    </IconButton>
                  </label>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              {/* <ListItemText primary="Logo" /> */}
              <ListItemText
                        primary="Logo"
                        secondary={
                          images && (
                            <img src={images} alt="Uploaded" style={{ maxWidth: '40%', marginTop: '10px' }} />
                          )
                        }
                      />
            </ListItem>
            {/* <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <label style={{ marginLeft: "5px" }}>Profile Image Url</label>
              <TextField
                {...register("image")}
                name="image"
                placeholder="Profile Image Url"
                sx={{
                  ...textFieldStyle,
                  width: "100%",
                }}
              />
              {errors.image && (
                <Typography
                  variant="body1"
                  sx={{ color: "red", margin: "1rem" }}
                >
                  {errors.image?.message}
                </Typography>
              )}
            </Box> */}
          </Stack>
          {/* 
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <label style={{ marginLeft: "5px", marginTop: "15px" }}>
              Description
            </label>
            <TextField
              placeholder="Type here"
              fullWidth
              multiline={true}
              rows={5}
              InputProps={{
                style: {
                  padding: "10px",
                },
              }}
              {...register("description", { required: false })}
              sx={{ paddingTop: "10px", paddingBottom: "40px" }}
            />
          </Box> */}
        </DialogContent>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            flexDirection: 'row-reverse',
            margin: '2rem 1.5rem 2rem 0',
          }}
        >
          {/* <Button onClick={closeDialog}>Cancel</Button> */}
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Box>
      </form>
      {loading ? <LoadingSpinner /> : null}
    </Dialog>
  )
}

export default CreateTenant
