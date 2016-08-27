<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="Ice_Admin._default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body style="background-color: antiquewhite">
    <form id="form1" runat="server">
    <div id="content">
        <asp:ImageButton ID="ImageButton1" runat="server" Width="200" Height="200" ImageUrl="Images/branches.png" OnClick="branches_click"/>
        <asp:ImageButton ID="ImageButton2" runat="server" Width="200" Height="200" ImageUrl="Images/users.png" OnClick="users_click"/>
        <asp:ImageButton ID="ImageButton3" runat="server" Width="200" Height="200" ImageUrl="Images/products.jpg" OnClick="products_click"/>
        <asp:ImageButton ID="ImageButton4" runat="server" Width="200" Height="200" ImageUrl="Images/orders.png" OnClick="orders_click"/>
        <asp:ImageButton ID="ImageButton5" runat="server" Width="200" Height="200" ImageUrl="Images/details.png" OnClick="details_click"/>
    </div>
    </form>
</body>
</html>
