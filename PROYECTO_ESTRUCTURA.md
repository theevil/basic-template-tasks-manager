# Estructura del Proyecto Redux + Axios

## 📁 Árbol de carpetas

```
src/
├── api/
│   └── client.ts                    # Cliente HTTP Axios
├── store/
│   ├── store.ts                     # Configuración del Store Redux
│   ├── hooks/
│   │   └── index.ts                 # Hooks personalizados (useAppDispatch, useAppSelector)
│   └── slices/
│       ├── exampleSlice.ts          # Slice de ejemplo
│       └── [tuSlice].ts             # Tus slices aquí
├── types/
│   └── index.ts                     # Tipos TypeScript globales
├── components/
│   ├── ExampleComponent.tsx         # Componente de ejemplo
│   └── [tuComponente].tsx           # Tus componentes aquí
├── pages/
│   └── ...
└── ...
```

## 🚀 Pasos iniciales

1. **Configurar Store**: El store ya está configurado en `src/store/store.ts`
2. **Crear Slices**: Crear nuevos slices en `src/store/slices/`
3. **Registrar en Store**: Importar y registrar nuevos slices en `store.ts`
4. **Usar en Componentes**: Usar `useAppDispatch` y `useAppSelector` en tus componentes
5. **Configurar API**: Usar `apiClient` para llamadas HTTP

## 📝 Variables de Entorno

Ver `.env.example` para configurar:
- `VITE_API_URL`: URL base de la API

## 📚 Dependencias instaladas

- **@reduxjs/toolkit**: ^2.10.1
- **react-redux**: ^8.1.3
- **axios**: ^1.13.2
- **immer**: ^10.2.0

## 💡 Ejemplo rápido

Ver `REDUX_SETUP.md` para ejemplos detallados de uso.
