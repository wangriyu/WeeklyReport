package controllers

import (
	"github.com/astaxie/beego"
	"github.com/json-iterator/go"
)

var json = jsoniter.ConfigCompatibleWithStandardLibrary

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.Data["Website"] = "wangriyu"
	c.Data["Email"] = "wangriyu1997@gmail.com"
	c.TplName = "index.tpl"
}

type Result struct {
	Status string      `json:"status"`
	Code   int         `json:"code"`
	Msg    string      `json:"msg,omitempty"`
	Data   interface{} `json:"data,omitempty"`
}

func NewMsg(status string, code int, msg string,  data interface{}) Result {
	return Result{status, code, msg, data}
}

func NewErrorMsg(status string, code int, err error,  data interface{}) Result {
	return Result{status, code, err.Error(), data}
}

func NewDataMsg(status string, code int, data interface{}) Result {
	return Result{Status:status, Code:code, Data:data}
}
