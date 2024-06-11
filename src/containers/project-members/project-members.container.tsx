import * as React from "react"
import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import Autocomplete from "@mui/material/Autocomplete"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { TeamsService } from "@/services/teams.service"
// import { ProjectService } from "@/services/projects.service"
// import { ProjectTeamSearchResponse } from "@/types/project.type"
import { ProjectTeamMemberResponse } from "@/types/project.type"
import { TeamMemberTableProps } from "./project-members.type"
import { User } from "@/types/team.type"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import { Tooltip } from "@mui/material"
// import Paper from "@mui/material/Paper"
import { visuallyHidden } from "@mui/utils"
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  //   Chip,
} from "@mui/material"
// import { ProjectService } from "@/services/projects.service"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import { useSnackbar } from "notistack"
import { logger } from "@/helpers/logger"

import {
  AddTeamMember,
  Avatar,
  DetailsBox,
  NameTag,
  StyledAddRow,
  // StyledModalListName,
  // StyledModalListRole,
  StyledHeadTableCellMain,
} from "./project-members.style"
import {
  // //   AddIcon,
  // //   // Cross,
  Deactivate,
  // //   // SearchIcon
} from "@/assets/images"
import { TextField } from "@mui/material"
// import { ProjectTeamMemberResponse, ProjectTeamSearchResponse } from '@/types/project.type';
import Divider from "@mui/material/Divider"
import styled from "styled-components"
import { ListService } from "@/services/list.service"
import LoadingSpinner from "@/components/loader"
import { ProjectTeamSearchResponse } from "@/types/project.type"
import ConfirmDeleteModalComponent from "@/components/confirm-delete-modal"
import { LocalStorageService } from "@/helpers/local-storage-service"
// import { useParams } from "react-router-dom"

interface Data {
  id: number
  user_id: number
  user_name: string
  user_email: string
  user_status: string
  role_id: number
  role_name: string
  profile_image_url: string
}

type Order = "asc" | "desc"

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}
// --

