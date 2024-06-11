import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import { Switch, Tooltip } from '@mui/material'
import TextField from '../text-field'

function truncateText(text: string, length: number) {
  if (text?.length <= length) {
    return text
  }
  return `${text.substr(0, length)}...`
}

function EnhancedTableHead(props: any) {
  const { columns } = props

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      background: 'white',
      color: '#637381',
      fontSize: 14,
      fontWeight: '700',
      borderBottom: '2px solid #e8e8e8',
    },
  }))

  return (
    <TableHead sx={{ display: 'table-header-group' }}>
      <TableRow>
        {columns.map((headCell: any) => (
          <StyledTableCell key={headCell.id} align={'left'} padding={headCell.disablePadding ? 'none' : 'normal'}>
            {headCell.code ? (
              <Tooltip
                title={
                  <span
                    dangerouslySetInnerHTML={{
                      __html: headCell.question_text ? `${headCell.question_text}` : '',
                    }}
                  ></span>
                }
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${headCell.label || headCell.code ? truncateText(`${headCell.code}-${headCell.label}`, 40) : ''}`,
                  }}
                ></span>
              </Tooltip>
            ) : (
              headCell.label
            )}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    borderBottom: '1px solid #e8e8e8',
    fontSize: 13,
    fontWeight: '600',
  },
}))

export default function NestedQuotaTable({ rows, columns, setRows, addData, isEdit, QuotaActiveDeactive }: any) {
  return (
    <Box sx={{ width: '100%', marginInline: '1rem' }}>
      <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
        <EnhancedTableHead columns={columns} />
        <TableBody>
          {rows.map((row: any, index: number) => {
            return (
              <TableRow key={index}>
                {row?.quota.conditions?.map((val: any, i: number) => {
                  return (
                    <StyledTableCell
                      // sx={{ width: '300px', minWidth: '350px' }}
                      align="left"
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: `${val.answerText ? val.answerText[0] : ''}`,
                      }}
                    ></StyledTableCell>
                  )
                })}
                <StyledTableCell align="left">
                  {addData || isEdit.edit ? (
                    <TextField
                      size="small"
                      disabled={!row.quota.isActive}
                      placeholder="Quota"
                      variant="outlined"
                      type="number"
                      value={row.quota.sampleNumber.toString()}
                      sx={{ width: '200px' }}
                      onChange={(e) => {
                        let payload = [...rows]
                        payload[index].quota.sampleNumber = Number(e.target.value)
                        setRows(JSON.parse(JSON.stringify(payload)))
                      }}
                    />
                  ) : (
                    row.quota.sampleNumber
                  )}
                </StyledTableCell>
                <StyledTableCell align="left">{row.quota.starts}</StyledTableCell>
                <StyledTableCell align="left">{row.quota.completes}</StyledTableCell>
                <StyledTableCell align="left">
                  {(row.quota.starts === 0 ? 0 : (row.quota.completes / row.quota.starts) * 100).toFixed(2)}
                </StyledTableCell>
                <StyledTableCell align="left">{Number(row.quota.sampleNumber) - Number(row.quota.completes)}</StyledTableCell>
                <StyledTableCell align="left" sx={{ display: addData ? 'none' : '' }}>
                  <Switch
                    size="small"
                    // disabled={isEdit.disabled}
                    checked={row.quota.isActive}
                    onChange={(e) => {
                      // let payload = [...rows];
                      // payload[index].quota.isActive = e.target.checked;
                      // setRows(JSON.parse(JSON.stringify(payload)));
                      QuotaActiveDeactive(e.target.checked, row.quota.id)
                    }}
                  />
                </StyledTableCell>
              </TableRow>
            )
          })}
          {rows.length <= 0 && (
            <TableRow
              style={{
                height: 53,
              }}
            >
              <StyledTableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  )
}
