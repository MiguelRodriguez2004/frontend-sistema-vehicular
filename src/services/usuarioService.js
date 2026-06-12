import axiosInstance from '../api/axiosInstance';

/**
 * Servicio para interactuar con los endpoints del perfil de usuario en el backend.
 */
export const usuarioService = {
  /**
   * Obtiene el perfil del usuario autenticado desde el backend.
   * GET /usuarios/me
   *
   * @returns {Promise<Object>} Datos del perfil (id, nombre, email, rol, activo, createdAt).
   */
  obtenerPerfil: async () => {
    try {
      const response = await axiosInstance.get('/usuarios/me');
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      throw error;
    }
  },

  /**
   * Actualiza el perfil del usuario autenticado.
   * PATCH /usuarios/me
   *
   * @param {Object} data - Campos a actualizar ({ nombre: string }).
   * @returns {Promise<Object>} Datos del perfil actualizado.
   */
  actualizarPerfil: async (data) => {
    try {
      const response = await axiosInstance.patch('/usuarios/me', data);
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
      throw error;
    }
  },
};

export default usuarioService;
