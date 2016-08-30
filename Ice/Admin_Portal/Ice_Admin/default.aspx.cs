using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Ice_Admin
{
    public partial class _default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
//
        }

        protected void branches_click(object sender, ImageClickEventArgs e)
        {
            Response.Redirect("branches.aspx");
        }

        protected void users_click(object sender, ImageClickEventArgs e)
        {
            Response.Redirect("branches.aspx");

        }

        protected void products_click(object sender, ImageClickEventArgs e)
        {
            Response.Redirect("branches.aspx");

        }

        protected void orders_click(object sender, ImageClickEventArgs e)
        {
            Response.Redirect("branches.aspx");

        }

        protected void details_click(object sender, ImageClickEventArgs e)
        {
            Response.Redirect("branches.aspx");

        }
    }
}