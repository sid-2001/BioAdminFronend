import Box from "@mui/material/Box"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import { StyledHeadTableCell } from "./survey-supplies.style"
import { headCells, Data } from "./constants"
import { Order } from "./sort-functions"
import { visuallyHidden } from "@mui/utils"

interface EnhancedTableProps {
  // numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void
  // onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order
  orderBy: string
  rowCount: number
  edit?: boolean
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    // onSelectAllClick,
    order,
    orderBy,
    // numSelected,
    // rowCount,
    onRequestSort,
    edit,
  } = props
  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => {
          if (headCell?.id == "action" && !edit) {
            return null
          }
          return (
            <StyledHeadTableCell
              key={headCell.id}
              align={
                index === 0
                  ? "left"
                  : index !== headCells.length - 1
                    ? "center"
                    : "center"
              }
              padding={headCell.disablePadding ? "none" : "normal"}
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

export default EnhancedTableHead
