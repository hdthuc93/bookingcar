import NhanVien from '../models/nhan_vien-model';
import Xe from '../models/xe-model';
import conn from '../configs/connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import firebase from 'firebase/app';
import admin from 'firebase-admin';
import config from '../configs/connection';
import serviceAccount from '../configs/firebase_auth.json';
// const serviceAccount = require("../configs/firebase_auth.json");

const fbApp = admin.initializeApp({
    databaseURL: config.databaseFBURL,
    credential: admin.credential.cert(serviceAccount)
});

const fbDB = fbApp.database();

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

        bcrypt.compare(req.body.password, user.password, async function(err, isMatch) {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to authenticate user"
                });
            } 

            if(isMatch) {
                let result = await Xe.findOne({ where: { ma_tai_xe: user.id }});
                jwt.sign({ username: user.username, user_type: user.ma_loai }, conn.secretKey, 
                        { algorithm: 'HS256', expiresIn: 60 * 60 * 24 * 7 }, async (err, token) => {
                    if(err) {
                        return res.status(500).json({
                            success: false,
                            message: "Error, cannot response a token"
                        });
                    }

                    let fbToken = await admin.auth().createCustomToken(user.username);

                    return res.status(200).json({
                        success: true,
                        message: "Login successfully",
                        data: {
                            name: user.ten_nv,
                            user_id: user.username,
                            car_id: result.id,
                            // role: user.user_type_id,
                            token: token,
                            fbToken: fbToken
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