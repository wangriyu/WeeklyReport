package controllers

import (
	"beego-server/controllers/codes"
	"beego-server/models"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
)

type StaffController struct {
	beego.Controller
}

func (c *StaffController) CreateStaff() {
	body := c.Ctx.Input.RequestBody
	staff := models.StaffRequest{}

	var (
		id int64
		err error
	)
	if err := json.Unmarshal(body, &staff); err != nil {
		logs.Error("[CreateStaff]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	if (staff.Department != "" && !models.VerifyDepartment(staff.Department)) || (staff.Role != "" && !models.VerifyRole(staff.Role)) {
		c.Data["json"] = NewMsg("unValid", codes.ParameterUnValid, "UnValid department or role", nil)
		goto finish
	}

	id, err = staff.Create()
	if err != nil {
		logs.Error("[CreateStaff]: %+v", err)
		c.Data["json"] = NewErrorMsg("failed", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, id)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) Login() {
	body := c.Ctx.Input.RequestBody
	arg := struct {
		Nickname string `json:"nickname"`
		Password string `json:"password"`
	}{}

	var (
		staff = models.Staff{}
		err   error
	)
	if err := json.Unmarshal(body, &arg); err != nil {
		logs.Error("[Login]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	staff, err = models.CheckLogin(arg.Nickname, arg.Password)
	if err != nil {
		logs.Error("[Login]: %+v", err)
		if err.Error() == "<QuerySeter> no row found" {
			c.Data["json"] = NewErrorMsg("failed", codes.NotFound, err, nil)
		} else {
			c.Data["json"] = NewErrorMsg("failed", codes.DBExecErr, err, nil)
		}
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, staff)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) CurrentUser() {
	id := c.Input().Get("id")

	staff, err := models.QueryStaffByID(id)
	if err != nil {
		logs.Error("[CurrentUser]: %+v", err)
		if err.Error() == "<QuerySeter> no row found" {
			c.Data["json"] = NewErrorMsg("failed", codes.NotFound, err, nil)
		} else {
			c.Data["json"] = NewErrorMsg("failed", codes.DBExecErr, err, nil)
		}
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, staff)
	}
	c.ServeJSON()
}

func (c *StaffController) ChangePass() {
	body := c.Ctx.Input.RequestBody
	arg := struct {
		Id      uint   `json:"id"`
		OldPass string `json:"oldPass"`
		NewPass string `json:"newPass"`
	}{}

	var (
		err error
	)
	if err := json.Unmarshal(body, &arg); err != nil {
		logs.Error("[ChangePass]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	err = models.UpdatePass(arg.Id, arg.OldPass, arg.NewPass)
	if err != nil {
		logs.Error("[ChangePass]: %+v", err)
		c.Data["json"] = NewErrorMsg("failed", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) ChangeInfo() {
	body := c.Ctx.Input.RequestBody
	staff := models.StaffRequest{}

	var err error
	if err := json.Unmarshal(body, &staff); err != nil {
		logs.Error("[ChangeInfo]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	err = staff.Update()
	if err != nil {
		logs.Error("[ChangeInfo]: %+v", err)
		c.Data["json"] = NewErrorMsg("failed", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) HardDelete() {
	var (
		body = c.Ctx.Input.RequestBody
		req = models.DeleteStaffRequest{}
		err error
	)

	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[HardDelete]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	err = models.HardDelete(req)
	if err != nil {
		logs.Error("[HardDelete]: %+v", err)
		if err.Error() == "not found" {
			c.Data["json"] = NewErrorMsg("failed", codes.NotFound, err, nil)
		} else {
			c.Data["json"] = NewErrorMsg("failed", codes.DBExecErr, err, nil)
		}
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) SoftDelete() {
	var (
		body = c.Ctx.Input.RequestBody
		req = models.DeleteStaffRequest{}
		err error
	)

	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[SoftDelete]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	err = models.SoftDelete(req)
	if err != nil {
		logs.Error("[SoftDelete]: %+v", err)
		if err.Error() == "not found" {
			c.Data["json"] = NewErrorMsg("failed", codes.NotFound, err, nil)
		} else {
			c.Data["json"] = NewErrorMsg("failed", codes.DBExecErr, err, nil)
		}
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) MarketingDaily() {
	body := c.Ctx.Input.RequestBody
	req := models.MarketingDailyRequest{}

	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[MarketingDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	if err := req.Set(); err != nil {
		logs.Error("[MarketingDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) TechSupportDaily() {
	body := c.Ctx.Input.RequestBody
	req := models.DailyRequest{}

	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[TechSupportDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	if err := req.SetTechSupport(); err != nil {
		logs.Error("[TechSupportDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) AfterSaleDaily() {
	body := c.Ctx.Input.RequestBody
	req := models.DailyRequest{}

	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[AfterSaleDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	if err := req.SetAfterSale(); err != nil {
		logs.Error("[AfterSaleDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) DevelopDaily() {
	body := c.Ctx.Input.RequestBody
	req := models.DailyRequest{}

	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[DevelopDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	if err := req.SetDevelop(); err != nil {
		logs.Error("[DevelopDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) ProductDaily() {
	body := c.Ctx.Input.RequestBody
	req := models.DailyRequest{}

	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[ProductDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	if err := req.SetProduct(); err != nil {
		logs.Error("[ProductDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) OfficeDaily() {
	body := c.Ctx.Input.RequestBody
	req := models.DailyRequest{}

	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[OfficeDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	if err := req.SetOffice(); err != nil {
		logs.Error("[OfficeDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) FinanceDaily() {
	body := c.Ctx.Input.RequestBody
	req := models.DailyRequest{}

	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[FinanceDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	if err := req.SetFinance(); err != nil {
		logs.Error("[FinanceDaily]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) AddWeeklySummary() {
	body := c.Ctx.Input.RequestBody
	req := models.AddWeeklySummaryRequest{}

	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[AddWeeklySummary]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	if err := models.AddWeeklySummary(req); err != nil {
		logs.Error("[AddWeeklySummary]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *StaffController) AddWeeklyPlan() {
	body := c.Ctx.Input.RequestBody
	req := models.AddWeeklyPlanRequest{}

	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[AddWeeklyPlan]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	if err := models.AddWeeklyPlan(req); err != nil {
		logs.Error("[AddWeeklyPlan]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}
