/* jshint indent: 2 */
import { sequelize, Sequelize } from './index-model';

const KhachHang = sequelize.define('khach_hang', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ten_kh: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ngay_sinh: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  so_dt: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  so_cmnd: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'khach_hang'
});


export default KhachHang;
