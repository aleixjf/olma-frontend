export interface NavigationItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: NavigationItem[];
}
