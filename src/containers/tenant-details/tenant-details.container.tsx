import Tabs from "@/components/tabs"
import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { IconButton, Tooltip, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import { PageWrapper } from "@/styles/page-wrapper"
import { backIcon } from "@/assets/images"
import { TenantService } from "@/services/tenant.service"
import { TenantType } from "../tenants-list/tenants-list"

function TenantDetailsContainer() {
  const { tenantId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const tenantService = new TenantService()
  const { enqueueSnackbar } = useSnackbar()

  const [tenant, setTenant] = useState<TenantType | null>(null)
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [tenantName, setTenantName] = useState<string>("")

  async function getAndUpdateTenant() {
    setLoading(true)
    try {
      const data = await tenantService.get_tenant(tenantId || "")
      setTenant(data)
      setTenantName(data?.[0]?.name)
      // console.log(tenant, "tenant")
      setLoading(false)
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    getAndUpdateTenant()
  }, [tenantId])

  useEffect(() => {
    if (location.pathname === `/tenants/${tenantId}/overview`) {
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
              navigate("/tenants")
            }}
          >
            <img src={backIcon} />
          </IconButton>
          <Tooltip title={tenantName}>
            <Typography variant='h6' style={{ marginBottom: "0" }}>
              {tenantName || ""}
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
            label: "Overview",
            isDisabled: false,
            route: `/tenants/${tenantId}/overview`,
          },
          // {
          //   label: "Configuration",
          //   isDisabled: false,
          //   route: `/suppliers/${tenantId}/configuration`,
          // },
          // {
          //   label: 'Programmatic Configuration',
          //   isDisabled: false,
          //   route: `/suppliers/${tenantId}/programmatic-configuration`,
          // }
        ]}
        tabpanels={
          <Outlet
            context={{ tenant, getAndUpdateTenant, isLoading: loading }}
          />
        }
      />
    </PageWrapper>
  )
}

export default TenantDetailsContainer
