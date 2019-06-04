package controllers

import (
	"beego-server/controllers/codes"
	"beego-server/models"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
)

type DepartmentController struct {
	beego.Controller
}

func (c *DepartmentController) GetList() {
	list, err := models.GetDepartments()
	if err != nil {
		logs.Error(err)
		c.Data["json"] = NewErrorMsg("error", codes.JsonErr, err, list)
	}

	c.Data["json"] = NewDataMsg("ok", codes.Success, list)
	c.ServeJSON()
}
