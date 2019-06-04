package routers

import (
	"beego-server/controllers"
	"github.com/astaxie/beego"
)

func init() {
	ns := beego.NewNamespace("/api",
		// test
		beego.NSRouter("/", &controllers.MainController{}),
		beego.NSRouter("/departments", &controllers.DepartmentController{}, "get:GetList"),
		// login
		beego.NSRouter("/register", &controllers.StaffController{}, "post:CreateStaff"),
		beego.NSRouter("/login", &controllers.StaffController{}, "post:Login"),
		beego.NSRouter("/currentUser", &controllers.StaffController{}, "get:CurrentUser"),
		// common
		beego.NSRouter("/staff/changepass", &controllers.StaffController{}, "post:ChangePass"),
		beego.NSRouter("/staff/changeinfo", &controllers.StaffController{}, "post:ChangeInfo"),
		beego.NSRouter("/staff/harddelete", &controllers.StaffController{}, "post:HardDelete"),
		beego.NSRouter("/staff/softdelete", &controllers.StaffController{}, "post:SoftDelete"),
		// admin
		beego.NSRouter("/admin/auditlist", &controllers.AdminController{}, "get:AuditList"),
		beego.NSRouter("/admin/stafflist", &controllers.AdminController{}, "get:StaffList"),
		beego.NSRouter("/admin/setrole", &controllers.AdminController{}, "post:SetRole"),
		beego.NSRouter("/admin/marketingMonthly", &controllers.AdminController{}, "get:MarketingMonthly"),
		beego.NSRouter("/admin/marketingMonthlyByID", &controllers.AdminController{}, "get:MarketingMonthlyByID"),
		beego.NSRouter("/admin/techSupportMonthly", &controllers.AdminController{}, "get:TechSupportMonthly"),
		beego.NSRouter("/admin/afterSaleMonthly", &controllers.AdminController{}, "get:AfterSaleMonthly"),
		beego.NSRouter("/admin/developMonthly", &controllers.AdminController{}, "get:DevelopMonthly"),
		beego.NSRouter("/admin/productMonthly", &controllers.AdminController{}, "get:ProductMonthly"),
		beego.NSRouter("/admin/officeMonthly", &controllers.AdminController{}, "get:OfficeMonthly"),
		beego.NSRouter("/admin/financeMonthly", &controllers.AdminController{}, "get:FinanceMonthly"),
		beego.NSRouter("/admin/weeklyPlan", &controllers.AdminController{}, "get:WeeklyPlan"),
		beego.NSRouter("/admin/weeklySummary", &controllers.AdminController{}, "get:WeeklySummary"),
		beego.NSRouter("/admin/annuallyList", &controllers.AdminController{}, "get:AnnuallyList"),
		beego.NSRouter("/admin/annuallyItemList", &controllers.AdminController{}, "get:AnnuallyItemList"),
		beego.NSRouter("/admin/addAnnuallyPlan", &controllers.AdminController{}, "post:AddAnnuallyPlan"),
		beego.NSRouter("/admin/updateAnnuallyPlan", &controllers.AdminController{}, "post:UpdateAnnuallyPlan"),
		beego.NSRouter("/admin/addAnnuallyItem", &controllers.AdminController{}, "post:AddAnnuallyItem"),
		beego.NSRouter("/admin/updateAnnuallyItem", &controllers.AdminController{}, "post:UpdateAnnuallyItem"),
		beego.NSRouter("/admin/deleteAnnuallyItem", &controllers.AdminController{}, "get:DeleteAnnuallyItem"),
		// staff
		beego.NSRouter("/staff/marketingDaily", &controllers.StaffController{}, "post:MarketingDaily"),
		beego.NSRouter("/staff/techSupportDaily", &controllers.StaffController{}, "post:TechSupportDaily"),
		beego.NSRouter("/staff/afterSaleDaily", &controllers.StaffController{}, "post:AfterSaleDaily"),
		beego.NSRouter("/staff/developDaily", &controllers.StaffController{}, "post:DevelopDaily"),
		beego.NSRouter("/staff/productDaily", &controllers.StaffController{}, "post:ProductDaily"),
		beego.NSRouter("/staff/officeDaily", &controllers.StaffController{}, "post:OfficeDaily"),
		beego.NSRouter("/staff/financeDaily", &controllers.StaffController{}, "post:FinanceDaily"),
		beego.NSRouter("/staff/weeklySummary", &controllers.StaffController{}, "post:AddWeeklySummary"),
		beego.NSRouter("/staff/weeklyPlan", &controllers.StaffController{}, "post:AddWeeklyPlan"),
	)
	// 注册 namespace
	beego.AddNamespace(ns)
}
