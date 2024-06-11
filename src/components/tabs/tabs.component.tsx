import * as React from 'react'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import { TabProps, TabPanelProps } from './tabs.type'
import { StyledTabs } from './tabs.style'
import { useLocation, useNavigate } from 'react-router-dom'
// import { Stack } from "@mui/material";
import { theme } from '@/constants/theme'

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div style={{ marginTop: '1rem' }} role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <>{children}</>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

const TabsComponent = (props: TabProps) => {
  let navigate = useNavigate()

  const { labels, tabpanels, setValue, value } = props

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  let location = useLocation()

  return (
    <Box sx={{ width: '100%' }}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        sx={{ minHeight: '0px' }}
        TabIndicatorProps={{
          style: {
            display: 'none',
          },
        }}
      >
        {labels.map(({ label, route, isDisabled }, index) => {
          return (
            <Tab
              sx={{
                minHeight: '30px',
                height: '30px',
                paddingInline: '10px !important',
                borderRadius: '0.5rem',
                backgroundColor: route && route === location.pathname ? theme.palette.grey[400] : value === index ? theme.palette.grey[400] : '',
                color: 'black !important',

                '&:hover': {
                  backgroundColor: theme.palette.grey[400],
                  color: 'black',
                },
              }}
              key={index}
              label={label}
              disabled={isDisabled}
              onClick={() => {
                if (route) {
                  navigate(route)
                }
              }}
              {...a11yProps(index)}
            />
          )
        })}
      </StyledTabs>
      <TabPanel value={value} index={value}>
        {tabpanels}
      </TabPanel>
    </Box>
  )
}

export default TabsComponent
