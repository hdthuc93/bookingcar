using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
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

        private void btnLuu_Click(object sender, EventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(txtSoDienThoai.Text))
                {
                    MessageBox.Show("Vui lòng nhập số điện thoại");
                    return;
                }
                    

                var json = JsonConvert.SerializeObject(new
                {
                    dt_kh = txtSoDienThoai.Text.Trim(),
                    ma_xe = string.Empty,
                    ma_loai_xe = cboLoaiXe.SelectedIndex,
                    status = 0,
                    tg_date = Function.ConvertDateTimeToTimestamp(DateTime.Now),
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
    }
}
