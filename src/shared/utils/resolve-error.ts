export function resolveError(error: unknown, fallback = 'Ocurrio un error inesperado'): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
