/* jshint indent: 2 */
import { sequelize, Sequelize } from './index-model';
import KhachHang from './khach_hang-model';
import Xe from './xe-model';

const DatXe = sequelize.define('dat_xe', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ma_xe: {
    type: Sequelize.INTEGER(11),
    allowNull: false
  },
  ma_kh: {
    type: Sequelize.INTEGER(11),
    allowNull: true
  },
  xuat_phat: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  di_den: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  so_km: {
    type: Sequelize.DECIMAL,
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