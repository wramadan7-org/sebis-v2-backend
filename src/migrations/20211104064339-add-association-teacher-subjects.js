module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'gradeGroups',
      'curriculumId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'curriculums',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true,
        after: 'id',
      },
    );

    await queryInterface.addColumn(
      'grades',
      'gradeGroupId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'gradeGroups',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true,
        after: 'id',
      },
    );

    await queryInterface.addColumn(
      'teacherSubjects',
      'gradeId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'grades',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'id',
      },
    );

    await queryInterface.addColumn(
      'teacherSubjects',
      'subjectId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'subjects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'gradeId',
      },
    );

    await queryInterface.addColumn(
      'teacherSubjects',
      'teacherId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'gradeId',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'gradeGroups',
      'curriculumId',
    );

    await queryInterface.removeColumn(
      'grades',
      'gradeGroupId',
    );

    await queryInterface.removeColumn(
      'teacherSubject',
      'gradeId',
    );

    await queryInterface.removeColumn(
      'teacherSubject',
      'subjectId',
    );

    await queryInterface.removeColumn(
      'teacherSubject',
      'teacherId',
    );
  },
};
