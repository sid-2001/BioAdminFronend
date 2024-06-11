import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box, Button, Divider, Grid, IconButton, Stack, Typography } from '@mui/material'
import { DeleteOutline } from '@mui/icons-material'
import TextField from '../text-field'
// import CustomDividerComponent from '../custom-divider'

const QualConfigurationComponent = ({ open, handleClose, editQual, setEditQual, qualification, setQualification }: any) => {
  const [error, setError] = useState(false)

  const onSave = () => {
    console.log(qualification, 'qualification', editQual)
    let payload = qualification.map((qual: any) => {
      if (Number(qual.survey_qualification_id) === Number(editQual.survey_qualification_id)) {
        qual = editQual
      }
      return qual
    })
    setQualification(payload)
    handleClose()
  }

  useEffect(() => {
    let error =
      editQual?.range?.some(
        (val: any) => val.min === '' || val.max === '' || Number(val.min) > Number(val.max) || Number(val.min) < 10 || Number(val.max) > 100,
      ) || editQual?.text?.some((val: any) => val === '')
    setError(error)
  }, [editQual])

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginBottom: '0.5rem' }}>
          <span>Configure Qualification</span>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button size="small" color="primary" variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              size="small"
              color="primary"
              disabled={error}
              variant="contained"
              onClick={() => {
                onSave()
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
        <Divider />
        {/* <CustomDividerComponent /> */}
      </DialogTitle>
      <DialogContent sx={{ color: 'black !important' }}>
        <Stack spacing={4}>
          <Stack spacing={0.5}>
            <Typography fontSize="15px" fontWeight="700" color="dark">
              Qualification
            </Typography>
            <Typography fontSize="14px" fontWeight="400" color="dark">
              {editQual?.qualification_question_text}
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography fontSize="15px" fontWeight="700" color="dark">
              Options
            </Typography>
            {editQual?.qualification_type_id === 4 ? (
              <Box width="100%">
                {editQual?.range.map((value: any, i: number) => {
                  return (
                    <Grid container spacing={2} mb={1.5} key={i}>
                      <Grid item xs={12} md={5.5}>
                        <TextField
                          size="small"
                          type="number"
                          fullWidth
                          value={value.min}
                          onChange={(e) => {
                            let payload = { ...editQual }
                            payload.range[i].min = e.target.value
                            setEditQual(payload)
                          }}
                          variant="outlined"
                          label="Min"
                          error={value.min === '' ? true : Number(value.min) < 10 ? true : false}
                          helperText={
                            value.min === '' ? 'This field is Required' : Number(value.min) < 10 ? 'This value can not be less then 10' : ''
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={5.5}>
                        <TextField
                          size="small"
                          type="number"
                          fullWidth
                          value={value.max}
                          onChange={(e) => {
                            let payload = { ...editQual }
                            payload.range[i].max = e.target.value
                            setEditQual(payload)
                          }}
                          variant="outlined"
                          label="Max"
                          error={value.max === '' ? true : Number(value.min) > Number(value.max) ? true : Number(value.max) > 100 ? true : false}
                          helperText={
                            value.max === ''
                              ? 'This field is Required'
                              : Number(value.max) > 100
                                ? 'This value can not be greater than 100'
                                : Number(value.min) > Number(value.max)
                                  ? 'This is not be less then min'
                                  : ''
                          }
                        />
                      </Grid>
                      {editQual?.range?.length > 1 && (
                        <Grid item xs={12} md={1}>
                          <IconButton
                            onClick={() => {
                              let payload = { ...editQual }
                              payload.range.splice(i, 1)
                              setEditQual(payload)
                            }}
                          >
                            <DeleteOutline color="error" fontSize="small" />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  )
                })}
                <Box display="flex" alignItems="center" justifyContent="flex-end" width="92%">
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      let payload = { ...editQual }
                      payload.range.push({ min: 10, max: 100 })
                      setEditQual(payload)
                    }}
                  >
                    + add more input
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box width="100%">
                {editQual?.text?.map((value: any, i: number) => {
                  return (
                    <Grid container spacing={2} mb={1.5} key={i}>
                      <Grid item xs={12} md={11}>
                        <TextField
                          size="small"
                          type="text"
                          fullWidth
                          value={value}
                          onChange={(e) => {
                            let payload = { ...editQual }
                            payload.text[i] = e.target.value
                            setEditQual(payload)
                          }}
                          variant="outlined"
                          label="Text"
                          error={value.text === '' ? true : false}
                          helperText={value.text === '' ? 'This field is Required' : ''}
                        />
                      </Grid>
                      {editQual?.text?.length > 1 && (
                        <Grid item xs={12} md={1}>
                          <IconButton
                            onClick={() => {
                              let payload = { ...editQual }
                              payload.text.splice(i, 1)
                              setEditQual(payload)
                            }}
                          >
                            <DeleteOutline color="error" fontSize="small" />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  )
                })}
                <Box display="flex" alignItems="center" justifyContent="flex-end" width="92%">
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      let payload = { ...editQual }
                      payload.text.push('Text')
                      setEditQual(payload)
                    }}
                  >
                    + add more input
                  </Button>
                </Box>
              </Box>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default QualConfigurationComponent
