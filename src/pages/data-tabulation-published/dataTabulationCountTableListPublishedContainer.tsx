import 'react-data-grid/lib/styles.css'
import './style.css'
// import { TablesService } from "./test.service"

// import DataGrid, { ColumnOrColumnGroup, RenderCellProps } from "react-data-grid"
import DataGrid from 'react-data-grid'
import { Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Popover, Tooltip, Typography } from '@mui/material'
import { useEffect, useState, useRef, memo, forwardRef, LegacyRef } from 'react'
import { Column, Table } from './table.type'
import { styled } from '@mui/material/styles'
// import { theme } from "@/constants/theme"
import { JSONData } from '@/types/project-data.type'
import { useLocation } from 'react-router-dom'
import { VariableSizeList, areEqual } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import memoize from 'memoize-one'
import InsightsIcon from '@mui/icons-material/Insights'
import { theme } from '@/constants/theme'
import ReactMarkdown from 'react-markdown'
interface GridComponentPropTypes {
  table: Table
  id: string
  navigateToIndex: (id: number) => void
  navigateToPercentage?: (id: number) => void
  useNested: boolean
}

const StyledText = styled(Typography)(() => ({
  fontFamily: 'Calibri',
  fontWeight: 700,
  fontSize: '18px',
  marginBottom: '0rem',
}))

function CellRenderer(row: any, keyVal: number) {
  const valueAsString = String(row?.row[keyVal]?.value)
  const endsWithPercent = valueAsString?.endsWith('%')

  const location = useLocation()
  const lastHash = useRef('')

  function formatValue(value: string) {
    const num = parseFloat(value)
    if (!isNaN(num) && !endsWithPercent) {
      const decimalPart = (num.toString().split('.')[1] || '').length
      if (decimalPart > 0) {
        return num.toFixed(2)
      }
    }
    return value
  }

  useEffect(() => {
    if (location.hash) {
      lastHash.current = location.hash.slice(1)
    }

    if (lastHash.current && document.getElementById(lastHash.current)) {
      setTimeout(() => {
        document.getElementById(lastHash.current)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        lastHash.current = ''
      }, 100)
    }
  }, [location])

  return (
    <div
      style={{
        backgroundColor: row.rowIdx === 0 ? '#ddebf7' : '',
        display: 'flex',
        alignItems: 'center',
        justifyContent: row.column.idx == 0 ? 'flex-start' : 'flex-end',
        gap: '4px',
        fontWeight: row.rowIdx === 0 || row.column.idx == 0 ? '700' : 'normal',
        padding: '4px',
        fontSize: '16px',
        // width: "75px",
      }}
    >
      <Tooltip title={row?.row[keyVal]?.z_score || ''} arrow placement="top">
        {/* {row?.row[keyVal]?.value} */}
        {row?.row[keyVal]?.value ? formatValue(row.row[keyVal].value) : row?.row[keyVal]?.value}
      </Tooltip>

      {(endsWithPercent || row?.row[0].value == 'mean' || row?.row[0].value == 'std' || row?.row[0].value == 'sem') && (
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: '700',
            color: 'red',
          }}
        >
          {row?.row[keyVal]?.value_subscript}
        </Typography>
      )}
    </div>
  )
}


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



function getColumnSchema(table: Table) {
  const groupNames = [...new Set(table.rows[0].columns.map((col: any) => col.group_name))]

  const columnsLength = table.rows[0].columns.length

  let key = 0
  const newColumnSchema = []

  for (const group of groupNames) {
    const groupedCols = table.rows[0].columns.filter((col: any) => col.group_name === group)
    const obj: any = {
      name: group,
      children: [],
      headerCellClass: group === '' ? 'transparent' : 'blue',
      resizable: true,
    }
    let flag = false
    groupedCols.forEach((x: Column) => {
      if (x.name) flag = true
    })
    if (flag) {
      obj.children = groupedCols.map((x: Column) => {
        const keyVal = key % columnsLength
        key++
        return {
          name: x.name,
          headerCellClass: group === '' ? 'transparent' : 'blue',
          resizable: true,
          children: [
            {
              key: keyVal,
              headerCellClass: group === '' ? 'transparent' : 'blue',
              name: x.label,
              resizable: true,
              renderCell: (row: any) => CellRenderer(row, keyVal),
            },
          ],
        }
      })
    } else {
      obj.children = groupedCols.map((x: Column) => {
        const keyVal = key % columnsLength
        key++

        return {
          key: keyVal,
          headerCellClass: group === '' ? 'transparent' : 'blue',
          name: x.label,
          resizable: true,
          renderCell: (row: any) => CellRenderer(row, keyVal),
        }
      })
    }

    newColumnSchema.push(obj)
  }

  return newColumnSchema
}

