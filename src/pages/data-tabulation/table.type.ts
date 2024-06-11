interface RootObject {
  name: string
  tables: Table[]
}
interface Table {
  table_name: string
  question_text: string
  analysis_text: string
  notes_text: string
  rows: Row[]
}
interface Row {
  name: string
  columns: Column[]
}
interface Column {
  group_name: string
  name: string
  label: string
  value: number | string
  value_percent: string
  value_subscript: string
}

export type { Column, RootObject, Row, Table }
