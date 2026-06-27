import { memo } from 'react';
import type { FallingItem } from '../types';

type Props = {
  item: FallingItem;
};

function FallingObjectComponent({ item }: Props) {
  return (
    <div
      className={`falling-object falling-object--${item.kind}`}
      style={{
        width: item.size,
        height: item.size,
        transform: `translate3d(${item.x}px, ${item.y}px, 0)`
      }}
      aria-label={item.label}
    >
      <span className="falling-icon">{item.icon}</span>
      <span className="falling-label">{item.label}</span>
    </div>
  );
}

export const FallingObject = memo(FallingObjectComponent);
