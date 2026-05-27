import axiosInstance from '../api/axiosInstance';

/**
 * Servicio para interactuar con los endpoints de Órdenes de Trabajo en el backend.
 */
export const ordenService = {
  /**
   * Crea una nueva orden de trabajo en el backend.
   * POST /ordenes
   * 
   * @param {Object} data - Datos de la orden:
   *   - vehiculoId: number
   *   - tecnicoId: number
   *   - kilometraje: number
   *   - tipoServicio: 'PREVENTIVO' | 'CORRECTIVO' | 'DIAGNOSTICO'
   *   - diagnostico: string
   * @returns {Promise<Object>} Datos de la orden creada y normalizada.
   */
  crearOrden: async (data) => {
    try {
      const response = await axiosInstance.post('/ordenes', data);
      const payload = response.data;

      // Desenvolver si viene con la propiedad 'data'
      let rawData = payload;
      if (payload && typeof payload === 'object' && 'data' in payload) {
        rawData = payload.data;
      }
      return rawData;
    } catch (error) {
      console.error('Error al crear la orden de trabajo en el backend:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las órdenes de trabajo del sistema de forma relacionada.
   * GET /ordenes
   * 
   * @returns {Promise<Array>} Listado de órdenes de trabajo relacionado.
   */
  obtenerOrdenes: async () => {
    try {
      const response = await axiosInstance.get('/ordenes');
      return response.data?.data ?? [];
    } catch (error) {
      console.error('Error al obtener las órdenes de trabajo del backend:', error);
      throw error;
    }
  },

  /**
   * Obtiene una orden de trabajo por su identificador único.
   * GET /ordenes/:id
   * 
   * @param {string|number} id - Identificador de la orden.
   * @returns {Promise<Object|null>} Datos completos de la orden o null si no se encuentra.
   */
  obtenerOrdenPorId: async (id) => {
    try {
      const response = await axiosInstance.get(`/ordenes/${id}`);
      const payload = response.data;

      // Desenvolver si viene con la propiedad 'data'
      let rawData = payload;
      if (payload && typeof payload === 'object' && 'data' in payload) {
        rawData = payload.data;
      }
      return rawData ?? null;
    } catch (error) {
      console.error(`Error al obtener la orden de trabajo ${id} del backend:`, error);
      throw error;
    }
  },

  /**
   * Cambia el estado de una orden de trabajo.
   * PATCH /ordenes/:id/estado
   * 
   * @param {string|number} id - Identificador de la orden.
   * @param {string} estado - El nuevo estado (ej: 'RECIBIDO', 'EN_PROCESO').
   * @returns {Promise<Object>} Datos actualizados de la orden.
   */
  cambiarEstadoOrden: async (id, estado) => {
    try {
      const response = await axiosInstance.patch(`/ordenes/${id}/estado`, { estado });
      const payload = response.data;
      return payload?.data ?? payload;
    } catch (error) {
      console.error(`Error al cambiar el estado de la orden ${id} en el backend:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva novedad asociada a una orden.
   * POST /novedades
   * 
   * @param {string|number} ordenId - ID de la orden de trabajo.
   * @param {string} descripcion - Descripción o comentario técnico.
   * @param {string} [tipo='GENERAL'] - El tipo de la novedad (ESTETICO, MECANICO, ELECTRICO, GENERAL).
   * @returns {Promise<Object>} La novedad creada.
   */
  crearNovedad: async (ordenId, descripcion, tipo = 'GENERAL') => {
    try {
      const response = await axiosInstance.post('/novedades', {
        ordenId: Number(ordenId),
        descripcion,
        tipo
      });
      return response.data;
    } catch (error) {
      console.error(`Error al crear novedad para la orden ${ordenId} en el backend:`, error);
      throw error;
    }
  }
};

export default ordenService;
