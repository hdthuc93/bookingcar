/* jshint indent: 2 */
import { sequelize, Sequelize } from './index-model';
import LoaiNV from './loai_nv-model';
import bcrypt from 'bcrypt';

const NhanVien = sequelize.define('nhan_vien', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ten_nv: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  ngay_sinh: {
    type: Sequelize.DATE,
    allowNull: true,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  so_cmnd: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  ma_loai: {
    type: Sequelize.INTEGER(11),
    allowNull: false
  },
  username: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'nhan_vien'
});

NhanVien.beforeCreate((nhanvien, options) => {
  return bcrypt.genSalt(10)
    .then(salt => {
      return bcrypt.hash(nhanvien.password, salt, null);
    })
    .then(hash => {
      nhanvien.setDataValue('password', hash);
    })
    .catch(err => {
      console.log(err);
      return sequelize.Promise.reject(err);
    });
});

LoaiNV.hasMany(NhanVien, { foreignKey: 'ma_loai', sourceKey: 'id' });
NhanVien.belongsTo(LoaiNV, { foreignKey: 'ma_loai', targetKey: 'id' });

export default NhanVien;