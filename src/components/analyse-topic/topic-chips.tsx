import './topicChips.css'
import { Box, Chip, Paper, Typography } from '@mui/material'
import TagFacesIcon from '@mui/icons-material/TagFaces'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import CustomDividerComponent from '../custom-divider'

const TopicChips = ({ topics, setSelectedTopic, topicsClass, selectedTopic }: any) => {
  const colorComination = (sentiment_score: any, sentiment_classFilter: any) => {
    if (sentiment_classFilter === 'positive' || sentiment_classFilter === '	neutral') {
      if (sentiment_score > 100 || sentiment_score > 90) {
        return 1
      } else if (sentiment_score > 80) {
        return 0.9
      } else if (sentiment_score > 70) {
        return 0.8
      } else if (sentiment_score > 60) {
        return 0.7
      } else if (sentiment_score > 50) {
        return 0.6
      } else if (sentiment_score > 40) {
        return 0.5
      } else if (sentiment_score > 10) {
        return 0.4
      }
    } else {
      let score = sentiment_score - 100
      if (score > 80) {
        return 0.4
      } else if (score > 50) {
        return 0.5
      } else if (score > 40) {
        return 0.6
      } else if (score > 30) {
        return 0.7
      } else if (score > 20) {
        return 0.8
      } else if (score > 10) {
        return 0.9
      } else if (score < 10) {
        return 1
      }
    }
  }

  return (
    <Paper
      className="topic-chip-main-div"
      sx={{
        boxShadow: '0px 2px 8px rgba(149, 159, 163, 0.15), 2px 4px 12px 6px rgba(132, 145, 150, 0.2)',
      }}
    >
      <div className="topic-text-div" style={{ marginBottom: '0.5rem' }}>
        Topics
      </div>
      <CustomDividerComponent />
      <Box
        sx={{
          marginTop: '0.5rem',
        }}
      >
        {topics?.filter((value: any) => {
          if (topicsClass === 'all') {
            return true
          } else if (value.sentiment_classFilter === topicsClass) {
            return true
          } else {
            return false
          }
        })?.length > 0 ? (
          topics
            ?.filter((value: any) => {
              if (topicsClass === 'all') {
                return true
              } else if (value.sentiment_classFilter === topicsClass) {
                return true
              } else {
                return false
              }
            })
            .map((value: any, i: number) => {
              return (
                <Chip
                  onClick={() => {
                    if (selectedTopic && selectedTopic.topics === value.topics) {
                      setSelectedTopic(null)
                    } else {
                      setSelectedTopic(value)
                    }
                  }}
                  icon={
                    value.sentiment_classFilter === 'positive' ? (
                      <TagFacesIcon />
                    ) : value.sentiment_classFilter === 'negative' ? (
                      <SentimentVeryDissatisfiedIcon />
                    ) : (
                      <div></div>
                    )
                  }
                  label={value.topics}
                  key={i}
                  color={value.sentiment_classFilter === 'positive' ? 'success' : value.sentiment_classFilter === 'negative' ? 'error' : 'default'}
                  variant="outlined"
                  sx={{
                    color: value.sentiment_classFilter === 'neutral' ? 'grey !important' : '',
                    boxShadow: selectedTopic?.topics === value.topics ? 'rgba(0, 0, 0, 0.24) 0px 3px 8px' : '',
                    margin: '2px',
                    opacity: colorComination(value.sentimentAllScore, value.sentiment_classFilter),
                  }}
                />
              )
            })
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <Typography variant="h5">No Topics</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default TopicChips
