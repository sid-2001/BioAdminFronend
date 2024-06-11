// import "react-data-grid/lib/styles.css";
// import "./style.css";
// // import { TablesService } from "./test.service"

// // import DataGrid, { ColumnOrColumnGroup, RenderCellProps } from "react-data-grid"
// import DataGrid from "react-data-grid";
// import { Grid, Tooltip, Typography } from "@mui/material";
// import { useEffect, useState, useRef } from "react";
// import { Column, Table } from "./table.type";
// import { styled } from "@mui/material/styles";
// import { theme } from "@/constants/theme";
// import { JSONData } from "@/types/project-data.type";
// import { useLocation } from "react-router-dom";
// import DummyData from "./Dummy.json"
// interface GridComponentPropTypes {
//   table: Table;
//   id: string;
//   navigateToIndex: (id: string) => void;
//   navigateToPercentage: (id: string) => void;
// }

// const StyledText = styled(Typography)(() => ({
//   fontFamily: "Calibri",
//   fontWeight: 700,
//   fontSize: "18px",
//   marginBottom: "0rem",
// }));

// function CellRenderer(row: any, keyVal: number) {
//   const valueAsString = String(row?.row[keyVal]?.value);
//   const endsWithPercent = valueAsString?.endsWith("%");

//   const location = useLocation();
//   const lastHash = useRef("");

//   function formatValue(value: string) {
//     const num = parseFloat(value);
//     if (!isNaN(num) && !endsWithPercent) {
//       const decimalPart = (num.toString().split(".")[1] || "").length;
//       if (decimalPart > 0) {
//         return num.toFixed(2);
//       }
//     }
//     return value;
//   }

//   useEffect(() => {
//     if (location.hash) {
//       lastHash.current = location.hash.slice(1);
//     }

//     if (lastHash.current && document.getElementById(lastHash.current)) {
//       setTimeout(() => {
//         document
//           .getElementById(lastHash.current)
//           ?.scrollIntoView({ behavior: "smooth", block: "start" });
//         lastHash.current = "";
//       }, 100);
//     }
//   }, [location]);

//   return (
//     <div
//       style={{
//         backgroundColor: row.rowIdx === 0 ? "#ddebf7" : "",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: row.column.idx == 0 ? "flex-start" : "flex-end",
//         gap: "4px",
//         fontWeight: row.rowIdx === 0 || row.column.idx == 0 ? "700" : "normal",
//         padding: "4px",
//         fontSize: "16px",
//         // width: "75px",
//       }}
//     >
//       <Tooltip title={row?.row[keyVal]?.z_score || ""} arrow placement="top">
//         {/* {row?.row[keyVal]?.value} */}
//         {row?.row[keyVal]?.value
//           ? formatValue(row.row[keyVal].value)
//           : row?.row[keyVal]?.value}
//       </Tooltip>

//       {(endsWithPercent ||
//         row?.row[0]?.value == "mean" ||
//         row?.row[0]?.value == "std" ||
//         row?.row[0]?.value == "sem") && (
//           <Typography
//             sx={{
//               fontSize: "12px",
//               fontWeight: "700",
//               color: "red",
//             }}
//           >
//             {row?.row[keyVal]?.value_subscript}
//           </Typography>
//         )}
//     </div>
//   );
// }

// function getColumnSchema(table: Table) {
//   const groupNames = [
//     ...new Set(table.rows[0].columns.map((col: any) => col.group_name)),
//   ];

//   const columnsLength = table.rows[0].columns.length;

//   let key = 0;
//   const newColumnSchema = [];

//   for (const group of groupNames) {
//     const groupedCols = table.rows[0].columns.filter(
//       (col: any) => col.group_name === group
//     );
//     const obj: any = {
//       name: group,
//       children: [],
//       headerCellClass: group === "" ? "transparent" : "blue",
//       resizable: true,
//     };
//     obj.children = groupedCols.map((x: Column) => {
//       const keyVal = key % columnsLength;
//       key++;
//       return {
//         name: x.name,
//         headerCellClass: group === "" ? "transparent" : "blue",
//         resizable: true,
//         children: [
//           {
//             key: keyVal,
//             headerCellClass: group === "" ? "transparent" : "blue",
//             name: x.label,
//             resizable: true,
//             renderCell: (row: any) => CellRenderer(row, keyVal),
//           },
//         ],
//       };
//     });

//     newColumnSchema.push(obj);
//   }

//   return newColumnSchema;
// }

