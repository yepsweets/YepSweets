using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ice
{
    /// <summary>
    /// Summary description for uploadHandler
    /// </summary>
    public class uploadHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {

        string lreturn = "success";
        try
        {
            HttpPostedFile file = HttpContext.Current.Request.Files["file"];
            if (HttpContext.Current.Request.Params["email"] != null)
            {
                string saveFile = System.Web.HttpContext.Current.Request.MapPath(".") + "\\postedFiles\\" + HttpContext.Current.Request.Params["email"]+ "\\" + file.FileName;
               file.SaveAs(saveFile);
            }
            else
            {
                throw new Exception("upload failed!");
            }
        }
        catch (Exception ex)
        {
            lreturn = "fail. " + ex.Message;
            lreturn = (new IceWS()).terminateRequst(context, lreturn);
        }
        context.Response.Write(lreturn);

       }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}