/* jshint indent: 2 */
import { sequelize, Sequelize } from './index-model';

const LoaiNV = sequelize.define('loai_nv', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ten_loai: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'loai_nv'
});

export default LoaiNV;