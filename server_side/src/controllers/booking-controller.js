import DatXe from '../models/dat_xe-model';
import KhachHang from '../models/khach_hang-model';

async function create(req, res) {
    let inObj = {
        ma_xe: req.body.ma_xe,
        ma_kh: undefined,
        xuat_phat: req.body.xuat_phat
    };

    try {
        if(req.body.dt_kh) {
            let result = await KhachHang.findOne({ where: { so_dt: req.body.dt_kh } });
            inObj.ma_kh = result.id;
        }
    
        await DatXe.create(inObj);
    
        return res.status(201).json({
            msg: 'create booking successfully',
            success: true
        });
    } catch(ex) {
        console.log(ex);
        return res.status(500).json({
            msg: 'Fail to create booking',
            success: false
        });
    }
}

export default { create };