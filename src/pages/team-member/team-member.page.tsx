import TeamMemberContainer from "../../containers/team-list";
import { Outlet, useLocation } from "react-router-dom";

const TeamMemberPage = () => {
  const location = useLocation();
  return (
    <>{location.pathname === "/users" ? <TeamMemberContainer /> : <Outlet />}</>
  );
};
export default TeamMemberPage;
