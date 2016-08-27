<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="branches.aspx.cs" Inherits="Ice_Admin.branches" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="site_admin.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:Button ID="show_branches" runat="server" Text="Show Existing Branches" OnClick="show_branches_Click" />
            &nbsp;&nbsp;&nbsp;<asp:Button ID="hide_branches" runat="server" Text="Hide Existing Branches" OnClick="hide_branches_Click" />
            <br />
            <br />
            <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" BackColor="#DEBA84" BorderColor="#DEBA84" BorderStyle="None" BorderWidth="1px" CellPadding="3" CellSpacing="2" DataSourceID="cegroup3Db">
                <Columns>
                    <asp:BoundField DataField="BranchName" HeaderText="BranchName" SortExpression="BranchName" />
                    <asp:CheckBoxField DataField="Kosher" HeaderText="Kosher" SortExpression="Kosher" />
                    <asp:BoundField DataField="Address" HeaderText="Address" SortExpression="Address" />
                    <asp:BoundField DataField="Longitude" HeaderText="Longitude" SortExpression="Longitude" />
                    <asp:BoundField DataField="Latitude" HeaderText="Latitude" SortExpression="Latitude" />
                    <asp:BoundField DataField="MidWeek" HeaderText="MidWeek" SortExpression="MidWeek" />
                    <asp:BoundField DataField="MidWeekOpenHours" HeaderText="MidWeekOpenHours" SortExpression="MidWeekOpenHours">
                        <ItemStyle HorizontalAlign="Center" />
                    </asp:BoundField>
                    <asp:BoundField DataField="Weekend" HeaderText="Weekend" SortExpression="Weekend">
                        <ItemStyle HorizontalAlign="Center" />
                    </asp:BoundField>
                    <asp:BoundField DataField="WeekendOpenHours" HeaderText="WeekendOpenHours" SortExpression="WeekendOpenHours">
                        <ItemStyle HorizontalAlign="Center" />
                    </asp:BoundField>
                    <asp:BoundField DataField="Telephone" HeaderText="Telephone" SortExpression="Telephone" />
                    <asp:BoundField DataField="Manager" HeaderText="Manager" SortExpression="Manager" />
                    <asp:CommandField ButtonType="Button" ShowEditButton="True" />
                    <asp:CommandField ButtonType="Button" ShowDeleteButton="True" />
                </Columns>
                <FooterStyle BackColor="#F7DFB5" ForeColor="#8C4510" />
                <HeaderStyle BackColor="#A55129" Font-Bold="True" ForeColor="White" />
                <PagerStyle ForeColor="#8C4510" HorizontalAlign="Center" />
                <RowStyle BackColor="#FFF7E7" ForeColor="#8C4510" />
                <SelectedRowStyle BackColor="#738A9C" Font-Bold="True" ForeColor="White" />
                <SortedAscendingCellStyle BackColor="#FFF1D4" />
                <SortedAscendingHeaderStyle BackColor="#B95C30" />
                <SortedDescendingCellStyle BackColor="#F1E5CE" />
                <SortedDescendingHeaderStyle BackColor="#93451F" />
            </asp:GridView>
            <asp:SqlDataSource ID="SqlDataSource1" runat="server" DeleteCommand="sp_deleteBranch"  DeleteCommandType="StoredProcedure" ConnectionString='ConfigurationManager.ConnectionStrings["IceDB"].ConnectionString'></asp:SqlDataSource>
            <br />
            <br />
            <asp:Button ID="add_branch_button" runat="server" Text="Add New Branch" onClick="add_branch_button_Click"/>
            <div runat="server" id="newBranchDetails">
                <asp:TextBox ID="BranchNameTextBox" placeholder="branch name" runat="server"></asp:TextBox><br />
                <asp:Label ID="KosherLabel" runat="server" Text="Is Kosher?"></asp:Label><asp:CheckBox ID="KosherCheckBox" runat="server" /><br />
                <asp:TextBox ID="AddressTextBox" placeholder="address" runat="server"></asp:TextBox><br />
                <asp:TextBox ID="LongitudeTextBox" placeholder="longitude" runat="server"></asp:TextBox><br />
                <asp:TextBox ID="LatitudeTextBox" placeholder="latitude" runat="server"></asp:TextBox><br />
                <asp:TextBox ID="PhotoTextBox" placeholder="photo url" runat="server"></asp:TextBox><br />
                <asp:TextBox ID="MidWeekOpenHoursTextBox" placeholder="midweek open hours" runat="server"></asp:TextBox><br />
                <asp:TextBox ID="WeekendOpenHoursTextBox" placeholder="weekend open hours" runat="server"></asp:TextBox><br />
                <asp:TextBox ID="TelephoneTextBox" placeholder="telephone" runat="server"></asp:TextBox><br />
                <asp:TextBox ID="ManagerTextBox" placeholder="manager" runat="server"></asp:TextBox><br />
                <asp:Button ID="AddToDbButton" runat="server" Text="Add to DB" onClick="AddToDbButton_Click"/>
            </div>



            <asp:SqlDataSource ID="cegroup3Db" runat="server" ConnectionString="<%$ ConnectionStrings:ConStr %>" SelectCommand="SELECT [BranchName], [Kosher], [Address], [Longitude], [Latitude], [MidWeek], [MidWeekOpenHours], [Weekend], [WeekendOpenHours], [Telephone], [Manager] FROM [Branches]"></asp:SqlDataSource>
        </div>
    </form>
</body>
</html>
