import { useState, useEffect } from "react"
import * as React from "react"
import MembersContainer from "./project-members.container"
import { logger } from "@/helpers/logger"
import { ProjectService } from "@/services/projects.service"
import {
  ProjectTeamMember,
  ProjectTeamMemberResponse,
  ProjectTeamSearchResponse,
} from "@/types/project.type"
import { enqueueSnackbar } from "notistack"
import { useParams } from "react-router-dom"
import LoadingSpinner from "@/components/loader"
// interface TeamMemberTableContainerProps {
//   projectId: string;
//   isEditing: boolean;
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   // deleteTeamMember: ()=>void;
// }

// interface UserIdAndRole {
//   user_id: number;
//   role_id: number;
// };

// --//
const TeamMemberTableContainer = () => {
  const { projectId } = useParams()
  const isEditing = true
  const projectService = new ProjectService()
  const [selectedUsers, setSelectedUsers] = useState<
    ProjectTeamSearchResponse[]
  >([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [rows, setRows] = useState<ProjectTeamMemberResponse[]>([])

  const getTeamMembers = async () => {
    setLoading(true)
    try {
      const data = await projectService.get_project_team_members(projectId)
      setRows(data)
      setLoading(false)
    } catch (error) {
      logger.error(error)
      setLoading(false)
      if ((error as any)?.response?.status === 403) {
        enqueueSnackbar("Access denied: Insufficient permissions.", {
          variant: "error",
        })
      } else {
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
        })
      }
    }
  }

  const handleAddUser = (user: ProjectTeamSearchResponse) => {
    // console.log(user, "useruseruser")
    setSelectedUsers((prevUsers) => {
      // Check if a user with the same user_id already exists
      const userExists = prevUsers.some(
        (prevUser) => prevUser.user_id === user.user_id,
      )
      // If user does not exist, add user
      if (!userExists) {
        return [
          ...(rows as unknown as ProjectTeamSearchResponse[]),
          ...prevUsers,
          user,
        ]
      }
      // If user already exists, do not add user
      return prevUsers
    })
  }

  const handleRemoveUser = async (userId: string) => {
    if (projectId) await deleteTeamMember(projectId, userId)
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== Number(userId)),
    )
    console.log(userId, "userId")
    getTeamMembers()
  }

  // console.log(selectedUsers, "selectedusers")

  const deleteTeamMember = async (projectId: string, teamMemberId: string) => {
    try {
      const data = await projectService.delete_team_member(
        projectId,
        teamMemberId,
      )
      return data
    } catch (error) {
      logger.error(error)
      if ((error as any)?.response?.status === 403) {
        enqueueSnackbar("Access denied: Insufficient permissions.", {
          variant: "error",
        })
      } else {
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
        })
      }
    }
  }

  const transformSelectedMembers = (
    selectedMembers: ProjectTeamSearchResponse[],
  ): ProjectTeamMember[] => {
    // console.log(selectedMembers, "selectedMembers")
    return selectedMembers.map((member) => ({
      user_id: member.id,
      //   @ts-ignore
      role_id: "role" in member ? member.role : member.role_id,
    }))
  }

  const handleAdd = async (email: string, newRole: number): Promise<void> => {
    setLoading(true)
    try {
      if (projectId && email && newRole)
        await projectService.post_project_team_member_mail(projectId, [
          {
            email: email,
            role_id: newRole,
          },
        ])
      setSelectedUsers([])
      getTeamMembers()
      setLoading(false)
    } catch (error) {
      logger.error(error)
      setLoading(false)
      if ((error as any)?.response?.status === 403) {
        enqueueSnackbar("Access denied: Insufficient permissions.", {
          variant: "error",
        })
      } else {
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
        })
      }
    }
  }

  const handleUpdate = async (
    newRole: number,
    team_member_id: string,
  ): Promise<void> => {
    setLoading(true)
    try {
      if (projectId)
        await projectService.update_roles(projectId, team_member_id, newRole)
      getTeamMembers()
      enqueueSnackbar("Role Updated.", {
        variant: "success",
      })
      setLoading(false)
    } catch (error) {
      logger.error(error)
      setLoading(false)
      if ((error as any)?.response?.status === 403) {
        enqueueSnackbar("Access denied: Insufficient permissions.", {
          variant: "error",
        })
      } else {
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
        })
      }
    }
  }

  //   const newUsersArray = selectedUsers.filter((user) => user.is_new)
  //   const existingUsersArray = selectedUsers.filter((user) => !user.is_new)
  //   console.log("New Users Array:", newUsersArray)
  //   console.log("Existing Users Array:", existingUsersArray)

  const handleSave = async (): Promise<void> => {
    setLoading(true)

    try {
      const newUsers = selectedUsers.filter((user) => user.is_new)
      const existingUsers = selectedUsers.filter((user) => !user.is_new)

      if (newUsers.length > 0) {
        // Call the API for new users (invitees)
        const newUsersData = newUsers.map((user) => ({
          email: user.email,
          role_id: user.role_id,
        }))
        if (projectId) {
          await projectService.post_project_team_member_mail(
            projectId,
            newUsersData,
          )
        }
      }

      if (existingUsers.length > 0) {
        // Call the API for existing users
        const transformedMembers: ProjectTeamMember[] =
          transformSelectedMembers(existingUsers)

        if (projectId) {
          await projectService.post_project_team_member(
            projectId,
            transformedMembers,
          )
        }
      }
      enqueueSnackbar("Team Member added", {
        variant: "success",
      })
      setSelectedUsers([])
      getTeamMembers()

      setLoading(false)
    } catch (error) {
      logger.error(error)

      if ((error as any)?.response?.status === 403) {
        enqueueSnackbar("Access denied: Insufficient permissions.", {
          variant: "error",
        })
      } else {
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
        })
      }

      setLoading(false)
    }
  }

  useEffect(() => {
    getTeamMembers()
  }, [])

  return (
    <>
      {loading && <LoadingSpinner />}
      <MembersContainer
        //@ts-ignore
        projectId={projectId}
        deleteTeamMember={deleteTeamMember}
        onAddUser={handleAddUser}
        onRemoveUser={handleRemoveUser}
        onSave={handleSave}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        rows={rows}
        setRows={setRows}
        isEditing={isEditing}
        isLoading={loading}
        setIsLoading={setLoading}
      />
    </>
  )
}

export default TeamMemberTableContainer
