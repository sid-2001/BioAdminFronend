import Tabs from "@/components/tabs"
import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
// import { logger } from "@/helpers/logger"
import {
  // Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material"
import { useSnackbar } from "notistack"
import { PageWrapper } from "@/styles/page-wrapper"
// import {
//   ContactType,
//   PrimaryBox,
// } from "@/components/project-card/project-card.style"
import { backIcon } from "@/assets/images"
// import { MoreHorizOutlined } from "@mui/icons-material"
import { ClientsService } from "@/services/client.service"
import { ClientType } from "@/types/client.types"

// function truncateText(text: any, length: number) {
//   // Check if the input is a string and if it exceeds the required length
//   if (typeof text === "string" && text.length > length) {
//     return `${text.substr(0, length)}...`
//   }
//   return text // This will return the input as is, if it's not a string or if it's within the length limit
// }
// function truncateText(text: any, length: number) {
//   // Check if the input is a string and if it exceeds the required length
//   if (typeof text === "string" && text.length > length) {
//     return `${text.substr(0, length)}...`
//   }
//   return text // This will return the input as is, if it's not a string or if it's within the length limit
// }

function ClientDetailsContainer() {
  const { clientId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const clientService = new ClientsService()
  const { enqueueSnackbar } = useSnackbar()

  const [client, setClient] = useState<ClientType | null>(null)
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)

  async function getAndUpdateClient() {
    setLoading(true)
    try {
      const data = await clientService.getClient(clientId || "")

      setClient(data)
      setLoading(false)
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    getAndUpdateClient()
  }, [clientId])

  useEffect(() => {
    if (location.pathname === `/clients/${clientId}/overview`) {
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
              navigate("/clients")
            }}
          >
            <img src={backIcon} />
          </IconButton>
          <Tooltip title={client?.name}>
            <Typography variant='h6' style={{ marginBottom: "0" }}>
              {client?.name || ""}
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
            route: `/clients/${clientId}/overview`,
          },
        ]}
        tabpanels={
          <Outlet
            context={{ client, getAndUpdateClient, isLoading: loading }}
          />
        }
      />
    </PageWrapper>
  )
}

export default ClientDetailsContainer
