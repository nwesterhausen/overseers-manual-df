import { Stack } from 'solid-bootstrap';
import { Component } from 'solid-js';

export type TwoPartBadgeProps = {
  bg: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  text?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  name: string;
  value: string;
};

const TwoPartBadge: Component<TwoPartBadgeProps> = (props) => {
  const noValue = props.value.length === 0;
  return (
    <Stack class='double-badge' direction='horizontal' gap={0}>
      <span
        class={`rounded${noValue ? '' : '-start'} bg-${props.bg} ${props.text ? 'text-' + props.text : 'text-light'}`}>
        {props.name}
      </span>
      {noValue ? <></> : <span class='rounded-end bg-secondary text-light'>{props.value}</span>}
    </Stack>
  );
};

export default TwoPartBadge;
