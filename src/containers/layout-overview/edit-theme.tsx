import { ThemesService, ThemeType, ThemePropertiesTies } from '@/services/themes.service'
import TextField from '@/components/text-field'
import { useSnackbar } from 'notistack'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Badge, Box, Button, Grid, IconButton, Typography } from '@mui/material'
import { StyledLabel } from '@/containers/project-request/project-request.style'
import CloudUploadIcon from '@mui/icons-material/CloudUploadOutlined'
import Select from '@/components/select'
// import ThemePreview from "./theme-preview"
import CloseIcon from '@mui/icons-material/Close'
import { ListService } from '@/services/list.service'

interface EditThemePropTypes {
  theme: ThemeType
  getAndUpdateTheme: () => void
  setIsEdit: any
  setThemeProperties: React.Dispatch<React.SetStateAction<ThemePropertiesTies | null>>
}

interface StyledColorInputPropTypes {
  initialValue: any
  callbackFn: any
}

function StyledColorInput({ callbackFn, initialValue }: StyledColorInputPropTypes) {
  const [color, setColor] = useState<any>(initialValue || '')

  function changeHandler(e: any) {
    console.log(e.target.value)

    if (e && e.target) {
      callbackFn(e.target.value)
      setColor(e.target.value)
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        marginTop: '4px',
      }}
    >
      <TextField
        sx={{
          '& .MuiInputBase-input': {
            width: '50px',
          },
        }}
        type="color"
        onChange={changeHandler}
        value={color}
      />
      <Typography
        component="span"
        sx={{
          position: 'absolute',
          left: '75px',
          top: '18px',
        }}
      >
        {color}
      </Typography>
    </Box>
  )
}

