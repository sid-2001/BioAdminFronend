import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Button } from '@mui/material'
import { PasteListModalComponentProps } from './paste-list-modal.type'
import TextField from '../text-field'
import { useState } from 'react'

const PasteListModalComponent = ({ open, addOptionClose, handleGetList }: PasteListModalComponentProps) => {
  const [value, setValue] = useState('')

  return (
    <Dialog open={open} onClose={addOptionClose} maxWidth="sm" fullWidth>
      <DialogTitle>Paste a list</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ marginTop: '0.2rem' }}
          label="Options"
          type="email"
          fullWidth
          variant="outlined"
          multiline
          value={value}
          rows={10}
          onChange={(e) => {
            setValue(e.target.value)
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            addOptionClose()
            setValue('')
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={value === ''}
          variant="contained"
          onClick={async () => {
            await handleGetList(value.split(/[\n,]+/))
            setValue('')
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PasteListModalComponent