// function getRows(table: Table) {
//   const columnsLength = table.rows[0].columns.length;

//   let col = 0;
//   const dataRows = table.rows.map((row: any) => {
//     return row.columns.reduce((acc: any, cur: any) => {
//       // const key = cur.name.split(" ").join("_")

//       const key = col % columnsLength;
//       col++;
//       acc[key] = {
//         value: cur.value,
//         value_subscript: cur.value_subscript,
//         z_score: cur?.z_score,
//       };

//       return acc;
//     }, {});
//   });

//   return dataRows;
// }

// function DataTabulationGridComponent({
//   table,
//   id,
//   navigateToIndex,
//   navigateToPercentage,
// }: GridComponentPropTypes) {
//   // const table = DummyData
//   const { table_name, question_text, analysis_text, notes_text } = table;
//   // const { table_name, question_text, analysis_text, notes_text } = table;
//   if (table && table.rows.length) {
//     const columns = getColumnSchema(table);
//     const rows = getRows(table);

//     console.log(columns, rows, "columnsrows")

//     console.log(table, "tabletabletable")

//     return (
//       <div
//         style={{
//           marginBottom: "3rem",
//         }}
//         id={id}
//       >
//         <Grid container style={{ width: "50%" }}>
//           <Grid item xs={6} onClick={() => navigateToIndex(id)}>
//             <Typography
//               style={{
//                 cursor: "pointer",
//                 color: theme.palette.primary.main,
//                 textDecoration: "underline",
//               }}
//             >
//               Back to Index{" "}
//             </Typography>
//           </Grid>
//           <Grid item xs={6} onClick={() => navigateToPercentage(id)}>
//             <Typography
//               style={{
//                 cursor: "pointer",
//                 color: theme.palette.primary.main,
//                 textDecoration: "underline",
//               }}
//             >
//               Percentages{" "}
//             </Typography>
//           </Grid>
//         </Grid>
//         <StyledText variant="h3">{table_name}</StyledText>
//         <StyledText variant="h3"> {question_text}</StyledText>
//         <StyledText
//           variant="h3"
//           style={{
//             marginBottom: "4rem",
//           }}
//         >
//           {analysis_text}
//         </StyledText>
//         <StyledText variant="h3">{notes_text}</StyledText>
//         <DataGrid
//           rowClass={() => "row"}
//           rows={rows}
//           columns={columns}
//           style={{
//             height: "fit-content",
//           }}
//         />
//       </div>
//     );
//   }

//   return null;
//   // return ""
// }

// // interface DataTabulationCountTableContainerPropTypes {}

// function DataTabulationCountTableContainer({
//   navigateToIndex,
//   navigateToPercentage,
//   JSONData,
// }: {
//   navigateToIndex: (id: string) => void;
//   navigateToPercentage: (id: string) => void;
//   JSONData: JSONData;
// }) {
//   // const tablesService = new TablesService()
//   const [tables, setTables] = useState<Array<Table>>([]);

//   const addPercentRow = (tables: Array<Table>) => {
//     return tables.map((table) => {
//       const newTable = { ...table };
//       const newRows = [table.rows[0]];

//       for (let i = 1; i < table.rows.length; i++) {
//         const row = table.rows[i];
//         const newRow = { ...row };
//         newRow.columns = row.columns.map((col) => ({
//           ...col,
//           value: col.value_percent,
//         }));
//         newRows.push(row);
//         newRows.push(newRow);
//       }

//       newTable.rows = newRows;
//       return newTable;
//     });
//   };

//   const addEmptyColumn = (tables: Array<Table>) => {
//     return tables.map((table) => {
//       const newTable = { ...table };
//       newTable.rows.forEach((row, i) => {
//         if (row.columns[0].group_name === "") {
//           row.columns.shift();
//         }
//         row.columns.unshift({
//           group_name: "",
//           name: "",
//           label: "",
//           value: i === 0 || i % 2 !== 0 ? row.name : "",
//           value_percent: "",
//           value_subscript: "",
//         });
//       });
//       return newTable;
//     });
//   };

//   function addTotalColumn(tables: Array<Table>) {
//     const newtables = tables.map((table) => {
//       const newTable = { ...table };

//       newTable.rows = newTable.rows.map((row) => {
//         const newRow = { ...row };

//         newRow.columns = newRow.columns.map((column, index) => {
//           const newColumn = { ...column };

