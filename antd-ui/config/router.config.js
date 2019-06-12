export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },

  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        path: '/',
        redirect: '/home',
        authority: ['guest', 'admin', 'boss', 'leader', 'staff'],
      },

      // home
      {
        path: '/home',
        name: 'home',
        icon: 'home',
        component: './Home',
      },

      // Admin
      // manage staff
      {
        path: '/admin/staff',
        name: 'manage-staff',
        icon: 'usergroup-add',
        authority: ['admin'],
        routes: [
          {
            path: '/admin/staff/register-audit',
            name: 'register-audit',
            component: './Admin/RegisterAudit',
          },
          {
            path: '/admin/staff/list',
            name: 'staff-list',
            component: './Admin/ManageStaff',
          },
        ],
      },
      // manage daily work
      {
        path: '/admin/daily',
        name: 'manage-daily',
        icon: 'schedule',
        authority: ['admin'],
        routes: [
          {
            path: '/admin/daily/marketing',
            name: 'daily-marketing',
            component: './ManageDaily/MarketingDaily',
          },
          {
            path: '/admin/daily/techsupport',
            name: 'daily-techsupport',
            component: './ManageDaily/TechSupportDaily',
          },
          {
            path: '/admin/daily/aftersale',
            name: 'daily-aftersale',
            component: './ManageDaily/AfterSaleDaily',
          },
          {
            path: '/admin/daily/office',
            name: 'daily-office',
            component: './ManageDaily/OfficeDaily',
          },
          {
            path: '/admin/daily/develop',
            name: 'daily-develop',
            component: './ManageDaily/DevelopDaily',
          },
          {
            path: '/admin/daily/product',
            name: 'daily-product',
            component: './ManageDaily/ProductDaily',
          },
          {
            path: '/admin/daily/finance',
            name: 'daily-finance',
            component: './ManageDaily/FinanceDaily',
          },
        ],
      },
      // manage weekly work
      {
        path: '/admin/weekly',
        name: 'weekly-list',
        icon: 'box-plot',
        authority: ['admin'],
        component: './ManageWeekly',
      },
      // manage annually work
      {
        path: '/admin/annually',
        name: 'annually-list',
        icon: 'fund',
        authority: ['admin'],
        component: './ManageAnnually',
      },

      // staff
      // daily
      {
        path: '/staff/daily',
        name: 'staff-daily',
        icon: 'schedule',
        authority: ['staff'],
        component: './SubmitDaily',
      },
      // weekly
      {
        path: '/staff/weekly',
        name: 'staff-weekly',
        icon: 'box-plot',
        authority: ['staff'],
        component: './SubmitWeekly',
      },
      {
        path: '/staff/weeklyList',
        name: 'staff-weekly-list',
        icon: 'container',
        authority: ['staff'],
        component: './Staff/WeeklyList',
      },
      // monthly
      {
        path: '/staff/monthly',
        name: 'staff-monthly',
        icon: 'fund',
        authority: ['staff'],
        component: './Staff/MonthlyWork',
      },

      // leader
      // daily
      {
        path: '/leader/daily',
        name: 'leader-daily',
        icon: 'schedule',
        authority: ['leader'],
        component: './SubmitDaily',
      },
      // weekly
      {
        path: '/leader/weekly',
        name: 'leader-weekly',
        icon: 'book',
        authority: ['leader'],
        component: './SubmitWeekly',
      },
      {
        path: '/leader/weekly-list',
        name: 'leader-weekly-list',
        icon: 'box-plot',
        authority: ['leader'],
        component: './Leader/WeeklyList',
      },
      // monthly
      {
        path: '/leader/monthly',
        name: 'leader-monthly',
        icon: 'project',
        authority: ['leader'],
        component: './Leader/MonthlyWork',
      },
      // manage annually work
      {
        path: '/leader/annually',
        name: 'annually-list',
        icon: 'fund',
        authority: ['leader'],
        component: './ManageAnnually',
      },

      // boss
      // manage daily work
      {
        path: '/boss/daily',
        name: 'manage-daily',
        icon: 'schedule',
        authority: ['boss'],
        routes: [
          {
            path: '/boss/daily/marketing',
            name: 'daily-marketing',
            component: './ManageDaily/MarketingDaily',
          },
          {
            path: '/boss/daily/techsupport',
            name: 'daily-techsupport',
            component: './ManageDaily/TechSupportDaily',
          },
          {
            path: '/boss/daily/aftersale',
            name: 'daily-aftersale',
            component: './ManageDaily/AfterSaleDaily',
          },
          {
            path: '/boss/daily/office',
            name: 'daily-office',
            component: './ManageDaily/OfficeDaily',
          },
          {
            path: '/boss/daily/develop',
            name: 'daily-develop',
            component: './ManageDaily/DevelopDaily',
          },
          {
            path: '/boss/daily/product',
            name: 'daily-product',
            component: './ManageDaily/ProductDaily',
          },
          {
            path: '/boss/daily/finance',
            name: 'daily-finance',
            component: './ManageDaily/FinanceDaily',
          },
        ],
      },
      // manage weekly work
      {
        path: '/boss/weekly',
        name: 'weekly-list',
        icon: 'box-plot',
        authority: ['boss'],
        component: './ManageWeekly',
      },
      // manage annually work
      {
        path: '/boss/annually',
        name: 'annually-list',
        icon: 'fund',
        authority: ['boss'],
        component: './ManageAnnually',
      },

      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
            ],
          },
        ],
      },

      {
        component: '404',
      },
    ],
  },
];
