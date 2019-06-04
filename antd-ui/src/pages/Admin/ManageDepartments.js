import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
} from 'antd';
import DropOption from '@/components/DropOption';
import styles from './TableList.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ department, loading }) => ({
  department,
  loading: loading.models.department
}))
@Form.create()
class ManageDepartments extends PureComponent {
  state = {
  };

  handleSingleMenuClick = (record, e) => {
    console.log(record, e.key);
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    }, {
      title: 'name',
      dataIndex: 'nickname',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <DropOption
          onMenuClick={e => this.handleSingleMenuClick(record, e)}
          menuOptions={[
            { key: '1', name: '修改' },
            { key: '2', name: '删除' },
          ]}
        />
      ),
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'department/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg) => {
    const { dispatch } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };

    dispatch({
      type: 'department/fetch',
      payload: params,
    });
  };

  render() {
    const {
      department: { data },
      loading,
    } = this.props;
    const { list = [], pagination } = data;
    const paginationProps = {
      showSizeChanger: true,
      pageSizeOptions: ['20', '30', '50', '100'],
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      ...pagination,
    };

    return (
      <Card bordered={false}>
        <Table
          rowKey={record => record.id}
          className={styles.table}
          bordered
          scroll={{ x: '100%' }}
          columns={this.columns}
          dataSource={list}
          pagination={paginationProps}
          loading={loading}
          onChange={this.handleStandardTableChange}
        />
      </Card>
    )
  }
}

export default ManageDepartments
