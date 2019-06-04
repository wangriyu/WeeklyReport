package models

const (
	DefaultDepartment     = "default"
	MarketingDepartment   = "marketing"   // 营销部
	TechSupportDepartment = "techSupport" // 技术支持部
	AfterSaleDepartment   = "afterSale"   // 售后部
	DevelopDepartment     = "develop"     // 研发部
	ProductDepartment     = "product"     // 生产部
	OfficeDepartment      = "office"      // 综合办公室
	FinanceDepartment     = "finance"     // 财务部
)

type Department struct {
	Name string `json:"name"`
}

func GetDepartments() (list []Department, err error) {
	list = []Department{
		{DefaultDepartment},
		{MarketingDepartment},
		{TechSupportDepartment},
		{AfterSaleDepartment},
		{DevelopDepartment},
		{ProductDepartment},
		{OfficeDepartment},
		{FinanceDepartment},
	}
	return list, nil
}

func VerifyDepartment(department string) bool {
	switch department {
	case DefaultDepartment, MarketingDepartment, TechSupportDepartment, AfterSaleDepartment, DevelopDepartment, ProductDepartment, OfficeDepartment, FinanceDepartment:
		return true
	default:
		return false
	}
}
