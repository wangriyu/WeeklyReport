package models

import (
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/astaxie/beego"

	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"golang.org/x/crypto/scrypt"
)

const (
	AdminRole  = "admin"
	BossRole   = "boss"
	LeaderRole = "leader"
	StaffRole  = "staff"
	GuestRole  = "guest"
)

const (
	DimissionStatus = iota - 1 // 代表员工离职，或者代表记录软删除
	GuestStatus                // 初始状态
	NormalStatus               // 正常状态
	_
	BossStatus // 总工状态
	_
	AdminStatus = 5 // admin 状态，用于区分
)

type StaffRequest struct {
	Id         uint     `json:"id,omitempty"`
	Nickname   string   `json:"nickname,omitempty"`
	Name       string   `json:"name,omitempty"`
	Password   string   `json:"password,omitempty"`
	JoinDate   DateTime `json:"joinDate,omitempty"`
	Department string   `json:"department,omitempty"`
	Mail       string   `json:"mail,omitempty"`
	Mobile     string   `json:"mobile,omitempty"`
	Role       string   `json:"role,omitempty"`
}

type Staff struct {
	Id         uint      `json:"id"`
	Nickname   string    `json:"nickname,omitempty"`
	Name       string    `json:"name,omitempty"`
	Password   string    `json:"password,omitempty"`
	JoinDate   time.Time `json:"joinDate,omitempty" orm:"type(date)"`
	Department string    `json:"department,omitempty"`
	Mail       string    `json:"mail,omitempty"`
	Mobile     string    `json:"mobile,omitempty"`
	Role       string    `json:"role,omitempty"`
}

func (staff *StaffRequest) Create() (int64, error) {
	o := orm.NewOrm()

	encryptPass := GeneratePassword(staff.Password)
	if encryptPass == "" {
		return 0, errors.New("internal error with encrypt")
	}

	status := GuestStatus
	if staff.Role != "" {
		switch staff.Role {
		case StaffRole, LeaderRole:
			status = NormalStatus
		case BossRole:
			status = BossStatus
		}
	}
	res, err := o.Raw(
		"INSERT INTO staff(nickname,password,name,join_date,mobile,mail,department,role,status) VALUES(?,?,?,?,?,?,?,?,?)",
		staff.Nickname,
		encryptPass,
		staff.Name,
		staff.JoinDate.ToTime(),
		staff.Mobile,
		staff.Mail,
		staff.Department,
		staff.Role,
		status,
	).Exec()
	if err != nil {
		return 0, err
	}

	num, _ := res.RowsAffected()
	logs.Info("[CreateStaff]: %d rows affected, insert %s", num, staff.Nickname)

	id, _ := res.LastInsertId()
	return id, nil
}

func (staff *StaffRequest) Update() error {
	o := orm.NewOrm()

	var (
		res sql.Result
		err error
	)
	if staff.Department != "" && staff.Role != "" {
		status := NormalStatus
		switch staff.Role {
		case StaffRole, LeaderRole:
			status = NormalStatus
		case BossRole:
			status = BossStatus
		}
		res, err = o.Raw(
			"UPDATE staff SET nickname = ?, name = ?, join_date = ?, mobile = ?, mail = ?, department = ?, role = ?, status = ? WHERE id = ?",
			staff.Nickname,
			staff.Name,
			staff.JoinDate.ToTime(),
			staff.Mobile,
			staff.Mail,
			staff.Department,
			staff.Role,
			status,
			staff.Id,
		).Exec()
	} else {
		res, err = o.Raw(
			"UPDATE staff SET nickname = ?, name = ?, join_date = ?, mobile = ?, mail = ? WHERE id = ?",
			staff.Nickname,
			staff.Name,
			staff.JoinDate.ToTime(),
			staff.Mobile,
			staff.Mail,
			staff.Id,
		).Exec()
	}
	if err != nil {
		return err
	}

	num, _ := res.RowsAffected()

	if num == 0 {
		return errors.New("no change anything")
	}
	logs.Info("[UpdateStaff]: %d rows affected, update %+v", num, staff)

	return nil
}

func CheckLogin(nickname, password string) (staff Staff, err error) {
	o := orm.NewOrm()
	err = o.Raw("SELECT * FROM staff WHERE nickname = ? AND status >= ?", nickname, GuestStatus).QueryRow(&staff)
	if err != nil {
		return staff, err
	}
	if GeneratePassword(password) != staff.Password {
		return staff, errors.New("not correct password")
	}

	staff.Password = ""
	return staff, nil
}

