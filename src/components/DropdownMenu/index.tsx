import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

interface IDropdownMenuProps {
  actions: {
    label: string;
    action: VoidFunction;
  }[];
}

const DropdownMenu: React.FC<IDropdownMenuProps> = ({ actions }) => {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <i className='bi bi-three-dots-vertical' />
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content>
          {actions.map(({ label, action }, index) => (
            <DropdownMenuPrimitive.Item
              key={index}
              onClick={(e) => {
                e.preventDefault();
                action();
                e.stopPropagation();
              }}
            >
              {label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export default DropdownMenu;
