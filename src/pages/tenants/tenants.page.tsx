import { Outlet } from "react-router-dom"
import { useLocation } from "react-router-dom"
import TenantsListContainer from "@/containers/tenants-list/tenants-list"

function TenantsPage() {
  const location = useLocation()

  return (
    <>{location.pathname === "/tenants" ? <TenantsListContainer /> : <Outlet />}</>
  )
}

export default TenantsPage
