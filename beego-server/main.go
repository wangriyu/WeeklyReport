package main

import (
	"fmt"

	_ "beego-server/routers"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

func init() {
	dbUser := beego.AppConfig.String("mysql_user")
	dbPass := beego.AppConfig.String("mysql_pass")
	dbName := beego.AppConfig.String("mysql_db")
	dbURL := beego.AppConfig.String("mysql_urls")
	dbPort := beego.AppConfig.String("mysql_port")

	if err := orm.RegisterDriver("mysql", orm.DRMySQL); err != nil {
		panic(err)
	}
	dataSource := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8", dbUser, dbPass, dbURL, dbPort, dbName)
	if err := orm.RegisterDataBase("default", "mysql", dataSource); err != nil {
		panic(err)
	}
	orm.Debug = true

	beego.BConfig.WebConfig.Session.SessionCookieLifeTime = 60 * 60 * 24 * 7 // cookie 生命周期 7 天 不会变
	beego.BConfig.WebConfig.Session.SessionGCMaxLifetime = 60 * 60 * 24 * 5   // session 生命周期 5 天 刷新会变
	beego.BConfig.WebConfig.Session.SessionProvider = "file"
	beego.BConfig.WebConfig.Session.SessionProviderConfig = "./tmp"

	logs.Async()
	logs.SetLogger(logs.AdapterMultiFile, `{"filename":"./logs/run.log","separate":["emergency", "alert", "critical", "error", "warning", "notice", "info", "debug"],"level":6,"maxlines":0,"maxsize":0,"daily":true,"maxdays":90}`)
}

func main() {
	beego.Run()
}
