module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER(2).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary and auto increment key of the table',
    },

    roleName: {
      field: 'role_name',
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Name of role',
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: 'Role description',
    },

    status: {
      field: 'status',
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE',
      comment: 'Role is active, inactive',
    },
  }, {
    freezeTableName: true,
    tableName: 'role',
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      as: 'Users',
      constraints: true,
      foreignKey: {
        name: 'roleId',
        field: 'role_id',
        allowNull: false,
      },
    });

    Role.belongsToMany(models.Permission, {
      through: 'role_permission',
      as: 'RolePermission',
      constraints: true,
      foreignKey: {
        name: 'roleId',
        field: 'role_id',
        allowNull: false,
      },
    });
  };
  return Role;
};
