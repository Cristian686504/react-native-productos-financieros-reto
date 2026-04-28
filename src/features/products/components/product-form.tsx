import { useRef } from 'react';
import { LayoutChangeEvent, ScrollView, Text, View } from 'react-native';

import { emptyProductFormValues } from '@/src/features/products/domain/product';
import { useProductForm } from '@/src/features/products/hooks/use-product-form';
import { Button } from '@/src/shared/components/ui/button';
import { ErrorMessage } from '@/src/shared/components/ui/error-message';
import { TextField } from '@/src/shared/components/ui/text-field';

import { ProductLogo } from './product-logo';
import { productFormFields } from './product-form-config';
import { styles } from './product-form.styles';
import { ProductFormProps } from './product-form.types';

export function ProductForm({
  mode,
  initialValues = emptyProductFormValues,
  isSubmitting,
  onSubmit,
  verifyProductId,
}: ProductFormProps) {
  const title = mode === 'create' ? 'Formulario de Registro' : 'Formulario de Edición';
  const submitTitle = mode === 'create' ? 'Enviar' : 'Guardar';
  const { blurField, errors, resetForm, submitError, submitForm, updateField, values } =
    useProductForm({
      initialValues,
      mode,
      onSubmit,
      verifyProductId,
    });
  const scrollViewRef = useRef<ScrollView>(null);
  const fieldPositions = useRef<Partial<Record<keyof typeof values, number>>>({});

  const registerFieldPosition =
    (fieldName: keyof typeof values) => (event: LayoutChangeEvent) => {
      fieldPositions.current[fieldName] = event.nativeEvent.layout.y;
    };

  const handleSubmit = async () => {
    const submitErrors = await submitForm();
    const firstErrorField = productFormFields.find((field) => submitErrors?.[field.name]);

    if (firstErrorField) {
      const yPosition = fieldPositions.current[firstErrorField.name] ?? 0;

      scrollViewRef.current?.scrollTo({
        animated: true,
        y: Math.max(yPosition - 16, 0),
      });
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{title}</Text>
      {submitError ? <ErrorMessage message={submitError} /> : null}
      <View style={styles.fields}>
        {productFormFields.map((field) => (
          <View
            key={field.name}
            style={styles.fieldGroup}
            onLayout={registerFieldPosition(field.name)}>
            <TextField
              autoCapitalize="none"
              editable={field.readOnly ? false : !(field.readOnlyOnEdit && mode === 'edit')}
              error={errors[field.name]}
              helperText={field.helperText}
              label={field.label}
              multiline={field.multiline}
              numberOfLines={field.multiline ? 3 : 1}
              placeholder={field.name.includes('date') ? 'DD/MM/YYYY' : undefined}
              value={values[field.name]}
              onBlur={() => blurField(field.name)}
              onChangeText={(value) => updateField(field.name, value)}
            />
            {field.name === 'logo' ? (
              <View style={styles.logoPreview}>
                <Text style={styles.previewLabel}>Vista previa</Text>
                <ProductLogo size="small" uri={values.logo} />
              </View>
            ) : null}
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <Button
          disabled={isSubmitting}
          iconName={mode === 'create' ? 'send' : 'save'}
          title={isSubmitting ? 'Guardando...' : submitTitle}
          onPress={handleSubmit}
        />
        <Button
          disabled={isSubmitting}
          iconName="refresh"
          title="Reiniciar"
          variant="secondary"
          onPress={resetForm}
        />
      </View>
    </ScrollView>
  );
}
