# Productos financieros

Aplicacion React Native con Expo para administrar productos financieros consumiendo los servicios locales.

## Scripts

```bash
npm install
npm run start
npm run lint
npm run test
```

La API se consume desde `http://localhost:3002` por defecto. Ese valor esta configurado en `app.json` como `extra.apiBaseUrl`.

## Funcionalidades

- Listado de productos con busqueda y contador de registros.
- Detalle de producto con acciones de editar y eliminar.
- Alta y edicion con validaciones de campos, fechas e ID existente.
- Eliminacion con modal de confirmacion.
- Manejo visual de errores y skeleton de carga.
- Pruebas unitarias con umbral minimo de 70% de cobertura.

## Ajustes realizados al backend local

Para poder consumir la API desde Expo web, se modifico `../repo-interview-main/src/main.ts` y se habilito CORS para los origenes locales usados por el frontend:

- `http://localhost:8081`
- `http://127.0.0.1:8081`
- `http://localhost:19006`
- `http://127.0.0.1:19006`

Motivo: cuando la app corre en navegador, el frontend se sirve desde un origen distinto al backend (`http://localhost:3002`). Sin la cabecera `Access-Control-Allow-Origin`, el navegador bloquea las solicitudes aunque el backend responda con estado 200.

Se agregaron tambien las dependencias `cors` y `@types/cors` en `../repo-interview-main/package.json`, porque `routing-controllers` requiere el paquete `cors` para aplicar la configuracion anterior.