import { OtaQuestionsList } from "@/types/project-ota.types"

interface OtaQuestionListComponentProps {
  questionList: OtaQuestionsList | null
  fullViewMode: boolean
  setQuestionId: React.Dispatch<React.SetStateAction<string | null>>
}

export type { OtaQuestionListComponentProps }
