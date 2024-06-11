import { Button, Grid, Stack } from '@mui/material'
import { ProjectBuilderSectionComponentProps, SectionData } from './project-builder-section.type'
// import TextField from "../text-field";
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { logger } from '@/helpers/logger'
// import { Loader } from "../loader/loader.style";
import { ProjectService } from '@/services/projects.service'
import { useParams } from 'react-router'
import TextFieldNew from '../text-field-new/text-field-new.component'
import { QuestionNameInput } from '@/constants/cutom-question-name-input'
import _ from 'lodash'

const ProjectBuilderSectionComponent = (props: ProjectBuilderSectionComponentProps) => {
  let { section, add, getSection, setAdd, setCreateSectionId, sections, setSectionCompare } = props
  const [_loading, setLoading] = useState(false)
  const [sectionCopy, setSectionCopy] = useState<any>(null)
  const { enqueueSnackbar } = useSnackbar()
  let projectService = new ProjectService()
  let { projectId, surveyId } = useParams()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SectionData>()

  useEffect(() => {
    if (section) {
      let payload = {
        section_code: section.section_code,
        description: section.description,
        section_name: section.section_name,
      }
      setSectionCopy(payload)
      // setValue("section_id", section.section_id);
      setValue('section_code', section.section_code)
      setValue('description', section.description)
      setValue('section_name', section.section_name)
      setValue('sort_order', section.sort_order)
    }
  }, [section])

  useEffect(() => {
    if (section?.section_id === -1) {
      setSectionCompare(true)
    } else {
      if (
        _.isEqual(watch('section_code'), sectionCopy?.section_code) &&
        _.isEqual(watch('description'), sectionCopy?.description) &&
        _.isEqual(watch('section_name'), sectionCopy?.section_name)
      ) {
        setSectionCompare(false)
      } else {
        setSectionCompare(true)
      }
    }
  }, [watch('section_code'), watch('description'), watch('section_name')])

  console.log(section, sections, section?.section_id, "section?.section_idsection?.section_id")

  const onSubmit: SubmitHandler<SectionData> = async (obj: SectionData) => {
    setLoading(true)
    // console.log(obj, "payloadpayload")
    let payload: SectionData = { ...obj }
    payload.sort_order = sections.length
    if (section.section_id === -1 && projectId && surveyId) {
      try {
        let data: any = await projectService.add_project_builder_section(payload, String(projectId), Number(surveyId))
        enqueueSnackbar('SuccessFully section created', {
          variant: 'success',
        })
        setLoading(false)
        setAdd(false)
        await getSection()
        setCreateSectionId(Number(data?.id))
        setSectionCompare(false)
      } catch (error: any) {
        logger?.error(error)
        if ((error as any)?.response?.status == 400) {
          enqueueSnackbar(`${(error as any)?.response?.data?.message}`, {
            variant: 'error',
          })
        } else {
          enqueueSnackbar('There was an error processing your request.', {
            variant: 'error',
          })
          setLoading(false)
        }
      }
    } else {
      if (projectId && surveyId)
        try {
          payload.sort_order = section.section_sort_order
          await projectService.update_project_builder_section(payload, String(projectId), Number(surveyId), String(section?.section_id))
          enqueueSnackbar('SuccessFully section saved', {
            variant: 'success',
          })
          setLoading(false)
          setSectionCompare(false)
          getSection()
        } catch (error: any) {
          logger?.error(error)
          if ((error as any)?.response?.status == 400) {
            enqueueSnackbar(`${(error as any)?.response?.data?.message}`, {
              variant: 'error',
            })
          } else {
            enqueueSnackbar('There was an error processing your request.', {
              variant: 'error',
            })
          }
          setLoading(false)
        }
    }
  }

  const resetForm = () => {
    reset({
      section_code: '',
      section_name: '',
      description: '',
    })
  }

  useEffect(() => {
    if (add) {
      resetForm()
    }
  }, [add])

  console.log(watch('description'))

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2} marginTop="1rem">
        <Grid item xs={4}>
          {/* <TextField
            size="small"
            required
            value={watch("section_code")}
            label="Node Code"
            {...register("section_code", {
              required: "Node Code is Required !",
            })}
          /> */}
          <QuestionNameInput
            size="small"
            fullWidth
            sx={{ width: '100%' }}
            required
            value={watch('section_code')}
            placeholder="Node Code"
            {...register('section_code', {
              required: 'Node Code is Required !',
            })}
          />

          {errors?.section_code && <p style={{ fontSize: '11px', color: 'red' }}>{errors?.section_code.message}</p>}
        </Grid>
        <Grid item xs={8}>
          {/* <TextField
            size="small"
            required
            value={watch("section_name")}
            label="Node Name"
            {...register("section_name", {
              required: "Node Name is Required !",
            })}
          /> */}
          <QuestionNameInput
            size="small"
            fullWidth
            sx={{ width: '100%' }}
            required
            value={watch('section_name')}
            placeholder="Node Name"
            {...register('section_name', {
              required: 'Node Name is Required !',
            })}
          />
          {errors?.section_name && <p style={{ fontSize: '11px', color: 'red' }}>{errors?.section_name.message}</p>}
        </Grid>

        <Grid item xs={12}>
          {/* <TextField
            multiline
            rows={8}
            value={watch("description")}
            label="Description"
            {...register("description")}
          /> */}

          <TextFieldNew
            multiline
            rows={1}
            maxRows={window?.innerHeight > 900 ? 20 : window?.innerHeight > 800 ? 12 : 8}
            sx={{
              textarea: {
                resize: 'vertical',
                overflow: 'auto',
              },
              marginLeft: '0.1rem',
            }}
            placeholder="Description"
            value={watch('description')}
            onChange={(e) => {
              setValue('description', e.target.value)
            }}
            style={{ marginTop: '0rem', width: '98%' }}
            // {...register("description", {
            //   required: false,
            // })}
            label="Description"
          />
        </Grid>

        {/* <Grid item xs={12}>
          <TextField
            multiline
            rows={2}
            sx={{
              textarea: {
                resize: 'vertical',
                overflow: 'auto'
              }
            }}
            value={watch("description")}
            placeholder="Description"
            {...register("description")}
          />
        </Grid> */}
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end" position="absolute" bottom="0rem" right="0.2rem">
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  )
}

export default ProjectBuilderSectionComponent
