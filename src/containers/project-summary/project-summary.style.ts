import styled from "styled-components";

export const GridContainerProject = styled.article`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16.5rem, 23.1rem));
  gap: 2rem;
  @media (max-width: 1550px) {
    grid-template-columns: repeat(auto-fit, minmax(12.5rem, 23.5rem));
  }
`;

export const GridContainerProjectTable = styled.article`
  width: 100%;
  display: grid;
  
`;