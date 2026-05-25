import axiosInstance from '../api/axiosInstance';

/**
 * Servicio para interactuar con los endpoints de Clientes en el backend.
 */
export const clienteService = {
  /**
   * Obtiene todos los clientes registrados.
   * GET /clientes
   */
  obtenerClientes: async () => {
    try {
      const response = await axiosInstance.get('/clientes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los clientes:', error);
      throw error;
    }
  },

  /**
   * Busca un cliente por su número de identificación / documento.
   * GET /clientes?documento=12345
   * 
   * @param {string|number} documento - El número de documento del cliente a buscar.
   */
  buscarClientePorDocumento: async (documento) => {
    try {
      const response = await axiosInstance.get(`/clientes`, {
        params: { documento }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al buscar cliente con documento ${documento}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo cliente en el sistema.
   * POST /clientes
   * 
   * @param {Object} clienteData - Datos del cliente a registrar.
   */
  crearCliente: async (clienteData) => {
    try {
      const response = await axiosInstance.post('/clientes', clienteData);
      return response.data;
    } catch (error) {
      console.error('Error al registrar un nuevo cliente:', error);
      throw error;
    }
  }
};

export default clienteService;
