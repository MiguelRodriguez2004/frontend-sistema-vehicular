import axiosInstance from '../api/axiosInstance';

/**
 * Servicio para interactuar con los endpoints de Vehículos en el backend.
 */
export const vehiculoService = {
  /**
   * Obtiene todos los vehículos del sistema.
   * GET /vehiculos
   */
  obtenerVehiculos: async () => {
    try {
      const response = await axiosInstance.get('/vehiculos');
      const payload = response.data;
      
      // Desenvolver si viene con la propiedad 'data'
      let rawData = payload;
      if (payload && typeof payload === 'object' && 'data' in payload) {
        rawData = payload.data;
      }
      return Array.isArray(rawData) ? rawData : [];
    } catch (error) {
      console.error('Error al obtener todos los vehículos:', error);
      throw error;
    }
  },

  /**
   * Obtiene los vehículos asociados a un cliente específico de forma normalizada.
   * GET /vehiculos?clienteId=123
   * 
   * @param {string|number} clienteId - ID del cliente
   * @returns {Promise<Array>} Garantiza el retorno de un arreglo válido de vehículos.
   */
  obtenerVehiculosPorCliente: async (clienteId) => {
    try {
      const response = await axiosInstance.get('/vehiculos', {
        params: { clienteId }
      });
      
      const payload = response.data;

      // Desenvolver si viene con la propiedad 'data'
      let rawData = payload;
      if (payload && typeof payload === 'object' && 'data' in payload) {
        rawData = payload.data;
      }

      // Normalización estricta de la respuesta para el frontend
      if (Array.isArray(rawData)) {
        return rawData;
      }
      if (rawData && typeof rawData === 'object') {
        return [rawData];
      }
      return [];
    } catch (error) {
      console.error(`Error al obtener vehículos del cliente ${clienteId}:`, error);
      throw error;
    }
  }
};

export default vehiculoService;
