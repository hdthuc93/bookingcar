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
    allowNull: false
  },
  ngay_sinh: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  so_dt: {
    type: Sequelize.STRING(15),
    allowNull: false
  },
  so_cmnd: {
    type: Sequelize.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'khach_hang'
});


export default KhachHang;
