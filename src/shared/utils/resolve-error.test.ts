import { resolveError } from './resolve-error';

describe('resolveError', () => {
  it('returns the error message when the value is an Error', () => {
    expect(resolveError(new Error('Algo fallo'))).toBe('Algo fallo');
  });

  it('returns the fallback for unknown values', () => {
    expect(resolveError('fallo', 'Mensaje alternativo')).toBe('Mensaje alternativo');
  });
});

