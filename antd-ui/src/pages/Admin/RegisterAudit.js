import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
} from 'antd';
import DropOption from '@/components/DropOption';
import moment from 'moment';
import { departments } from '../../utils/variable';
import styles from './TableList.less';

const departmentKeys = Object.keys(departments);
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.models.audit
}))
@Form.create()
class RegisterAudit extends PureComponent {
  state = {
    selectedRowKeys: [],
    pagination: {
      current: 1,
      pageSize: 10
    }
  };

  handleSingleMenuClick = (record, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'audit/setRole',
      payload: {
        ids: [record.id],
        operation: e.key
      }
    });
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    }, {
      title: '账户名',
      dataIndex: 'nickname',
    }, {
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: '入职日期',
      dataIndex: 'joinDate',
      render: (text) => moment(text).format('YYYY-MM-DD')
    }, {
      title: '部门',
      dataIndex: 'department',
      filters: [
        {
          text: departments[departmentKeys[0]],
          value: departmentKeys[0],
        }, {
          text: departments[departmentKeys[1]],
          value: departmentKeys[1],
        }, {
          text: departments[departmentKeys[2]],
          value: departmentKeys[2],
        }, {
          text: departments[departmentKeys[3]],
          value: departmentKeys[3],
        }, {
          text: departments[departmentKeys[4]],
          value: departmentKeys[4],
        }, {
          text: departments[departmentKeys[5]],
          value: departmentKeys[5],
        }, {
          text: departments[departmentKeys[6]],
          value: departmentKeys[6],
        }, {
          text: departments[departmentKeys[7]],
          value: departmentKeys[7],
        },
      ],
      render: (text) => departments[text],
      onFilter: (value, record) => record.department.indexOf(value) === 0
    }, {
      title: '电话',
      dataIndex: 'mobile',
    }, {
      title: '邮箱',
      dataIndex: 'mail',
    }, {
      title: '权限',
      dataIndex: 'role',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <DropOption
          onMenuClick={e => this.handleSingleMenuClick(record, e)}
          menuOptions={[
            { key: 'setStaff', name: '设为员工' },
            { key: 'setLeader', name: '设为主管' },
            { key: 'setBoss', name: '设为总工' },
            { key: 'delete', name: '删除记录' },
          ]}
        />
      ),
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'audit/fetch',
    });
  }

  handleStandardTableChange = (pagination) => {
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    };

    this.setState({pagination: params})
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  handleMultiMenuClick = (selectedRowKeys, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'audit/setRole',
      payload: {
        ids: selectedRowKeys,
        operation: e.key
      }
    });
  };

  render() {
    const { audit: { list }, loading } = this.props;
    const { selectedRowKeys, pagination } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '50'],
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      total: list && list.length ? list.length : 0,
      ...pagination,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
        <Card bordered={false}>
          <div style={{marginBottom: '10px'}}>
            <DropOption
              disabled={!hasSelected}
              buttonStyle={{margin: '0 16px 0 0'}}
              onMenuClick={e => this.handleMultiMenuClick(selectedRowKeys, e)}
              menuOptions={[
                { key: 'setStaff', name: '设为员工' },
                { key: 'setLeader', name: '设为主管' },
                { key: 'setBoss', name: '设为总工' },
                { key: 'delete', name: '删除记录' },
              ]}
            />
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </div>
          <Table
            rowKey={record => record.id}
            rowSelection={rowSelection}
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
    );
  }
}

export default RegisterAudit;
