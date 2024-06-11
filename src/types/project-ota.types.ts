import { AnalysisData } from "./project-data.type"

interface OtaQuestionsList {
  name: string
  questions: OtaQuestions[]
}

interface OtaQuestions {
  question_text: string
  base_name: string
  question_id: string
  analysis_data: AnalysisData[]
}

export type { OtaQuestionsList, OtaQuestions }
