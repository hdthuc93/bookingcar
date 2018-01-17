using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Telephonist
{
    public partial class FrmMain : Form
    {
        public FrmMain()
        {
            InitializeComponent();
            cboLoaiXe.SelectedIndex = 0;
        }
        
        private void txtSoDienThoai_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (!Char.IsDigit(e.KeyChar) && !Char.IsControl(e.KeyChar))
            {
                e.Handled = true;
            }
        }

        private void btnThoat_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void FrmMain_Load(object sender, EventArgs e)
        {
            LoadListDatXe();
            timer1.Start();
        }

        private void LoadListDatXe()
        {
            var request = (HttpWebRequest)WebRequest.Create("https://bookingcar-a2d85.firebaseio.com/booking/.json");

            var response = (HttpWebResponse)request.GetResponse();

            var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();

            var firebaseLookup = JsonConvert.DeserializeObject<Dictionary<string, DatXe>>(responseString);
            if (firebaseLookup != null)
            {
                var data = firebaseLookup.Values.ToList();
                foreach (DatXe item in data)
                {
                    if (item.Ma_loai_xe == "1")
                        item.Ten_loai_xe = "Premium";
                    else
                        item.Ten_loai_xe = "Thường";
                    if ( !string.IsNullOrEmpty(item.Tg_dat))
                    {
                        double temp;
                        double.TryParse(item.Tg_dat, out temp);
                        item.Tg_dat = Function.UnixTimeStampToDateTime(temp).ToString("dd/MM/yyyy h:mm tt");
                    }
                    if (item.Status != null)
                    {
                        if ( int.Parse(item.Status) == (int)Enums.Status.ChuaDinhVi)
                        {
                            item.Status = "Chưa định vị";
                        }
                        else if ( int.Parse(item.Status) == (int)Enums.Status.DaDinhVi)
                        {
                            item.Status = "Đã định vị";
                        }
                        else if (int.Parse(item.Status) == (int)Enums.Status.DangDiChuyen)
                        {
                            item.Status = "Đang di chuyển";
                        }
                        else if (int.Parse(item.Status) == (int)Enums.Status.HoanTatChuyenDi)
                        {
                            item.Status = "Hoàn tất chuyến đi";
                        }
                        else if (int.Parse(item.Status) == (int)Enums.Status.KhongCoXe)
                        {
                            item.Status = "Không có xe";
                        }
                        else if (int.Parse(item.Status) == (int)Enums.Status.XeDaNhan)
                        {
                            item.Status = "Xe đã nhận";
                        }
                    }
                }
                gcDatXe.DataSource = data;
            }
        }

        private void btnDatXe_Click(object sender, EventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(txtSoDienThoai.Text))
                {
                    MessageBox.Show("Vui lòng nhập số điện thoại");
                    return;
                }
                if (!(txtSoDienThoai.Text.Length <= 11))
                {
                    MessageBox.Show("Số điện thoại không hợp lệ. Xin vui lòng nhập lại!");
                    return;
                }

                var json = JsonConvert.SerializeObject(new
                {
                    dt_kh = txtSoDienThoai.Text.Trim(),
                    ma_xe = string.Empty,
                    ma_loai_xe = cboLoaiXe.SelectedIndex,
                    status = 0,
                    tg_dat = Function.ConvertDateTimeToTimestamp(DateTime.Now),
                    xuat_phat = txtDiaChiDon.Text,
                    xuat_phat_toa_do = string.Empty
                });

                var request = WebRequest.CreateHttp("https://bookingcar-a2d85.firebaseio.com/booking/.json");
                request.Method = "POST";
                request.ContentType = "application/json";
                var buffer = Encoding.UTF8.GetBytes(json);
                request.ContentLength = buffer.Length;
                request.GetRequestStream().Write(buffer, 0, buffer.Length);
                var response = request.GetResponse();
                json = (new StreamReader(response.GetResponseStream())).ReadToEnd();
                if (((HttpWebResponse)response).StatusCode == HttpStatusCode.OK)
                {
                    MessageBox.Show("Đặt xe thành công", this.Text, MessageBoxButtons.OK, MessageBoxIcon.Information);
                    LoadListDatXe();
                }
                else
                {
                    MessageBox.Show("Đặt xe không thành công", this.Text, MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void btnThoat_Click_1(object sender, EventArgs e)
        {
            this.Close();
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            LoadListDatXe();
        }
    }
}
