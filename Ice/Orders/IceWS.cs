using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// Summary description for IceWS
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class IceWS : System.Web.Services.WebService
{
    private static string conStr = ConfigurationManager.ConnectionStrings["IceDB"].ConnectionString;
    public IceWS()
    {
        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    //[WebMethod]
    //public string[] CurrentDateAndTime()
    //{
    //    string[] time = new string[2];
    //    time[0] = DateTime.Now.ToShortTimeString();
    //    time[1] = DateTime.Now.ToShortDateString();
    //    return time;
    //}
    [WebMethod]
    public List<Yep> GetYepBranches()
    {
        string sp = "sp_getBranches";
        return ConvertDataToString(getTable(sp));
    }

    [WebMethod]
    public int addProduct(string ProductName)
    {
        int rows;
        string sp = "sp_addProduct";
        SqlConnection con = new SqlConnection(conStr);
        SqlCommand com = new SqlCommand(sp, con);
        com.CommandType = CommandType.StoredProcedure;
        com.Parameters.AddWithValue("@ProductName", ProductName);
        com.Connection.Open();
        rows = com.ExecuteNonQuery();
        return rows;
    }

    [WebMethod]
    public List<Yep> GetProducts()
    {
        string sp = "sp_getProducts";
        return ConvertDataToString(getTable(sp));
    }

    [WebMethod]
    public int addFlavor(string Flavor)
    {
        int rows = 0;
        string sp = "sp_addFlavor";
        SqlConnection con = new SqlConnection(conStr);
        SqlCommand com = new SqlCommand(sp, con);
        com.CommandType = CommandType.StoredProcedure;
        com.Parameters.AddWithValue("@Flavor", Flavor);
        com.Connection.Open();
        rows = com.ExecuteNonQuery();
        return rows;
    }

    [WebMethod]
    public List<Yep> GetFlavors()
    {
        string sp = "sp_getFlavors";
        return ConvertDataToString(getTable(sp));
    }

    [WebMethod]
    public List<Yep> GetNumofFlavors()
    {
        string sp = "sp_getNumOfFlavors";
        return ConvertDataToString(getTable(sp));
    }

    [WebMethod]
    public List<Yep> GetAddOns()
    {
        string sp = "sp_getAddons";
        return ConvertDataToString(getTable(sp));
    }


    [WebMethod]
    public List<Yep> GetSizes()
    {
        string sp = "sp_getSizes";
        return ConvertDataToString(getTable(sp));
    }

    private DataSet getTable(string command)
    {
        DataSet ds = new DataSet();
        using (SqlConnection con = new SqlConnection(conStr))
        {
            using (SqlCommand cmd = new SqlCommand(command, con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
        }
        return ds;
    }


    private List<Yep> ConvertDataToString(DataSet ds)
    {
        List<Yep> rows = new List<Yep>();

        foreach (DataTable dt in ds.Tables)
        {
            foreach (DataRow dr in dt.Rows)
            {
                Yep row;
                foreach (DataColumn col in dt.Columns)
                {
                    row = new Yep(col.ColumnName, dr[col]);
                    rows.Add(row);
                }

            }
        }
        return rows;
    }
}

public class Yep
{
    public string colName { get; set; }
    public object value { get; set; }
    public Yep(string colName, object value) { this.colName = colName; this.value = value; }
  
}