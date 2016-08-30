<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Site_Admin.aspx.cs" Inherits="Ice_Admin.Site_Admin" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="site_admin.css" rel="stylesheet" />
</head>
<body style="background-color: antiquewhite">
    <form id="form1" runat="server">
        <div id="wrap">
            <asp:Login ID="Login1" runat="server"  CssClass="login" OnAuthenticate="Login1_Authenticate" DestinationPageUrl="default.aspx" BackColor="#E3EAEB" BorderColor="#E6E2D8" BorderPadding="4" BorderStyle="Solid" BorderWidth="1px" Font-Names="Verdana" Font-Size="0.8em" ForeColor="#333333" TextLayout="TextOnTop">
                <InstructionTextStyle Font-Italic="True" ForeColor="Black" />
                <LoginButtonStyle BackColor="White" BorderColor="#C5BBAF" BorderStyle="Solid" BorderWidth="1px" Font-Names="Verdana" Font-Size="0.8em" ForeColor="#1C5E55" />
                <TextBoxStyle Font-Size="0.8em" />
                <TitleTextStyle BackColor="#1C5E55" Font-Bold="True" Font-Size="0.9em" ForeColor="White" />
            </asp:Login>
        </div>
    </form>
</body>
</html>