const headCells: readonly HeadCell[] = [
  {
    id: "user_name",
    numeric: false,
    disablePadding: false,
    label: "Team Member",
  },
  {
    id: "user_email",
    numeric: false,
    disablePadding: false,
    label: "Email ID",
  },
  { id: "role_name", numeric: false, disablePadding: false, label: "Role" },
  {
    id: "user_status",
    numeric: false,
    disablePadding: false,
    label: "User Status",
  },
  { id: "user_id", numeric: false, disablePadding: false, label: "Action" },
]

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

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
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface EnhancedTableProps {
  order: Order
  orderBy: keyof Data
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void
  // rowCount: number
  isEditing: boolean
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const {
    order,
    orderBy,
    onRequestSort,
    // isEditing
  } = props

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => {
          return (
            <StyledHeadTableCellMain
              key={headCell.id}
              align={index === headCells.length - 1 ? "right" : "left"}
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
            </StyledHeadTableCellMain>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

const MembersContainer = ({
  projectId,
  deleteTeamMember,
  // onAddUser,
  //   onRemoveUser,
  //   isLoading,
  //   setIsLoading,
  onUpdate,
  onSave,
  // onAdd,
  selectedUsers,
  setSelectedUsers,
  rows,
  setRows,
  isEditing,
}: TeamMemberTableProps) => {
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = React.useState<any[]>([])
  const [order, setOrder] = React.useState<Order>("asc")
  const [orderBy, setOrderBy] = React.useState<keyof Data>("user_name")
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(25)
  const [deleteRowData, setDeleteRowData] =
    React.useState<ProjectTeamMemberResponse | null>(null)
  const [openModal, setOpenModal] = React.useState(false)
  const [openTeamModal, setOpenTeamModal] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState(" ")
  const [loading, setLoading] = React.useState<boolean>(true)
  const projectsService = new TeamsService()
  const rolesService = new ListService()
  const { enqueueSnackbar } = useSnackbar()
  const localstorageService = new LocalStorageService()
  // const [newRole, _setNewRole] = useState(2)
  const AddUsers = (user: ProjectTeamSearchResponse) => {
    setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user])
  }

  const userStoredObj = localstorageService.get("user")
  let currentUserId: number | null = null
  if (userStoredObj && userStoredObj.length > 0) {
    const userObj = JSON.parse(userStoredObj)
    currentUserId = userObj?.id
  }

  const getUsers = async () => {
    setLoading(true)
    try {
      const data = await projectsService.get_team_members()
      setUsers(data)
      setLoading(false)
    } catch (error) {
      logger.error(error)
      setLoading(false)
      if ((error as any)?.response?.status === 403) {
        enqueueSnackbar("Access denied: Insufficient permissions.", {
          variant: "error",
        })
      } else {
        enqueueSnackbar("An error occurred while retrieving the projects.", {
          variant: "error",
        })
      }
    }
  }

  const getRoles = async () => {
    setLoading(true)
    try {
      const data = await rolesService.role_list()
      setRoles(data)
      setLoading(false)
    } catch (error) {
      logger.error(error)
      setLoading(false)
    }
  }

  // useEffect(() => {
  //   getUsers()
  // }, [])

  useEffect(() => {
    getRoles()
    getUsers()
  }, [])

  useEffect(() => {
    const filteredUsers = users.filter(
      (user) =>
        !selectedUsers.some((selectedUser) => selectedUser.id === user.id) &&
        !rows.some((row) => row.id === user.id),
    )
    setAvailableUsers(filteredUsers)
  }, [users, selectedUsers, rows])

  const RemoveUser = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => user.id !== userId),
    )
  }

  // console.log(users)
  // console.log(roles)

  const SearchModalCancel = () => {
    setOpenTeamModal(false)
    setSearchTerm("")
    setSelectedUsers([])
  }
  const SaveModalData = async () => {
    setLoading(true)
    await onSave()
    setOpenTeamModal(false)
    setLoading(false)
  }

  // const handleAddMail = () => {
  //   onAdd(searchTerm, newRole)
  //   // setOpenTeamModal(false)
  //   getUsers()
  // }
  const handleModalSearchBar = (eValue: string) => {
    if (searchTerm === " ") {
      setSearchTerm("")
      setSearchTerm(eValue.split(" ")[1])
    } else {
      setSearchTerm(eValue)
    }
  }

  const modalDeleteButton = () => {
    if (deleteRowData && deleteRowData.id != 0) {
      deleteTeamMember(projectId, String(deleteRowData.id))
      setRows((prevRows) =>
        prevRows.filter((row) => row.id !== deleteRowData.id),
      )
      setDeleteRowData(null)
      setOpenModal(false)
    }
  }

  const modalDeleteHandler = (rowData: ProjectTeamMemberResponse) => {
    setOpenModal(true)
    setDeleteRowData(rowData)
  }

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const ScrollableTableContainer = styled(TableContainer)`
    max-height: "500px";
    min-height: "500px";
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  `

  const handleRoleChange = (event: any, userId: number) => {
    const { value } = event.target
    const selectedRole = roles.find((role) => role.id === value)
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.map((user) =>
        user.id === userId
          ? { ...user, role_id: selectedRole.id, role_name: selectedRole.name }
          : user,
      ),
    )
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddUser = () => {
    if (searchTerm) {
      if (!isValidEmail(searchTerm)) {
        enqueueSnackbar("Invalid email address", { variant: "error" })
        return
      }

      const isDuplicateEmail = rows.some((row) => row.user_email === searchTerm)

      if (isDuplicateEmail) {
        enqueueSnackbar("Team Member with the same email already exists", {
          variant: "error",
        })
        return
      }

      const newUser = {
        email: searchTerm,
        first_name: searchTerm,
        last_name: searchTerm,
        id: new Date().getTime(), 
        role_id: 2,
        role_name: "EDITOR",
        is_active: true,
        is_new: true,
      }

      //@ts-ignore
      setSelectedUsers((prevUsers) => [...prevUsers, newUser])
      setSearchTerm("")
    }
  }

  const handleDeleteClose = () => {
    setOpenModal(false)
  }

  const handleFormSubmit = (event: any) => {
    event.preventDefault() 
    handleAddUser()
  }

  return (
    <>
      {loading ? <LoadingSpinner /> : null}
      <ConfirmDeleteModalComponent
        open={openModal}
        handleClose={handleDeleteClose}
        DeleteFunc={modalDeleteButton}
        title={"Are you sure?"}
        subTitle={
          deleteRowData
            ? `You want to delete the Team Member ${deleteRowData.user_name} with role ${deleteRowData.role_name} from the list?`
            : ""
        }
      />
      <Dialog open={openTeamModal} maxWidth='md' fullWidth>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <Autocomplete
              style={{ paddingTop: "0.5rem" }}
              options={availableUsers}
              getOptionLabel={(user) => user.first_name}
              filterOptions={(options, { inputValue }) =>
                options.filter(
                  (option) =>
                    option.first_name.includes(inputValue) &&
                    !rows.some((row) => row.user_id === option.id),
                )
              }
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  value={searchTerm}
                  onChange={(e) => handleModalSearchBar(e.target.value)}
                  placeholder='Search team members by name or role here...'
                  style={{ width: "100%" }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {/* <Select
                        style={{
                          position: "absolute",
                          right: "90px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          outline: "none",
                          border: "none",
                        }}
                        size='small'
                        value={newRole}
                        onChange={(e) => {
                          const { value } = e.target
                          const selectedRole = roles.find(
                            (role) => role.id === value,
                          )
                          console.log(selectedRole, "selectedRoleselectedRole")
                          setNewRole(selectedRole?.id)
                        }}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select> */}
                        {/* <AddOutlinedIcon
                        style={{
                          position: "absolute",
                          right: "30px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                        onClick={handleAddUser}
                      /> */}
                        {/* {params.InputProps.endAdornment} */}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, user) => (
                <li {...props}>
                  {user.first_name} {user.last_name}
                </li>
              )}
              onChange={(_event, value) => {
                if (value) {
                  //@ts-ignore
                  AddUsers(value)
                  setSearchTerm("")
                }
              }}
            />
          </form>

          <Box style={{ marginTop: "0.5rem" }}>
            {/* {selectedUsers
              //   .filter((user) => !rows.some((row) => row.user_id === user.user_id))
              .map((user, index) => (
                <Chip
                  key={index}
                  label={`${
                    user?.first_name?.charAt(0)?.toUpperCase() +
                    user?.first_name?.slice(1)
                  } ${" "}${
                    user?.last_name?.charAt(0).toUpperCase() +
                    user?.last_name?.slice(1)
                  }`}
                  onDelete={() => onRemoveUser(user.user_id)}
                  //   deleteIcon={<img src={Cross} width={16} />}
                  style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}
                  variant='outlined'
                  sx={{
                    "& .MuiChip-label": {
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "140%",
                      color: "#1B806A",
                    },
                  }}
                />
              ))} */}
          </Box>
          <Box
            style={{
              marginBottom: "2rem",
              boxShadow:
                "0px 8px 24px -4px rgba(199, 203, 206, 0.20), 0px 0px 2px 0px rgba(145, 158, 171, 0.15)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "213px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            ></Box>
            <ScrollableTableContainer
              style={{
                minHeight: "400px",
                maxHeight: "400px",
                padding: "1rem",
              }}
            >
              <Table>
                <TableBody style={{ padding: "0px" }}>
                  {selectedUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <Avatar
                          style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            margin: "0px",
                          }}
                        >
                          {user.profile_image_url &&
                          user.profile_image_url != "N/A" &&
                          user.profile_image_url.length > 100 ? (
                            <img
                              src={user.profile_image_url}
                              alt={`${user?.first_name
                                ?.charAt(0)
                                ?.toUpperCase()} ${user?.last_name
                                ?.charAt(0)
                                ?.toUpperCase()} `}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <NameTag style={{ fontSize: "1rem" }} variant='h6'>
                              {user?.first_name && user?.last_name
                                ? `${user?.first_name
                                    ?.charAt(0)
                                    ?.toUpperCase()}${user?.last_name
                                    ?.charAt(0)
                                    ?.toUpperCase()} `
                                : user?.email
                                  ? `${
                                      user?.email?.charAt(0)?.toUpperCase() +
                                      user?.email?.charAt(1)?.toUpperCase()
                                    }`
                                  : ""}
                            </NameTag>
                          )}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>
                        <Select
                          size='small'
                          value={user.role_id}
                          onChange={(event) => handleRoleChange(event, user.id)}
                        >
                          {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align='right'>
                        <IconButton onClick={() => RemoveUser(user.id)}>
                          <CancelOutlinedIcon
                            sx={{
                              width: "20px",
                              height: "20px",
                              cursor: "pointer",
                            }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollableTableContainer>
          </Box>

          <Divider />

          <Box
            style={{
              display: "flex",
              justifyContent: "end",
              marginTop: "2rem",
            }}
          >
            <Box sx={{ mr: 2 }}>
              <Button onClick={SearchModalCancel} variant='outlined'>
                Cancel
              </Button>
            </Box>
            <Button
              onClick={SaveModalData}
              disabled={selectedUsers.length <= 0}
              variant='contained'
            >
              Invite
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <DetailsBox>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "1rem",
          }}
        >
          <AddTeamMember variant='h6' id='tableTitle'>
            Team Members
          </AddTeamMember>
          <Button
            onClick={() => {
              setOpenTeamModal(true)
            }}
            variant={"text"}
          >
            <AddOutlinedIcon />
            <StyledAddRow style={{ marginLeft: "0.5rem" }}>Member</StyledAddRow>
          </Button>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              isEditing={isEditing}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const isCurrentUser = row.user_id === currentUserId
                return (
                  <TableRow
                    key={row.user_id}
                    style={{ borderBottom: "1px solid #F4F6F8" }}
                  >
                    <TableCell
                      component='th'
                      scope='row'
                      padding='none'
                      style={{ display: "flex", border: "none" }}
                    >
                      <Avatar>
                        {row.profile_image_url &&
                        row.profile_image_url != "N/A" &&
                        row.profile_image_url.length > 100 ? (
                          <img
                            src={row.profile_image_url}
                            alt={`${row.user_name?.charAt(0)?.toUpperCase()} `}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <NameTag variant='h1'>{`${row.user_name
                            ?.charAt(0)
                            ?.toUpperCase()}${row.user_name
                            ?.split(" ")[1]
                            .charAt(0)
                            ?.toUpperCase()}`}</NameTag>
                        )}
                      </Avatar>
                      <span style={{ paddingTop: "1rem" }}>
                        {row.user_name}
                      </span>
                    </TableCell>
                    <TableCell align='left' style={{ border: "none" }}>
                      {row.user_email}
                    </TableCell>
                    <TableCell align='left' style={{ border: "none" }}>
                      {isCurrentUser ? (
                        row.role_name
                      ) : (
                        <div style={{ position: "relative" , right: "10px"}}>
                        <Select
                          size='small'
                          value={row.role_id}
                          onChange={(e) =>
                            onUpdate(Number(e.target.value), String(row.id))
                          }
                        >
                          {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </Select>
                        </div>
                      )}
                    </TableCell>
                    <TableCell align='left' style={{ border: "none" }}>
                      {row.user_status}
                    </TableCell>
                    {isEditing ? (
                      <TableCell align='right' style={{ border: "none" }}>
                        {isCurrentUser ? null : (
                          <Tooltip
                            title='Unassign this team member'
                            placement='bottom'
                          >
                            <span>
                              <IconButton
                                onClick={() => modalDeleteHandler(row)}
                              >
                                <img
                                  src={Deactivate}
                                  alt='delete'
                                  width={15}
                                  height={15}
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </TableCell>
                    ) : null}
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 75, 100]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{
            marginTop: "2rem",
            display: rows?.length >= 25 ? "block" : "none",
          }}
        />
        {loading && <LoadingSpinner />}
      </DetailsBox>
    </>
  )
}

export default MembersContainer
