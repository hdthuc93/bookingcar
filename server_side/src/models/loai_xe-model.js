/* jshint indent: 2 */
import { sequelize, Sequelize } from './index-model';

const LoaiXe = sequelize.define('loai_xe', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ten_loai: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  so_tien_1_km: {
    type: Sequelize.DECIMAL,
    allowNull: false
  }
}, {
  tableName: 'loai_xe'
});

export default LoaiXe;