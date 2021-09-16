module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('roles', [
    {
      id: 'a0a76676-e446-49d2-ab7a-ae622783d7b8',
      roleName: 'student',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '437e0221-eb3d-477f-a3b3-799256fbcab6',
      roleName: 'teacher',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('roles', null),
};
