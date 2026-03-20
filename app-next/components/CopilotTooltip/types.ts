export type Labels = Partial<Record<'skip' | 'previous' | 'next' | 'finish', string>>;
export interface TooltipProps {
  labels: Labels;
}
