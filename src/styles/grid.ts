import styled from "styled-components";
//
export const GridContainer = styled.article`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 294px);
  gap: 1.5rem;
  @media (max-width: 1550px) {
    grid-template-columns: repeat(auto-fit, 294px);
  }
`;

export const GridContainerClent = styled.article`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 250px);
  height: calc(-208px + 100vh);
  overflow-y: scroll;
  gap: 2rem;
  @media (max-width: 1550px) {
    grid-template-columns: repeat(auto-fit, 250px);
  }
`;

export const GridContainerProject = styled.article`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 294px);
  gap: 1.5rem;
  @media (max-width: 1550px) {
    grid-template-columns: repeat(auto-fit, 294px);
  }
`;

export const GridContainerProjectNew = styled.article`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 250px);
  gap: 2rem;
  height: calc(-208px + 100vh);
  overflow-y: scroll;
  @media (max-width: 1550px) {
    grid-template-columns: repeat(auto-fit, 250px);
  }
`;

export const GridContainerSurvey = styled.article`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  gap: 1.8rem;
  overflow-y: scroll;
  height: calc(-208px + 100vh);
  @media (max-width: 1550px) {
    grid-template-columns: repeat(auto-fit, 284px);
    gap: 2rem;
  }
  @media (max-width: 1850px) {
    grid-template-columns: repeat(auto-fit, 300px);
    gap: 5rem;
  }
`;

export const GridContainerUsers = styled.article`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12.5rem, 18.1rem));
  gap: 2rem;
  @media (max-width: 1550px) {
    grid-template-columns: repeat(auto-fit, minmax(12.5rem, 20.5rem));
  }
`;

export const GridContainerUsers1 = styled.article`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 250px);
  height: calc(-208px + 100vh);
  overflow-y: scroll;
  gap: 2rem;
  @media (max-width: 1550px) {
    grid-template-columns: repeat(auto-fit, 250px);
  }
`;
