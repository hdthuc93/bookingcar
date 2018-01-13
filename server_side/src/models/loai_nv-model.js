/* jshint indent: 2 */
import { sequelize, Sequelize } from './index-model';

const LoaiNV = sequelize.define('loai_nv', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ten_loai: {
    type: Sequelize.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'loai_nv'
});

export default LoaiNV;