import { RoleModel } from '../models/role.model.js';

/**
 * @module RoleController
 * @description Controlador para gestionar el ciclo de vida de los roles y sus permisos.
 */

/**
 * Obtiene todos los roles registrados en el sistema.
 * @param {Object} req - Objeto de petición Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 */
export const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los roles", error: error.message });
  }
};

/**
 * Obtiene un rol específico por su identificador.
 * @param {Object} req - Objeto de petición Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await RoleModel.findById(id);

    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    res.json(role);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el rol", error: error.message });
  }
};

/**
 * Crea un nuevo rol en el sistema.
 * @param {Object} req - Objeto de petición Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const createRole = async (req, res) => {
  try {
    const newRole = await RoleModel.create(req.body);
    res.status(201).json({
      message: "Rol creado exitosamente",
      data: newRole
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el rol", error: error.message });
  }
};

/**
 * Actualiza completamente un rol existente.
 * @param {Object} req - Objeto de petición Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRole = await RoleModel.update(id, req.body);

    if (!updatedRole) {
      return res.status(404).json({ message: "Rol no encontrado para actualizar" });
    }

    res.json({ message: "Rol actualizado completamente", data: updatedRole });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el rol", error: error.message });
  }
};

/**
 * Actualiza parcialmente los campos de un rol.
 * @param {Object} req - Objeto de petición Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const patchRole = async (req, res) => {
  try {
    const { id } = req.params;
    const patchedRole = await RoleModel.patch(id, req.body);

    if (!patchedRole) {
      return res.status(404).json({ message: "Rol no encontrado para actualización parcial" });
    }

    res.json({ message: "Rol actualizado parcialmente", data: patchedRole });
  } catch (error) {
    res.status(500).json({ message: "Error al aplicar cambios al rol", error: error.message });
  }
};

/**
 * Elimina un rol del sistema.
 * @param {Object} req - Objeto de petición Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RoleModel.delete(id);

    if (!result) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    res.json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el rol", error: error.message });
  }
};

/**
 * Consulta los permisos asociados a un rol específico.
 * @param {Object} req - Objeto de petición Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const getRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const permissions = await RoleModel.getPermissionsByRoleId(id);
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener permisos del rol", error: error.message });
  }
};

/**
 * Sincroniza los permisos de un rol (reemplaza los actuales por nuevos).
 * @param {Object} req - Objeto de petición Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const assignRolePermissions = async (req, res) => {
  try {
    const { id } = req.params; // ID del rol
    const { permissionIds } = req.body; // Arreglo de IDs de permisos

    // Lógica clave: El modelo se encarga de limpiar e insertar en la tabla pivote
    await RoleModel.syncPermissions(id, permissionIds);

    res.json({ message: "Permisos sincronizados correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al asignar permisos", error: error.message });
  }
};