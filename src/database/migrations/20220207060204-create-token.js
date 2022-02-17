'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('tokens',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        type:Sequelize.TEXT,
        allowNull:false
      },
      device: Sequelize.STRING,
      user_id: {
        type:Sequelize.STRING,
        allowNull:false
      },
      status: {
          type:Sequelize.STRING,
          defaultValue:'active'
      },
      expired_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tokens');
  }
};
