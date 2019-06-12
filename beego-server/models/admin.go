package models

import (
	"errors"
	"fmt"
	"time"

	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
)

type SetRoleRequest struct {
	IDs       []uint `json:"ids"`
	Operation string `json:"operation"`
}

func QueryAuditList() (list []Staff, err error) {
	o := orm.NewOrm()
	num, err := o.Raw("SELECT id,nickname,name,join_date,department,mail,mobile,role FROM staff WHERE role = ?", GuestRole).QueryRows(&list)
	if err != nil {
		return list, err
	}

	logs.Debug("[QueryAuditList]: %d rows affected", num)
	return list, nil
}

func QueryStaffList(department, role []string) (list []Staff, err error) {
	var num int64
	o := orm.NewOrm()
	d := "?"
	for i := 1; i < len(department); i++ {
		d += ", ?"
	}
	r := "?"
	for i := 1; i < len(role); i++ {
		r += ", ?"
	}
	if len(department) != 0 {
		if len(role) != 0 {
			num, err = o.Raw(
				fmt.Sprintf("SELECT id,nickname,name,join_date,department,mail,mobile,role FROM staff WHERE department IN (%s) AND role IN (%s) AND status > ?", d, r),
				department,
				role,
				GuestStatus,
			).QueryRows(&list)
		} else {
			num, err = o.Raw(
				fmt.Sprintf("SELECT id,nickname,name,join_date,department,mail,mobile,role FROM staff WHERE department IN (%s) AND role NOT IN (?, ?) AND status > ?", d),
				department,
				GuestRole,
				AdminRole,
				GuestStatus,
			).QueryRows(&list)
		}
	} else {
		if len(role) != 0 {
			num, err = o.Raw(
				fmt.Sprintf("SELECT id,nickname,name,join_date,department,mail,mobile,role FROM staff WHERE role IN (%s) AND status > ?", r),
				role,
				GuestStatus,
			).QueryRows(&list)
		} else {
			num, err = o.Raw(
				"SELECT id,nickname,name,join_date,department,mail,mobile,role FROM staff WHERE role NOT IN (?, ?) AND status > ?",
				GuestRole,
				AdminRole,
				GuestStatus,
			).QueryRows(&list)
		}
	}
	if err != nil {
		return list, err
	}

	logs.Debug("[QueryStaffList]: %d rows affected", num)
	return list, nil
}

func (req *SetRoleRequest) Set() error {
	l := len(req.IDs)
	if l == 0 {
		return errors.New("no id founds")
	}

	s := "?"
	for i := 1; i < l; i++ {
		s += ", ?"
	}

	var query string
	switch req.Operation {
	case "setStaff":
		query = fmt.Sprintf("UPDATE staff SET role = 'staff',status = %d WHERE id IN (%s) AND status >= %d", NormalStatus, s, GuestStatus)
	case "setLeader":
		query = fmt.Sprintf("UPDATE staff SET role = 'leader',status = %d WHERE id IN (%s) AND status >= %d", NormalStatus, s, GuestStatus)
	case "setBoss":
		query = fmt.Sprintf("UPDATE staff SET role = 'boss',status = %d WHERE id IN (%s) AND status >= %d", BossStatus, s, GuestStatus)
	case "delete":
		query = fmt.Sprintf("DELETE FROM staff WHERE id IN (%s) AND status >= %d", s, GuestStatus)
	default:
		return errors.New("unexpected operation")
	}
	o := orm.NewOrm()
	res, err := o.Raw(query, req.IDs).Exec()
	if err != nil {
		return err
	}

	num, _ := res.RowsAffected()
	logs.Info("[SetRoleRequest %s]: %d rows affected in staff where id in %v", req.Operation, num, req.IDs)

	return nil
}

type MarketingMonthlyResultAll struct {
	Id       uint              `json:"id"`
	Name     string            `json:"name"`
	WorkItem map[string][]int8 `json:"workItem"`
}

