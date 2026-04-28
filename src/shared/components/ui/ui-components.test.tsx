import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AppHeader } from '@/src/shared/components/layout/app-header';
import { Screen } from '@/src/shared/components/layout/screen';

import { Button } from './button';
import { ErrorMessage } from './error-message';
import { TextField } from './text-field';

describe('shared UI components', () => {
  it('renders button presses and disabled state', () => {
    const onPress = jest.fn();
    const { getByRole, getByText, rerender } = render(<Button title="Guardar" onPress={onPress} />);

    fireEvent.press(getByText('Guardar'));

    expect(onPress).toHaveBeenCalledTimes(1);

    rerender(<Button disabled title="Guardar" onPress={onPress} />);

    expect(getByRole('button').props.accessibilityState).toEqual({ disabled: true });
  });

  it('renders field label, value and validation message', () => {
    const { getByDisplayValue, getByText } = render(
      <TextField error="Campo requerido" label="Nombre" value="Cuenta" onChangeText={jest.fn()} />,
    );

    expect(getByText('Nombre')).toBeTruthy();
    expect(getByDisplayValue('Cuenta')).toBeTruthy();
    expect(getByText('Campo requerido')).toBeTruthy();
  });

  it('makes disabled fields non-interactive', () => {
    const { getByLabelText } = render(
      <TextField editable={false} label="Fecha de revisión" value="2027-05-01" />,
    );
    const input = getByLabelText('Fecha de revisión');

    expect(input.props.editable).toBe(false);
    expect(input.props.focusable).toBe(false);
    expect(input.props.caretHidden).toBe(true);
    expect(input.props.contextMenuHidden).toBe(true);
    expect(input.props.selectTextOnFocus).toBe(false);
  });

  it('renders error and layout components', () => {
    const { getByText } = render(
      <Screen>
        <ErrorMessage message="No se pudo cargar" />
        <Text>Contenido</Text>
      </Screen>,
    );

    expect(getByText('BANCO')).toBeTruthy();
    expect(getByText('No se pudo cargar')).toBeTruthy();
    expect(getByText('Contenido')).toBeTruthy();
  });

  it('renders the header by itself', () => {
    const { getByText } = render(<AppHeader />);

    expect(getByText('BANCO')).toBeTruthy();
  });
});
