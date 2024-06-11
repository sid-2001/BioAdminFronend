interface CustomCardMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onDeactivate: () => void;
  onEdit: () => void;
  setAnchorEl: (data: any) => void;
  onhandleClick?: (data: any) => void;
  status?: number;
  surveyStatus?: number;
  tableEdit?: boolean;
  surveySupply?: boolean;
  config?: boolean;
  quotaCardMenu?: boolean;
  isActive?: boolean;
  permissions?: boolean;
}

export type { CustomCardMenuProps };