func QueryMarketingMonthly(start, end time.Time) ([]MarketingMonthlyResultAll, error) {
	var (
		ids []MarketingMonthlyResultAll
	)

	o := orm.NewOrm()
	num, err := o.Raw("SELECT id,name FROM staff WHERE department = ? AND status = ?", MarketingDepartment, NormalStatus).QueryRows(&ids)
	if err != nil {
		return ids, err
	}
	if num == 0 {
		return ids, errors.New("no person found")
	}

	for i := range ids {
		var items []struct {
			Date    time.Time
			Hygiene int8
			Meeting int8
			Work    int8
		}
		_, err := o.Raw("SELECT date,hygiene,meeting,work FROM marketing_daily WHERE executor = ? AND date >= ? AND date <= ?", ids[i].Id, start, end).QueryRows(&items)
		if err != nil {
			return ids, err
		}
		ids[i].WorkItem = make(map[string][]int8)
		for j := range items {
			ids[i].WorkItem[items[j].Date.Format("20060102")] = []int8{items[j].Hygiene, items[j].Meeting, items[j].Work}
		}
	}

	logs.Debug("[QueryMarketingMonthly]: %+v", ids)
	return ids, nil
}

type MarketingMonthlyResult struct {
	Id      string    `json:"id"`
	Date    time.Time `json:"date"`
	Hygiene int8      `json:"hygiene"`
	Meeting int8      `json:"meeting"`
	Work    int8      `json:"work"`
}

func QueryMarketingMonthlyByID(id string, start, end time.Time) ([]MarketingMonthlyResult, error) {
	o := orm.NewOrm()
	var result []MarketingMonthlyResult
	num, err := o.Raw("SELECT date,hygiene,meeting,work FROM marketing_daily WHERE executor = ? AND date >= ? AND date <= ? ORDER BY date", id, start, end).QueryRows(&result)
	if err != nil {
		return result, err
	}
	logs.Info("[QueryMarketingMonthlyByID]: %d rows affected", num)
	return result, nil
}

type MonthlyResult struct {
	Id        string    `json:"id"`
	Date      time.Time `json:"-"`
	WorkItem1 int8      `json:"workItem1,omitempty"`
	WorkItem2 int8      `json:"workItem2,omitempty"`
	WorkItem3 int8      `json:"workItem3,omitempty"`
	WorkItem4 int8      `json:"workItem4,omitempty"`
	WorkItem5 int8      `json:"workItem5,omitempty"`
	WorkItem6 int8      `json:"workItem6,omitempty"`
	WorkItem7 int8      `json:"workItem7,omitempty"`
	WorkItem8 int8      `json:"workItem8,omitempty"`
}

func QueryTechSupportMonthly(id string, start, end time.Time) ([]MonthlyResult, error) {
	o := orm.NewOrm()

	var items []MonthlyResult
	num, err := o.Raw(
		"SELECT date,work_item1,work_item2,work_item3,work_item4,work_item5,work_item6,work_item7 FROM techsupport_daily WHERE executor = ? AND date >= ? AND date <= ? ORDER BY date",
		id,
		start,
		end,
	).QueryRows(&items)
	if err != nil {
		return items, err
	}

	logs.Debug("[QueryTechSupportMonthly]: %d rows affected, %+v", num, items)
	return items, nil
}

func QueryAfterSaleMonthly(id string, start, end time.Time) ([]MonthlyResult, error) {
	o := orm.NewOrm()

	var items []MonthlyResult
	num, err := o.Raw("SELECT date,work_item1,work_item2,work_item3,work_item4,work_item5,work_item6,work_item7,work_item8 FROM aftersale_daily WHERE executor = ? AND date >= ? AND date <= ? ORDER BY date", id, start, end).QueryRows(&items)
	if err != nil {
		return items, err
	}

	logs.Debug("[QueryAfterSaleMonthly]: %d rows affected, %+v", num, items)
	return items, nil
}

