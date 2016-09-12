using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Ice
{
    /// <summary>
    /// Summary description for uploadHandler
    /// </summary>
    public class uploadHandler : IHttpHandler
    {
        IceWS IceHalper = new IceWS();

        public void ProcessRequest(HttpContext context)
        {
           var json = new JavaScriptSerializer();
           string lreturn = "";
        try
        {
            string tempDir = "postedFiles";
            HttpPostedFile file = HttpContext.Current.Request.Files["file"];
            string email = HttpContext.Current.Request.Params["email"], sessionid = HttpContext.Current.Request.Params["sessionid"];
            string mainDirPath = System.Web.HttpContext.Current.Request.MapPath(".") + "\\"+tempDir;
            string userDirPath = mainDirPath + "\\" + email;
            string filePathToDB="", fullFilePath = userDirPath + "\\" + file.FileName + ".jpg";
            filePathToDB = "/cegroup3/prod/"+ tempDir +"/" + email + "/" + fullFilePath.Substring(fullFilePath.LastIndexOf('\\')+1);
            var user = new User
            {
                Email = email,
                _token = sessionid
            };
            if (validateUploadRequest(user)){//
                if(!Directory.Exists(mainDirPath)){
                    throw new Exception("Opps somthing went wrong.");

                }
                if (!Directory.Exists(userDirPath))
                {
                    Directory.CreateDirectory(userDirPath);
                }

                file.SaveAs(fullFilePath);
                SaveToDB(user, filePathToDB);
                context.Response.Write(filePathToDB);
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

        private void SaveToDB(User user, string fullFilePath)
        {
            var _params = new Dictionary<string,string>(){
                {"param1","@UserEmail"},{"value1",user.Email},
                {"param2","@path"},{"value2",fullFilePath}
            
            };
            if (!"1".Equals(IceHalper.getTable("sp_uploadtUserPhoto", _params).Tables[0].Rows[0][0].ToString()))
            {
                throw new Exception("Opps DataBase error.");
            }   
        }

        private bool validateUploadRequest(User user)
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
            if ("0".Equals(IceHalper.getTable(sp, _params).Tables[0].Rows[0][0].ToString()))
            {
                return false;
            }

            return true;
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