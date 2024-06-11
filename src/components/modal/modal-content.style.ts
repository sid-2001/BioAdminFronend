import styled from "styled-components";
 
export const PageWrapper = styled.section(({}) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));
 
export const Content = styled.main(({}) => ({
  height: "fit-content",
  width: "40rem",
  left: "40rem",
  top: "7.8125rem",
  borderRadius: "1.5rem",
  padding: "2rem",
  backgroundColor: "#fff",
}));