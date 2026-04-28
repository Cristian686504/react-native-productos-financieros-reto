import { ProductFormValues } from './product';
import {
  addOneYear,
  formatDate,
  normalizeProductForm,
  parseDate,
  validateProductForm,
} from './product-validation';

const validProduct: ProductFormValues = {
  id: 'trj-crd',
  name: 'Tarjeta Credito',
  description: 'Tarjeta de consumo con cupo disponible',
  logo: 'https://example.com/logo.png',
  date_release: '2026-05-01',
  date_revision: '2027-05-01',
};

describe('product validation', () => {
  it('accepts a valid product', () => {
    const errors = validateProductForm(validProduct, {
      mode: 'create',
      today: new Date(2026, 3, 28),
    });

    expect(errors).toEqual({});
  });

  it('returns field errors for required and invalid values', () => {
    const errors = validateProductForm(
      {
        id: 'ab',
        name: 'abc',
        description: 'short',
        logo: '',
        date_release: '2026-02-31',
        date_revision: '',
      },
      { mode: 'create', today: new Date(2026, 3, 28) },
    );

    expect(errors).toMatchObject({
      id: 'ID debe tener al menos 3 caracteres.',
      name: 'Nombre debe tener al menos 6 caracteres.',
      description: 'Descripción debe tener al menos 10 caracteres.',
      logo: 'Ingresa la URL o ruta del logo.',
      date_release: 'Usa el formato DD/MM/YYYY e ingresa una fecha válida.',
      date_revision: 'La fecha de revisión se calcula desde la fecha de liberación.',
    });
  });

  it('explains maximum length errors', () => {
    const errors = validateProductForm(
      {
        ...validProduct,
        id: 'producto-muy-largo',
        name: 'x'.repeat(101),
        description: 'x'.repeat(201),
      },
      { mode: 'edit', today: new Date(2026, 3, 28) },
    );

    expect(errors).toMatchObject({
      id: 'ID debe tener máximo 10 caracteres.',
      name: 'Nombre debe tener máximo 100 caracteres.',
      description: 'Descripción debe tener máximo 200 caracteres.',
    });
  });

  it('rejects release dates before today and revision dates outside one year', () => {
    const errors = validateProductForm(
      {
        ...validProduct,
        date_release: '2026-04-27',
        date_revision: '2027-04-29',
      },
      { mode: 'edit', today: new Date(2026, 3, 28) },
    );

    expect(errors.date_release).toBe('La fecha de liberación debe ser hoy o una fecha futura.');
    expect(errors.date_revision).toBe(
      'La fecha de revisión debe ser 27/04/2027, un año después de la liberación.',
    );
  });

  it('rejects existing IDs only when creating', () => {
    const createErrors = validateProductForm(validProduct, {
      mode: 'create',
      idAlreadyExists: true,
      today: new Date(2026, 3, 28),
    });
    const editErrors = validateProductForm(validProduct, {
      mode: 'edit',
      idAlreadyExists: true,
      today: new Date(2026, 3, 28),
    });

    expect(createErrors.id).toBe('Ya existe un producto con este ID. Usa un ID diferente.');
    expect(editErrors.id).toBeUndefined();
  });

  it('normalizes supported date formats and trims text values', () => {
    const normalized = normalizeProductForm({
      ...validProduct,
      id: ' trj-crd ',
      date_release: '01/05/2026',
      date_revision: '01/05/2027',
    });

    expect(normalized.id).toBe('trj-crd');
    expect(normalized.date_release).toBe('2026-05-01');
    expect(normalized.date_revision).toBe('2027-05-01');
  });

  it('parses and formats local dates without timezone drift', () => {
    const parsedDate = parseDate('2026-05-01');

    expect(parsedDate).not.toBeNull();
    expect(formatDate(addOneYear(parsedDate as Date))).toBe('2027-05-01');
    expect(parseDate('2026-13-01')).toBeNull();
  });
});
