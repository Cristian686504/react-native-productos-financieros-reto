import { useCallback, useEffect, useState } from 'react';

import { ProductFormFieldName } from '@/src/features/products/components/product-form.types';
import {
  ProductFormValues,
  emptyProductFormValues,
} from '@/src/features/products/domain/product';
import {
  addOneYear,
  formatDate,
  hasValidationErrors,
  normalizeProductForm,
  parseDate,
  validateProductForm,
} from '@/src/features/products/domain/product-validation';
import { ProductFormErrors } from '@/src/features/products/domain/product-validation.types';
import { formatDisplayDate } from '@/src/shared/utils/format-display-date';
import { resolveError } from '@/src/shared/utils/resolve-error';

import { UseProductFormOptions } from './use-product-form.types';

export function useProductForm({
  mode,
  initialValues = emptyProductFormValues,
  onSubmit,
  verifyProductId,
}: UseProductFormOptions) {
  const [values, setValues] = useState<ProductFormValues>(() => toDisplayFormValues(initialValues));
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setValues(toDisplayFormValues(initialValues));
    setErrors({});
    setSubmitError(null);
  }, [initialValues]);

  const updateField = useCallback((field: ProductFormFieldName, value: string) => {
    setSubmitError(null);
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
      ...(field === 'date_release' ? { date_revision: undefined } : {}),
    }));
    setValues((currentValues) => {
      const nextValues = { ...currentValues, [field]: value };

      if (field === 'date_release') {
        const releaseDate = parseDate(value);
        nextValues.date_revision = releaseDate && !isPastDate(releaseDate)
          ? formatDisplayDate(formatDate(addOneYear(releaseDate)))
          : '';
      }

      return nextValues;
    });
  }, []);

  const blurField = useCallback(
    (field: ProductFormFieldName) => {
      const normalizedValues = normalizeProductForm(values);
      const fieldErrors = validateProductForm(normalizedValues, { mode });

      setErrors((currentStateErrors) => ({
        ...currentStateErrors,
        [field]: fieldErrors[field],
      }));

      if (!fieldErrors[field] && field.includes('date')) {
        setValues((currentValues) => ({
          ...currentValues,
          [field]: formatDisplayDate(normalizedValues[field]),
        }));
      }
    },
    [mode, values],
  );

  const resetForm = useCallback(() => {
    setValues(toDisplayFormValues(initialValues));
    setErrors({});
    setSubmitError(null);
  }, [initialValues]);

  const submitForm = useCallback(async () => {
    try {
      const normalizedValues = normalizeProductForm(values);
      const currentErrors = validateProductForm(normalizedValues, { mode });

      if (hasValidationErrors(currentErrors)) {
        setErrors(currentErrors);
        return currentErrors;
      }

      if (mode === 'create') {
        const idAlreadyExists = await verifyProductId(normalizedValues.id);
        const idErrors = validateProductForm(normalizedValues, { mode, idAlreadyExists });

        if (hasValidationErrors(idErrors)) {
          setErrors(idErrors);
          return idErrors;
        }
      }

      await onSubmit(normalizedValues);
      return null;
    } catch (error) {
      setSubmitError(resolveError(error, 'No se pudo guardar el producto'));
      return null;
    }
  }, [mode, onSubmit, values, verifyProductId]);

  return {
    blurField,
    errors,
    resetForm,
    submitError,
    submitForm,
    updateField,
    values,
  };
}

function toDisplayFormValues(values: ProductFormValues): ProductFormValues {
  return {
    ...values,
    date_release: formatDisplayDate(values.date_release),
    date_revision: formatDisplayDate(values.date_revision),
  };
}

function isPastDate(date: Date): boolean {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return date < startOfToday;
}
