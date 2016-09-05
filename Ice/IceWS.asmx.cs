using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Globalization;
using System.Text.RegularExpressions;


/// <summary>
/// Summary description for IceWS
/// </summary>
[WebService(Namespace = "http://yep.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class IceWS : System.Web.Services.WebService
{
    private static string conStr = ConfigurationManager.ConnectionStrings["IceDB"].ConnectionString;
    private static JavaScriptSerializer ser = new JavaScriptSerializer();
    public IceWS()
    {
        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }


    [WebMethod]
    public string UploadFile()
    {
        string lreturn = "success";
        try
        {
            HttpPostedFile file = HttpContext.Current.Request.Files["file"];
            string saveFile = System.Web.HttpContext.Current.Request.MapPath(".")+"\\postedFiles\\" + file.FileName;
            file.SaveAs(System.Web.HttpContext.Current.Request.MapPath(".") + "\\postedFiles\\" + file.FileName);
        }
        catch (Exception ex)
        {
            lreturn = "fail. " + ex.Message;
        }
        return lreturn;
    }  

    private string terminateRequst(HttpContext Context, string jsonMsg){
        Context.Response.Status = "403 Forbidden";
       // Context.Response.Write(jsonMsg);
        //the next line is untested - thanks to strider for this line
        Context.Response.StatusCode = 403;
        //the next line can result in a ThreadAbortException
        //Context.Response.End(); 
        Context.ApplicationInstance.CompleteRequest();
        return jsonMsg;

    }

    public string SingUpUser(User user)
    {
        var _params = new Dictionary<string, string>();
        string errMsg = validateUserSignUp(user);
        if (!"".Equals(errMsg))
        {
            return terminateRequst(Context,errMsg);
        }
        _params.Add("param1","@FirstName");
        _params.Add("value1", user.First.ToString());
        _params.Add("param2", "@LastName");
        _params.Add("value2", user.Last.ToString());
        _params.Add("param3", "@Email");
        _params.Add("value3", user.Email.ToString());
        _params.Add("param4", "@Password");
        _params.Add("value4", user.Password.ToString());
        _params.Add("param5", "@City");
        _params.Add("value5", user.City.ToString());
        _params.Add("param6", "@Address");
        _params.Add("value6", user.Address.ToString());

        var res = getTable("sp_signUpNewUser",_params).Tables[0].Rows[0][0];
        if ("0".Equals(res.ToString()))
        {
            return terminateRequst(Context, "Email is allready exists in our system, did you forget your paasword?");
        }
        return "User created successfully";
    
    }

    public Boolean ValidateUserToken(User user)
    {
        if (user.Email == null || user._token == null || "".Equals(user.Email) || "".Equals(user._token))
        {
            return false;
            // return user is not validate
        }

        string sp = "sp_getSessionWithID";
        var _params = new Dictionary<string, string>();
        _params.Add("param1", "@UserEmail");
        _params.Add("value1", user.Email);
        _params.Add("param2", "@sessionID");
        _params.Add("value2", user._token);
        if ("0".Equals(getTable(sp, _params).Tables[0].Rows[0][0].ToString()))
        {
            return false;
        }
        var _minutes = Session["TTL"].ToString() ?? "";
        if (int.Parse(_minutes.ToString()) < 10)
        {
            _params = new Dictionary<string, string>();
            _params.Add("param1", "@Minutes");
            _params.Add("value1", "10");
            _params.Add("param2", "@sessionId");
            _params.Add("value2", user._token.ToString());
            try
            {
                Session["TTL"] = int.Parse(getTable("sp_AddSessionTTLMinutes", _params).Tables[0].Rows[0][0].ToString());
            }
            catch (Exception e)
            {
                return false;
            }
           
        }
        return true;
    }
 
    private Boolean ValidateUser(User user)
    {
        if (user == null || "".Equals(user.Email) || "".Equals(user.Password))
        {
            return false;
        }
        string sp = "sp_doValidateUser";
        Dictionary<string,string> _params = new Dictionary<string, string>();
        _params.Add("param1", "@UserEmail");
        _params.Add("value1", user.Email);

        _params.Add("param2", "@UserPassword");
        _params.Add("value2", user.Password);
        try
        {
            var res = int.Parse(getTable(sp, _params).Tables[0].Rows[0][0].ToString());
            if ("0".Equals(res))
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        catch (Exception e)
        {
            return false;
        }
    }

    [WebMethod(EnableSession = true)]
    public string DoAjax(string func, string user)
    {
        if (Session["TTL"] == null)
        {
            Session["TTL"] = 0;
        }
        //user json format: "{\"Email\":\"pini@c.com,\",\"First\":\"Pini\",\"Last\":\"Ke\",\"Address\":\"Kadima\",\"Password\":\"\",\"City\":\"\",\"_token\":\"519\"}";
        var _user = (User)(ser.Deserialize(user, typeof(User)));
        if (!isAjaxRequestValidate(func,_user))
        {
            Context.Response.StatusDescription = "מזה החרא הזה?אגקס זה נוזל כלים בכלל!";
            Context.Response.StatusCode = 403;
            return null;
        }
        return (new Method(func,_user)).Invok();
    }

    private bool isAjaxRequestValidate(string func,User user)
    {
        if ("".Equals(func.ToString()))
        {
            return false;
        }
        if ("returnSession".Equals(func.ToString()))
        {
            if (!"".Equals(user.Email) && !"".Equals(user.Password))
            {
                return true;
            }
        }
        if ("signUser".Equals(func.ToString()))
        {
            return true;
        }

        return ValidateUserToken(user);
    }

    private string validateUserSignUp(global::User user)
    {
        string userSignUpErr = "";
        if ("".Equals(user.First))
        {
            userSignUpErr += "- First Name field required<br>";
        }
        if ("".Equals(user.Last))
        {
             userSignUpErr += "- Last Name field required<br>";
        }
        if ("".Equals(user.City))
        {
             userSignUpErr += @"- City field required<br>";
        }
        if ("".Equals(user.Address))
        {
            userSignUpErr += "- Address field required<br>";
        }
        if ("".Equals(user.Password))
        {
            userSignUpErr += "- Password field required<br>";
        }
        else
        {
            if (user.Password.Length < 7)
            {
                userSignUpErr += "- Password must be greater or equal than 8 characters<br>";
            }
        }
        if ("".Equals(user.Email))
        {
            userSignUpErr += "- Email field required<br>";
        }
        else
        {
            if (!(new RegexUtilities()).IsValidEmail(user.Email))
            {
                userSignUpErr += "- Email is not valid<br>";
            }
        }

        return userSignUpErr;
    }
    
    public string GetSession(User user)
    {
        if (!ValidateUser(user))
        {
            return terminateRequst(Context,"");
        }

        string sp = "sp_getSession";
        Dictionary<string,string> _params = new Dictionary<string,string>();
        _params.Add("param1","@UserEmail");
        _params.Add("value1",user.Email.ToString());
        return ConvertTableToJsonList(getTable(sp,_params).Tables[0]);
    }

    [WebMethod]
    public string GetYepBranches()
    {
        string sp = "sp_getBranches";
        return ConvertTableToJsonList(getTable(sp,null).Tables[0]);
    }

    public string GetUserOrders(User user)
    {
        var param = new Dictionary<string,string>();
        param.Add("param1", "@UserEmail");
        param.Add("value1", user.Email);
        string sp = "sp_getOrders";
        return ConvertTableToJsonList(getTable(sp, param).Tables[0]);
    }

    [WebMethod]
    public int addProduct(string ProductName)
    {
        int rows = 0;
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
        return ConvertDataToString(getTable(sp,null));
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
        return ConvertDataToString(getTable(sp,null));
    }

    private DataSet getTable(string storedProcedure,Dictionary<string,string> param)
    {
        //DataTable dt = new DataTable();
        DataSet ds = new DataSet();//
        using (SqlConnection con = new SqlConnection(conStr))
        {
            using (SqlCommand cmd = new SqlCommand(storedProcedure, con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                if (param != null)
                {
                    for (var i = 1; i <= param.Count/2; i++ )
                    {
                        cmd.Parameters.AddWithValue(param["param"+i], param["value"+i]);
                    }
                }
                con.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);//
                //da.Fill(dt);
            }
        }
        return ds;
    }


    private string ConvertTableToJsonList(DataTable Dt)
    {
        string[] StrDc = new string[Dt.Columns.Count];
        string HeadStr = string.Empty;

        for (int i = 0; i < Dt.Columns.Count; i++)
        {
            StrDc[i] = Dt.Columns[i].Caption;
            HeadStr += "\"" + StrDc[i] + "\" : \"" + StrDc[i] + i.ToString() + "¾" + "\",";
        }

        HeadStr = HeadStr.Substring(0, HeadStr.Length - 1);

        StringBuilder Sb = new StringBuilder();
        Sb.Append("{\"" + Dt.TableName + "\" : [");

        for (int i = 0; i < Dt.Rows.Count; i++)
        {
            string TempStr = HeadStr;
            Sb.Append("{");

            for (int j = 0; j < Dt.Columns.Count; j++)
            {
                TempStr = TempStr.Replace(Dt.Columns[j] + j.ToString() + "¾", Dt.Rows[i][j].ToString());
            }
            Sb.Append(TempStr + "},");
        }

        Sb = new StringBuilder(Sb.ToString().Substring(0, Sb.ToString().Length - 1));
        Sb.Append("]}");

        return Sb.ToString();
    }

    private List<Yep> ConvertDataToString(DataSet ds)
    {
        //System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
        List<Yep> rows = new List<Yep>();
        //Dictionary<string, object> row;
        //Yep row;
        foreach (DataTable dt in ds.Tables)
        {
            foreach (DataRow dr in dt.Rows)
            {
                Yep row;
               // row = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    row = new Yep(col.ColumnName, dr[col]);
                    //row.Add(col.ColumnName, dr[col]);
                    rows.Add(row);
                }
                
            }
        }
        return rows;
    }
}

public class Yep
{
    public Yep()
    {
    }
    public string colName { get; set; }
    public object value { get; set; }
    public Yep (string colName, object value) { this.colName = colName; this.value = value; }
}

public class User
{
    public User(){
        this.Email = "";
        this.First = "";
        this.Last = "";
        this.Address = "";
        this.Password = "";
        this.City = "";
        this._token = "";
    }
    public string Email
    {
        get;
        set;
    }
    public string First
    {
        get;
        set;
    }
    public string Last
    {
        get;
        set;
    }
    public string Address
    {
        set;
        get;
    }
    public string Password
    {
        get;
        set;
    }
    public string City
    {
        get;
        set;
    }
    public string _token
    {
        get;
        set;
    }
    public string toString()
    {
        return "email:" + this.Email + "first:" + this.First + "last:" + this.Last + "address:" + this.Address + "password:" + this.Password + "_token" + this._token;
    }
}
public class Method
{
    const int VLIDATE_SESSION_FUNCTION = 1;
    const int GET_SESSION = 2;
    const int GET_USER_ORDERS = 3;
    const int GET_YEP_BRANCHES = 4;
    const int SIGN_UP_USER = 5;
    public User user = new User();
    Dictionary<string, int> functionKey = new Dictionary<string, int>()
    {
        {"getLoginStatus", VLIDATE_SESSION_FUNCTION},
        {"returnSession", GET_SESSION},
        {"getUserOrders",GET_USER_ORDERS},
        {"funcGetBranches",GET_YEP_BRANCHES},
        {"signUser",SIGN_UP_USER}
    };

    public Method(string func, User user)
    {
        this.user.Email = user.Email;
        this.user.First = user.First;
        this.user.Last = user.Last;
        this.user.Address = user.Address;
        this.user.City = user.City;
        this.user._token = user._token;
        this.user.Password = user.Password;
        this._func = func;
    }
    public string _func
    {
        get;
        set;
    }

    public string Invok()
    {

        switch (functionKey[this._func])
        {
            //case 1:
            //return (new IceWS()).ValidateUserToken(this.user).ToString();
            case 2:
                return (new IceWS()).GetSession(this.user);
            case 3:
                return (new IceWS()).GetUserOrders(this.user);
            //case 4:
            //    return (new IceWS()).GetYepBranches();
            case 5:
                return (new IceWS()).SingUpUser(this.user);

        }
        return "";
    }


}
public class RegexUtilities
{
    bool invalid = false;
    public bool IsValidEmail(string strIn)
    {
        invalid = false;
        if (String.IsNullOrEmpty(strIn))
            return false;

        // Use IdnMapping class to convert Unicode domain names.
        try
        {
            strIn = Regex.Replace(strIn, @"(@)(.+)$", this.DomainMapper,
                                  RegexOptions.None, TimeSpan.FromMilliseconds(200));
        }
        catch (RegexMatchTimeoutException)
        {
            return false;
        }

        if (invalid)
            return false;

        // Return true if strIn is in valid e-mail format.
        try
        {
            return Regex.IsMatch(strIn,
                  @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                  @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                  RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
        }
        catch (RegexMatchTimeoutException)
        {
            return false;
        }
    }
    private string DomainMapper(Match match)
    {
        // IdnMapping class with default property values.
        IdnMapping idn = new IdnMapping();

        string domainName = match.Groups[2].Value;
        try
        {
            domainName = idn.GetAscii(domainName);
        }
        catch (ArgumentException)
        {
            invalid = true;
        }
        return match.Groups[1].Value + domainName;
    }
}
