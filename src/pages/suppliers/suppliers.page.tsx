import { Outlet } from "react-router-dom"
import { useLocation } from "react-router-dom"

import SuppliersList from "@/containers/suppliers-list"

function SuppliersPage() {
  const location = useLocation()

  return (
    <>{location.pathname === "/suppliers" ? <SuppliersList /> : <Outlet />}</>
  )
}

export default SuppliersPage
