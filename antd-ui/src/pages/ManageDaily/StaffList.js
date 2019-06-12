import React from 'react';
import { Table } from 'antd';
import moment from 'moment';

const StaffList = props => {
  const { list, loading, enableModal } = props;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 30,
    },
    {
      title: '账户名',
      dataIndex: 'nickname',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      render: text => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '电话',
      dataIndex: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'mail',
    },
    {
      title: '角色',
      dataIndex: 'role',
      filterMultiple: false,
      filters: [
        {
          text: '员工',
          value: 'staff',
        },
        {
          text: '主管',
          value: 'leader',
        },
      ],
      onFilter: (value, record) => record.role.indexOf(value) === 0,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <a href="javascript:;" onClick={() => enableModal(record)}>
          查看日报
        </a>
      ),
    },
  ];

  return (
    <Table
      size="small"
      rowKey={data => data.id}
      bordered
      scroll={{ x: '100%' }}
      columns={columns}
      dataSource={list}
      pagination={false}
      loading={loading}
    />
  );
};

export default StaffList;
