import { Section } from '@/types/survey-builder.type'

interface ProjectBuilderSectionComponentProps {
  section?: any
  add?: boolean
  getSection: () => Promise<void>
  setAdd: React.Dispatch<React.SetStateAction<boolean>>
  sections: Section[]
  setCreateSectionId: React.Dispatch<React.SetStateAction<number | null>>
  setSectionCompare: React.Dispatch<React.SetStateAction<boolean>>
}

interface SectionData {
  section_id: number
  section_code: string
  section_name: string
  description: string
  sort_order: number
}

export type { ProjectBuilderSectionComponentProps, SectionData }