function getRows(table: Table) {
  const columnsLength = table.rows[0].columns.length

  let col = 0
  const dataRows = table.rows.map((row: any) => {
    return row.columns.reduce((acc: any, cur: any) => {
      // const key = cur.name.split(" ").join("_")

      const key = col % columnsLength
      col++
      acc[key] = {
        value: cur.value,
        value_subscript: cur.value_subscript,
        z_score: cur?.z_score,
      }

      return acc
    }, {})
  })

  return dataRows
}

function DataTabulationGridComponent({ table, id, useNested }: GridComponentPropTypes) {
  const { table_name, question_id, question_text, analysis_text, notes_text } = table
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget)

    setAnchorEl(event.currentTarget)
    setShowInsights(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const [showInsights, setShowInsights] = useState(false)

  const open = Boolean(anchorEl)

  if (table && table.rows.length) {
    const columns = useNested ? getColumnSchemaNested(table) : getColumnSchema(table);
    const rows = getRows(table)

    const containsPattern = (item: string) => {
      const pattern = /^\*\*[^*]+\*\*:$/
      return pattern.test(item.trim())
    }

    const filteredInsightsData = (table as any)?.insights?.filter((item: string) => item !== '')

    return (
      <div
        style={{
          marginBottom: '3rem',
        }}
        id={id}
      >
        {/* <Grid container style={{ width: "50%" }}>
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
        </Grid> */}
        <StyledText variant="h3">{table_name}</StyledText>
        <StyledText variant="h3">
          {' '}
          {question_id} :{' '}
          {question_text.length > 100 ? (
            <Tooltip
              PopperProps={{
                container: document.querySelector('.fullscreen'),
              }}
              title={question_text}
            >
              <StyledText variant="h3">{question_text.substring(0, 100) + '...'}</StyledText>
            </Tooltip>
          ) : (
            question_text
          )}
        </StyledText>
        <StyledText
          variant="h3"
          style={{
            marginBottom: '4rem',
          }}
          dangerouslySetInnerHTML={{ __html: analysis_text }}
        />
        {/* {analysis_text} */}
        {/* </StyledText> */}
        <StyledText variant="h3">{notes_text}</StyledText>
        {filteredInsightsData && filteredInsightsData?.length > 0 && (
          <div style={{ zIndex: 9999 }}>
            <Box
              sx={{
                position: 'relative',
                marginBottom: '1rem',
              }}
            >
              <IconButton
                sx={{
                  borderRadius: '0.25rem',
                }}
                onClick={handleClick}
              >
                <InsightsIcon color="primary" />
              </IconButton>
              {showInsights ? (
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  // anchorOrigin={{
                  //   vertical: 'center',
                  //   horizontal: 'right',
                  // }}
                  // transformOrigin={{
                  //   vertical: 'center',
                  //   horizontal: 'right',
                  // }}
                  sx={{
                    maxHeight: '711px',
                    // overflowY: 'scroll',
                  }}
                  container={document.querySelector('.fullscreen')}
                >
                  <Box
                    sx={{
                      maxWidth: '60vw',
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      padding: '1rem',
                      zIndex: 3,
                      boxShadow: '0px 2px 4px 0px rgba(232, 204, 255, 0.12), 0px 4px 12px 0px rgba(228, 152, 255, 0.25)',
                    }}
                  >
                    <Box style={{ backgroundColor: '#ffffff !important' }}>
                      <Typography>Insights</Typography>
                      <List
                        sx={{
                          width: '100%',
                          bgcolor: 'background.paper',
                          gap: '0.5rem',
                        }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                      >
                        {filteredInsightsData &&
                          filteredInsightsData?.map((item: string) => (
                            <Box style={{ display: 'flex', alignItems: 'start' }}>
                              <ListItemButton style={{ display: 'flex', alignItems: 'start' }}>
                                {!containsPattern(item) && (
                                  <ListItemIcon>
                                    <InsightsIcon style={{ color: theme.palette.primary.main, marginTop: '0.3rem' }} />
                                  </ListItemIcon>
                                )}
                                <ListItemText style={{ color: 'black' }}>
                                  {/* {item} */}
                                  <ReactMarkdown>{item}</ReactMarkdown>
                                </ListItemText>
                              </ListItemButton>
                            </Box>
                          ))}
                      </List>
                    </Box>
                  </Box>
                </Popover>
              ) : null}
            </Box>
          </div>
        )}
        <DataGrid
          rowClass={() => 'row'}
          rows={rows}
          columns={columns}
          style={{
            height: 'fit-content',
          }}
        />
      </div>
    )
  }

  return null
  // return ""
}

// interface DataTabulationCountTableContainerPropTypes {}

const DataTabulationCountTablePublsihedContainer = forwardRef(function DataTabulationCountTableContainer(
  {
    JSONData, useNested
  }: {
    JSONData: JSONData
    useNested: boolean,
  },
  ref: LegacyRef<any>,
) {
  // const tablesService = new TablesService()

  const [tables, setTables] = useState<Array<Table>>([])
  console.log(useNested, "useNesteduseNested")

  const addPercentRow = (tables: Array<Table>) => {
    return tables.map((table) => {
      const newTable = { ...table }
      const newRows = [table.rows[0]]

      for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i]
        const newRow = { ...row }
        newRow.columns = row.columns.map((col) => ({
          ...col,
          value: col.value_percent,
        }))
        newRows.push(row)
        newRows.push(newRow)
      }

      newTable.rows = newRows
      return newTable
    })
  }

  const addEmptyColumn = (tables: Array<Table>) => {
    return tables.map((table) => {
      const newTable = { ...table }
      newTable.rows.forEach((row, i) => {
        if (row.columns[0].group_name === '') {
          row.columns.shift()
        }
        row.columns.unshift({
          group_name: '',
          name: '',
          label: '',
          value: i === 0 || i % 2 !== 0 ? row.name : '',
          value_percent: '',
          value_subscript: '',
        })
      })
      return newTable
    })
  }

  function addTotalColumn(tables: Array<Table>) {
    const newtables = tables.map((table) => {
      const newTable = { ...table }

      newTable.rows = newTable.rows.map((row) => {
        const newRow = { ...row }

        newRow.columns = newRow.columns.map((column, index) => {
          const newColumn = { ...column }

          if (index === 0 && newColumn.name === 'Total') {
            newColumn.group_name = '\u00A0\u00A0\u00A0\u00A0\u00A0' + newColumn.name + '\u00A0\u00A0\u00A0\u00A0\u00A0'
            // newColumn.label = newColumn.name;
            newColumn.name = ''
          }

          return newColumn
        })

        return newRow
      })

      return newTable
    })

    return newtables
  }

  useEffect(() => {
    if (JSONData?.tables) {
      const processedTables = addEmptyColumn(addPercentRow(addTotalColumn(JSONData?.tables)))
      setTables(processedTables)
    }
  }, [JSONData])

  const createItemData = memoize((items, toggleItemActive) => ({
    items,
    toggleItemActive,
  }))

  const TableWindow = memo((props: any) => {
    // Data passed to List as "itemData" is available as props.data
    const { items } = props.data
    const item = items[props.index]

    return (
      <div style={props.style} key={props.index}>
        <DataTabulationGridComponent
          key={props.index}
          id={`poc-table-${item?.table_name}`}
          table={item}
          navigateToIndex={() => { }}
          navigateToPercentage={() => { }}
          useNested={useNested}
        />
      </div>
    )
  }, areEqual)

  const itemData = createItemData(tables, null)

  return (
    <AutoSizer>
      {({ width, height }: any) => (
        <VariableSizeList
          ref={ref}
          height={height}
          itemCount={tables.length}
          itemData={itemData}
          estimatedItemSize={500}
          itemSize={(index: any) => {
            let table = tables[index]
            let rowCount = table.rows.length - 1 * 2 + 4 + 10

            return rowCount * 35
          }}
          width={width}
        >
          {TableWindow}
        </VariableSizeList>
      )}
    </AutoSizer>
  )
})

export default DataTabulationCountTablePublsihedContainer
