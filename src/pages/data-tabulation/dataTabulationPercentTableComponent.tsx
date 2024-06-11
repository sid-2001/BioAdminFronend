import "react-data-grid/lib/styles.css";
import "./style.css";
// import { TablesService } from "./test.service"

// import DataGrid, { ColumnOrColumnGroup, RenderCellProps } from "react-data-grid"
import DataGrid from "react-data-grid";
import { Grid, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { Column, Table } from "./table.type";
import { styled } from "@mui/material/styles";
import { theme } from "@/constants/theme";
import { JSONData } from "@/types/project-data.type";
import { useLocation } from "react-router-dom";

interface GridComponentPropTypes {
  table: Table;
  id: string;
  navigateToIndex: (id: string) => void;
  navigateToCount: (id: string) => void;
}

const StyledText = styled(Typography)(() => ({
  fontFamily: "Calibri",
  fontWeight: 700,
  fontSize: "18px",
  marginBottom: "0rem",
}));

function CellRenderer(row: any, keyVal: number) {
  const location = useLocation();
  const lastHash = useRef("");

  useEffect(() => {
    if (location.hash) {
      lastHash.current = location.hash.slice(1); // safe hash for further use after navigation
    }

    if (lastHash.current && document.getElementById(lastHash.current)) {
      setTimeout(() => {
        document
          .getElementById(lastHash.current)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        lastHash.current = "";
      }, 100);
    }
  }, [location]);
  return (
    <div
      style={{
        backgroundColor: row.rowIdx === 0 ? "#ddebf7" : "",
        display: "flex",
        alignItems: "center",
        justifyContent: row.column.idx == 0 ? "flex-start" : "flex-end",
        gap: "4px",
        fontWeight: row.rowIdx === 0 || row.column.idx == 0 ? "700" : "normal",
        padding: "4px",
        fontSize: "16px",
        // width: "75px",
      }}
    >
      {row.row[keyVal]}
    </div>
  );
}

function getColumnSchema(table: Table) {
  const groupNames = [
    ...new Set(table.rows[0].columns.map((col: any) => col.group_name)),
  ];

  const columnsLength = table.rows[0].columns.length;

  let key = 0;
  const newColumnSchema = [];

  for (const group of groupNames) {
    const groupedCols = table.rows[0].columns.filter(
      (col: any) => col.group_name === group
    );
    const obj: any = {
      name: group,
      children: [],
      headerCellClass: group === "" ? "transparent" : "blue",
      resizable: true,
    };
    obj.children = groupedCols.map((x: Column) => {
      const keyVal = key % columnsLength;
      key++;
      return {
        name: x.name,
        headerCellClass: group === "" ? "transparent" : "blue",
        resizable: true,
        children: [
          {
            key: keyVal,
            headerCellClass: group === "" ? "transparent" : "blue",
            name: x.label,
            resizable: true,
            renderCell: (row: any) => CellRenderer(row, keyVal),
          },
        ],
      };
    });

    newColumnSchema.push(obj);
  }

  return newColumnSchema;
}

function getRows(table: Table) {
  const columnsLength = table.rows[0].columns.length;

  let col = 0;
  const dataRows = table.rows.map((row: any) => {
    return row.columns.reduce((acc: any, cur: any) => {
      // const key = cur.name.split(" ").join("_")

      const key = col % columnsLength;
      col++;
      acc[key] = cur.value_percent;

      return acc;
    }, {});
  });

  return dataRows;
}

function DataTabulationGridComponent({
  table,
  id,
  navigateToCount,
  navigateToIndex,
}: GridComponentPropTypes) {
  const { table_name, question_text, analysis_text, notes_text } = table;

  if (table && table.rows.length) {
    const columns = getColumnSchema(table);
    const rows = getRows(table);

    return (
      <div
        style={{
          marginBottom: "3rem",
        }}
        id={id}
      >
        <Grid container style={{ width: "50%" }}>
          <Grid item xs={6} onClick={() => navigateToIndex(id)}>
            <Typography
              style={{
                cursor: "pointer",
                color: theme.palette.primary.main,
                textDecoration: "underline",
              }}
            >
              Back to Index{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} onClick={() => navigateToCount(id)}>
            <Typography
              style={{
                cursor: "pointer",
                color: theme.palette.primary.main,
                textDecoration: "underline",
              }}
            >
              Counts{" "}
            </Typography>
          </Grid>
        </Grid>
        <StyledText variant="h3">{table_name}</StyledText>
        <StyledText variant="h3">{question_text}</StyledText>
        <StyledText
          variant="h3"
          style={{
            marginBottom: "4rem",
          }}
        >
          {analysis_text}
        </StyledText>
        <StyledText variant="h3">{notes_text}</StyledText>

        <DataGrid
          rowClass={() => "row"}
          rows={rows}
          columns={columns}
          style={{
            height: "fit-content",
          }}
          rowHeight={45}
        />
      </div>
    );
  }

  return null;
  // return ""
}

// interface DataTabulationCountTableContainerPropTypes {}

function DataTabulationPercentageTableContainer({
  navigateToIndex,
  navigateToCount,
  JSONData,
}: {
  navigateToIndex: (id: string) => void;
  navigateToCount: (id: string) => void;
  JSONData: JSONData;
}) {
  // const tablesService = new TablesService()
  const [tables, setTables] = useState<Array<Table>>([]);

  // async function getTables() {
  //   try {
  //     const data = await tablesService.getPercentTables()

  //     setTables(data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // useEffect(() => {
  //   // console.log("DataTabulationPercentTableContainer mounted", tables)

  //   getTables()
  // }, [])

  // console.log("DataTabulationPercentTableContainer mounted", tables)

  // function scrollTo(id = 2) {
  //   const element = document.getElementById(`poc-table-${id}`)
  //   if (element) {
  //     element.scrollIntoView({ behavior: "smooth", block: "start" })
  //   }
  // }

  const addEmptyColumnForPercentTable = (tablesData: Array<Table>) => {
    return tablesData.map((table) => {
      const str = JSON.stringify(table);
      const newTable = JSON.parse(str);

      newTable.rows = newTable.rows.map((row: any) => {
        const newRow = { ...row };

        newRow.columns.unshift({
          group_name: "",
          name: "",
          label: "",
          value: "",
          value_percent: row.name,
          value_subscript: "",
        });

        return newRow;
      });

      return newTable;
    });
  };

  function addTotalColumn(tables: Array<Table>) {
    const newtables = tables.map((table) => {
      const newTable = { ...table };

      newTable.rows = newTable.rows.map((row) => {
        const newRow = { ...row };

        newRow.columns = newRow.columns.map((column, index) => {
          const newColumn = { ...column };

          if (index === 0) {
            newColumn.group_name = newColumn.name;
            // newColumn.label = newColumn.name;
            newColumn.name = "";
          }

          return newColumn;
        });

        return newRow;
      });

      return newTable;
    });

    return newtables;
  }

  useEffect(() => {
    if (JSONData?.tables) {
      const modifiedTables = addEmptyColumnForPercentTable(
        addTotalColumn(JSONData.tables)
      );
      setTables(modifiedTables);
    }
  }, []);

  return (
    <section>
      {/* <Button onClick={() => scrollTo(2)}>Scroll to 3rd</Button> */}
      {tables?.map((table, i) => {
        return (
          <DataTabulationGridComponent
            id={`percent-table-${i}`}
            key={i}
            table={table}
            navigateToIndex={navigateToIndex}
            navigateToCount={navigateToCount}
          />
        );
      })}
    </section>
  );
}

export default DataTabulationPercentageTableContainer;
