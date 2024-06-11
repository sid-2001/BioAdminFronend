import * as React from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import { visuallyHidden } from "@mui/utils"
import {
  StyledHeadTableCell,
  StyledTableCell,
} from "./quota-condition-edit-table.style"
import { TableProps } from "./quota-condition-edit-table.type"
import { Box, Checkbox } from "@mui/material"
import TextField from "../text-field"

interface Data {
  question_answer_id: string
  question_answer_text: string
  question_answer_code: string
  sample_size: number
  completed: number
  remaining: number
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = "asc" | "desc"

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: "question_answer_id",
    numeric: false,
    disablePadding: true,
    label: "Option Code",
  },
  {
    id: "question_answer_text",
    numeric: true,
    disablePadding: false,
    label: "Option",
  },
  {
    id: "sample_size",
    numeric: true,
    disablePadding: false,
    label: "Quota",
  },
  {
    id: "completed",
    numeric: true,
    disablePadding: false,
    label: "Complete",
  },
  {
    id: "remaining",
    numeric: true,
    disablePadding: false,
    label: "Remanining",
  },
]

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void
  order: Order
  orderBy: string
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => {
          return (
            <StyledHeadTableCell
              key={index}
              align={
                index === 1 || index === 0
                  ? "left"
                  : index === headCells.length - 1
                    ? "right"
                    : "center"
              }
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </StyledHeadTableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

export default function EnhancedTable(props: TableProps) {
  let { data, quotaCondition, setQuotaCondition, groupIndex, surveyData } =
    props
  const [order, setOrder] = React.useState<Order>("asc")
  const [orderBy, setOrderBy] = React.useState<keyof Data>("completed")
  const [rows, setRows] = React.useState<any>([])

  React.useEffect(() => {
    let payload = []
    if (!quotaCondition.edit || surveyData.status_name === "LIVE") {
      payload = data.question_answers.filter((val: any) =>
        data.selectedAns.includes(Number(val.question_answer_id)),
      )
    } else {
      payload = data.question_answers
    }
    setRows(payload)
  }, [data, quotaCondition])

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map(
              (row, index) => {
                return (
                  <TableRow key={index} sx={{ cursor: "pointer" }}>
                    <StyledTableCell align='left' width='20%'>
                      <Checkbox
                        size='small'
                        id={
                          row.question_answer_id
                            ? row?.question_answer_id?.toString()
                            : ""
                        }
                        checked={data?.selectedAns?.includes(
                          Number(row.question_answer_id),
                        )}
                        sx={{
                          display:
                            surveyData.status_name === "LIVE" ||
                            !quotaCondition.edit
                              ? "none"
                              : "",
                        }}
                        color='primary'
                        onChange={(e) => {
                          let payload = { ...quotaCondition }

                          if (!e.target.checked) {
                            payload.quota_conditions[groupIndex].selectedAns =
                              payload.quota_conditions[
                                groupIndex
                              ].selectedAns.filter(
                                (value: any) =>
                                  value !== Number(row.question_answer_id),
                              )
                            payload.quota_conditions[
                              groupIndex
                            ].question_answers[index].sample_size = 0
                          } else {
                            payload.quota_conditions[
                              groupIndex
                            ].selectedAns.push(Number(row.question_answer_id))
                          }
                          setQuotaCondition(payload)
                        }}
                      />
                      {row.question_answer_code}
                    </StyledTableCell>

                    <StyledTableCell
                      align='left'
                      sx={{ width: "30%" }}
                      dangerouslySetInnerHTML={{
                        __html:
                          row && row?.question_answer_text
                            ? row.question_answer_text
                            : "",
                      }}
                    ></StyledTableCell>
                    <StyledTableCell align='center' width='20%'>
                      {surveyData.status_name !== "LIVE" &&
                      quotaCondition.edit ? (
                        <TextField
                          variant='outlined'
                          sx={{
                            width: "120px",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "0.5rem",
                              maxHeight: "0.25rem",
                            },
                          }}
                          size='small'
                          type='number'
                          inputProps={{
                            min: 0,
                          }}
                          disabled={
                            !data.selectedAns.includes(
                              Number(row.question_answer_id),
                            )
                          }
                          value={row.sample_size.toString()}
                          onChange={(e) => {
                            let payload = { ...quotaCondition }
                            payload.quota_conditions[
                              groupIndex
                            ].question_answers[index].sample_size = Number(
                              e.target.value,
                            )
                            setQuotaCondition(payload)
                          }}
                        />
                      ) : (
                        row.sample_size.toString()
                      )}
                    </StyledTableCell>
                    <StyledTableCell align='center' width='20%'>
                      {row.completed}
                    </StyledTableCell>
                    <StyledTableCell align='right' width='20%'>
                      {Number(Number(row.sample_size) - Number(row.completed))}
                    </StyledTableCell>
                  </TableRow>
                )
              },
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
