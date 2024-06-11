import {
  StyledCard,
  StyledConfigTypography,
  StyledNotReTypography,
  StyledStycTimeTypeTypography,
  StyledStycTimeTypography
  
} from "./summary-card.style";
import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { SummaryCardData } from "./summary-card.type";

const SummaryCard = ({ data }: { data: SummaryCardData }) => {
  const failPercentage = (data.fail / data.total) * 100;
  const successPercentage = 100 - failPercentage;

  const pieChartData = [
    { id: 0, value: successPercentage, color: "#1aaf1a" },
    { id: 1, value: failPercentage, color: "#FF0000" },
  ];

  return (
    // <StyledCard>
    //     <Box style={{ display: "flex", flexDirection: "row", height: '100%', position: 'relative' }}>
    //         <Box style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
    //             <Box style={{ height: "66px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    //                 <Box style={{ width: "60px", height: "97px" }}></Box>
    //                 <Box style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", }}>
    //                     <Box>
    //                         <StyledNotReTypography><span style={{ color: "#FF0000" }}>{data.fail}</span>/{data.total}</StyledNotReTypography>
    //                         <StyledStycTimeTypeTypography>Non Reviewed</StyledStycTimeTypeTypography>
    //                     </Box>
    //                     <Box>
    //                         <StyledNotReTypography><span style={{ color: "#008000" }}>{data.reviewed}</span>/{data.total}</StyledNotReTypography>
    //                         <StyledStycTimeTypeTypography>Reviewed</StyledStycTimeTypeTypography>
    //                     </Box>
    //                 </Box>
    //             </Box>
    //             <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
    //                 <StyledConfigTypography>{data.name}</StyledConfigTypography>
    //                 <StyledSubConfigTypography>{data.type}</StyledSubConfigTypography>
    //             </Box>
    //         </Box>
    //         <Box style={{ position: 'absolute', right: 0, bottom: 0 }}>
    //             <StyledStycTimeTypography variant="body2">{data.sync_time}</StyledStycTimeTypography>
    //         </Box>
    //     </Box>
    // </StyledCard>

    <StyledCard>
      <Box style={{ display: "flex", height: "100%", position: "relative" }}>
        <Box
          style={{
            width: "60px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <PieChart
            series={[
              {
                data: pieChartData,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { innerRadius: 10, additionalRadius: -10, color: "gray" },
              },
            ]}
            height={900}
            width={900}
          />
        </Box>
        <Box style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <StyledNotReTypography>
                <span style={{ color: "#FF0000" }}>{data.fail}</span>/{data.total}
              </StyledNotReTypography>

              <StyledStycTimeTypeTypography>Non Reviewed</StyledStycTimeTypeTypography>
            </Box>
            <Box>
              <StyledNotReTypography>
                <span style={{ color: "#008000" }}>{data.reviewed}</span>
              </StyledNotReTypography>
              <StyledStycTimeTypeTypography>Reviewed</StyledStycTimeTypeTypography>
            </Box>
          </Box>
          <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "left" }}>
            <StyledConfigTypography>{data.name}</StyledConfigTypography>
            {/* <StyledSubConfigTypography>{data.type}</StyledSubConfigTypography> */}
          </Box>
        </Box>
        <Box style={{ position: "absolute", right: 0, bottom: 0 }}>
          <StyledStycTimeTypography variant="body2">{data.sync_time}</StyledStycTimeTypography>
        </Box>
      </Box>
    </StyledCard>
  );
};

export default SummaryCard;
