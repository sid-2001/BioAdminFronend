import { useEffect, useState } from 'react'
import './viewAnalyse.css'
import {
  // Backdrop,
  Box,
  // Button,
  Chip,
  // CircularProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material'
import ViewTable from '@/components/anlaysis-view-table'
import TopicChips from '@/components/analyse-topic'
import WordCloudAnalyse from '@/components/analyse-word-cloud'
import { AnalysisData } from '@/types/project-data.type'
import CustomDividerComponent from '@/components/custom-divider'
import FilterListIcon from '@mui/icons-material/FilterList'

interface ViewAnalyseProps {
  data: AnalysisData[]
  questionName: string | undefined
  fullViewMode: boolean
}

interface keywordsProps {
  text: string
  value: number
}

const ViewAnalyse = ({ data, questionName, fullViewMode }: ViewAnalyseProps) => {
  const [topics, setTopics] = useState<any>([])
  const [keywords, setKeyWords] = useState<keywordsProps[]>([])

  const [topicKeywords, setTopicKeyWords] = useState<keywordsProps[]>([])

  const [toggleTopic, setToggleTopic] = useState<boolean>(false)

  const [selectedTopic, setSelectedTopic] = useState<any>(null)
  const [topicPercentage, setTopicPercentage] = useState(0)
  const [topicsClass, setTopicClass] = useState('all')
  const [analyseListView, setAnalyseListView] = useState<AnalysisData[]>([])
  const [filterList, setFilterList] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  // const [isLoading, setIsLoading] = useState(false)
  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    setAnalyseListView(data)
  }, [data])

  useEffect(() => {
    let key_words: any = []

    let topic_key_words: any = []

    let data: any = []
    let sentimentScoreMap: any = {}
    let sentimentClassMap: any = {}
    let topicKeywords: any = []
    // console.log(topicKeywords, "qwertyuitopicKeywordstopicKeywordstopicKeywords")

    // array && Array.isArray(array) && array.length > 0)
    if (analyseListView && Array.isArray(analyseListView) && analyseListView.length > 0) {
      analyseListView?.length &&
        analyseListView?.map((value: any) => {
          key_words = [...key_words, ...value.keywords]

          topic_key_words = [...topic_key_words, ...value?.topics]

          data = [...data, ...value.topics]
          if (
            value?.topics
            // && Array.isArray(value?.topics) && value?.topics.length > 0
          ) {
            value?.topics?.map((val: any) => {
              let resutSentimentScore = []
              let resultSentimentClass = []
              resutSentimentScore.push(value.sentiment_score)
              resultSentimentClass.push(value.sentiment_class)

              // console.log(topicKeywords, val, topicKeywords[val], value, "topicKeywordstopicKeywordstopicKeywords")

              if (topicKeywords[val] && value.keywords && Array.isArray(value.keywords) && value.keywords.length > 0) {
                topicKeywords[val] = [...topicKeywords[val], ...value.keywords]
              } else if (topicKeywords && topicKeywords[val]) {
                topicKeywords[val] = [...value.keywords]
              }

              if (sentimentScoreMap[val]) {
                sentimentScoreMap[val] = [...sentimentScoreMap[val], ...resutSentimentScore]
              } else {
                sentimentScoreMap[val] = [...resutSentimentScore]
              }

              if (sentimentClassMap[val]) {
                sentimentClassMap[val] = [...sentimentClassMap[val], ...resultSentimentClass]
              } else {
                sentimentClassMap[val] = [...resultSentimentClass]
              }
            })
          }
          return
        })
    }

    let arrayTopics: any = []
    for (const no in sentimentScoreMap) {
      if (sentimentScoreMap[no].length > 0) {
        arrayTopics.push({
          topics: no,
          sentiment_score: sentimentScoreMap[no],
        })
      }
    }

    const countMap: any = {}
    data.forEach((str: any) => {
      if (countMap[str]) {
        countMap[str]++
      } else {
        countMap[str] = 1
      }
    })

    arrayTopics.map((value: any) => {
      if (
        Object.keys(sentimentClassMap).includes(value.topics) ||
        Object.keys(countMap).includes(value.topics) ||
        Object.keys(topicKeywords).includes(value.topics)
      ) {
        value.sentiment_class = sentimentClassMap[value.topics]
        value.value = countMap[value.topics]
        value.keyWords = topicKeywords[value.topics]
        return value
      }
    })

    arrayTopics.map((value: any) => {
      value?.sentiment_score.sort(function (a: any, b: any) {
        return a - b
      })
      if (value?.sentiment_score.length === 1) {
        value.sentimentAllScore = value?.sentiment_score[0] * 100
      } else {
        let index = Math.ceil(value?.sentiment_score.length / 2)
        value.sentimentAllScore = value?.sentiment_score[index] * 100
      }

      //class calculate
      let positiveCount = 0
      let negativeCount = 0
      let neutralCount = 0
      value.sentiment_class.map((val: any) => {
        if (val === 'positive') {
          positiveCount = positiveCount + 1
        } else if (val === 'negative') {
          negativeCount = negativeCount + 1
        } else if (val === 'neutral') {
          neutralCount = neutralCount + 1
        }
      })
      if (neutralCount > positiveCount && neutralCount >= negativeCount) {
        value.sentiment_classFilter = 'neutral'
      } else if (positiveCount >= neutralCount && positiveCount >= negativeCount) {
        value.sentiment_classFilter = 'positive'
      } else {
        value.sentiment_classFilter = 'negative'
      }

      return value
    })

    setTopics(arrayTopics)

    const keyWordsCountMap: any = {}
    key_words.forEach((str: any) => {
      if (keyWordsCountMap[str]) {
        keyWordsCountMap[str]++
      } else {
        keyWordsCountMap[str] = 1
      }
    })

    let duplicateKeyWords: any = []
    for (const key in keyWordsCountMap) {
      if (keyWordsCountMap[key] > 0) {
        duplicateKeyWords.push({
          text: key,
          value: keyWordsCountMap[key],
        })
      }
    }
    setKeyWords(duplicateKeyWords)

    const topicskeyWordsCountMap: any = {}
    topic_key_words.forEach((str: any) => {
      if (topicskeyWordsCountMap[str]) {
        topicskeyWordsCountMap[str]++
      } else {
        topicskeyWordsCountMap[str] = 1
      }
    })

    let duplicateTopicsKeyWords: any = []
    for (const key in topicskeyWordsCountMap) {
      if (topicskeyWordsCountMap[key] > 0) {
        duplicateTopicsKeyWords.push({
          text: key,
          value: topicskeyWordsCountMap[key],
        })
      }
    }
    // console.log(duplicateKeyWords, duplicateTopicsKeyWords, "duplicateTopicsKeyWordsduplicateTopicsKeyWordsduplicateTopicsKeyWords")
    setTopicKeyWords(duplicateTopicsKeyWords)

    let sentimentClassesArray: any = []
    analyseListView.map((val: any) => {
      if (!sentimentClassesArray.includes(val.sentiment_class)) {
        sentimentClassesArray.push(val.sentiment_class)
      }
    })
    setFilterList(sentimentClassesArray)
  }, [analyseListView])

  useEffect(() => {
    if (selectedTopic) {
      selectedTopic?.sentiment_score.sort(function (a: any, b: any) {
        return a - b
      })
      if (selectedTopic?.sentiment_score.length === 1) {
        setTopicPercentage(selectedTopic?.sentiment_score[0] * 100)
      } else {
        let index = Math.ceil(selectedTopic?.sentiment_score.length / 2)
        setTopicPercentage(selectedTopic?.sentiment_score[index] * 100)
      }
      // console.log(selectedTopic, topics, selectedTopic?.keyWords, "selectedTopic?.keyWordsselectedTopic?.keyWords")
      // const keyWordsCountMap: any = {}
      // Array.isArray(selectedTopic?.keyWords) && selectedTopic?.keyWords?.forEach((str: any) => {
      //   if (keyWordsCountMap[str]) {
      //     keyWordsCountMap[str]++
      //   } else {
      //     keyWordsCountMap[str] = 1
      //   }
      // })

      // let duplicateKeyWords = []
      // for (const key in keyWordsCountMap) {
      //   if (keyWordsCountMap[key] > 0) {
      //     duplicateKeyWords.push({
      //       text: key,
      //       value: keyWordsCountMap[key],
      //     })
      //   }
      // }
      // setKeyWords(duplicateKeyWords)

      // let keyWordsTopics = selectedTopic?.topics.split(' ')

      // const topicskeyWordsCountMap: any = {}
      // keyWordsTopics && keyWordsTopics?.forEach((str: any) => {
      //   if (topicskeyWordsCountMap[str]) {
      //     topicskeyWordsCountMap[str]++
      //   } else {
      //     topicskeyWordsCountMap[str] = 1
      //   }
      // })

      // let duplicateTopicsKeyWords = []
      // for (const key in topicskeyWordsCountMap) {
      //   if (topicskeyWordsCountMap[key] > 0) {
      //     duplicateTopicsKeyWords.push({
      //       text: key,
      //       value: topicskeyWordsCountMap[key],
      //     })
      //   }
      // }
      // setTopicKeyWords(duplicateTopicsKeyWords)
    }
  }, [selectedTopic])

  useEffect(() => {
    if (selectedTopic === null) {
      let key_words: any = []

      let topic_key_words: any = []

      analyseListView?.map((value: any) => {
        key_words = [...key_words, ...value.keywords]

        topic_key_words = [...topic_key_words, ...value?.topics]
      })

      const keyWordsCountMap: any = {}
      key_words.forEach((str: any) => {
        if (keyWordsCountMap[str]) {
          keyWordsCountMap[str]++
        } else {
          keyWordsCountMap[str] = 1
        }
      })

      let duplicateKeyWords: any = []
      for (const key in keyWordsCountMap) {
        if (keyWordsCountMap[key] > 0) {
          duplicateKeyWords.push({
            text: key,
            value: keyWordsCountMap[key],
          })
        }
      }
      setKeyWords(duplicateKeyWords)

      const topicskeyWordsCountMap: any = {}
      topic_key_words.forEach((str: any) => {
        if (topicskeyWordsCountMap[str]) {
          topicskeyWordsCountMap[str]++
        } else {
          topicskeyWordsCountMap[str] = 1
        }
      })

      let duplicateTopicsKeyWords: any = []
      for (const key in topicskeyWordsCountMap) {
        if (topicskeyWordsCountMap[key] > 0) {
          duplicateTopicsKeyWords.push({
            text: key,
            value: topicskeyWordsCountMap[key],
          })
        }
      }
      setTopicKeyWords(duplicateTopicsKeyWords)
    }
  }, [topicsClass, selectedTopic])

  function truncateText(text: string, length: number) {
    if (text?.length <= length) {
      return text
    }
    return `${text.substr(0, length)}...`
  }
  // console.log(topics, "topicstopicstopics")
  return (
    <div className="viewAnalyse-main" style={{ padding: '10px' }}>
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color='inherit' />
      </Backdrop> */}
      <Grid container spacing={2}>
        <Grid item sm={12} xs={12} md={8}>
          <ViewTable analyseListView={analyseListView} selectedTopic={selectedTopic} questionName={questionName} fullViewMode={fullViewMode} />
        </Grid>
        <Grid item sm={12} xs={12} md={4}>
          <Box>
            <Box className="group-button-div" marginBottom="0.7rem">
              <Stack direction="row" spacing={2} alignItems="center">
                <Tooltip title={selectedTopic?.topics.length > 15 ? selectedTopic?.topics : ''}>
                  <div className="topic-text-div">{truncateText(selectedTopic?.topics ? selectedTopic?.topics : '', 15)}</div>
                </Tooltip>
                {selectedTopic && (
                  <div
                    className="percente-div"
                    style={{
                      borderColor: selectedTopic.sentiment_classFilter === 'negative' ? '#F0686D' : '',

                      color: selectedTopic.sentiment_classFilter === 'negative' ? '#F0686D' : '',
                    }}
                  >
                    {topicPercentage.toFixed()}%
                  </div>
                )}
              </Stack>
              <Stack>
                <div>
                  <Chip label={topicsClass?.charAt(0).toUpperCase() + topicsClass?.slice(1)} />
                  <IconButton onClick={handleClick}>
                    <FilterListIcon />
                  </IconButton>
                </div>
                <Menu
                  autoFocus={true}
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setSelectedTopic(null)
                      setTopicClass('all')
                      handleClose()
                    }}
                  >
                    All
                  </MenuItem>
                  {filterList.map((val: any) => {
                    return (
                      <MenuItem
                        onClick={() => {
                          setSelectedTopic(null)
                          setTopicClass(val)
                          handleClose()
                        }}
                      >
                        {val.charAt(0).toUpperCase() + val.slice(1)}
                      </MenuItem>
                    )
                  })}
                </Menu>
              </Stack>
              {/* <Stack direction="row" spacing={0.5}>
                <Button
                  size="small"
                  sx={{
                    borderRadius: '20px !important',
                    background: topicsClass === 'all' ? 'black !important' : '',
                  }}
                  variant={topicsClass === 'all' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelectedTopic(null)
                    setTopicClass('all')
                  }}
                >
                  All
                </Button>
                <Button
                  size="small"
                  sx={{
                    borderRadius: '20px !important',
                    background: topicsClass === 'negative' ? 'black !important' : '',
                  }}
                  variant={topicsClass === 'negative' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelectedTopic(null)
                    setTopicClass('negative')
                  }}
                >
                  Negative
                </Button>
                <Button
                  size="small"
                  sx={{
                    borderRadius: '20px !important',
                    background: topicsClass === 'positive' ? 'black !important' : '',
                  }}
                  variant={topicsClass === 'positive' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelectedTopic(null)
                    setTopicClass('positive')
                  }}
                >
                  Positive
                </Button>
              </Stack> */}
            </Box>
            <CustomDividerComponent />
            <div
              className="topic-and-worldcloud-div"
              // style={{ marginTop: "0.7rem" }}
              style={{
                // @ts-ignore
                '&::-webkit-scrollbar': {
                  width: 6,
                },
                overflow: 'auto',
                // height: fullViewMode ? "calc(100vh - 220px)" : "635px",
                height: fullViewMode ? 'calc(100vh - 220px)' : 'calc(100vh - 380px)',
                marginTop: '0.7rem',
                // boxShadow:
                //   "0px 2px 8px rgba(149, 159, 163, 0.15), 2px 4px 12px 6px rgba(132, 145, 150, 0.2)",
              }}
            >
              <TopicChips topics={topics} setSelectedTopic={setSelectedTopic} topicsClass={topicsClass} selectedTopic={selectedTopic} />
              {toggleTopic ? (
                <WordCloudAnalyse keywords={topicKeywords} componentName={'Topics cloud'} setToggleTopic={setToggleTopic} toggleTopic={toggleTopic} />
              ) : (
                <WordCloudAnalyse keywords={keywords} componentName={'Word cloud'} setToggleTopic={setToggleTopic} toggleTopic={toggleTopic} />
              )}
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default ViewAnalyse