func QueryDevelopMonthly(id string, start, end time.Time) ([]MonthlyResult, error) {
	o := orm.NewOrm()

	var items []MonthlyResult
	num, err := o.Raw("SELECT date,work_item1,work_item2,work_item3,work_item4,work_item5,work_item6,work_item7 FROM develop_daily WHERE executor = ? AND date >= ? AND date <= ? ORDER BY date", id, start, end).QueryRows(&items)
	if err != nil {
		return items, err
	}

	logs.Debug("[QueryDevelopMonthly]: %d rows affected, %+v", num, items)
	return items, nil
}

func QueryProductMonthly(id string, start, end time.Time) ([]MonthlyResult, error) {
	o := orm.NewOrm()

	var items []MonthlyResult
	num, err := o.Raw("SELECT date,work_item1,work_item2,work_item3,work_item4 FROM product_daily WHERE executor = ? AND date >= ? AND date <= ? ORDER BY date", id, start, end).QueryRows(&items)
	if err != nil {
		return items, err
	}

	logs.Debug("[QueryProductMonthly]: %d rows affected, %+v", num, items)
	return items, nil
}

func QueryOfficeMonthly(id string, start, end time.Time) ([]MonthlyResult, error) {
	o := orm.NewOrm()

	var items []MonthlyResult
	num, err := o.Raw("SELECT date,work_item1,work_item2,work_item3,work_item4,work_item5,work_item6 FROM office_daily WHERE executor = ? AND date >= ? AND date <= ? ORDER BY date", id, start, end).QueryRows(&items)
	if err != nil {
		return items, err
	}

	logs.Debug("[QueryOfficeMonthly]: %d rows affected, %+v", num, items)
	return items, nil
}

func QueryFinanceMonthly(id string, start, end time.Time) ([]MonthlyResult, error) {
	o := orm.NewOrm()

	var items []MonthlyResult
	num, err := o.Raw("SELECT date,work_item1,work_item2,work_item3,work_item4,work_item5 FROM finance_daily WHERE executor = ? AND date >= ? AND date <= ? ORDER BY date", id, start, end).QueryRows(&items)
	if err != nil {
		return items, err
	}

	logs.Debug("[QueryFinanceMonthly]: %d rows affected, %+v", num, items)
	return items, nil
}

type WeekSummary struct {
	Id       uint              `json:"id"`
	Complete string            `json:"complete"`
	Summary  string            `json:"summary"`
	Stage    string            `json:"stage"`
	Result   string            `json:"result"`
	Items    []WeekSummaryItem `json:"items"`
}

type WeekSummaryItem struct {
	Id          uint   `json:"id"`
	Description string `json:"description"`
	Result      string `json:"result"`
}

type WeekPlan struct {
	Id          uint           `json:"id"`
	Description string         `json:"description"`
	Goal        string         `json:"goal"`
	Remark      string         `json:"remark"`
	Items       []WeekPlanItem `json:"items"`
}

type WeekPlanItem struct {
	Id          uint   `json:"id"`
	Description string `json:"description"`
	Goal        string `json:"goal"`
}

func QueryWeeklyPlan(id, planWeek string) (WeekPlan, error) {
	var (
		plan = WeekPlan{}
		err  error
		o    = orm.NewOrm()
	)

	err = o.Raw("SELECT id,description,goal,remark FROM weekly WHERE executor = ? AND title = ?", id, planWeek).QueryRow(&plan)
	if err != nil {
		return plan, err
	}

	var (
		items []WeekPlanItem
		num   int64
	)
	num, err = o.Raw("SELECT id,description,goal FROM weekly_plan WHERE pid = ?", plan.Id).QueryRows(&items)
	if err != nil {
		return plan, err
	}
	logs.Info("[GenerateWeeklyReport]: %d rows affected in weekly_plan, pid %d", num, plan.Id)
	plan.Items = items

	return plan, nil
}

func QueryWeeklySummary(id, summaryWeek string) (WeekSummary, error) {
	var (
		summary = WeekSummary{}
		err     error
		o       = orm.NewOrm()
	)

	err = o.Raw("SELECT id,complete,summary,stage,result FROM weekly WHERE executor = ? AND title = ?", id, summaryWeek).QueryRow(&summary)
	if err != nil {
		return summary, err
	}

	var (
		items []WeekSummaryItem
		num   int64
	)
	num, err = o.Raw("SELECT id,description,result FROM weekly_summary WHERE pid = ?", summary.Id).QueryRows(&items)
	if err != nil {
		return summary, err
	}
	logs.Info("[GenerateWeeklyReport]: %d rows affected in weekly_summary, pid %d", num, summary.Id)
	summary.Items = items

	return summary, nil
}

