package controllers

import (
	"beego-server/controllers/codes"
	"beego-server/models"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"strings"
	"time"
)

type AdminController struct {
	beego.Controller
}

func (c *AdminController) AuditList() {
	list, err := models.QueryAuditList()
	if err != nil {
		logs.Error("[AuditList]: %+v", err)
		c.Data["json"] = NewErrorMsg("failed", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	}

	c.ServeJSON()
}

func (c *AdminController) StaffList() {
	departmentArg := c.Input().Get("department")
	roleArg := c.Input().Get("role")

	var (
		department []string
		role []string
	)
	if departmentArg != "" {
		department = strings.Split(departmentArg, ",")
	}
	if roleArg != "" {
		role = strings.Split(roleArg, ",")
	}
	list, err := models.QueryStaffList(department, role)
	if err != nil {
		logs.Error("[AuditList]: %+v", err)
		c.Data["json"] = NewErrorMsg("failed", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	}

	c.ServeJSON()
}

func (c *AdminController) SetRole() {
	body := c.Ctx.Input.RequestBody
	req := models.SetRoleRequest{}

	var err error
	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[SetRole]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	err = req.Set()
	if err != nil {
		logs.Error("[SetRole]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) MarketingMonthly() {
	var (
		startDate = c.Input().Get("start")
		endDate   = c.Input().Get("end")
		start     time.Time
		end       time.Time
		err       error
		list      []models.MarketingMonthlyResultAll
	)

	start, err = time.ParseInLocation("20060102", startDate, time.Local)
	if err != nil {
		logs.Error("[MarketingMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}
	end, err = time.ParseInLocation("20060102", endDate, time.Local)
	if err != nil {
		logs.Error("[MarketingMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}

	list, err = models.QueryMarketingMonthly(start, end)
	if err != nil {
		logs.Error("[MarketingMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		var resp []interface{}
		for _, item := range list {
			m := make(map[string]interface{})
			m["id"] = item.Id
			m["name"] = item.Name
			for k, v := range item.WorkItem {
				m["hygiene_"+k] = v[0]
				m["meeting_"+k] = v[1]
				m["work_"+k] = v[2]
			}
			resp = append(resp, m)
		}
		c.Data["json"] = NewDataMsg("ok", codes.Success, resp)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) MarketingMonthlyByID() {
	var (
		id        = c.Input().Get("id")
		startDate = c.Input().Get("start")
		endDate   = c.Input().Get("end")
		start     time.Time
		end       time.Time
		err       error
		list      []models.MarketingMonthlyResult
	)

	start, err = time.ParseInLocation("20060102", startDate, time.Local)
	if err != nil {
		logs.Error("[MarketingMonthlyByID]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}
	end, err = time.ParseInLocation("20060102", endDate, time.Local)
	if err != nil {
		logs.Error("[MarketingMonthlyByID]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}

	list, err = models.QueryMarketingMonthlyByID(id, start, end)
	if err != nil {
		logs.Error("[MarketingMonthlyByID]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		for i := range list {
			list[i].Id = list[i].Date.Format("20060102")
		}
		c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) TechSupportMonthly() {
	var (
		id        = c.Input().Get("id")
		startDate = c.Input().Get("start")
		endDate   = c.Input().Get("end")
		start     time.Time
		end       time.Time
		err       error
		list      []models.MonthlyResult
	)

	start, err = time.ParseInLocation("20060102", startDate, time.Local)
	if err != nil {
		logs.Error("[TechSupportMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}
	end, err = time.ParseInLocation("20060102", endDate, time.Local)
	if err != nil {
		logs.Error("[TechSupportMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}

	list, err = models.QueryTechSupportMonthly(id, start, end)
	if err != nil {
		logs.Error("[TechSupportMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		for i := range list {
			list[i].Id = list[i].Date.Format("20060102")
		}
		c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) AfterSaleMonthly() {
	var (
		id        = c.Input().Get("id")
		startDate = c.Input().Get("start")
		endDate   = c.Input().Get("end")
		start     time.Time
		end       time.Time
		err       error
		list      []models.MonthlyResult
	)

	start, err = time.ParseInLocation("20060102", startDate, time.Local)
	if err != nil {
		logs.Error("[AfterSaleMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}
	end, err = time.ParseInLocation("20060102", endDate, time.Local)
	if err != nil {
		logs.Error("[AfterSaleMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}

	list, err = models.QueryAfterSaleMonthly(id, start, end)
	if err != nil {
		logs.Error("[AfterSaleMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		for i := range list {
			list[i].Id = list[i].Date.Format("20060102")
		}
		c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) DevelopMonthly() {
	var (
		id        = c.Input().Get("id")
		startDate = c.Input().Get("start")
		endDate   = c.Input().Get("end")
		start     time.Time
		end       time.Time
		err       error
		list      []models.MonthlyResult
	)

	start, err = time.ParseInLocation("20060102", startDate, time.Local)
	if err != nil {
		logs.Error("[DevelopMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}
	end, err = time.ParseInLocation("20060102", endDate, time.Local)
	if err != nil {
		logs.Error("[DevelopMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}

	list, err = models.QueryDevelopMonthly(id, start, end)
	if err != nil {
		logs.Error("[DevelopMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		for i := range list {
			list[i].Id = list[i].Date.Format("20060102")
		}
		c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) ProductMonthly() {
	var (
		id        = c.Input().Get("id")
		startDate = c.Input().Get("start")
		endDate   = c.Input().Get("end")
		start     time.Time
		end       time.Time
		err       error
		list      []models.MonthlyResult
	)

	start, err = time.ParseInLocation("20060102", startDate, time.Local)
	if err != nil {
		logs.Error("[ProductMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}
	end, err = time.ParseInLocation("20060102", endDate, time.Local)
	if err != nil {
		logs.Error("[ProductMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}

	list, err = models.QueryProductMonthly(id, start, end)
	if err != nil {
		logs.Error("[ProductMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		for i := range list {
			list[i].Id = list[i].Date.Format("20060102")
		}
		c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) OfficeMonthly() {
	var (
		id        = c.Input().Get("id")
		startDate = c.Input().Get("start")
		endDate   = c.Input().Get("end")
		start     time.Time
		end       time.Time
		err       error
		list      []models.MonthlyResult
	)

	start, err = time.ParseInLocation("20060102", startDate, time.Local)
	if err != nil {
		logs.Error("[OfficeMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}
	end, err = time.ParseInLocation("20060102", endDate, time.Local)
	if err != nil {
		logs.Error("[OfficeMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}

	list, err = models.QueryOfficeMonthly(id, start, end)
	if err != nil {
		logs.Error("[OfficeMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		for i := range list {
			list[i].Id = list[i].Date.Format("20060102")
		}
		c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) FinanceMonthly() {
	var (
		id        = c.Input().Get("id")
		startDate = c.Input().Get("start")
		endDate   = c.Input().Get("end")
		start     time.Time
		end       time.Time
		err       error
		list      []models.MonthlyResult
	)

	start, err = time.ParseInLocation("20060102", startDate, time.Local)
	if err != nil {
		logs.Error("[FinanceMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}
	end, err = time.ParseInLocation("20060102", endDate, time.Local)
	if err != nil {
		logs.Error("[FinanceMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DateFormatErr, err, nil)
		goto finish
	}

	list, err = models.QueryFinanceMonthly(id, start, end)
	if err != nil {
		logs.Error("[FinanceMonthly]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		for i := range list {
			list[i].Id = list[i].Date.Format("20060102")
		}
		c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) WeeklyPlan() {
	id := c.Input().Get("id")
	planWeek := c.Input().Get("planWeek")

	res, err := models.QueryWeeklyPlan(id, planWeek)
	if err != nil {
		logs.Error("[WeeklyPlan]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, res)
	}

	c.ServeJSON()
}

func (c *AdminController) WeeklySummary() {
	id := c.Input().Get("id")
	summaryWeek := c.Input().Get("summaryWeek")

	res, err := models.QueryWeeklySummary(id, summaryWeek)
	if err != nil {
		logs.Error("[WeeklySummary]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, res)
	}

	c.ServeJSON()
}

func (c *AdminController) AnnuallyList() {
	list, err := models.QueryAnnuallyList()
	if err != nil {
		logs.Error("[AnnuallyList]: %+v", err)
		c.Data["json"] = NewErrorMsg("failed", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	}

	c.ServeJSON()
}

func (c *AdminController) AnnuallyItemList() {
	id := c.Input().Get("id")

	list, err := models.QueryAnnuallyItemList(id)
	if err != nil {
		logs.Error("[AnnuallyItemList]: %+v", err)
		c.Data["json"] = NewErrorMsg("failed", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	}

	c.ServeJSON()
}

func (c *AdminController) AddAnnuallyPlan() {
	body := c.Ctx.Input.RequestBody
	req := models.Annually{}

	var (
		err error
		id int64
	)
	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[AddAnnuallyPlan]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	id, err = models.AddAnnuallyPlan(req)
	if err != nil {
		logs.Error("[AddAnnuallyPlan]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, id)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) UpdateAnnuallyPlan() {
	body := c.Ctx.Input.RequestBody
	req := models.Annually{}

	var err error
	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[UpdateAnnuallyPlan]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	err = models.UpdateAnnuallyPlan(req)
	if err != nil {
		logs.Error("[UpdateAnnuallyPlan]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) AddAnnuallyItem() {
	body := c.Ctx.Input.RequestBody
	req := models.AnnuallyItem{}

	var (
		err error
		id int64
	)
	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[AddAnnuallyItem]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	id, err = models.AddAnnuallyPlanItem(req)
	if err != nil {
		logs.Error("[AddAnnuallyItem]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, id)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) UpdateAnnuallyItem() {
	body := c.Ctx.Input.RequestBody
	req := models.AnnuallyItem{}

	var err error
	if err := json.Unmarshal(body, &req); err != nil {
		logs.Error("[UpdateAnnuallyItem]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, nil)
		goto finish
	}

	err = models.UpdateAnnuallyItem(req)
	if err != nil {
		logs.Error("[UpdateAnnuallyItem]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}

finish:
	c.ServeJSON()
}

func (c *AdminController) DeleteAnnuallyItem() {
	id := c.Input().Get("id")
	pid := c.Input().Get("pid")

	err := models.DeleteAnnuallyItem(id, pid)
	if err != nil {
		logs.Error("[DeleteAnnuallyItem]: %+v", err)
		c.Data["json"] = NewErrorMsg("error", codes.DBExecErr, err, nil)
	} else {
		c.Data["json"] = NewDataMsg("ok", codes.Success, nil)
	}
	c.ServeJSON()
}
