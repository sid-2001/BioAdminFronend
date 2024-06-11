import { Question, Section } from '@/types/survey-builder.type'

interface SectionsQuestionsListComponentProps {
  setquestionError: React.Dispatch<React.SetStateAction<boolean>>
  sections: Section[]
  selectedSection: Section | null
  selectedQuestion: Question | null
  setSectionAdd: React.Dispatch<React.SetStateAction<boolean>>
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
  setSelectedQuestion: React.Dispatch<any>
  setQuestionEdit: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedSection: React.Dispatch<any>
  setSectionDelete: React.Dispatch<React.SetStateAction<boolean>>
  setQuestionPreview: React.Dispatch<any>
  preview: boolean
  scrollToElement: (text: string) => void
  setQuestionSoftDelete: React.Dispatch<React.SetStateAction<boolean>>
  setQuestionDelete: React.Dispatch<React.SetStateAction<boolean>>
  getProjectTemplate: () => Promise<void>
  setThreadOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSectionSoftDelete: React.Dispatch<React.SetStateAction<boolean>>
  questionCompare: boolean
  setQuestionCompare: React.Dispatch<React.SetStateAction<boolean>>
  setSubQuestion: React.Dispatch<any>
  subQuestion: any
  setSubOpen: React.Dispatch<React.SetStateAction<number | null>>
  subOpen: number | null
  setQuestionSubDelete: React.Dispatch<React.SetStateAction<boolean>>
  setSubAdd: React.Dispatch<React.SetStateAction<boolean>>
  subAdd: boolean
  setSectionCompare: React.Dispatch<React.SetStateAction<boolean>>
  sectionCompare: boolean

  // setSelectedFileQuestionTitle: React.Dispatch<React.SetStateAction<FilesTypes | null>>
}

export type { SectionsQuestionsListComponentProps }
