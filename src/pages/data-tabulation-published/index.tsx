import * as React from "react"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

import DataTabulationPercentTableComponent from "./dataTabulationPercentTablePublishedComponent"
import DataTabulationCountTableListContainer from "./dataTabulationCountTableListPublishedContainer"
import TablesListContainer from "./tablesListContainer"
import { JSONData } from "@/types/project-data.type"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, overflow: "auto", width: "calc(100vw - 120px)" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

function DataTabulationPage({ JSONData }: { JSONData: JSONData }) {
  const [value, setValue] = React.useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  // function changeTab(_rowId: number, colId: number) {
  //   if (colId === 0) {
  //     setValue(1)
  //   }
  // }

  function changeTab(_rowId: number, colId: number) {
    switch (colId) {
      case 0:
        setValue(1)
        break
      case 1:
        setValue(2)
        break
      default:
        break
    }
  }

  return (
    <Box
      sx={{
        background: "white",
        borderRadius: "12px",
        height: "calc(100vh - 345px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label='Index' {...a11yProps(0)} />
          <Tab label='Counts' {...a11yProps(1)} />
          <Tab label='Percentage' {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Box sx={{ flex: "1", overflow: "auto" }}>
        <CustomTabPanel value={value} index={0}>
          <TablesListContainer
            linkClickHandler={changeTab}
            JSONData={JSONData}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <DataTabulationCountTableListContainer JSONData={JSONData} useNested={false} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <DataTabulationPercentTableComponent JSONData={JSONData} useNested={false} />
        </CustomTabPanel>
      </Box>
    </Box>
  )
}

export default DataTabulationPage
