/* jshint indent: 2 */
import { sequelize, Sequelize } from './index-model';
import KhachHang from './khach_hang-model';
import Xe from './xe-model';

const DatXe = sequelize.define('dat_xe', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ma_xe: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  },
  ma_kh: {
    type: DataTypes.INTEGER(11),
    allowNull: true
  },
  xuat_phat: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  di_den: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  so_km: {
    type: DataTypes.DECIMAL,
    allowNull: true
  }
}, {
  tableName: 'dat_xe'
});

KhachHang.hasMany(DatXe, { foreignKey: 'ma_kh', sourceKey: 'id' });
DatXe.belongsTo(KhachHang, { foreignKey: 'ma_kh', targetKey: 'id' });

Xe.hasMany(DatXe, { foreignKey: 'ma_xe', sourceKey: 'id' });
DatXe.belongsTo(Xe, { foreignKey: 'ma_xe', targetKey: 'id' });

export default DatXe;