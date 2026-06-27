import { memo } from 'react';

type Props = {
  x: number;
  width: number;
  shaking: boolean;
};

function BasketComponent({ x, width, shaking }: Props) {
  return (
    <div
      className={`basket ${shaking ? 'is-shaking' : ''}`}
      style={{ width, transform: `translateX(${x - width / 2}px)` }}
      aria-label="Calm basket"
    >
      <div className="basket-glow" />
      <div className="basket-rim">INNERGY</div>
      <div className="basket-bowl" />
    </div>
  );
}

export const Basket = memo(BasketComponent);
