/* jshint indent: 2 */
import { sequelize, Sequelize } from './index-model';

const LoaiXe = sequelize.define('loai_xe', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ten_loai: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  so_tien_1_km: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  tableName: 'loai_xe'
});

export default LoaiXe;