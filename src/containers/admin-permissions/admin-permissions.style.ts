import { styled } from "@mui/material/styles";
import { Typography, TableCell, Box } from "@mui/material";
import { styled as styles } from "styled-components";

export const PageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: "700",
    color: theme.palette.primary.dark,
    lineHeight: "140%",
    fontSize: "1.5rem",
    marginBottom: "1rem",
}));

export const CenteredContainer = styles.div`
display: flex;
justify-content: center;
align-items: center;
position: fixed;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
`;

export const StyledHeadTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: "140%",
    color: theme.palette.grey[600],
    borderRight: `1px solid ${theme.palette.grey[300]}`,
    width: "25%"
}));

export const StyledRolesHeadTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: "140%",
    color: theme.palette.grey[600],
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "400",
    fontSize: 14,
    lineHeight: "140%",
    color: theme.palette.grey[800],
}));

export const DetailsBox = styles(Box)(({ }) => ({
    boxSizing: "border-box",
    maxWidth: "99rem",
    padding: "2rem",
    background: "#FFFFFF",
    borderRadius: "1rem",
    transition: "box-shadow 0.3s ease-in-out",

    // "&:hover": {
    boxShadow:
        "0rem 0rem 0.125rem rgba(145, 158, 171, 0.15), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.2)",
    // },
}));


export const ScrollableTableContainer = styled(DetailsBox)`
  max-height: calc(100vh - 165px);
  max-width: 100%;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  `;
