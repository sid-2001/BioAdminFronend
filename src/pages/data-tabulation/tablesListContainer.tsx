import "react-data-grid/lib/styles.css";
import "./style.css";

import DataGrid from "react-data-grid";
import { Box, Link, Typography } from "@mui/material";
import { JSONData, DataRow } from "../../types/project-data.type";
// const columns = [
//   { key: "id", name: "ID" },
//   { key: "title", name: "Title" },
// ]

// const rows = [
//   { id: 0, title: "Example" },
//   { id: 1, title: "Demo" },
// ]

function CellRenderer(data: any) {
  if (data.row && data.column) {
    const { row, column } = data;
    // console.log(row, column, "row, columnrow, column");
    return (
      <Box
        sx={{
          padding: "0.5rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        {column.idx === 0 || column.idx === 1 ? (
          <Link
            sx={{
              display: "block",
              marginBottom: "0.5rem",
            }}
            href={
              column.idx === 1
                ? `#percent-table-${row.id}`
                : `#poc-table-${row.id}`
            }
          >
            {column.idx === 1 ? "%_" + row[column.key] : row[column.key]}
          </Link>
        ) : (
          <Typography>{row[column.key]}</Typography>
        )}
      </Box>
    );
  }

  return "";
}

const columns = [
  {
    key: "counts",
    name: "Counts",
    headerCellClass: "blue",
    renderCell: (row: any) => CellRenderer(row),
    resizable: true,
  },
  {
    key: "percentages",
    name: "Percentages",
    headerCellClass: "blue",
    renderCell: (row: any) => CellRenderer(row),
    resizable: true,
  },
  {
    key: "question_number",
    name: "Question Number",
    headerCellClass: "blue",
    renderCell: (row: any) => CellRenderer(row),
    resizable: true,
  },
  {
    key: "question_text",
    name: "Question Text",
    headerCellClass: "blue",
    renderCell: (row: any) => CellRenderer(row),
    resizable: true,
  },
  {
    key: "basic_title",
    name: "Basic Title",
    headerCellClass: "blue",
    renderCell: (row: any) => CellRenderer(row),
  },
  {
    key: "base_value",
    name: "Unweighted Base Size",
    headerCellClass: "blue",
    renderCell: (row: any) => CellRenderer(row),
    resizable: true,
  },
];

// const rows = [
//   {
//     counts: "Table 0",
//     percentages: "percentages",
//     question_number: "question_number",
//     question_text: "question_text",
//     basic_title: "basic_title",
//     id: 0,
//   },
//   {
//     counts: "Table 1",
//     percentages: "percentages",
//     question_number: "question_number",
//     question_text: "question_text",
//     basic_title: "basic_title",
//     id: 1,
//   },
//   {
//     counts: "Table 2",
//     percentages: "percentages",
//     question_number: "question_number",
//     question_text: "question_text",
//     basic_title: "basic_title",
//     id: 2,
//   },
// ]

const transformJSONToRows = (jsonData: JSONData): DataRow[] => {
  const rows: DataRow[] = [];
  jsonData?.tables?.forEach((table, index) => {
    rows?.push({
      // counts: `Table ${index + 1}`,
      counts: table?.table_name,
      percentages: table?.table_name,
      question_number: table?.question_id,
      question_text: table?.question_text,
      basic_title: table?.base_name,
      base_value: table?.base_value,
      id: index,
    });
  });
  return rows;
};

// interface DataTabulationListType {
//   counts: string
//   percentages: string
//   question_number: string
//   question_text: string
//   basic_title: string
//   base_size: number
// }

interface TablesListContainerPropTypes {
  linkClickHandler: (rowId: number, colId: number) => void;
  JSONData: JSONData;
}

function TablesListContainer({
  linkClickHandler,
  JSONData,
}: TablesListContainerPropTypes) {
  const rows = transformJSONToRows(JSONData);
  // console.log(JSONData, "transformJSONToRowstransformJSONToRows", JSONData?.data?.tables);

  return (
    <DataGrid
      rowClass={() => "row"}
      rows={rows}
      columns={columns}
      style={{
        height: "fit-content",
      }}
      onCellClick={(e: { row: { id: number }; column: { idx: number } }) =>
        linkClickHandler(e.row.id, e.column.idx)
      }
    />
  );
}

export default TablesListContainer;
