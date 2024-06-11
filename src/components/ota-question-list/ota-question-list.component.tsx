import {
  Button,
  // FormControl,
  InputAdornment,
  // MenuItem,
  // Select,
  Stack,
  Typography,
} from "@mui/material";
import { OtaQuestionListComponentProps } from "./ota-question-list.type";
import { DetailsBox, SearchInput } from "./ota-question-list.style";
import { Search } from "@mui/icons-material";
import { theme } from "@/constants/theme";
import { useEffect, useState } from "react";
import { OtaQuestions } from "@/types/project-ota.types";

const OtaQuestionListComponent = ({
  questionList,
  fullViewMode,
  setQuestionId,
}: OtaQuestionListComponentProps) => {
  const [_filterList, setFilterList] = useState<string[]>([]);
  const [_filter, setFilter] = useState<string>("Base : All Respondents");
  const [filterData, setFilterData] = useState<OtaQuestions[]>([]);
  const [search, setSearch] = useState<string>("");
  const [index, setIndex] = useState<Number | null>(null);

  useEffect(() => {
    if (questionList) {
      const filterListData = new Set<string>();
      questionList?.questions.map((val: any) => {
        if (!filterListData.has(val.base_name)) {
          filterListData.add(String(val.base_name));
        }
      });
      setFilterList(Array.from(filterListData));
      if (questionList?.questions?.length > 0) {
        setIndex(0);
        setQuestionId(questionList?.questions[0]?.question_id);
      }
    }
  }, [questionList]);

  useEffect(() => {
    if (questionList) {
      if (search.length >= 2) {
        let data = questionList?.questions?.filter((value) => {
          if (
            value.question_id.toLowerCase().includes(search.toLowerCase()) ||
            value.question_text.toLowerCase().includes(search.toLowerCase())
          ) {
            return true;
          }
        });
        setFilterData(data);
      } else {
        setFilterData(questionList?.questions);
      }
    }
  }, [search, questionList]);

  function truncateText(text: string, length: number) {
    if (text?.length <= length) {
      return text;
    }
    return `${text.substr(0, length)}...`;
  }
  return (
    <DetailsBox sx={{ height: fullViewMode ? "calc(100vh - 100px)" : "calc(100vh - 270px)" }}>
      <Stack
        sx={{
          paddingTop: "1rem"
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
                setIndex(null);
                setQuestionId(null);
              }}
            >
              Clear Filters
            </Button>
          </Stack>
          {/* <FormControl fullWidth>
            <Select
              value={filter}
              label=""
              variant="standard"
              size="small"
              onChange={(e) => {
                setFilter(e.target.value);
                setIndex(null);
                setQuestionId(null);
              }}
            >
              {filterList.map((val) => (
                <MenuItem value={val}>{val}</MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </Stack>
      </Stack>
      <Stack
        marginTop="1rem"
        sx={{
          height: fullViewMode ? "calc(100vh - 224px)" : "calc(100vh - 395px)",
          overflow: "auto",
        }}
      >
        {filterData
          // .filter((value) => {
          //   if (filter === "") {
          //     return true
          //   } else if (value.base_name === filter) {
          //     return true
          //   }
          // })
          .map((value, i) => {
            // console.log(index, i, "index === i ");
            return (
              <Stack
                key={i}
                onClick={() => {
                  setIndex(i);
                  setQuestionId(value.question_id);
                }}
                direction="row"
                justifyContent="space-between"
                sx={{
                  padding: "0.5rem",
                  background: index !== null && index === i ? "#E4E4E4" : "",
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
                {/* <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#7A7A7A",
                  }}
                >
                  {value.base_value}
                </Typography> */}
              </Stack>
            );
          })}
      </Stack>
    </DetailsBox>
  );
};

export default OtaQuestionListComponent;
