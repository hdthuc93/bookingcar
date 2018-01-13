/* jshint indent: 2 */
import { sequelize, Sequelize } from './index-model';

const KhachHang = sequelize.define('khach_hang', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ten_kh: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  ngay_sinh: {
    type: Sequelize.DATE,
    allowNull: true
  },
  so_dt: {
    type: Sequelize.STRING(15),
    allowNull: false,
    unique: true
  },
  so_cmnd: {
    type: Sequelize.STRING(20),
    allowNull: true,
    unique: true
  }
}, {
  tableName: 'khach_hang'
});


export default KhachHang;
