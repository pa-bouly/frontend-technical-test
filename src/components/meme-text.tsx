import type { CSSProperties, FC, ReactNode } from 'react';
import { useDrag } from 'react-dnd';

const style: CSSProperties = {
  position: 'absolute',
  userSelect: 'none',
  color: 'white',
  textTransform: 'uppercase',
  fontFamily: 'Impact',
};

export interface BoxProps {
  id: string;
  left: number;
  top: number;
  fontSize?: number;
  children?: ReactNode;
  canDrag?: boolean;
  dataTestId?: string;
  number?: number;
}

export const MemeText: FC<BoxProps> = ({
  id,
  left,
  top,
  children,
  canDrag,
  dataTestId,
  number,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'box',
      item: { id, left, top },
      canDrag: canDrag,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top]
  );

  if (isDragging) {
    return <div ref={drag} />;
  }
  return (
    <div
      className="box"
      ref={drag}
      style={{ ...style, left, top, cursor: canDrag ? 'move' : 'default' }}
      data-testid={`${dataTestId}-text-${number}`}
    >
      {children}
    </div>
  );
};
