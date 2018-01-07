/* jshint indent: 2 */
import { sequelize, Sequelize } from './index-model';
import NhanVien from './nhan_vien-model';

const Xe = sequelize.define('xe', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  bien_so_xe: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  ma_loai: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'loai_xe',
      key: 'id'
    }
  },
  ma_tai_xe: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  }
}, {
  tableName: 'xe'
});

NhanVien.hasMany(Xe, { foreignKey: 'ma_tai_xe', sourceKey: 'id' });
Xe.belongsTo(NhanVien, { foreignKey: 'ma_tai_xe', targetKey: 'id' });

export default Xe;