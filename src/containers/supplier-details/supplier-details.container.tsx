import Tabs from "@/components/tabs"
import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { IconButton, Tooltip, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import { PageWrapper } from "@/styles/page-wrapper"
import { backIcon } from "@/assets/images"
import { SuppliersService } from "@/services/supplier.sevice"
import { SupplierType } from "@/containers/suppliers-list/suppliers-list"

function SupplierDetailsContainer() {
  const { supplierId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const supplierService = new SuppliersService()
  const { enqueueSnackbar } = useSnackbar()

  const [supplier, setsupplier] = useState<SupplierType | null>(null)
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)

  async function getAndUpdateSupplier() {
    setLoading(true)
    try {
      const data = await supplierService.getSupplier(supplierId || "")

      setsupplier(data)
      console.log(supplier, "suppliersupplier")
      setLoading(false)
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    getAndUpdateSupplier()
  }, [supplierId])

  useEffect(() => {
    if (location.pathname === `/suppliers/${supplierId}/overview`) {
      setValue(0)
    } else if (location.pathname === `/suppliers/${supplierId}/configuration`) {
      setValue(1);
    } else if (location.pathname === `/suppliers/${supplierId}/programmatic-configuration`) {
      setValue(2);
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
              navigate("/suppliers")
            }}
          >
            <img src={backIcon} />
          </IconButton>
          <Tooltip title={supplier?.name}>
            <Typography variant='h6' style={{ marginBottom: "0" }}>
              {supplier?.name || ""}
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
            route: `/suppliers/${supplierId}/overview`,
          },
          {
            label: "Configuration",
            isDisabled: false,
            route: `/suppliers/${supplierId}/configuration`,
          },
          {
            label: 'Programmatic Configuration',
            isDisabled: false,
            route: `/suppliers/${supplierId}/programmatic-configuration`,
          }
        ]}
        tabpanels={
          <Outlet
            context={{ supplier, getAndUpdateSupplier, isLoading: loading }}
          />
        }
      />
    </PageWrapper>
  )
}

export default SupplierDetailsContainer
