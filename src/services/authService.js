import axiosInstance from '../api/axiosInstance';

/**
 * Servicio para interactuar con los endpoints de autenticación en el backend.
 */
const authService = {
  /**
   * Inicia sesión con correo y contraseña.
   * POST /auth/login
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} Datos del usuario y token.
   */
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  /**
   * Restablece la contraseña de un usuario usando un token válido.
   * POST /auth/reset-password
   *
   * @param {string} token - Token de reseteo enviado al correo.
   * @param {string} newPassword - Nueva contraseña.
   * @returns {Promise<Object>} Respuesta del backend.
   */
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Error en reset password:', error);
      throw error;
    }
  },
};

export default authService;
