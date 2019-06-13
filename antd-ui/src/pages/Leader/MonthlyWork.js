import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table } from 'antd';
import moment from 'moment';
import DailyModal from './DailyModal';

@connect(({ monthly, user, staff, loading }) => ({
  user,
  monthly,
  staff,
  staffLoading: loading.models.staff,
  loading: loading.models.monthly,
}))
class MonthlyWork extends Component {
  state = {
    record: {},
    startDate: null,
    endDate: null,
    modalVisible: false,
  };

  columns = [
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
        <a href="javascript:" onClick={() => this.enableModal(record)}>
          查看日报
        </a>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      user: { currentUser },
    } = this.props;
    dispatch({
      type: 'staff/fetchStaffList',
      payload: {
        role: 'staff,leader',
        department: currentUser.department,
      },
    });
  }

  enableModal = record => {
    this.setState({ record, modalVisible: true });
    this.handleDateChange(
      moment().startOf('month').format('YYYYMMDD'),
      moment().format('YYYYMMDD'),
      record.id,
    );
  };

  handleModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  handleDateChange = (start, end, id) => {
    const {
      dispatch,
      user: { currentUser },
    } = this.props;
    this.setState({
      startDate: start,
      endDate: end,
    });
    switch (currentUser.department) {
      case 'afterSale':
        dispatch({
          type: 'monthly/fetchAfterSaleMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'develop':
        dispatch({
          type: 'monthly/fetchDevelopMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'finance':
        dispatch({
          type: 'monthly/fetchFinanceMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'marketing':
        dispatch({
          type: 'monthly/fetchMarketingMonthlyByID',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'office':
        dispatch({
          type: 'monthly/fetchOfficeMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'product':
        dispatch({
          type: 'monthly/fetchProductMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'techSupport':
        dispatch({
          type: 'monthly/fetchTechSupportMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      default:
    }
  };

  render() {
    const {
      monthly: { list },
      staff: { list: staffList },
      user: { currentUser },
      loading,
      staffLoading,
    } = this.props;
    const { modalVisible, record, startDate, endDate } = this.state;
    const modalProps = {
      item: record,
      startDate,
      endDate,
      modalVisible,
      department: currentUser.department,
      loading,
      list,
      handleModalVisible: this.handleModalVisible,
      handleDateChange: this.handleDateChange,
    };

    return (
      <Card bordered={false}>
        <Table
          size="small"
          rowKey={data => data.id}
          bordered
          scroll={{ x: '100%' }}
          columns={this.columns}
          dataSource={staffList}
          pagination={false}
          loading={staffLoading}
        />
        <DailyModal {...modalProps} />
      </Card>
    );
  }
}

export default MonthlyWork;
