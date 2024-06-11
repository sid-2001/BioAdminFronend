import AddBtn from '@/components/add-btn'
import AddSurveyQuotaComponent from '@/components/add-survey-quota'
import { Options } from '@/components/add-survey-quota/survey-quota.type'
import EditSurveyQuotaComponent from '@/components/edit-survey-quota'
import LoadingSpinner from '@/components/loader'
import { DetailsBox } from '@/components/project-details/project-details.style'
import { logger } from '@/helpers/logger'
import { QuotaService } from '@/services/quotas.service'
import {
  //  Button,
  Stack,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router'

function SurveyQuotaContainer() {
  const [newQuota, setNewQuota] = useState(false)
  const [quotaList, setQuotaList] = useState<any>([])
  const [searchText, setSearchText] = useState<string>('')
  const [options, setOptions] = useState<Options[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { survey } = useOutletContext<any>()
  const quotaService = new QuotaService()
  const { enqueueSnackbar } = useSnackbar()
  const { surveyId } = useParams()

  const getSurveyQuotas = async () => {
    setIsLoading(true)
    try {
      const response = await quotaService.get_quota_list(String(surveyId))
      response.data.map((value: any) => (value.edit = false))
      setQuotaList(response.data)
      setIsLoading(false)
    } catch (e) {
      logger.error(e)
      if ((e as any)?.response?.status === 403) {
        enqueueSnackbar('Access denied: Insufficient permissions.', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar('An error occurred. Please try again.', {
          variant: 'error',
        })
      }
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (surveyId) getSurveyQuotas()
  }, [surveyId])

  const fetchOptions = async () => {
    if (searchText === '') {
      try {
        const response = await quotaService.survey_qualification_search(String(survey?.project_id), Number(surveyId))
        setOptions(response.data)
      } catch (e) {
        logger.error(e)
        if ((e as any)?.response?.status === 403) {
          enqueueSnackbar('Access denied: Insufficient permissions.', {
            variant: 'error',
          })
        } else {
          enqueueSnackbar('An error occurred. Please try again.', {
            variant: 'error',
          })
        }
      }
    } else {
      const filterOption = [...options]
      setOptions(
        filterOption?.filter((item: Options) => item.question_name.toLowerCase().includes(searchText.toLowerCase())).map((item: Options) => item),
      )
    }
  }

  useEffect(() => {
    if (survey) {
      fetchOptions()
    }
  }, [searchText, survey])

  return (
    <DetailsBox padding="1rem 1.5rem" sx={{ height: 'calc(100vh - 270px)' }}>
      {isLoading && <LoadingSpinner />}
      <Stack direction="row" spacing={2} marginBottom="1rem">
        <Typography variant="h6">Quotas</Typography>
        <AddBtn
          // @ts-ignore
          onClick={() => {
            setNewQuota(true)
          }}
        />
      </Stack>

      {quotaList?.map((value: any, index: number) => (
        <EditSurveyQuotaComponent
          key={index}
          data={value}
          index={index}
          quotaList={quotaList}
          setQuotaList={setQuotaList}
          getSurveyQuotas={getSurveyQuotas}
          options={options}
          searchText={searchText}
          setSearchText={setSearchText}
          surveyData={survey}
        />
      ))}
      {newQuota && (
        <AddSurveyQuotaComponent
          setNewQuota={setNewQuota}
          options={options}
          searchText={searchText}
          setSearchText={setSearchText}
          getSurveyQuotas={getSurveyQuotas}
        />
      )}
      {/* <Button
        variant='text'
        color='primary'
        onClick={() => {
          setNewQuota(true)
        }}
        size='small'
        disabled={newQuota}
        sx={{
          marginBottom: "20px",
        }}
      >
        + New Quota
      </Button> */}
    </DetailsBox>
  )
}

export default SurveyQuotaContainer
