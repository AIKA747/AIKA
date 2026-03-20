export type TabsType = {
  items: { title: string; key: string }[];
  onIndexChange?: (index: number) => void;
};
