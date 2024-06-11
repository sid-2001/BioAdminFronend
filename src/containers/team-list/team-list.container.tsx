import {
  // GridContainer,
  // GridContainerUsers,
  GridContainerUsers1,
} from "@/styles/grid"
// import AddCard from "@/components/add-card";
import { TeamsService } from "@/services/teams.service"
import { useEffect, useState } from "react"
import { PatchObjectType, User } from "@/types/team.type"
import { PageWrapper } from "@/styles/page-wrapper"
import TeamManagementCard from "@/components/team-management-card"
import { logger } from "@/helpers/logger"
import { styled } from "styled-components"
import LoadingSpinner from "@/components/loader"
import { useSnackbar } from "notistack"
import { Box, Stack, Typography } from "@mui/material"
import CreateUser from "@/components/create-user"
import AddBtn from "@/components/add-btn"

const TeamListContainer = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState(false)
  // const navigate = useNavigate();

  const projectsService = new TeamsService()
  const { enqueueSnackbar } = useSnackbar()
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
  // console.log(users)

  useEffect(() => {
    getUsers()
  }, [])

  const handleClick = () => {
    console.log("Sdfsd")
    setOpenModal(true)
  }
  const handleClose = () => {
    setOpenModal(false)
  }

  const CenteredContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `

  function reOrderUsers(arr: User[]) {
    const disabledUsers = arr?.filter((obj) => !obj.is_active)
    const activeUsers = arr?.filter((obj) => obj.is_active)

    return [...activeUsers, ...disabledUsers]
  }

  const userService = new TeamsService()

  const UpdateActivity = async (userIdPut: number, data: any) => {

    setLoading(true)
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      contact_number: data.contact_number,
      role_id: data.role_id,
      is_active: data.is_active,
    }
    try {
      await userService.update_user(Number(userIdPut), payload)
      // enqueueSnackbar("User Successfully Created", {
      //   variant: "success",
      // })
      getUsers()
      setLoading(false)
    } catch (e) {
      console.log(e)
      enqueueSnackbar("Oops something went wrong !!", {
        variant: "error",
      })
      setLoading(false)
    }
  }

  const ActivateDeactivateUser = async (user_id: number, object: PatchObjectType) => {
    setLoading(true)
    try {
      const data = await userService.activate_deactivate_user(Number(user_id), object)
      if (data?.status == 'ok') {
        getUsers()
        enqueueSnackbar("User status updated successfully!!", {
          variant: "success",
        })
      }
    } catch (error) {
      logger.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageWrapper
        style={{
          // background: "white",
          borderRadius: '12px',
          height: 'calc(100vh - 142px)',
        }}
      >
        <Box
          style={{
            width: '100%',
            position: 'sticky',
            top: '0px',
            // background: "white",
            zIndex: 500,
            padding: '1rem 2rem 0rem 2rem',
          }}
        >
          <Stack direction="row" gap="1rem">
            <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
              Users
            </Typography>
            <AddBtn onClick={handleClick} />
          </Stack>
        </Box>
        <Box sx={{ padding: '0rem 2rem 0rem 2rem' }}>
          {users?.length <= 0 && !loading ? (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography>There is no User</Typography>
            </Box>
          ) : (
            <GridContainerUsers1 style={{ marginBottom: '2rem' }}>
              {/* <AddCard handleClick={handleClick} /> */}

              {reOrderUsers(users)?.map((data, index) => (
                <TeamManagementCard key={index} user={data} UpdateActivity={UpdateActivity} ActivateDeactivateUser={ActivateDeactivateUser} />
              ))}
            </GridContainerUsers1>
          )}

          <CreateUser open={openModal} handleClose={handleClose} getUsers={getUsers} users={users} />
          {loading ? (
            <CenteredContainer>
              <LoadingSpinner />
            </CenteredContainer>
          ) : null}
        </Box>
        {/* </main> */}
      </PageWrapper>
    </>
  )
}

export default TeamListContainer
