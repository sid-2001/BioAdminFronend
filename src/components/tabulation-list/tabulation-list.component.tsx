import {
  Button,
  FormControl,
  //   Grid,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material"
import { TabulationListComponentProps } from "./tabulation-list.type"
import { DetailsBox, SearchInput } from "./tabulation-list.style"
import { Search } from "@mui/icons-material"
import { theme } from "@/constants/theme"
import { useEffect, useState } from "react"
import { Table } from "@/types/project-data.type"

const TabulationListComponent = ({
  JSONData,
  navigateToIndex,
  tabValue,
  fullViewMode,
}: TabulationListComponentProps) => {
  const [filterList, setFilterList] = useState<string[]>([])
  const [filter, setFilter] = useState<string>("Base : All Respondents")
  const [filterData, setFilterData] = useState<Table[]>([])
  const [search, setSearch] = useState<string>("")
  const [index, setIndex] = useState<Number | null>(null)

  useEffect(() => {
    let filterListData: string[] = []
    JSONData.tables.map((val) => {
      if (!filterListData.includes(val.base_name)) {
        filterListData.push(String(val.base_name))
      }
    })
    setFilterList(filterListData)
  }, [JSONData])

  useEffect(() => {
    if (search.length >= 2) {
      let data = JSONData.tables.filter((value) => {
        if (value.question_id.toLowerCase().includes(search.toLowerCase())) {
          return true
        }
      })
      setFilterData(data)
    } else {
      setFilterData(JSONData.tables)
    }
  }, [JSONData, search])

  useEffect(() => {
    setIndex(null)
  }, [tabValue, filter, search])

  function truncateText(text: string, length: number) {
    if (text?.length <= length) {
      return text
    }
    return `${text.substr(0, length)}...`
  }
  return (
    <DetailsBox>
      <Stack
        sx={{
          paddingTop: "1rem",
        }}
        spacing={1}
      >
        <Typography variant='h6'>Tables Index</Typography>
        <SearchInput
          size='small'
          placeholder='Search here'
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{ color: theme.palette.grey[400] }} />
              </InputAdornment>
            ),
          }}
        />
        <Stack spacing={0.5} sx={{ marginTop: "0.3rem" }}>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography sx={{ fontSize: "14px", fontWeight: 700 }}>
              Base:
            </Typography>
            <Button
              variant='text'
              size='small'
              onClick={() => {
                setFilter("")
              }}
            >
              Clear Filters
            </Button>
          </Stack>
          <FormControl fullWidth>
            <Select
              value={filter}
              label=''
              variant='standard'
              size='small'
              onChange={(e) => {
                setFilter(e.target.value)
              }}
            >
              {filterList && filterList.map((val) => (
                <MenuItem value={val}>{val}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      <Stack
        marginTop='1rem'
        sx={{
          height: fullViewMode ? "calc(100vh - 295px)" : "calc(100vh - 507px)",
          overflow: "auto",
        }}
      >
        {filterData
          .filter((value) => {
            if (filter === "") {
              return true
            } else if (value.base_name === filter) {
              return true
            }
          })
          .map((value: any, i) => {
            return (
              // <Tooltip title={value.question_text} placement='bottom-start'>
              <Stack
                key={i}
                onClick={() => {
                  if (tabValue === 1) {
                    navigateToIndex(value.index)
                    setIndex(value.index)
                  } else {
                    navigateToIndex(value.index)
                    setIndex(value.index)
                  }
                }}
                direction='row'
                justifyContent='space-between'
                sx={{
                  padding: "0.5rem",
                  background:
                    index !== null && index === value.index ? "#E4E4E4" : "",
                  "&:hover": {
                    background: "#E4E4E4",
                    cursor: "pointer",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#212121",
                  }}
                >
                  {truncateText(value.question_id, 18)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#7A7A7A",
                  }}
                >
                  {value.base_value}
                </Typography>
              </Stack>
              // </Tooltip>
            )
          })}
      </Stack>
    </DetailsBox>
  )
}

export default TabulationListComponent
