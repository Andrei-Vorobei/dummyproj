import type { InputHTMLAttributes, JSX } from 'react';
import type { FieldPath, FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form';

import { clsx } from 'clsx';

import styles from './text-input.module.css';

type TextInputProps<TFieldValues extends FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: FieldPath<TFieldValues>;
  register?: UseFormRegister<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
};

const TextInput = <TFieldValues extends FieldValues>({
  label,
  name,
  type = 'text',
  register,
  rules,
  placeholder,
  className,
  ...props
}: TextInputProps<TFieldValues>): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      {label ? (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      ) : null}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={clsx(styles.input, className)}
        {...(register ? register(name, rules) : {})}
        {...props}
      />
    </div>
  );
};

export default TextInput;
