import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { palette } from './palette';
import { styles } from './text-field.styles';
import { TextFieldProps } from './text-field.types';

export function TextField({
  label,
  error,
  helperText,
  editable = true,
  style,
  onBlur,
  onFocus,
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          isFocused && editable ? styles.labelFocused : null,
          error ? styles.labelError : null,
        ]}>
        {label}
      </Text>
      <TextInput
        {...inputProps}
        accessibilityLabel={label}
        accessibilityState={{ disabled: !editable }}
        caretHidden={!editable || inputProps.caretHidden}
        contextMenuHidden={!editable || inputProps.contextMenuHidden}
        editable={editable}
        focusable={editable}
        placeholderTextColor={palette.muted}
        selectionColor={palette.navy}
        selectTextOnFocus={editable ? inputProps.selectTextOnFocus : false}
        style={[
          styles.input,
          isFocused && editable ? styles.focused : null,
          !editable ? styles.disabled : null,
          error ? styles.inputError : null,
          style,
        ]}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
      />
      {helperText && !error ? <Text style={styles.helper}>{helperText}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
