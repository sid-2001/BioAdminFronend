import React, {useState} from "react";
import Footer from "../footer/Footer";
import DashboardIcon from "../navbar/icons/Frame 112.png";
import ProjectsIcon from "../navbar/icons/Frame 113.png";
import ClientsIcon from "../navbar/icons/Frame 114.png";
import VendorsIcon from "../navbar/icons/Frame 115.png";
import AdminIcon from "../navbar/icons/Frame 116.png";
import TemplatesIcon from "../navbar/icons/Frame 117.png";
import RequestsIcon from "../navbar/icons/Frame.png";
import ArrowIcon from "../navbar/Vector 3.svg"
import SettingsIcon from "../navbar/Settings.svg"
import "../navbar/navbarstyle.css"
import Header from "../header/Header";

const bodyStyles: React.CSSProperties = {
  backgroundColor: "whitesmoke",
  minHeight: "100vh"
};

const settingsStyles:React.CSSProperties = {
    // marginLeft: "25px",
    display: "flex",
    alignItems: "center",
    marginBottom: "10px"
}

const asideStyles: React.CSSProperties = {
    position : "absolute",
  height: "calc(100vh - 143px)",
  marginLeft: "20px",
  width: "250px",
  border: "2px solid #fff",
  borderRadius: "20px",
  marginBottom: "37px",
//   overflow: "hidden",
  transition: "width 0.10s ease-in-out",
  zIndex: "100"
};

const collapsedAsideStyles: React.CSSProperties = {
    width: "65px",
    border: "2px solid #fff",
    borderRadius: "20px",

  };

const navbarStyles: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  justifyContent: "space-between",
};

const listStyles: React.CSSProperties = {
//   flex: "1 1 0%",
  paddingLeft: "0.75rem",
  paddingRight: "0.75rem",
};

const iconlistStyles: React.CSSProperties = {
  listStyle: "none",
  display: "flex",
  alignItems: "center",
  marginTop: "20px",
  marginBottom: "20px",
  marginLeft: "-10px",
  border: "1px solid white",
  justifyContent: "center"
};

const iconStyles: React.CSSProperties = {
    // marginRight: "20px",
    // marginLeft: "20px"
}

const slidingButton: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "-10px",
    borderRadius: "50%",
    backgroundColor: "#305DCF",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // left: "260px",
    // bottom: "90px",
    zIndex: "500",
    cursor: "pointer",
};

function Navbar() {

    const [isCollapsed,setIsCollapsed] = useState(true)

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
      };
  return (
    <div style={bodyStyles}>
      {/* <h2 style={headingStyles} >BB.</h2> */}
        <Header/>
      
      <div style={isCollapsed ? { ...asideStyles, ...collapsedAsideStyles } : asideStyles}>
        <div style={navbarStyles}>
            <div>
            <ul style={listStyles}>
            <li style={iconlistStyles} className="list">
              <img src={DashboardIcon} alt="" width={32} height={32} style={iconStyles}/> <span style={{display: isCollapsed ?  "none" : ""}}>Dashboard</span>
            </li>
            <li style={iconlistStyles} className="list">
              <img src={ProjectsIcon} alt="" width={32} height={32} style={iconStyles}/> <span style={{display: isCollapsed ?  "none" : ""}}>Projects</span>
            </li>
            <li style={iconlistStyles} className="list">
              <img src={ClientsIcon} alt="" style={iconStyles}/> <span style={{display: isCollapsed ?  "none" : ""}}>Clients</span>
            </li>
            <li style={iconlistStyles} className="list">
              <img src={VendorsIcon} alt="" style={iconStyles}/> <span style={{display: isCollapsed ?  "none" : ""}}>Vendor</span>
            </li>
            <li style={iconlistStyles} className="list">
              <img src={AdminIcon} alt="" style={iconStyles}/> <span style={{display: isCollapsed ?  "none" : ""}}>Admin</span>
            </li>
            <li style={iconlistStyles} className="list">
              <img src={TemplatesIcon} alt="" style={iconStyles}/> <span style={{display: isCollapsed ?  "none" : ""}}>Templates</span>
            </li>
            <li style={iconlistStyles} className="list">
              <img src={RequestsIcon} alt="" style={iconStyles}/> <span style={{display: isCollapsed ?  "none" : ""}}>Requests</span>
            </li>
          </ul>
            </div>
            <div style={slidingButton} onClick={toggleCollapse}>
            <img src={ArrowIcon} alt=""/>
          </div>
            <div style={settingsStyles} >
                <img src={SettingsIcon} alt="" style={{paddingRight: "24px"}}/>
                <span style={{display: isCollapsed ?  "none" : ""}}>Settings</span>
            </div>
        </div>
      </div>
      <footer style={{position: "absolute" , bottom: "0", width: "100vw"}}>
        <Footer />
      </footer>
    </div>
  );
}

export default Navbar;
