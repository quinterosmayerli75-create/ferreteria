import { useCallback, useEffect, useRef, useState } from 'react';

// Hook para mostrar avisos (éxito / error) que desaparecen solos.
export function useAviso(duracion = 4000) {
  const [aviso, setAviso] = useState(null); // { tipo: 'exito' | 'error', texto }
  const temporizador = useRef(null);

  const cerrar = useCallback(() => {
    clearTimeout(temporizador.current);
    setAviso(null);
  }, []);

  const mostrar = useCallback(
    (tipo, texto) => {
      clearTimeout(temporizador.current);
      setAviso({ tipo, texto });
      // Los errores se quedan un poco más para que se alcancen a leer
      temporizador.current = setTimeout(() => setAviso(null), tipo === 'error' ? duracion * 1.75 : duracion);
    },
    [duracion]
  );

  useEffect(() => () => clearTimeout(temporizador.current), []);

  return {
    aviso,
    cerrar,
    exito: useCallback((texto) => mostrar('exito', texto), [mostrar]),
    error: useCallback((texto) => mostrar('error', texto), [mostrar]),
  };
}
