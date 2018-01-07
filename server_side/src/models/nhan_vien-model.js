/* jshint indent: 2 */
import { sequelize, Sequelize } from './index-model';
import LoaiNV from './loai_nv-model';

const NhanVien = sequelize.define('nhan_vien', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ten_nv: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ngay_sinh: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  so_cmnd: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  ma_loai: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  }
}, {
  tableName: 'nhan_vien'
});

LoaiNV.hasMany(NhanVien, { foreignKey: 'ma_loai', sourceKey: 'id' });
NhanVien.belongsTo(LoaiNV, { foreignKey: 'ma_loai', targetKey: 'id' });

export default NhanVien;