func QueryStaffByID(id string) (staff Staff, err error) {
	o := orm.NewOrm()
	err = o.Raw("SELECT * FROM staff WHERE id = ? AND status >= ?", id, GuestStatus).QueryRow(&staff)
	if err != nil {
		return staff, err
	}

	staff.Password = ""
	return staff, nil
}

func UpdatePass(id uint, old, new string) error {
	o := orm.NewOrm()
	pass := struct {
		Password string
	}{}
	err := o.Raw("SELECT password FROM staff WHERE id = ? AND status >= ?", id, GuestStatus).QueryRow(&pass)
	if err != nil {
		return err
	}
	if GeneratePassword(old) != pass.Password {
		return errors.New("not correct password")
	}

	encryptPass := GeneratePassword(new)
	if encryptPass == "" {
		return errors.New("internal error with encrypt")
	}
	res, err := o.Raw("UPDATE staff SET password = ? WHERE id = ?", encryptPass, id).Exec()
	if err != nil {
		return err
	}

	num, _ := res.RowsAffected()
	logs.Info("[ChangePass]: %d rows affected, id %d", num, id)
	return nil
}

type DeleteStaffRequest struct {
	IDs []uint `json:"ids"`
}

func HardDelete(ids DeleteStaffRequest) error {
	o := orm.NewOrm()

	s := "?"
	for i := 1; i < len(ids.IDs); i++ {
		s += ", ?"
	}

	res, err := o.Raw(fmt.Sprintf("DELETE FROM staff WHERE id IN (%s)", s), ids.IDs).Exec()
	if err != nil {
		return err
	}

	num, _ := res.RowsAffected()

	if num == 0 {
		return errors.New("not found")
	}
	logs.Debug("[HardDelete]: %d rows affected, id %v", num, ids)

	return nil
}

func SoftDelete(ids DeleteStaffRequest) error {
	o := orm.NewOrm()

	s := "?"
	for i := 1; i < len(ids.IDs); i++ {
		s += ", ?"
	}

	res, err := o.Raw(fmt.Sprintf("UPDATE staff SET status = ? WHERE id IN (%s)", s), DimissionStatus, ids.IDs).Exec()
	if err != nil {
		return err
	}

	num, _ := res.RowsAffected()

	if num == 0 {
		return errors.New("not found")
	}
	logs.Debug("[SoftDelete]: %d rows affected, id %v", num, ids)

	return nil
}

type MarketingDailyRequest struct {
	Id      uint     `json:"id"`
	Date    DateTime `json:"date"`
	Hygiene int8     `json:"hygiene"`
	Meeting int8     `json:"meeting"`
	Work    int8     `json:"work"`
}

func (req *MarketingDailyRequest) Set() error {
	o := orm.NewOrm()
	res, err := o.Raw(
		"INSERT INTO marketing_daily(executor,date,hygiene,meeting,work) VALUES(?,?,?,?,?)",
		req.Id,
		req.Date.ToTime(),
		req.Hygiene,
		req.Meeting,
		req.Work,
	).Exec()
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && time.Now().Format("2006-01-02") == req.Date.String() {
			updateRes, updateErr := o.Raw(
				"UPDATE marketing_daily SET hygiene = ?,meeting = ?,work = ? WHERE executor = ? AND date = ?",
				req.Hygiene,
				req.Meeting,
				req.Work,
				req.Id,
				req.Date.ToTime(),
			).Exec()
			if updateErr != nil {
				return updateErr
			}
			num, _ := updateRes.RowsAffected()
			logs.Info("[SetMarketingDailyRequest]: %d rows affected, update %+v", num, req)
			return nil
		}
		return err
	}

	num, _ := res.RowsAffected()
	logs.Info("[SetMarketingDailyRequest]: %d rows affected, insert %+v", num, req)
	return nil
}

type DailyRequest struct {
	Id        uint     `json:"id"`
	Date      DateTime `json:"date"`
	WorkItem1 int8     `json:"workItem1,omitempty"`
	WorkItem2 int8     `json:"workItem2,omitempty"`
	WorkItem3 int8     `json:"workItem3,omitempty"`
	WorkItem4 int8     `json:"workItem4,omitempty"`
	WorkItem5 int8     `json:"workItem5,omitempty"`
	WorkItem6 int8     `json:"workItem6,omitempty"`
	WorkItem7 int8     `json:"workItem7,omitempty"`
	WorkItem8 int8     `json:"workItem8,omitempty"`
}