type Annually struct {
	Id    uint   `json:"id,omitempty"`
	Title string `json:"title,omitempty"`
	Goal  string `json:"goal"`
	Plan  string `json:"plan"`
}

func QueryAnnuallyList() ([]Annually, error) {
	o := orm.NewOrm()

	var result []Annually
	_, err := o.Raw("SELECT id,title,goal,plan FROM annually WHERE status > ?", DimissionStatus).QueryRows(&result)
	if err != nil {
		return result, err
	}

	return result, nil
}

func AddAnnuallyPlan(req Annually) (int64, error) {
	o := orm.NewOrm()
	res, err := o.Raw("INSERT INTO annually(title,goal,plan) VALUES(?,?,?)", req.Title, req.Goal, req.Plan).Exec()
	if err != nil {
		return 0, err
	}

	id, _ := res.LastInsertId()
	return id, nil
}

func UpdateAnnuallyPlan(req Annually) error {
	o := orm.NewOrm()
	res, err := o.Raw("UPDATE annually SET goal = ?,plan = ? WHERE id = ?", req.Goal, req.Plan, req.Id).Exec()
	if err != nil {
		return err
	}

	num, _ := res.RowsAffected()
	logs.Info("[UpdateAnnuallyPlan]: %d rows affected in annually", num)
	return nil
}

type AnnuallyItem struct {
	Id          uint      `json:"id,omitempty"`
	Pid         uint      `json:"pid,omitempty"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Priority    int8      `json:"priority"`
	Deadline    time.Time `json:"deadline"`
	Leader      string    `json:"leader"`
	Progress    string    `json:"progress"`
	Result      string    `json:"result"`
}

func QueryAnnuallyItemList(id string) ([]AnnuallyItem, error) {
	o := orm.NewOrm()

	var result []AnnuallyItem
	_, err := o.Raw("SELECT id,pid,title,description,priority,deadline,leader,progress,result FROM annually_item WHERE pid = ?", id).QueryRows(&result)
	if err != nil {
		return result, err
	}

	return result, nil
}

func AddAnnuallyPlanItem(req AnnuallyItem) (int64, error) {
	o := orm.NewOrm()
	res, err := o.Raw(
		"INSERT INTO annually_item(pid,title,description,priority,deadline,leader,progress,result) VALUES(?,?,?,?,?,?,?,?)",
		req.Pid,
		req.Title,
		req.Description,
		req.Priority,
		req.Deadline,
		req.Leader,
		req.Progress,
		req.Result,
	).Exec()
	if err != nil {
		return 0, err
	}

	id, _ := res.LastInsertId()
	return id, nil
}

func UpdateAnnuallyItem(req AnnuallyItem) error {
	o := orm.NewOrm()
	res, err := o.Raw(
		"UPDATE annually_item SET title = ?,description = ?,priority = ?,deadline = ?,leader = ?,progress = ?,result = ? WHERE id = ?",
		req.Title,
		req.Description,
		req.Priority,
		req.Deadline,
		req.Leader,
		req.Progress,
		req.Result,
		req.Id,
	).Exec()
	if err != nil {
		return err
	}

	num, _ := res.RowsAffected()
	logs.Info("[UpdateAnnuallyPlan]: %d rows affected in annually", num)
	return nil
}

func DeleteAnnuallyItem(id, pid string) error {
	o := orm.NewOrm()
	res, err := o.Raw("DELETE FROM annually_item WHERE id = ? AND pid = ?", id, pid).Exec()
	if err != nil {
		return err
	}
	num, _ := res.RowsAffected()
	logs.Info("[DeleteAnnuallyItem]: %d rows affected in annually_item", num)
	return nil
}
