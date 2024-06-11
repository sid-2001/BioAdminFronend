// import { theme } from "@/constants/theme";
import { Stack, styled } from "@mui/material";

type BuilderIconWrapperProps = {
  fullViewMode: boolean;
};

type BuilderIconBoxProps = {
  fullViewMode: boolean;
};

export const BuilderIconWrapper = styled(Stack)<BuilderIconWrapperProps>(
  ({ fullViewMode }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: fullViewMode ? "99%" : "100%",
  })
);

// export const BuilderIconBox = styled(Stack)<BuilderIconBoxProps>(
//   ({ fullViewMode }) => ({
//     background: "white",
//     padding: "0.2rem 0.5rem",
//     borderRadius: "0.2rem",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: !fullViewMode ? "row" : "row",
//     // position: !fullViewMode ? "absolute" : "unset",
//     // right: "0px",
//     // top: "300px",
//     marginBottom: fullViewMode ? "1rem" : "0rem",
//     zIndex: 50,
//     gap: "0.5rem",
//   })
// );


export const BuilderIconBox = styled(Stack)<BuilderIconBoxProps>(
  ({ fullViewMode }) => ({
    background: "white",
    padding: "0.2rem 0.5rem",
    borderRadius: "0.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: fullViewMode ? "1rem" : "0rem",
    zIndex: 50,
    gap: "0.5rem",
    overflowX: "auto",
    whiteSpace: "nowrap",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    msOverflowStyle: "none",
  })
);
