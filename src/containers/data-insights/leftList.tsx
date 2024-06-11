import {
  Button,
  FormControl,
  //   Grid,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DetailsBox,
  SearchInput,
} from "@/components/tabulation-list/tabulation-list.style";
import { Search } from "@mui/icons-material";
import { theme } from "@/constants/theme";
import { useEffect, useState } from "react";
import { SurveyData, Question } from "@/types/data-insights.type";

interface LeftListPropTypes {
  data: SurveyData;
  fullViewMode: boolean;
  slideTo: (index: number) => void;
  activeIndex?: number;
}

const LeftList = ({
  data,
  slideTo,
  fullViewMode,
  activeIndex,
}: LeftListPropTypes) => {
  const [filterList, setFilterList] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("Base : All Respondents");
  const [filterData, setFilterData] = useState<Array<Question>>([]);
  const [search, setSearch] = useState<string>("");
  //   const [index, setIndex] = useState<Number | null>(null)
  const [oragnisedData, _setOrganisedData] = useState<Array<Question>>(data && processGroupedQuestions(data?.questions));


  function processGroupedQuestions(data: Question[]) {
    return data?.map((item, index) => {
      if (item.group && item.group.length) {
        // Combine question IDs
        // const question_id = `Respondent ${index + 1}`

        const respondent_name = `Respondent Profile ${index + 1}`
        const question_id = item.group.map((q: { question_id: any; }) => q.question_id).join('_');

        // Combine question labels
        const question_label = item.group.map((q: { question_label: any; }) => q.question_label).join(' | ');

        return {
          ...item?.group[0],
          question_id,
          question_label,
          respondent_name,
          grouped: true,
        };
      } else {
        // Return the item unchanged if there's no group
        return item;
      }
    });
  }

  // console.log(data && processGroupedQuestions(data?.questions), "processGroupedQuestionsprocessGroupedQuestions", data)

  useEffect(() => {
    const filterListData = new Set<string>();

    oragnisedData?.forEach((question) =>
      filterListData?.add(question.base_name)
    );

    setFilterList(Array.from(filterListData));
  }, [oragnisedData]);

  useEffect(() => {
    if (search.length >= 2) {
      const temp = oragnisedData?.filter((value) => {
        if (
          value?.question_id?.toLowerCase()?.includes(search?.toLowerCase()) ||
          value?.question_label?.toLowerCase()?.includes(search?.toLowerCase())
        ) {
          return true;
        }
      });
      setFilterData(temp);
    } else {
      setFilterData(oragnisedData);
    }
  }, [search]);

  useEffect(() => {
    // setIndex(null)
  }, [filter, search]);

  function truncateText(text: string, length: number) {
    if (text?.length <= length) {
      return text;
    }
    return `${text?.substr(0, length)}...`;
  }

  console.log(filterList, "filterListfilterList", filterData, oragnisedData, oragnisedData)
  return (
    <DetailsBox>
      <Stack
        sx={{
          paddingTop: "1rem",
        }}
        spacing={1}
      >
        <Typography variant="h6">Questions</Typography>
        <SearchInput
          size="small"
          placeholder="Search here"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: theme.palette.grey[400] }} />
              </InputAdornment>
            ),
          }}
        />
        <Stack spacing={0.5} sx={{ marginTop: "0.3rem" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography sx={{ fontSize: "14px", fontWeight: 700 }}>
              Base:
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setFilter("");
              }}
            >
              Clear Filters
            </Button>
          </Stack>
          <FormControl fullWidth>
            <Select
              value={filter}
              label=""
              variant="standard"
              size="small"
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            >
              {filterList?.map((val, i) => (
                <MenuItem key={i} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      <Stack
        marginTop="1rem"
        sx={{
          height: fullViewMode ? "calc(100vh - 295px)" : "calc(100vh - 487px)",
          overflow: "auto",
        }}
      >
        {filterData?.filter((value) => {
          if (filter === "") {
            return true;
          } else if (value.base_name === filter) {
            return true;
          }
        })
          .map((value, i) => {
            return (
              // <Tooltip title={value.question_text} placement='bottom-start'>
              <Tooltip title={value?.grouped ? 'Respondent Profile' : value.question_title_generated ? value?.question_title_generated : value.question_title ? value?.question_title : value.question_id ? value?.question_id : ''} placement="right" >
                <Stack
                  key={i}
                  direction="row"
                  justifyContent="space-between"
                  onClick={() => slideTo(i)}
                  sx={{
                    padding: "0.5rem",
                    background: activeIndex === i ? "#E4E4E4" : "",
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
                    {truncateText(value.respondent_name || value.question_id, 20)}
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
              </Tooltip>
            );
          })}
      </Stack>
    </DetailsBox >
  );
};

export default LeftList;