func (req *DailyRequest) SetTechSupport() error {
	o := orm.NewOrm()
	res, err := o.Raw(
		"INSERT INTO techsupport_daily(executor,date,work_item1,work_item2,work_item3,work_item4,work_item5,work_item6,work_item7) VALUES(?,?,?,?,?,?,?,?,?)",
		req.Id,
		req.Date.ToTime(),
		req.WorkItem1,
		req.WorkItem2,
		req.WorkItem3,
		req.WorkItem4,
		req.WorkItem5,
		req.WorkItem6,
		req.WorkItem7,
	).Exec()
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && time.Now().Format("2006-01-02") == req.Date.String() {
			updateRes, updateErr := o.Raw(
				"UPDATE techsupport_daily SET work_item1 = ?,work_item2 = ?,work_item3 = ?,work_item4 = ?,work_item5 = ?,work_item6 = ?,work_item7 = ? WHERE executor = ? AND date = ?",
				req.WorkItem1,
				req.WorkItem2,
				req.WorkItem3,
				req.WorkItem4,
				req.WorkItem5,
				req.WorkItem6,
				req.WorkItem7,
				req.Id,
				req.Date.ToTime(),
			).Exec()
			if updateErr != nil {
				return updateErr
			}
			num, _ := updateRes.RowsAffected()
			logs.Info("[SetTechSupportDaily]: %d rows affected, update %+v", num, req)
			return nil
		}
		return err
	}

	num, _ := res.RowsAffected()
	logs.Info("[SetTechSupportDaily]: %d rows affected, insert %+v", num, req)
	return nil
}

func (req *DailyRequest) SetAfterSale() error {
	o := orm.NewOrm()
	res, err := o.Raw(
		"INSERT INTO aftersale_daily(executor,date,work_item1,work_item2,work_item3,work_item4,work_item5,work_item6,work_item7,work_item8) VALUES(?,?,?,?,?,?,?,?,?,?)",
		req.Id,
		req.Date.ToTime(),
		req.WorkItem1,
		req.WorkItem2,
		req.WorkItem3,
		req.WorkItem4,
		req.WorkItem5,
		req.WorkItem6,
		req.WorkItem7,
		req.WorkItem8,
	).Exec()
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && time.Now().Format("2006-01-02") == req.Date.String() {
			updateRes, updateErr := o.Raw(
				"UPDATE aftersale_daily SET work_item1 = ?,work_item2 = ?,work_item3 = ?,work_item4 = ?,work_item5 = ?,work_item6 = ?,work_item7 = ?,work_item8 = ? WHERE executor = ? AND date = ?",
				req.WorkItem1,
				req.WorkItem2,
				req.WorkItem3,
				req.WorkItem4,
				req.WorkItem5,
				req.WorkItem6,
				req.WorkItem7,
				req.WorkItem8,
				req.Id,
				req.Date.ToTime(),
			).Exec()
			if updateErr != nil {
				return updateErr
			}
			num, _ := updateRes.RowsAffected()
			logs.Info("[SetAfterSaleDaily]: %d rows affected, update %+v", num, req)
			return nil
		}
		return err
	}

	num, _ := res.RowsAffected()
	logs.Info("[SetAfterSaleDaily]: %d rows affected, insert %+v", num, req)
	return nil
}

func (req *DailyRequest) SetDevelop() error {
	o := orm.NewOrm()
	res, err := o.Raw(
		"INSERT INTO develop_daily(executor,date,work_item1,work_item2,work_item3,work_item4,work_item5,work_item6,work_item7) VALUES(?,?,?,?,?,?,?,?,?)",
		req.Id,
		req.Date.ToTime(),
		req.WorkItem1,
		req.WorkItem2,
		req.WorkItem3,
		req.WorkItem4,
		req.WorkItem5,
		req.WorkItem6,
		req.WorkItem7,
	).Exec()
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && time.Now().Format("2006-01-02") == req.Date.String() {
			updateRes, updateErr := o.Raw(
				"UPDATE develop_daily SET work_item1 = ?,work_item2 = ?,work_item3 = ?,work_item4 = ?,work_item5 = ?,work_item6 = ?,work_item7 = ? WHERE executor = ? AND date = ?",
				req.WorkItem1,
				req.WorkItem2,
				req.WorkItem3,
				req.WorkItem4,
				req.WorkItem5,
				req.WorkItem6,
				req.WorkItem7,
				req.Id,
				req.Date.ToTime(),
			).Exec()
			if updateErr != nil {
				return updateErr
			}
			num, _ := updateRes.RowsAffected()
			logs.Info("[SetDevelopDaily]: %d rows affected, update %+v", num, req)
			return nil
		}
		return err
	}

	num, _ := res.RowsAffected()
	logs.Info("[SetDevelopDaily]: %d rows affected, insert %+v", num, req)
	return nil
}