function EditTheme({ getAndUpdateTheme, theme, setIsEdit, setThemeProperties }: EditThemePropTypes) {
  const themesService = new ThemesService()
  const listService = new ListService()
  const { enqueueSnackbar } = useSnackbar()

  const { register, handleSubmit } = useForm<ThemePropertiesTies>()
  const [formState, setFormState] = useState<ThemePropertiesTies>({
    ...theme.properties,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [imageSrc, setImageSrc] = useState<any>('')
  const [spLayoutList, setSpLayoutList] = useState<Array<{ id: number; sp_id: number; name: string }>>([])

  const [headerLogoSrc, setHeaderLogoSrc] = useState<any>('')

  async function updatetheme(properties: ThemePropertiesTies) {
    setLoading(true)
    try {
      await themesService.putTheme(theme, properties)
      getAndUpdateTheme()
      setLoading(false)
    } catch (error) {
      enqueueSnackbar('An error occurred. Please try again.', {
        variant: 'error',
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    listService.get_sp_layout_list().then((data) => {
      setSpLayoutList(data as any)
      console.log(data)
    })

    getAndUpdateTheme()
  }, [])

  const onSubmit: SubmitHandler<ThemePropertiesTies> = async () => {
    console.log(formState)

    updatetheme(formState).finally(() => {
      setIsEdit(false)
    })
  }

  function bgImageHandler(e: any) {
    if (e && e.target && FileReader) {
      const fr = new FileReader()

      fr.onload = () => {
        setImageSrc(fr.result)
        if (fr.result) {
          setFormState((prev) => {
            return {
              ...prev,
              backgroundImage: fr.result as any,
            }
          })
        }
      }

      fr.readAsDataURL(e.target.files[0])
      console.log(e.target.files[0])
    }
  }

  function logoImageHandler(e: any) {
    if (e && e.target && FileReader) {
      const fr = new FileReader()

      fr.onload = () => {
        setHeaderLogoSrc(fr.result)
        if (fr.result) {
          setFormState((prev) => {
            return {
              ...prev,
              header: {
                ...prev.header,
                url: fr.result as any,
              },
            }
          })
        }
      }

      fr.readAsDataURL(e.target.files[0])
      console.log(e.target.files[0])
    }
  }

  const textAlignments = [
    {
      text: 'left',
      value: 'left',
    },
    {
      text: 'center',
      value: 'center',
    },
    {
      text: 'right',
      value: 'right',
    },
  ]

  const fontFamilies = [
    {
      text: 'Times New Roman',
      value: 'Times New Roman',
    },
    {
      text: 'Inter',
      value: 'Inter',
    },
    {
      text: 'sans-serif',
      value: 'sans-serif',
    },
    {
      text: 'serif',
      value: 'serif',
    },
    {
      text: 'monospace',
      value: 'monospace',
    },
    {
      text: 'system-ui',
      value: 'system-ui',
    },
  ]

  useEffect(() => {
    if (formState) setThemeProperties(formState)
  }, [formState])

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          overflow: 'auto',
          height: 'calc(100vh - 290px)',
          position: 'relative',
          padding: '0.2rem',
        }}
      >
        <>
          <Typography
            component="h2"
            sx={{
              marginBottom: '1rem',
              fontWeight: '700',
            }}
          >
            General Properties
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Background Image</label>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <StyledLabel
                  style={{
                    marginTop: '5px',
                    borderRadius: '8px',
                    width: imageSrc || formState.backgroundImage ? '85%' : '',
                  }}
                  htmlFor="attachments"
                >
                  Pick File &nbsp;
                  <input {...register('backgroundImage')} style={{ display: 'none' }} id="attachments" type="file" onChange={bgImageHandler} />
                  <CloudUploadIcon />
                </StyledLabel>
                {imageSrc || formState.backgroundImage ? (
                  <Box width={50} height={50}>
                    <Badge
                      color="primary"
                      badgeContent={
                        <IconButton
                          size="small"
                          onClick={() => {
                            setFormState((prev) => {
                              return {
                                ...prev,
                                backgroundImage: '',
                              }
                            })
                            setImageSrc('')
                          }}
                        >
                          <CloseIcon sx={{ fontSize: '0.8rem', color: 'white' }} />
                        </IconButton>
                      }
                    >
                      <img
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                        src={imageSrc || formState.backgroundImage}
                      />
                    </Badge>
                  </Box>
                ) : null}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Font Family*</label>
              <Select
                value={formState.fontFamily || ''}
                items={fontFamilies.map((option) => ({
                  text: option.text,
                  value: option.value?.toString() || '',
                }))}
                onChange={(e) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      fontFamily: e.target.value,
                    } as any
                  })
                }}
                name="fontFamily"
                label=""
                register={register as any}
                isRequired={true}
                style={{ paddingTop: '5px' }}
              />
            </Grid>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Background Color*</label>
              <StyledColorInput
                initialValue={formState.backgroundColor}
                callbackFn={(color: any) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      backgroundColor: color,
                    }
                  })
                }}
              />
              {/* <TextField
                {...register("backgroundColor", { required: true })}
                sx={{ paddingTop: "5px" }}
                type='color'
                value={formState.backgroundColor}
              /> */}
            </Grid>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px', marginBottom: '5px' }}>Breakpoint</label>
              <TextField
                type="number"
                {...register('breakpoint', { required: false })}
                sx={{ paddingTop: '5px' }}
                value={formState.breakpoint}
                onChange={(e) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      breakpoint: Number(e.target.value),
                    }
                  })
                }}
              />
            </Grid>
          </Grid>
        </>

        <>
          <Typography
            component="h2"
            sx={{
              marginBottom: '1rem',
              marginTop: '1rem',
              fontWeight: '700',
            }}
          >
            Header Properties
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Header Logo</label>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <StyledLabel
                  style={{
                    marginTop: '5px',
                    borderRadius: '8px',
                  }}
                  htmlFor="headerImageLogo"
                >
                  Pick File &nbsp;
                  <input {...register('header.url')} style={{ display: 'none' }} id="headerImageLogo" type="file" onChange={logoImageHandler} />
                  <CloudUploadIcon />
                </StyledLabel>
                {headerLogoSrc ? (
                  <Box width={50} height={50}>
                    <img
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      src={headerLogoSrc}
                    />
                  </Box>
                ) : null}
              </Box>
            </Grid>

            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Header Text Color*</label>
              <StyledColorInput
                initialValue={formState?.header?.color}
                callbackFn={(color: any) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      header: {
                        ...prev.header,
                        color: color,
                      },
                    }
                  })
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Header Background Color*</label>
              <StyledColorInput
                initialValue={formState?.header?.backgroundColor}
                callbackFn={(color: any) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      header: {
                        ...prev.header,
                        backgroundColor: color,
                      },
                    }
                  })
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px', marginBottom: '5px' }}>Header Text</label>
              <TextField
                {...register('header.text')}
                sx={{ paddingTop: '5px' }}
                value={formState.header.text}
                onChange={(e) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      header: {
                        ...prev.header,
                        text: e.target.value,
                      },
                    }
                  })
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Header Text Align*</label>
              <Select
                value={formState?.header?.textAlign || ''}
                items={textAlignments.map((option) => ({
                  text: option.text,
                  value: option.value?.toString() || '',
                }))}
                onChange={(e) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      header: {
                        ...prev.header,
                        textAlign: e.target.value || '',
                      },
                    } as any
                  })
                }}
                name="header.textAlign"
                label=""
                register={register as any}
                isRequired={true}
                style={{ paddingTop: '5px' }}
              />
            </Grid>
          </Grid>
        </>

        <>
          <Typography
            component="h2"
            sx={{
              marginBottom: '1rem',
              marginTop: '1rem',
              fontWeight: '700',
            }}
          >
            Question Properties
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Question Text Color*</label>
              <StyledColorInput
                initialValue={formState?.questions?.color}
                callbackFn={(color: any) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      questions: {
                        ...prev.questions,
                        color: color,
                      },
                    }
                  })
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Question Box Fill*</label>
              <StyledColorInput
                initialValue={formState?.questions?.backgroundColor}
                callbackFn={(color: any) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      questions: {
                        ...prev.questions,
                        backgroundColor: color,
                      },
                    }
                  })
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Questions Box Stroke Color*</label>
              <StyledColorInput
                initialValue={formState?.questions?.borderColor}
                callbackFn={(color: any) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      questions: {
                        ...prev.questions,
                        borderColor: color,
                      },
                    }
                  })
                }}
              />
            </Grid>
          </Grid>
        </>

        <>
          <Typography
            component="h2"
            sx={{
              marginBottom: '1rem',
              marginTop: '1rem',
              fontWeight: '700',
            }}
          >
            Control Properties
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Selected Color*</label>
              <StyledColorInput
                initialValue={formState?.controls?.selected?.color}
                callbackFn={(color: any) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      controls: {
                        ...prev.controls,
                        selected: {
                          color: color,
                        },
                      },
                    }
                  })
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Unselected Color*</label>
              <StyledColorInput
                initialValue={formState?.controls?.unselected?.color}
                callbackFn={(color: any) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      controls: {
                        ...prev.controls,
                        unselected: {
                          color: color,
                        },
                      },
                    }
                  })
                }}
              />
            </Grid>
          </Grid>
        </>

        <>
          <Typography
            component="h2"
            sx={{
              marginBottom: '1rem',
              marginTop: '1rem',
              fontWeight: '700',
            }}
          >
            Button Properties
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Button Text Color*</label>
              <StyledColorInput
                initialValue={formState?.button?.color}
                callbackFn={(color: any) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      button: {
                        ...prev.button,
                        color: color,
                      },
                    }
                  })
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Button Fill*</label>
              <StyledColorInput
                initialValue={formState?.button?.backgroundColor}
                callbackFn={(color: any) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      button: {
                        ...prev.button,
                        backgroundColor: color,
                      },
                    }
                  })
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <label style={{ marginLeft: '5px' }}>Button Stroke Color*</label>
              <StyledColorInput
                initialValue={formState?.button?.borderColor}
                callbackFn={(color: any) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      button: {
                        ...prev.button,
                        borderColor: color,
                      },
                    }
                  })
                }}
              />
            </Grid>
          </Grid>
        </>

        <Typography
          component="h2"
          sx={{
            marginBottom: '1rem',
            marginTop: '1rem',
            fontWeight: '700',
          }}
        >
          SP Layouts
        </Typography>

        <Grid item xs={6}>
          <label style={{ marginLeft: '5px' }}>Layouts</label>
          <Select
            value={formState.splayoutid || ''}
            items={spLayoutList.map((option) => ({
              text: option.name,
              value: option.id?.toString() || '',
            }))}
            onChange={(e) => {
              const selectedOption = spLayoutList.find((option) => option.id.toString() === e.target.value)

              console.log(selectedOption)
              // debugger
              setFormState((prev) => {
                return {
                  ...prev,
                  splayoutid: e.target.value,
                  splayoutname: selectedOption ? selectedOption.name : '',
                } as any
              })
            }}
            name="SpList"
            label=""
            register={register as any}
            isRequired={true}
            style={{ paddingTop: '5px' }}
          />
        </Grid>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            paddingBottom: '10px',
            position: 'sticky',
            bottom: '-10px',
            zIndex: 5,
            background: 'white',
          }}
        >
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            onClick={() => {
              setIsEdit(false)
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
      {/* <ThemePreview theme={formState} /> */}
      {/* <Divider orientation="vertical" variant="middle" flexItem sx={{ marginLeft: "30px", borderRightWidth: 2, backgroundColor: "#5D5D5D"}}/> */}
    </>
  )
}

export default EditTheme
