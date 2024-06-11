interface NavigationSubListItemTypes {
  text: string;
  subpath: string;
}

interface NavigationListItemTypes {
  text: string;
  path: string;
  isSublist?: boolean;
  children?: Array<NavigationSubListItemTypes>;
}

interface NavigationListPropsTypes {
  subHeading: string;
  list: Array<NavigationListItemTypes>;
}

export type {
  NavigationListPropsTypes,
  NavigationListItemTypes,
  NavigationSubListItemTypes,
};