func (req *DailyRequest) SetProduct() error {
	o := orm.NewOrm()
	res, err := o.Raw(
		"INSERT INTO product_daily(executor,date,work_item1,work_item2,work_item3,work_item4) VALUES(?,?,?,?,?,?)",
		req.Id,
		req.Date.ToTime(),
		req.WorkItem1,
		req.WorkItem2,
		req.WorkItem3,
		req.WorkItem4,
	).Exec()
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && time.Now().Format("2006-01-02") == req.Date.String() {
			updateRes, updateErr := o.Raw(
				"UPDATE product_daily SET work_item1 = ?,work_item2 = ?,work_item3 = ?,work_item4 = ? WHERE executor = ? AND date = ?",
				req.WorkItem1,
				req.WorkItem2,
				req.WorkItem3,
				req.WorkItem4,
				req.Id,
				req.Date.ToTime(),
			).Exec()
			if updateErr != nil {
				return updateErr
			}
			num, _ := updateRes.RowsAffected()
			logs.Info("[SetProductDaily]: %d rows affected, update %+v", num, req)
			return nil
		}
		return err
	}

	num, _ := res.RowsAffected()
	logs.Info("[SetProductDaily]: %d rows affected, insert %+v", num, req)
	return nil
}

func (req *DailyRequest) SetOffice() error {
	o := orm.NewOrm()
	res, err := o.Raw(
		"INSERT INTO office_daily(executor,date,work_item1,work_item2,work_item3,work_item4,work_item5,work_item6) VALUES(?,?,?,?,?,?,?,?)",
		req.Id,
		req.Date.ToTime(),
		req.WorkItem1,
		req.WorkItem2,
		req.WorkItem3,
		req.WorkItem4,
		req.WorkItem5,
		req.WorkItem6,
	).Exec()
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && time.Now().Format("2006-01-02") == req.Date.String() {
			updateRes, updateErr := o.Raw(
				"UPDATE office_daily SET work_item1 = ?,work_item2 = ?,work_item3 = ?,work_item4 = ?,work_item5 = ?,work_item6 = ? WHERE executor = ? AND date = ?",
				req.WorkItem1,
				req.WorkItem2,
				req.WorkItem3,
				req.WorkItem4,
				req.WorkItem5,
				req.WorkItem6,
				req.Id,
				req.Date.ToTime(),
			).Exec()
			if updateErr != nil {
				return updateErr
			}
			num, _ := updateRes.RowsAffected()
			logs.Info("[SetOfficeDaily]: %d rows affected, update %+v", num, req)
			return nil
		}
		return err
	}

	num, _ := res.RowsAffected()
	logs.Info("[SetOfficeDaily]: %d rows affected, insert %+v", num, req)
	return nil
}

func (req *DailyRequest) SetFinance() error {
	o := orm.NewOrm()
	res, err := o.Raw(
		"INSERT INTO finance_daily(executor,date,work_item1,work_item2,work_item3,work_item4,work_item5) VALUES(?,?,?,?,?,?,?)",
		req.Id,
		req.Date.ToTime(),
		req.WorkItem1,
		req.WorkItem2,
		req.WorkItem3,
		req.WorkItem4,
		req.WorkItem5,
	).Exec()
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && time.Now().Format("2006-01-02") == req.Date.String() {
			updateRes, updateErr := o.Raw(
				"UPDATE finance_daily SET work_item1 = ?,work_item2 = ?,work_item3 = ?,work_item4 = ?,work_item5 = ? WHERE executor = ? AND date = ?",
				req.WorkItem1,
				req.WorkItem2,
				req.WorkItem3,
				req.WorkItem4,
				req.WorkItem5,
				req.Id,
				req.Date.ToTime(),
			).Exec()
			if updateErr != nil {
				return updateErr
			}
			num, _ := updateRes.RowsAffected()
			logs.Info("[SetFinanceDaily]: %d rows affected, update %+v", num, req)
			return nil
		}
		return err
	}

	num, _ := res.RowsAffected()
	logs.Info("[SetFinanceDaily]: %d rows affected, insert %+v", num, req)
	return nil
}

type AddWeeklySummaryRequest struct {
	Id       uint              `json:"id"`
	Week     string            `json:"week"`
	Complete string            `json:"complete"`
	Summary  string            `json:"summary"`
	Stage    string            `json:"stage"`
	Result   string            `json:"result"`
	Items    []WeekSummaryItem `json:"items"`
}

