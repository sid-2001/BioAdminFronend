// import PermissionsTable from "@/containers/admin-permissions";
import { Outlet, useLocation } from "react-router-dom";

const AdminPermissionsPage = () => {
  const location = useLocation();
  return <>{location.pathname === "/permissions" ? <></> : <Outlet />}</>;
};
export default AdminPermissionsPage;
