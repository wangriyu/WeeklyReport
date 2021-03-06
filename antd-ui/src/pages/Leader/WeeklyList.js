import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table } from 'antd';
import DropOption from '@/components/DropOption';
import moment from 'moment';
import WeeklyModal from './WeeklyModal';

@connect(({ weekly, staff, user, loading }) => ({
  weekly,
  staff,
  user,
  loading: loading.models.weekly,
  staffLoading: loading.models.staff,
}))
class WeeklyList extends Component {
  state = {
    planWeek: moment().add(1, 'weeks'),
    summaryWeek: moment(),
    record: {},
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
        <DropOption
          onMenuClick={e => this.handleSingleMenuClick(record, e)}
          menuOptions={[{ key: '1', name: '查看周报' }]}
        />
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

  handleModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  handleSingleMenuClick = (record, e) => {
    const { dispatch } = this.props;

    if (e.key === '1') {
      const planWeek = moment().add(1, 'weeks');
      const summaryWeek = moment();
      this.setState({
        record,
        modalVisible: true,
        planWeek,
        summaryWeek,
      });
      dispatch({
        type: 'weekly/fetchWeeklyPlan',
        payload: {
          id: record.id,
          planWeek: planWeek.format('YYYY-wo'),
        },
      });
      dispatch({
        type: 'weekly/fetchWeeklySummary',
        payload: {
          id: record.id,
          summaryWeek: summaryWeek.format('YYYY-wo'),
        },
      });
    }
  };

  handlePlanDateChange = week => {
    const { record } = this.state;
    const { dispatch } = this.props;

    this.setState({
      planWeek: week,
    });
    dispatch({
      type: 'weekly/fetchWeeklyPlan',
      payload: {
        id: record.id,
        planWeek: week.format('YYYY-wo'),
      },
    });
  };

  handleSummaryDateChange = week => {
    const { record } = this.state;
    const { dispatch } = this.props;

    this.setState({
      summaryWeek: week,
    });
    dispatch({
      type: 'weekly/fetchWeeklySummary',
      payload: {
        id: record.id,
        summaryWeek: week.format('YYYY-wo'),
      },
    });
  };

  render() {
    const {
      weekly: { weeklyPlan, weeklySummary },
      staff: { list },
      loading,
      staffLoading,
    } = this.props;
    const { record, planWeek, summaryWeek, modalVisible } = this.state;
    const modalProps = {
      item: record,
      planWeek,
      summaryWeek,
      modalVisible,
      weeklyPlan,
      weeklySummary,
      loading,
      handleModalVisible: this.handleModalVisible,
      handlePlanDateChange: this.handlePlanDateChange,
      handleSummaryDateChange: this.handleSummaryDateChange,
    };

    return (
      <Card>
        <Table
          size="small"
          rowKey={data => data.id}
          bordered
          scroll={{ x: '100%' }}
          columns={this.columns}
          dataSource={list}
          loading={staffLoading}
          pagination={false}
        />
        <WeeklyModal {...modalProps} />
      </Card>
    );
  }
}

export default WeeklyList;
