export const soloLetras = (value: string) =>
  value.trim() === ""
    ? true
    : /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value.trim());

export const soloNumeros = (value: string) =>
  value === ""
    ? true
    : /^[0-9]+$/.test(value);

export const alfanumerico = (value: string) =>
  /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/.test(value.trim());

export const noVacio = (value: string) =>
  value.trim().length > 0;

export const emailValido = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const telefonoValido = (value: string) =>
  /^[0-9]{6,15}$/.test(value);

export const ciValido = (value: string) =>
  /^[0-9]{5,12}$/.test(value);

export const salarioValido = (value: string) =>
  !isNaN(Number(value)) && Number(value) >= 0;

export const soloLetrasConEspacios = (value: string) =>
  /^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value.trim());