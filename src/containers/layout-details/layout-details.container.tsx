import Tabs from "@/components/tabs"
import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import {
  // Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material"
import { useSnackbar } from "notistack"
import { PageWrapper } from "@/styles/page-wrapper"
import { backIcon } from "@/assets/images"
import { LayoutType, LayoutsService } from "@/services/layout.service"

function LayoutDetailsContainer() {
  const { layoutId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const layoutService = new LayoutsService()
  const { enqueueSnackbar } = useSnackbar()

  const [layout, setLayout] = useState<LayoutType | null>(null)
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)

  async function getAndUpdateLayout() {
    setLoading(true)
    try {
      const data = await layoutService.getLayout(layoutId || "")

      setLayout(data)
      setLoading(false)
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    getAndUpdateLayout()
  }, [layoutId])

  useEffect(() => {
    if (location.pathname === `/layouts/${layoutId}/overview`) {
      setValue(0)
    }
  }, [location])

  return (
    <PageWrapper>
      <header
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <IconButton
            onClick={() => {
              navigate("/layouts")
            }}
          >
            <img src={backIcon} />
          </IconButton>
          <Tooltip title={layout?.name}>
            <Typography variant='h6' style={{ marginBottom: "0" }}>
              {layout?.name || ""}
            </Typography>
          </Tooltip>

          {/* <MoreHorizOutlined /> */}
        </div>
      </header>
      <Tabs
        setValue={setValue}
        value={value}
        labels={[
          {
            label: "Default theme",
            isDisabled: false,
            route: `/layouts/${layoutId}/overview`,
          },
        ]}
        tabpanels={
          <Outlet
            context={{ layout, getAndUpdateLayout, isLoading: loading }}
          />
        }
      />
    </PageWrapper>
  )
}

export default LayoutDetailsContainer
