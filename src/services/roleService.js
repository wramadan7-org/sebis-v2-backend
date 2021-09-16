const httpStatus = require('http-status');
const { Role } = require('../models/Role');
const ApiError = require('../utils/ApiError');

/**
 * Create new role
 * @param roleBody
 * @return {Promise<void | Role>}
 */
const createRole = async (roleBody) => Role.create(roleBody, { include: ['role', 'school'] });

/**
 * Get role by ID
 * @param roleId
 * @return {Promise<ApiError | Role>}
 */
const getRoleById = async (roleId) => {
  const role = await Role.findByPk(roleId);
  if (!role) throw new ApiError(httpStatus.NOT_FOUND, 'Role not found.');
  return role;
};

/**
 * Update role by ID
 * @param roleId
 * @param roleBody
 * @return {Promise<ApiError|Role>}
 */
const updateRoleById = async (roleId, roleBody) => {
  const role = await getRoleById(roleId);

  Object.assign(role, roleBody);
  await role.save();

  return role;
};

/**
 * Delete role by ID
 * @param roleId
 * @return {Promise<ApiError|Role>}
 */
const deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);

  await role.destroy();

  return role;
};

module.exports = {
  createRole,
  getRoleById,
  updateRoleById,
  deleteRoleById,
};
