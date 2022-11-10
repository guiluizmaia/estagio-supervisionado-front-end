import { InputHTMLAttributes } from 'react';
import { Control, ControllerProps, FieldValues } from 'react-hook-form';

interface IInputProps<T extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>,
    Pick<ControllerProps<T>, 'name'> {
  control: Control<T, object>;
  label: string;
  onRemove?: () => void;
}

export type { IInputProps };
