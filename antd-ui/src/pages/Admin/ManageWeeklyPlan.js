import React, { Component } from 'react';
import { connect }          from 'dva';
import { Card, Table }      from 'antd';
import DropOption           from '@/components/DropOption';
import moment               from 'moment';
import WeeklyModal          from './WeeklyModal';
import { departments }      from '../../utils/variable';

const departmentKeys = Object.keys(departments);

@connect(({ manageWeekly, loading }) => ({
  manageWeekly,
  loading: loading.models.manageWeekly
}))
class ManageWeeklyPlan extends Component {
  state = {
    planWeek: moment().add(1, 'weeks'),
    summaryWeek: moment(),
    record: {},
    modalVisible: false,
  };

  columns = [{
    title: 'ID',
    dataIndex: 'id',
    width: 30,
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
    title: '电话',
    dataIndex: 'mobile',
  }, {
    title: '邮箱',
    dataIndex: 'mail',
  }, {
    title: '部门',
    dataIndex: 'department',
    filters: [
      {
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
    title: '角色',
    dataIndex: 'role',
    filterMultiple: false,
    filters: [{
      text: '员工',
      value: 'staff',
    }, {
      text: '主管',
      value: 'leader',
    }],
    onFilter: (value, record) => record.role.indexOf(value) === 0
  }, {
    title: '操作',
    dataIndex: 'operation',
    render: (text, record) => (
      <DropOption
        onMenuClick={e => this.handleSingleMenuClick(record, e)}
        menuOptions={[
          { key: '1', name: '查看周报' },
        ]}
      />
    ),
  }];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manageWeekly/fetch',
      payload: {
        role: 'staff,leader'
      }
    });
  }

  handleModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible })
  };

  handleSingleMenuClick = (record, e) => {
    if (e.key === '1') {
      let planWeek = moment().add(1, 'weeks'), summaryWeek = moment()
      this.setState({
        record,
        modalVisible: true,
        planWeek,
        summaryWeek,
      });
      this.props.dispatch({
        type: 'manageWeekly/fetchWeeklyPlan',
        payload: {
          id: record.id,
          planWeek: planWeek.format('YYYY-wo'),
        }
      });
      this.props.dispatch({
        type: 'manageWeekly/fetchWeeklySummary',
        payload: {
          id: record.id,
          summaryWeek: summaryWeek.format('YYYY-wo')
        }
      })
    }
  };

  handlePlanDateChange = (week) => {
    const { record } = this.state;
    this.setState({
      planWeek: week
    });
    this.props.dispatch({
      type: 'manageWeekly/fetchWeeklyPlan',
      payload: {
        id: record.id,
        planWeek: week.format('YYYY-wo'),
      }
    })
  };

  handleSummaryDateChange = (week) => {
    const { record } = this.state;
    this.setState({
      summaryWeek: week
    });
    this.props.dispatch({
      type: 'manageWeekly/fetchWeeklySummary',
      payload: {
        id: record.id,
        summaryWeek: week.format('YYYY-wo'),
      }
    })
  };

  render() {
    const {
      manageWeekly: { list, weeklyPlan, weeklySummary },
      loading,
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
          rowKey={record => record.id}
          bordered
          scroll={{ x: '100%' }}
          columns={this.columns}
          dataSource={list}
          loading={loading}
          pagination={false}
        />
        <WeeklyModal {...modalProps} />
      </Card>
    )
  }
}

export default ManageWeeklyPlan
