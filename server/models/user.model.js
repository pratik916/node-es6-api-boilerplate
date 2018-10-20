module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary and auto increment key of the table',
    },

    firstName: {
      field: 'first_name',
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'First name',
    },

    lastName: {
      field: 'last_name',
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      comment: 'Last name',
    },

    email: {
      field: 'email',
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Email of user',
      validate: {
        isUnique(value, next) {
          const self = this;

          User.find({
              where: {
                email: value,
              },
            })
            .then((user) => {
              if (user && self.id !== user.id) {
                return next('Email is already in use');
              }

              return next();
            })
            .catch(err => next(err));
        },
      },
    },

    password: {
      field: 'password',
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'User password',
    },

    salt: DataTypes.STRING,

    forgotPwdSalt: {
      field: 'forgot_pwd_salt',
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Forgot password salt',
    },

    status: {
      field: 'status',
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE',
      comment: 'User is active, inactive',
    },
  }, {
    freezeTableName: true,
    tableName: 'users',
  });

  User.associate = (models) => {
    User.belongsTo(models.Company, {
      as: 'Company',
      constraints: true,
      foreignKey: {
        name: 'companyId',
        field: 'company_id',
        allowNull: false,
      },
    });

    User.belongsTo(models.Role, {
      as: 'Role',
      constraints: true,
      foreignKey: {
        name: 'roleId',
        field: 'role_id',
        allowNull: false,
      },
    });

    User.belongsToMany(models.Permission, {
      through: 'user_permission',
      as: 'UserPermission',
      constraints: true,
      foreignKey: {
        name: 'userId',
        field: 'user_id',
        allowNull: false,
      },
    });
  };

  return User;
};