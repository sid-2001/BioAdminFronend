import { Section } from '@/types/survey-builder.type'

interface ProjectBuilderPreviewComponentProps {
  fullViewMode: boolean
  html: string
  projectStatusIdChange: (status: number) => Promise<void>
  get_project_byid: any
  setChangeModal: React.Dispatch<React.SetStateAction<number | null>>
  project: any
  showSkeleton: boolean
  setshowSkeleton: any
  preview: boolean
  sections: Section[]
  originalDoc?: boolean
}

export type { ProjectBuilderPreviewComponentProps }
