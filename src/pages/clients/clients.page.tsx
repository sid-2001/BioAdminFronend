import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

import ClientsListContainer from "@/containers/clients-list";

function ClientsPage() {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/clients" ? <ClientsListContainer /> : <Outlet />}
    </>
  );
}

export default ClientsPage;
