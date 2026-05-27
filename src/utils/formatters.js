/**
 * Formatea una fecha ISO o string a un formato visualmente limpio (YYYY-MM-DD).
 * 
 * @param {string} dateString - Fecha a formatear.
 * @returns {string} Fecha formateada o fallback.
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    // Formato estético y legible local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString;
  }
};

/**
 * Convierte un kilometraje a un formato legible con separador de miles.
 * Ejemplo: 43000 -> 43.000 km
 * 
 * @param {number|string} value - Kilometraje crudo.
 * @returns {string} Kilometraje formateado.
 */
export const formatKilometraje = (value) => {
  const num = Number(value);
  if (isNaN(num)) return `${value || 0} km`;
  
  // Utiliza el formateo en español para separar miles por puntos
  return `${num.toLocaleString('es-CO')} km`;
};

/**
 * Trunca un texto largo para proteger el diseño y agrega puntos suspensivos.
 * 
 * @param {string} text - Texto a truncar.
 * @param {number} [maxLength=50] - Límite de caracteres.
 * @returns {string} Texto truncado.
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export default {
  formatDate,
  formatKilometraje,
  truncateText
};