//           if (index === 0) {
//             newColumn.group_name = newColumn.name;
//             // newColumn.label = newColumn.name;
//             newColumn.name = "";
//           }

//           return newColumn;
//         });

//         return newRow;
//       });

//       return newTable;
//     });

//     return newtables;
//   }

//   useEffect(() => {
//     if (JSONData?.tables) {
//       const processedTables = addEmptyColumn(
//         addPercentRow(addTotalColumn(JSONData?.tables))
//       );
//       setTables(processedTables);
//     }
//   }, [JSONData]);

//   return (
//     <section>
//       {/* <Button onClick={() => scrollTo(2)}>Scroll to 3rd</Button> */}
//       {tables?.map((table, i) => {
//         return (
//           <DataTabulationGridComponent
//             id={`poc-table-${i}`}
//             key={i}
//             table={table}
//             navigateToIndex={navigateToIndex}
//             navigateToPercentage={navigateToPercentage}
//           />
//         );
//       })}
//     </section>
//   );
// }

// export default DataTabulationCountTableContainer;

import "react-data-grid/lib/styles.css";
import "./style.css";
// import { TablesService } from "./test.service"

// import DataGrid, { ColumnOrColumnGroup, RenderCellProps } from "react-data-grid"
import DataGrid from "react-data-grid";
import { FormControlLabel, Grid, Switch, SwitchProps, Tooltip, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { Column, Table } from "./table.type";
import { styled } from "@mui/material/styles";
import { theme } from "@/constants/theme";
import { JSONData } from "@/types/project-data.type";
import { useLocation } from "react-router-dom";
// import DummyData from "./Dummy.json"


const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 34,
  height: 18,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#8E27D7',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 14,
    height: 14,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

interface GridComponentPropTypes {
  table: Table;
  id: string;
  navigateToIndex: (id: string) => void;
  navigateToPercentage: (id: string) => void;
}

const StyledText = styled(Typography)(() => ({
  fontFamily: "Calibri",
  fontWeight: 700,
  fontSize: "18px",
  marginBottom: "0rem",
}));

function CellRenderer(row: any, keyVal: number) {
  const valueAsString = String(row?.row[keyVal]?.value);
  const endsWithPercent = valueAsString?.endsWith("%");

  const location = useLocation();
  const lastHash = useRef("");

  function formatValue(value: string) {
    const num = parseFloat(value);
    if (!isNaN(num) && !endsWithPercent) {
      const decimalPart = (num.toString().split(".")[1] || "").length;
      if (decimalPart > 0) {
        return num.toFixed(2);
      }
    }
    return value;
  }

  useEffect(() => {
    if (location.hash) {
      lastHash.current = location.hash.slice(1);
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
      <Tooltip title={row?.row[keyVal]?.z_score || ""} arrow placement="top">
        {/* {row?.row[keyVal]?.value} */}
        {row?.row[keyVal]?.value
          ? formatValue(row.row[keyVal].value)
          : row?.row[keyVal]?.value}
      </Tooltip>

      {(endsWithPercent ||
        row?.row[0]?.value == "mean" ||
        row?.row[0]?.value == "std" ||
        row?.row[0]?.value == "sem") && (
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "700",
              color: "red",
            }}
          >
            {row?.row[keyVal]?.value_subscript}
          </Typography>
        )}
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

// function getColumnSchema(table) {
//   console.log(table, "tabletableasdfghj");

//   const columnsLength = table.rows[0].columns.length;
//   let key = 0;
//   const newColumnSchema = [];

//   const addChild = (parent, parts, col, keyVal) => {
//     if (parts.length === 0) return;

//     let name = parts.shift();
//     let child = parent.children.find(child => child.name === name);

//     if (!child) {
//       child = {
//         name,
//         headerCellClass: name === "" ? "transparent" : "blue",
//         resizable: true,
//         children: []
//       };
//       parent.children.push(child);
//     }

//     if (parts.length === 0) {
//       child.children.push({
//         key: keyVal,
//         headerCellClass: name === "" ? "transparent" : "blue",
//         name: col.label,
//         resizable: true,
//         renderCell: (row) => CellRenderer(row, keyVal)
//       });
//     } else {
//       addChild(child, parts, col, keyVal);
//     }
//   };

//   table.rows[0].columns.forEach((col, index) => {
//     const groupParts = col.group_name.split('-');
//     const keyVal = key % columnsLength;
//     key++;

//     addChild({ children: newColumnSchema }, groupParts, col, keyVal);
//   });

//   return newColumnSchema;
// }

// function getColumnSchema(table) {
//   console.log(table, "tabletableasdfghj");

//   const columnsLength = table.rows[0].columns.length;
//   let key = 0;
//   const newColumnSchema = [];

//   const addChild = (parent, parts, col, keyVal) => {
//     if (parts.length === 0) return;

//     let name = parts.shift();
//     // If it's the last part and it's "S2", replace with the col.name
//     if (parts.length === 0 && name === "S2") {
//       name = col.name;
//     }

//     let child = parent.children.find(child => child.name === name);

//     if (!child) {
//       child = {
//         name,
//         headerCellClass: name === "" ? "transparent" : "blue",
//         resizable: true,
//         children: []
//       };
//       parent.children.push(child);
//     }

//     if (parts.length === 0) {
//       child.children.push({
//         key: keyVal,
//         headerCellClass: name === "" ? "transparent" : "blue",
//         name: col.label,
//         resizable: true,
//         renderCell: (row) => CellRenderer(row, keyVal)
//       });
//     } else {
//       addChild(child, parts, col, keyVal);
//     }
//   };

//   table.rows[0].columns.forEach((col, index) => {
//     const groupParts = col.group_name.split('-');
//     const keyVal = key % columnsLength;
//     key++;

//     addChild({ children: newColumnSchema }, groupParts, col, keyVal);
//   });

//   return newColumnSchema;
// }

// function getColumnSchema(table) {
//   console.log(table, "tabletableasdfghj");

//   const columnsLength = table.rows[0].columns.length;
//   let key = 0;
//   const newColumnSchema = [];

//   const addChild = (parent, parts, col, keyVal) => {
//     if (parts.length === 0) return;

//     let name = parts.shift();
//     // If it's the last part and it's "S2", replace with the col.name
//     if (parts.length === 0 && name === "S2") {
//       name = col.name;
//     }

//     let child = parent.children.find(child => child.name === name);

//     if (!child) {
//       child = {
//         name,
//         headerCellClass: name === "" ? "transparent" : "blue",
//         resizable: true,
//         children: []
//       };
//       parent.children.push(child);
//     }

//     if (parts.length === 0) {
//       child.children.push({
//         key: keyVal,
//         headerCellClass: name === "" ? "transparent" : "blue",
//         name: col.label,
//         resizable: true,
//         renderCell: (row) => CellRenderer(row, keyVal)
//       });
//     } else {
//       addChild(child, parts, col, keyVal);
//     }
//   };

//   // Group columns by their group_name
//   const groupedColumns = table.rows[0].columns.reduce((acc, col) => {
//     const groupParts = col.group_name.split('-');
//     const mainGroup = groupParts.length > 1 ? groupParts[0] : col.group_name;
//     if (!acc[mainGroup]) acc[mainGroup] = [];
//     acc[mainGroup].push({ parts: groupParts, col });
//     return acc;
//   }, {});

//   // Iterate over grouped columns and build the schema
//   for (const group in groupedColumns) {
//     const groupCols = groupedColumns[group];
//     const groupObj = {
//       name: group,
//       headerCellClass: group === "" ? "transparent" : "blue",
//       resizable: true,
//       children: []
//     };

//     groupCols.forEach(({ parts, col }) => {
//       const keyVal = key % columnsLength;
//       key++;
//       if (parts.length > 1) {
//         // Remove the first part to avoid duplication in the hierarchy
//         parts.shift();
//         addChild(groupObj, parts, col, keyVal);
//       } else {
//         groupObj.children.push({
//           key: keyVal,
//           headerCellClass: group === "" ? "transparent" : "blue",
//           name: col.label,
//           resizable: true,
//           renderCell: (row) => CellRenderer(row, keyVal)
//         });
//       }
//     });

//     newColumnSchema.push(groupObj);
//   }

//   return newColumnSchema;
// }


interface Column1 {
  group_name: string;
  name: string;
  label: string;
  value: any;
  value_percent: any;
  value_subscript: any;
};

interface GroupedColumns {
  [key: string]: { parts: string[]; col: Column1 }[];
};

interface SchemaNode {
  name: string;
  headerCellClass: string;
  resizable: boolean;
  children: SchemaNode[];
  key?: number;
  renderCell?: (row: any) => JSX.Element;
}


function getColumnSchemaNested(table: Table): SchemaNode[] {
  console.log(table, "tabletableasdfghj");

  const columnsLength = table.rows[0].columns.length;
  let key = 0;
  const newColumnSchema: SchemaNode[] = [];

  const addChild = (parent: { name?: string; headerCellClass?: string; resizable?: boolean; children: any; }, parts: any[], col: { name: any; label: any; }, keyVal: number) => {
    if (parts.length === 0) return;

    let name = parts.shift();
    // If it's the last part and it's "S2", replace with the col.name
    if (parts.length === 0) {
      name = col.name;
    }

    let child = parent.children.find((child: { name: any; }) => child.name === name);

    if (!child) {
      child = {
        name,
        headerCellClass: name === "" ? "transparent" : "blue",
        resizable: true,
        children: []
      };
      parent.children.push(child);
    }

    if (parts.length === 0) {
      child.children.push({
        key: keyVal,
        headerCellClass: name === "" ? "transparent" : "blue",
        name: col.label,
        resizable: true,
        renderCell: (row: any) => CellRenderer(row, keyVal)
      });
    } else {
      addChild(child, parts, col, keyVal);
    }
  };

  // Group columns by their group_name
  const groupedColumns: GroupedColumns = table.rows[0].columns.reduce((acc: GroupedColumns, col: Column1) => {
    const groupParts = col.group_name.split('-');
    const mainGroup = groupParts.length > 1 ? groupParts[0] : col.group_name;
    if (!acc[mainGroup]) acc[mainGroup] = [];
    acc[mainGroup].push({ parts: groupParts, col });
    return acc;
  }, {});

  // Iterate over grouped columns and build the schema
  for (const group in groupedColumns) {
    const groupCols = groupedColumns[group];
    const groupObj: SchemaNode = {
      name: group,
      headerCellClass: group === "" ? "transparent" : "blue",
      resizable: true,
      children: []
    };

    groupCols.forEach(({ parts, col }) => {
      const keyVal = key % columnsLength;
      key++;
      if (parts.length > 1) {
        // Remove the first part to avoid duplication in the hierarchy
        parts.shift();
        addChild(groupObj, parts, col, keyVal);
      } else {
        const childObj: SchemaNode = {
          name: col.name,
          headerCellClass: group === "" ? "transparent" : "blue",
          resizable: true,
          children: []
        };
        // @ts-ignore
        childObj.children.push({
          key: keyVal,
          headerCellClass: group === "" ? "transparent" : "blue",
          name: col.label,
          resizable: true,
          renderCell: (row) => CellRenderer(row, keyVal),
          // children: [],
        });

        groupObj.children.push(childObj);
      }
    });

    newColumnSchema.push(groupObj);
  }

  return newColumnSchema;
}









// function getColumnSchema(table) {
//   const columnsLength = table.rows[0].columns.length;
//   let key = 0;

//   const buildHierarchy = (groupedCols) => {
//     const hierarchy = {};

//     groupedCols.forEach(col => {
//       const parts = col.group_name.split('-');
//       let currentLevel = hierarchy;

//       parts.forEach((part, index) => {
//         if (!currentLevel[part]) {
//           currentLevel[part] = {
//             name: part,
//             children: [],
//             headerCellClass: "blue",
//             resizable: true,
//           };
//         }
//         if (index === parts.length - 1) {
//           const keyVal = key % columnsLength;
//           key++;
//           currentLevel[part].children.push({
//             key: keyVal,
//             headerCellClass: "blue",
//             name: col.label,
//             resizable: true,
//             renderCell: (row) => CellRenderer(row, keyVal),
//           });
//         } else {
//           if (!currentLevel[part].children.length || typeof currentLevel[part].children[0] === 'object') {
//             currentLevel[part].children = {};
//           }
//           currentLevel = currentLevel[part].children;
//         }
//       });
//     });

//     const convertToArray = (obj) => {
//       return Object.values(obj).map(node => {
//         if (node.children && typeof node.children === 'object') {
//           node.children = convertToArray(node.children);
//         }
//         return node;
//       });
//     };

//     return convertToArray(hierarchy);
//   };

//   const groupedCols = table.rows[0].columns.filter(col => col.group_name);
//   const columns = buildHierarchy(groupedCols);

//   return columns;
// }

// function getRows(table) {
//   const columnsLength = table.rows[0].columns.length;

//   let col = 0;
//   const dataRows = table.rows.map((row) => {
//     return row.columns.reduce((acc, cur) => {
//       const key = col % columnsLength;
//       col++;
//       acc[key] = {
//         value: cur.value,
//         value_subscript: cur.value_subscript,
//         z_score: cur?.z_score,
//       };

//       return acc;
//     }, {});
//   });

//   return dataRows;
// }


function getRows(table: Table) {
  const columnsLength = table.rows[0].columns.length;

  let col = 0;
  const dataRows = table.rows.map((row: any) => {
    return row.columns.reduce((acc: any, cur: any) => {
      // const key = cur.name.split(" ").join("_")

      const key = col % columnsLength;
      col++;
      acc[key] = {
        value: cur.value,
        value_subscript: cur.value_subscript,
        z_score: cur?.z_score,
      };

      return acc;
    }, {});
  });

  return dataRows;
}

function DataTabulationGridComponent({
  table,
  id,
  navigateToIndex,
  navigateToPercentage,
}: GridComponentPropTypes) {
  // const table = DummyData
  const { table_name, question_text, analysis_text, notes_text } = table;

  const [useNested, setUseNested] = useState(false)
  // const { table_name, question_text, analysis_text, notes_text } = table;
  if (table && table.rows.length) {

    const columns = useNested ? getColumnSchemaNested(table) : getColumnSchema(table);
    const rows = getRows(table);

    console.log(columns, rows, "columnsrows")

    console.log(table, "tabletabletable")

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
          <Grid item xs={6} onClick={() => navigateToPercentage(id)}>
            <Typography
              style={{
                cursor: "pointer",
                color: theme.palette.primary.main,
                textDecoration: "underline",
              }}
            >
              Percentages{" "}
            </Typography>
          </Grid>
        </Grid>
        <StyledText variant="h3">{table_name}</StyledText>
        <StyledText variant="h3"> {question_text}</StyledText>
        <StyledText
          variant="h3"
          style={{
            marginBottom: "4rem",
          }}
        >
          {analysis_text}
        </StyledText>
        <StyledText variant="h3">{notes_text}</StyledText>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", }}>
          <div style={{ display: "flex", marginRight: "1rem" }}>
            <FormControlLabel
              control={<IOSSwitch size="small" sx={{ m: 1 }} checked={useNested} onChange={() => {
                setUseNested(!useNested)
              }} />}
              label={useNested ? 'Nested' : 'Nested'} labelPlacement="start"
            />
          </div>
        </div>

        <DataGrid
          rowClass={() => "row"}
          rows={rows}
          columns={columns}
          style={{
            height: "fit-content",
          }}
        />


      </div>
    );
  }

  return null;
  // return ""
}

// interface DataTabulationCountTableContainerPropTypes {}

function DataTabulationCountTableContainer({
  navigateToIndex,
  navigateToPercentage,
  JSONData,
}: {
  navigateToIndex: (id: string) => void;
  navigateToPercentage: (id: string) => void;
  JSONData: JSONData;
}) {
  // const tablesService = new TablesService()
  const [tables, setTables] = useState<Array<Table>>([]);

  const addPercentRow = (tables: Array<Table>) => {
    return tables.map((table) => {
      const newTable = { ...table };
      const newRows = [table.rows[0]];

      for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const newRow = { ...row };
        newRow.columns = row.columns.map((col) => ({
          ...col,
          value: col.value_percent,
        }));
        newRows.push(row);
        newRows.push(newRow);
      }

      newTable.rows = newRows;
      return newTable;
    });
  };

  const addEmptyColumn = (tables: Array<Table>) => {
    return tables.map((table) => {
      const newTable = { ...table };
      newTable.rows.forEach((row, i) => {
        if (row.columns[0].group_name === "") {
          row.columns.shift();
        }
        row.columns.unshift({
          group_name: "",
          name: "",
          label: "",
          value: i === 0 || i % 2 !== 0 ? row.name : "",
          value_percent: "",
          value_subscript: "",
        });
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
      const processedTables = addEmptyColumn(
        addPercentRow(addTotalColumn(JSONData?.tables))
      );
      setTables(processedTables);
    }
  }, [JSONData]);

  return (
    <section>
      {/* <Button onClick={() => scrollTo(2)}>Scroll to 3rd</Button> */}
      {tables?.map((table, i) => {
        return (
          <DataTabulationGridComponent
            id={`poc-table-${i}`}
            key={i}
            table={table}
            navigateToIndex={navigateToIndex}
            navigateToPercentage={navigateToPercentage}
          />
        );
      })}
    </section>
  );
}

export default DataTabulationCountTableContainer;