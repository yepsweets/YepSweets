using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Ice_Admin
{
    public partial class branches : System.Web.UI.Page
    {
        private static string conStr = ConfigurationManager.ConnectionStrings["IceDB"].ConnectionString;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                GridView1.Visible = false;
                newBranchDetails.Visible = false;
            }
        }

        protected void show_branches_Click(object sender, EventArgs e)
        {
            GridView1.Visible = true;
        }
        protected void hide_branches_Click(object sender, EventArgs e)
        {
            GridView1.Visible = false;
        }

        protected void add_branch_button_Click(object sender, EventArgs e)
        {
            newBranchDetails.Visible = true;
        }

        protected void AddToDbButton_Click(object sender, EventArgs e)
        {
            SqlConnection con = new SqlConnection(conStr);
            SqlCommand cmd = new SqlCommand("sp_addBranch", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@BranchName", BranchNameTextBox.Text);
            if (!KosherCheckBox.Checked)
                cmd.Parameters.AddWithValue("@Kosher", "False");
            cmd.Parameters.AddWithValue("@Kosher", "True");
            cmd.Parameters.AddWithValue("@Address", AddressTextBox.Text);
            cmd.Parameters.AddWithValue("@Longitude", Convert.ToDecimal(LongitudeTextBox.Text));
            cmd.Parameters.AddWithValue("@Latitude", Convert.ToDecimal(LatitudeTextBox.Text));
            cmd.Parameters.AddWithValue("@Photo", PhotoTextBox.Text);
            cmd.Parameters.AddWithValue("@MidWeek", "Sunday-Thursday");
            cmd.Parameters.AddWithValue("@MidWeekOpenHours", MidWeekOpenHoursTextBox.Text);
            cmd.Parameters.AddWithValue("@Weekend", "Friday");
            cmd.Parameters.AddWithValue("@WeekendOpenHours", MidWeekOpenHoursTextBox.Text);
            cmd.Parameters.AddWithValue("@Telephone", TelephoneTextBox.Text);
            cmd.Parameters.AddWithValue("@Manager", ManagerTextBox.Text);
            cmd.Connection.Open();
            cmd.ExecuteNonQuery();
            cmd.Connection.Close();
            Response.Write("Operation success");
            
            Page.Response.Redirect("branches.aspx");
        }
    }
}