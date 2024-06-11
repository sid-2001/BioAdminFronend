import SurveysListContainer from "@/containers/surveys-list"
import { Outlet, useLocation } from "react-router-dom"

function Surveys() {
  const location = useLocation()
  return (
    <>
      {location.pathname === "/surveys" ? <SurveysListContainer /> : <Outlet />}
    </>
  )
}

export default Surveys
