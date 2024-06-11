// import { styled } from "@mui/material/styles";
// import TextField from "@mui/material/TextField";

// export const StyledTextField = styled(TextField)(() => ({
//   "& .MuiInputBase-input": {
//     // color: theme.palette.grey[800],
//     fontWeight: 400,
//     fontSize: "1rem",
//     lineHeight: "140%",
//     fontFamily: "Inter, sans-serif",
//   },
//   "& .MuiFormLabel-root": {
//     marginTop: "0.1875rem",
//     // color: theme.palette.grey[500],
//     height: "0.9375rem",
//     fontWeight: 400,
//     fontSize: "0.75rem",
//     lineHeight: "0.9375rem",
//     letterSpacing: "0.02em",
//     width: "100%",
//   },
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "0.5rem",
//     width: "100%",
//     minHeight: "2.5rem",
//   },
//   "& label.Mui-focused": {
//     // color: theme.palette.grey[500],
//   },
//   "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
//     // borderColor: theme.palette.grey[800],
//   },
//   "&.Mui-focused .MuiFormLabel-root": {},
//   "& .MuiInputBase-input::placeholder": {
//     fontWeight: 400,
//     fontSize: "1rem",
//     lineHeight: "140%",
//     // color: theme.palette.grey[500],
//   },
// }));


import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import { theme as themes } from '@/constants/theme';

// const blue = {
//   100: '#DAECFF',
//   200: '#b6daff',
//   400: '#3399FF',
//   500: '#007FFF',
//   600: '#0072E5',
//   900: '#003A75',
// };

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

export const StyledTextField = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  // box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${themes.palette.primary.main};
  }

  &:focus {
    border-color: ${themes.palette.primary.main};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? themes.palette.primary.main : themes.palette.primary[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);