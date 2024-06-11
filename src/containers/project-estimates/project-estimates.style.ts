import { Box } from "@mui/system";
import { styled } from "styled-components";

export const DetailsBox = styled(Box)(({}) => ({
    boxSizing: "border-box",
    // maxWidth: "1584px",
    width: "100%",
    height: "calc(100vh - 230px)",
    // paddingBottom: "1rem",
    background: "transparent",
    // borderRadius: "1rem",
    // transition: "box-shadow 0.3s ease-in-out",
    marginBottom: "1rem",
    // boxShadow:
    //   "0rem 0rem 0.125rem rgba(145, 158, 171, 0.15), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.2)",
    overflow: "auto",
    // "&::-webkit-scrollbar": {
    //   width: "0.5em",
    // },
    // "&::-webkit-scrollbar-thumb": {
    //   backgroundColor: "transparent",
    // },
  }));

export const GridContainerProjectTable = styled.article`
  width: 100%;
  display: grid;
`;

export const GridContainerProject = styled.article`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16.5rem, 23.1rem));
  gap: 2rem;
  @media (max-width: 1550px) {
    grid-template-columns: repeat(auto-fit, minmax(12.5rem, 23.5rem));
  }
`;