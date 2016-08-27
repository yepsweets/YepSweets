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
    public partial class Site_Admin : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void Login1_Authenticate(object sender, AuthenticateEventArgs e)
        {
            int res;
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["IceDB"].ConnectionString);
            SqlCommand cmd = new SqlCommand("sp_doValidateUser", con);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            con.Open();
            cmd.Parameters.AddWithValue("@UserEmail", Login1.UserName);
            cmd.Parameters.AddWithValue("@UserPassword", Login1.Password);
            SqlParameter outp = new SqlParameter("@RES", SqlDbType.Int);

            SqlDataReader reader = cmd.ExecuteReader();
            reader.Read();
            res = Convert.ToInt32(reader[0]);
            if ( res == 1 )
                e.Authenticated = true;
            else e.Authenticated = false;


        }
    }
}