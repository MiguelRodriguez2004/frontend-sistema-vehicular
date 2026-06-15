import axiosInstance from '../api/axiosInstance';

/**
 * Servicio para interactuar con los endpoints administrativos de usuarios.
 * Todos los endpoints están protegidos y solo accesibles por usuarios con rol ADMIN.
 */
export const adminService = {
  /**
   * Obtiene la lista completa de usuarios del sistema.
   * GET /admin/users
   */
  listarUsuarios: async () => {
    const response = await axiosInstance.get('/admin/users');
    return response.data?.data ?? response.data;
  },

  /**
   * Obtiene un usuario específico por su ID.
   * GET /admin/users/:id
   */
  obtenerUsuario: async (id) => {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data?.data ?? response.data;
  },

  /**
   * Crea un nuevo usuario en la base de datos local.
   * POST /admin/users
   * @param {Object} data - { nombre, email, rol }
   */
  crearUsuario: async (data) => {
    const response = await axiosInstance.post('/admin/users', data);
    return response.data;
  },

  /**
   * Actualiza los datos de un usuario existente.
   * PUT /admin/users/:id
   * @param {number} id - ID del usuario.
   * @param {Object} data - { nombre?, email?, rol? }
   */
  actualizarUsuario: async (id, data) => {
    const response = await axiosInstance.put(`/admin/users/${id}`, data);
    return response.data;
  },

  /**
   * Activa o desactiva un usuario.
   * PATCH /admin/users/:id/status
   * @param {number} id - ID del usuario.
   * @param {boolean} activo - true para activar, false para desactivar.
   */
  cambiarEstado: async (id, activo) => {
    const response = await axiosInstance.patch(`/admin/users/${id}/status`, { activo });
    return response.data;
  },
};

export default adminService;
