interface ProjectSidebarComponentProps {
  sideBarImages: SideBarImagesProps[]
  survey?: boolean
}

interface SideBarImagesProps {
  image: string
  state?: any
  navigate?: any
  onClick?: any
  icon?: boolean
}

export type { SideBarImagesProps, ProjectSidebarComponentProps }
