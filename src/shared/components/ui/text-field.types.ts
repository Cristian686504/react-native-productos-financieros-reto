import { TextInputProps } from 'react-native';

export type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  helperText?: string;
};
