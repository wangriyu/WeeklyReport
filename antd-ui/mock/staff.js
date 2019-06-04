import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 106; i += 1) {
  tableListDataSource.push({
    id: i+100000,
    nickname: Math.random().toString(36).substr(2),
    name: Math.random().toString(36).substr(2),
    joinDate: `2019-05-0${i % 9 +1}`,
    department: [
      "marketing",
      "techSupport",
      "afterSale",
      "develop",
      "product",
      "office",
      "finance"
    ][i % 7],
    mobile: '18833245673',
    mail: Math.random().toString(36).substr(2) + '@qq.com',
    role: ['boss', 'leader', 'staff'][i % 3]
  });
}
tableListDataSource[0].department = "default";

function getList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.department) {
    const dps = params.department.split(',');
    let filterDataSource = [];
    dps.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => data.department === s)
      );
    });
    dataSource = filterDataSource;
  }

  if (params.role) {
    dataSource = dataSource.filter(data => data.role === params.role);
  }

  let pageSize = 20;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    status: 'ok',
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postRule(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        name: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        desc,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  return getRule(req, res, u);
}

export default {
  'GET /api/staff/list': getList,
  'POST /api/staff': postRule,
};
