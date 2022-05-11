import { useMantineColorScheme } from '@mantine/core';
import type { Identifier, XYCoord } from 'dnd-core';
import type { FC } from 'react';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { RiDragMove2Line } from 'react-icons/ri';

export const ItemTypes = {
  AIDNDI: 'aidndi',
};

export interface AccordionItem {
  indexQ: number;
  index: number;
  id: number;
  children: React.ReactNode;
  moveAccordionItem: (dragIndex: number, hoverIndex: number, indexQ: number, index: number) => void;
  moveAccordionItemCompleted: (indexQ: number, index: number, id: number) => void;
}

interface DragItem {
  index: number;
  indexQ: number;
  id: number;
}

export const DivAccordionItemDND: FC<AccordionItem> = ({
  moveAccordionItem,
  index,
  indexQ,
  children,
  moveAccordionItemCompleted,
  id,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const refNested = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes.AIDNDI,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        didDrop: monitor.didDrop(),
        isOver: monitor.isOver(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!refNested.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      if (indexQ !== item.indexQ) {
        return;
      }
      const hoverBoundingRect = refNested.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveAccordionItem(dragIndex, hoverIndex, indexQ, index);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.AIDNDI,
    item: () => {
      return { indexQ, index, id };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item: DragItem, monitor) => {
      moveAccordionItemCompleted(indexQ, index, item.id);
    },
  });

  const opacity = isDragging ? 0.3 : 1;
  drag(drop(refNested));
  return (
    <div className="flex items-center space-x-1">
      <div
        className={`flex grow rounded flex-col mb-[1px] p-1 ${dark ? 'bg-zinc-700' : 'bg-zinc-50'}`}
        ref={refNested}
        style={{ opacity }}
        data-handler-id={handlerId}
      >
        {children}
      </div>
      <div ref={refNested}>
        <RiDragMove2Line className="cursor-move" size={15} />
      </div>
    </div>
  );
};
