import { ProductFormValues } from './product';
import { ProductFormErrors, ValidationOptions } from './product-validation.types';

const idLimits = { min: 3, max: 10 };
const nameLimits = { min: 6, max: 100 };
const descriptionLimits = { min: 10, max: 200 };
const dateFormatMessage = 'Usa el formato DD/MM/YYYY e ingresa una fecha válida.';

export function validateProductForm(
  values: ProductFormValues,
  options: ValidationOptions,
): ProductFormErrors {
  const errors: ProductFormErrors = {};
  const today = startOfDay(options.today ?? new Date());
  const releaseDate = parseDate(values.date_release);
  const revisionDate = parseDate(values.date_revision);

  validateLength(values.id, idLimits, 'ID', errors, 'id');
  validateLength(values.name, nameLimits, 'Nombre', errors, 'name');
  validateLength(values.description, descriptionLimits, 'Descripción', errors, 'description');
  validateRequired(values.logo, 'Ingresa la URL o ruta del logo.', errors, 'logo');

  if (!errors.id && options.mode === 'create' && options.idAlreadyExists) {
    errors.id = 'Ya existe un producto con este ID. Usa un ID diferente.';
  }

  if (!values.date_release.trim()) {
    errors.date_release = 'Ingresa la fecha de liberación.';
  } else if (!releaseDate) {
    errors.date_release = dateFormatMessage;
  } else if (releaseDate < today) {
    errors.date_release = 'La fecha de liberación debe ser hoy o una fecha futura.';
  }

  if (!values.date_revision.trim()) {
    errors.date_revision = 'La fecha de revisión se calcula desde la fecha de liberación.';
  } else if (!revisionDate) {
    errors.date_revision = dateFormatMessage;
  } else if (releaseDate && !isSameDate(revisionDate, addOneYear(releaseDate))) {
    errors.date_revision = `La fecha de revisión debe ser ${formatLocalDate(addOneYear(releaseDate))}, un año después de la liberación.`;
  }

  return errors;
}

export function hasValidationErrors(errors: ProductFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function normalizeProductForm(values: ProductFormValues): ProductFormValues {
  return {
    id: values.id.trim(),
    name: values.name.trim(),
    description: values.description.trim(),
    logo: values.logo.trim(),
    date_release: normalizeDateInput(values.date_release),
    date_revision: normalizeDateInput(values.date_revision),
  };
}

export function normalizeDateInput(value: string): string {
  const date = parseDate(value);

  return date ? formatDate(date) : value.trim();
}

export function parseDate(value: string): Date | null {
  const trimmedValue = value.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedValue);
  const localMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmedValue);

  if (isoMatch) {
    return createValidDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));
  }

  if (localMatch) {
    return createValidDate(Number(localMatch[3]), Number(localMatch[2]), Number(localMatch[1]));
  }

  return null;
}

export function addOneYear(date: Date): Date {
  return createValidDate(date.getFullYear() + 1, date.getMonth() + 1, date.getDate()) ?? date;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}/${month}/${year}`;
}

function validateLength(
  value: string,
  limits: { min: number; max: number },
  label: string,
  errors: ProductFormErrors,
  key: keyof ProductFormValues,
): void {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    errors[key] = resolveRequiredLengthMessage(label);
    return;
  }

  if (trimmedValue.length < limits.min) {
    errors[key] = `${label} debe tener al menos ${limits.min} caracteres.`;
    return;
  }

  if (trimmedValue.length > limits.max) {
    errors[key] = `${label} debe tener máximo ${limits.max} caracteres.`;
  }
}

function resolveRequiredLengthMessage(label: string): string {
  if (label === 'ID') {
    return 'Ingresa el ID.';
  }

  if (label === 'Descripción') {
    return 'Ingresa la descripción.';
  }

  return `Ingresa el ${label.toLowerCase()}.`;
}

function validateRequired(
  value: string,
  label: string,
  errors: ProductFormErrors,
  key: keyof ProductFormValues,
): void {
  if (!value.trim()) {
    errors[key] = label;
  }
}

function createValidDate(year: number, month: number, day: number): Date | null {
  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isValid ? startOfDay(date) : null;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDate(left: Date, right: Date): boolean {
  return formatDate(left) === formatDate(right);
}
