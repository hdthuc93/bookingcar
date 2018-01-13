import NhanVien from '../models/nhan_vien-model';
import conn from '../configs/connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function register(req, res) {
    let user = {
        ten_nv: req.body.real_name,
        ngay_sinh: new Date(req.body.birthday).getTime(),
        so_cmnd: req.body.id_number,
        username: req.body.username,
        password: req.body.password,
        ma_loai: req.body.user_type
    }

    try {
        let found = await NhanVien.findOne({ where: { username: user.username }});

        if(found) {
            return res.status(400).json({
                msg: 'username is existed',
                success: false
            });
        }
        await NhanVien.create(user);
        return res.status(201).json({
            msg: 'create user successfully',
            success: true
        });

    } catch(ex) {
        console.log(ex);
        return res.status(500).json({
            msg: 'Fail to register, some errors in server, try again later',
            success: false
        });
    }
}

function login(req, res) {
    NhanVien.findOne({ where: { username: req.body.username }}).then((user) => {
        if(!user) {
            return res.status(200).json({
                success: false,
                message: "Email or password incorrect"
            });
        }

        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to authenticate user"
                });
            } 

            if(isMatch) {
                jwt.sign({ username: user.username, user_type: user.ma_loai }, conn.secretKey, 
                        { algorithm: 'HS256', expiresIn: 60 * 60 * 24 * 7 }, (err, token) => {
                    if(err) {
                        return res.status(500).json({
                            success: false,
                            message: "Error, cannot response a token"
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: "Login successfully",
                        data: {
                            real_name: user.real_name,
                            username: user.username,
                            // role: user.user_type_id,
                            token: token
                        }
                    });
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Username or password incorrect"
                });
            }
        })
    });
}

export default { register, login }