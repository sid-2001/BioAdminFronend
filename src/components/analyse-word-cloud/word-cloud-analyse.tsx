import WordCloud from 'react-d3-cloud'
import { Grid, IconButton, Paper, Tooltip } from '@mui/material'
import './wordCloud.css'
import CustomDividerComponent from '../custom-divider'
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft'
import SwitchRightIcon from '@mui/icons-material/SwitchRight'
//@ts-ignore
import { saveSvgAsPng } from 'save-svg-as-png'
import { createRef } from 'react'
import { Download } from '@mui/icons-material'

const WordCloudAnalyse = ({ keywords, componentName, setToggleTopic, toggleTopic }: any) => {
  const filteredArray = keywords.filter((obj: any) => obj.value > 1)
  const wordcloudRef: any = createRef()

  const handleSave = () => {
    if (wordcloudRef?.current) {
      const svgElement = wordcloudRef?.current?.querySelector('svg')
      saveSvgAsPng(svgElement, !toggleTopic ? 'Wordcloud.png' : 'Topicscloud.png')
    }
  }

  return (
    <Paper
      className="word-cloud-paper-div"
      sx={{
        boxShadow: '0px 2px 8px rgba(149, 159, 163, 0.15), 2px 4px 12px 6px rgba(132, 145, 150, 0.2)',
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between" className="word-cloud-text-div" sx={{ marginBottom: '0.5rem' }}>
        <Grid item>
          <div className="word-cloud-text-div">{componentName}</div>
        </Grid>
        <Grid item alignItems="center" display="flex">
          <Tooltip title={!toggleTopic ? 'Download Word cloud' : 'Download Topics cloud'} placement="top">
            <IconButton
              sx={{ marginRight: '0.2rem' }}
              color="primary"
              onClick={() => {
                handleSave()
              }}
              size="small"
            >
              <Download fontSize="small" />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title={toggleTopic ? 'Word cloud' : 'Topics cloud'} placement="top"> */}
          {!toggleTopic ? (
            <Tooltip title={'Topics cloud'} placement="top">
              <SwitchLeftIcon
                style={{ cursor: 'pointer' }}
                color="primary"
                // size="small"
                // checked={toggleTopic}
                onClick={() => setToggleTopic(!toggleTopic)}
              />
            </Tooltip>
          ) : (
            <Tooltip title={'Word cloud'} placement="top">
              <SwitchRightIcon
                style={{ cursor: 'pointer' }}
                color="primary"
                // size="small"
                // checked={toggleTopic}
                onClick={() => setToggleTopic(!toggleTopic)}
              />
            </Tooltip>
          )}
          {/* </Tooltip> */}
        </Grid>
      </Grid>
      <CustomDividerComponent />
      <div ref={wordcloudRef}>
        <WordCloud
          data={filteredArray}
          width={500}
          height={250}
          fontSize={(word) => word.value * 2}
          spiral="rectangular"
          rotate={() => 0}
          padding={2}
        />
      </div>
    </Paper>
  )
}

export default WordCloudAnalyse
