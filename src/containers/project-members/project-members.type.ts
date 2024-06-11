import {
    ProjectTeamMemberResponse,
    ProjectTeamSearchResponse,
  } from "@/types/project.type"
  
  interface TeamMemberTableProps {
    projectId: string
    deleteTeamMember: (projectId: string, teamMemberId: string) => void
    onAddUser: (user: ProjectTeamSearchResponse) => void
    onRemoveUser: (userId: string) => void
    onSave: () => Promise<void>
    onAdd: (email: string, newRole: number) => Promise<void>
    onUpdate: (newRole: number, team_member_id: string) => Promise<void>
    selectedUsers: ProjectTeamSearchResponse[]
    rows: ProjectTeamMemberResponse[]
    setRows: React.Dispatch<React.SetStateAction<ProjectTeamMemberResponse[]>>
    isEditing: boolean
    setSelectedUsers: React.Dispatch<
      React.SetStateAction<ProjectTeamSearchResponse[]>
    >
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  }
  
  export type { TeamMemberTableProps }
  