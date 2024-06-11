import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import LayoutsContainer from '@/containers/layouts'

function LayoutsPage() {
  const location = useLocation()

  return <>{location.pathname === '/layouts' ? <LayoutsContainer /> : <Outlet />}</>
}

export default LayoutsPage
