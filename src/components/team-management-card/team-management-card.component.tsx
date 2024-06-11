import { TeamManagementCardProps } from './team-management-card.type'
import { Box, Stack, Typography, IconButton, Menu, Tooltip } from '@mui/material'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { useNavigate } from 'react-router-dom'
import {
  NewCard,
  StatusBox,
  StatusBoxTypography,
  StyledDetails,
  StyledHeading,
  // TextAvatar,
  TextAvatarUser,
} from '@/styles/new-card'
import {
  CardNext,
  ContactIcon,
  // Deactivate,
  Email,
  // Web,
  // ContactIcon,
  // SVGFilesIcon as FilesIcon,
} from '@/assets/images'
import { StyledMenuItems } from '@/components/project-card-new/project-card-new.style'
import InfoIcon from '@mui/icons-material/Info'
import { useState } from 'react'
import { getInitials } from '@/containers/clients-list/clients-list.container'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { UserStatus } from '@/enums'

const TeamManagementCard = (props: TeamManagementCardProps) => {
  const { user, ActivateDeactivateUser } = props
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentObjectId, setCurrentObjectId] = useState<string | null>(null)

  const openOptions = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, objectUid: string) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setCurrentObjectId(objectUid)
  }

  const handleMenuClose = (event: any) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  console.log(user?.user_status_id, 'user?.user_status_id')
  return (
    <>
      <NewCard
        className={`shortCard ${
          UserStatus.ACTIVE === Number(user?.user_status_id) || UserStatus.PENDING === Number(user?.user_status_id) ? '' : 'disabled'
        }`}
        onClick={() => {
          navigate(`/users/${user?.id}`)
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            paddingBottom: '12px',
            borderBottom: '2px solid #FDB447',
          }}
        >
          <TextAvatarUser>{user?.first_name ? getInitials(user?.first_name + ' ' + user?.last_name) : ''}</TextAvatarUser>
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {openOptions && currentObjectId === String(user?.id) && (
              <Menu
                id={`menu-${user?.id}`}
                anchorEl={anchorEl}
                open={openOptions}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': `button`,
                }}
              >
                {/* {user?.user_status_id} */}
                {(user?.user_status_id === UserStatus.ACTIVE || user?.user_status_id === UserStatus.PENDING) && (
                  <StyledMenuItems
                    // style={{ display: user?.is_active ? 'auto' : 'none' }}
                    onClick={() => {
                      navigate(`/users/${user?.id}`)
                    }}
                  >
                    <InfoIcon width={20} height={20} />
                    <Typography variant="body2">Show Details</Typography>
                  </StyledMenuItems>
                )}

                {(UserStatus.ACTIVE === Number(user?.user_status_id) || UserStatus.DEACTIVATE === Number(user?.user_status_id)) && (
                  <StyledMenuItems
                    style={{ pointerEvents: 'auto' }}
                    onClick={(event) => {
                      event.stopPropagation()
                      ActivateDeactivateUser(Number(user?.id), { is_active: user?.is_active ? false : true })
                      handleMenuClose(event)
                      // const userId = user?.id ?? 0
                      //   .ActivateDeactivateUser(userId, {
                      //     ...user,
                      //     is_active: !user?.is_active,
                      //   })
                    }}
                  >
                    <CheckCircleIcon width={20} height={20} color={user?.is_active ? 'error' : 'success'} />
                    <Typography variant="body2">{user?.is_active ? 'Deactivate' : 'Activate'}</Typography>
                  </StyledMenuItems>
                )}
              </Menu>
            )}
            <Box
              sx={{
                height: '24px',
                marginBottom: '12px',
                display: 'flex',
                flexDirection: 'row-reverse',
                boxShadow: 'none',
              }}
            >
              <IconButton
                sx={{
                  width: '24px',
                  height: '24px',
                  padding: '0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'rgba(156, 156, 156, 1)',
                  borderRadius: '0.25rem',
                  pointerEvents: 'auto',
                }}
                id={`options`}
                aria-controls={openOptions ? `options` : undefined}
                aria-haspopup="true"
                aria-expanded={openOptions ? 'true' : undefined}
                onClick={(e) => {
                  handleMenuOpen(e, String(user?.id))
                }}
                // onClick={() => updateClient(client.is_active)}
              >
                <MoreHorizOutlinedIcon sx={{ color: '#9C9C9C' }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box>
          <StyledHeading variant="h1" className="clname">
            {`${user?.first_name} ${user?.last_name}`}
          </StyledHeading>
        </Box>

        <Stack sx={{ marginTop: 'auto', gap: '8px' }}>
          <Stack
            direction="row"
            gap="2px"
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img src={Email} alt="" />
            <Tooltip title={user?.email && user?.email.length > 30 ? user?.email : ''}>
              <StyledDetails className="cldetails">{user?.email}</StyledDetails>
            </Tooltip>
          </Stack>
          <Stack
            direction="row"
            gap="2px"
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img src={ContactIcon} alt="" />
            <StyledDetails className="cldetails">{user?.contact_number}</StyledDetails>
          </Stack>
        </Stack>
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{
            width: '100%',
          }}
        >
          <StatusBox
            className="statusbox"
            sx={{
              borderColor: !user?.is_active ? '#DE6C1A' : '',
            }}
          >
            <StatusBoxTypography
              className="statustext"
              sx={{
                color: !user?.is_active ? '#DE6C1A' : '',
              }}
            >
              {/* {user_data.user?.is_active ? "ACTIVE" : "INACTIVE"} */}
              {user?.user_status_name}
            </StatusBoxTypography>
          </StatusBox>
          <IconButton
            sx={{
              borderRadius: '0',
              padding: '4px',
            }}
            className="nextBtn"
            onClick={() => {
              navigate(`/users/${user?.id}`)
            }}
          >
            <img src={CardNext} alt="" />
          </IconButton>
        </Stack>
      </NewCard>
    </>
  )
}

export default TeamManagementCard