func AddWeeklySummary(req AddWeeklySummaryRequest) error {
	var (
		err   error
		res   sql.Result
		o     = orm.NewOrm()
		exist uint
	)

	err = o.Raw("SELECT id FROM weekly WHERE title = ? AND executor = ? LIMIT 1", req.Week, req.Id).QueryRow(&exist)
	if exist != 0 {
		res, err = o.Raw(
			"UPDATE weekly SET complete = ?, summary = ?, stage = ?, result = ? WHERE id = ?",
			req.Complete,
			req.Summary,
			req.Stage,
			req.Result,
			exist,
		).Exec()
		if err != nil {
			return err
		}

		if len(req.Items) > 0 {
			query := make([]string, 0, len(req.Items))
			for _, item := range req.Items {
				query = append(query, fmt.Sprintf("(%d, '%s', '%s')", exist, item.Description, item.Result))
			}
			res, err = o.Raw("INSERT INTO weekly_summary(pid,description,result) VALUES" + strings.Join(query, ",")).Exec()
			if err != nil {
				return err
			}
		}
	} else {
		res, err = o.Raw(
			"INSERT INTO weekly(title,executor,complete,summary,stage,result) VALUES(?,?,?,?,?,?)",
			req.Week,
			req.Id,
			req.Complete,
			req.Summary,
			req.Stage,
			req.Result,
		).Exec()
		if err != nil {
			return err
		}

		if len(req.Items) > 0 {
			weeklyID, err := res.LastInsertId()
			query := make([]string, 0, len(req.Items))
			for _, item := range req.Items {
				query = append(query, fmt.Sprintf("(%d, '%s', '%s')", weeklyID, item.Description, item.Result))
			}
			res, err = o.Raw("INSERT INTO weekly_summary(pid,description,result) VALUES" + strings.Join(query, ",")).Exec()
			if err != nil {
				return err
			}
		}
	}

	return nil
}

type AddWeeklyPlanRequest struct {
	Id          uint           `json:"id"`
	Week        string         `json:"week"`
	Description string         `json:"description"`
	Goal        string         `json:"goal"`
	Remark      string         `json:"remark"`
	Items       []WeekPlanItem `json:"items"`
}

func AddWeeklyPlan(req AddWeeklyPlanRequest) error {
	var (
		err   error
		res   sql.Result
		o     = orm.NewOrm()
		exist uint
	)

	err = o.Raw("SELECT id FROM weekly WHERE title = ? AND executor = ? LIMIT 1", req.Week, req.Id).QueryRow(&exist)
	if exist != 0 {
		res, err = o.Raw(
			"UPDATE weekly SET description = ?, goal = ?, remark = ? WHERE id = ?",
			req.Description,
			req.Goal,
			req.Remark,
			exist,
		).Exec()
		if err != nil {
			return err
		}

		if len(req.Items) > 0 {
			query := make([]string, 0, len(req.Items))
			for _, item := range req.Items {
				query = append(query, fmt.Sprintf("(%d, '%s', '%s')", exist, item.Description, item.Goal))
			}
			res, err = o.Raw("INSERT INTO weekly_plan(pid,description,goal) VALUES" + strings.Join(query, ",")).Exec()
			if err != nil {
				return err
			}
		}
	} else {
		res, err = o.Raw(
			"INSERT INTO weekly(title,executor,description,goal,remark) VALUES(?,?,?,?,?)",
			req.Week,
			req.Id,
			req.Description,
			req.Goal,
			req.Remark,
		).Exec()
		if err != nil {
			return err
		}

		if len(req.Items) > 0 {
			weeklyID, err := res.LastInsertId()
			query := make([]string, 0, len(req.Items))
			for _, item := range req.Items {
				query = append(query, fmt.Sprintf("(%d, '%s', '%s')", weeklyID, item.Description, item.Goal))
			}
			res, err = o.Raw("INSERT INTO weekly_plan(pid,description,goal) VALUES" + strings.Join(query, ",")).Exec()
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func VerifyRole(role string) bool {
	switch role {
	case AdminRole, BossRole, LeaderRole, StaffRole, GuestRole:
		return true
	default:
		return false
	}
}

func GeneratePassword(pass string) string {
	var salt = []byte(beego.AppConfig.String("salt"))

	dk, err := scrypt.Key([]byte(strings.TrimSpace(pass)), salt, 16384, 8, 1, 32)
	if err != nil {
		logs.Error("GeneratePassword err: %v", err)
		return ""
	}
	return base64.StdEncoding.EncodeToString(dk)
}
