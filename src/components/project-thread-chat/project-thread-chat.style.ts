import { styled } from "@mui/material/styles";
import { Box, Stack, Typography } from "@mui/material";

export const StyledStack = styled(Stack)`
  padding: 1.5rem;
  // width: 340px;
  padding: 1rem;
  margin: 0 1rem;
  height: 100%;
`;

export const InputContainer = styled(Box)(() => ({
  display: "flex",
}));

export const StyledTitle = styled(Typography)`
  color: var(--Grey-5, #323232);
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  width: 10.25rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
export const StyledContainer = styled(Stack)(({}) => ({
  flex: 1,
  padding: "0.3125rem 1rem",
  borderRadius: "4px",

  "& *": {
    border: "none !important",
    outline: "none !important",
    boxShadow: "none !important",
  },

  "& .ck-editor": {
    maxWidth: "500px"
  },

  "& .ck-editor .ck-insert-table-dropdown-grid-box": {
    border: "1px solid black !important"
  },

  "& .ck-editor__editable": {
    maxWidth: "600px",
    padding: "0 30px !important",
    maxHeight: "100px",
  },

  "& .ck-editor__editable table td": {
    border: "1px solid black !important"
  },

  "@media(min-width: 1048px)": {
    "& .ck-editor__editable": {
      maxWidth: "820px",
    },
  },

  "@media(min-width: 1390px)": {
    "& .ck-editor__editable": {
      maxWidth: "880px",
    },
  },

  "@media(min-width: 1512px)": {
    "& .ck-editor__editable": {
      maxWidth: "950px",
    },
  },
}));
