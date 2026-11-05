import { useCallback, useEffect, useRef, useState } from 'react';

// Hook para mostrar avisos (éxito / error) que desaparecen solos.
export function useAviso(duracion = 3500) {
  const [aviso, setAviso] = useState(null); // { tipo: 'exito' | 'error', texto }
  const temporizador = useRef(null);

  const cerrar = useCallback(() => {
    clearTimeout(temporizador.current);
    setAviso(null);
  }, []);

  const mostrar = useCallback(
    (tipo, texto) => {
      clearTimeout(temporizador.current);
      setAviso({ tipo, texto, id: Date.now() });
      // Los errores se quedan más tiempo para que se alcancen a leer
      temporizador.current = setTimeout(() => setAviso(null), tipo === 'error' ? duracion * 2 : duracion);
    },
    [duracion]
  );

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const exito = useCallback((texto) => mostrar('exito', texto), [mostrar]);
  const error = useCallback((texto) => mostrar('error', texto), [mostrar]);

  return { aviso, cerrar, exito, error };
}
