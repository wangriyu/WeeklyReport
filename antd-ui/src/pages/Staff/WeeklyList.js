import React, { Component } from 'react';
import { connect }          from 'dva';
import {
  Button, Card, Col, Row, Table, List, DatePicker,
} from 'antd';
import moment               from 'moment';
import { departments }      from '../../utils/variable';
import styles               from './WeeklyList.less';

const { WeekPicker } = DatePicker;

@connect(({ staffWeekly, user, loading }) => ({
  staffWeekly,
  user,
  loading: loading.models.staffWeekly
}))
class WeeklyList extends Component {
  state = {
    summaryWeek: moment(),
    planWeek: moment().add(1, 'weeks'),
  };

  planColumns = [
    {
      title: '序号',
      dataIndex: 'id',
    }, {
      title: '工作计划描述',
      dataIndex: 'description',
    }, {
      title: '完成目标',
      dataIndex: 'goal',
    }
  ];

  summaryColumns = [
    {
      title: '序号',
      dataIndex: 'id',
    }, {
      title: '工作内容描述',
      dataIndex: 'description',
    }, {
      title: '结果',
      dataIndex: 'result',
    }
  ];

  componentDidMount() {
    this.handleSummaryDateChange(moment());
    this.handlePlanDateChange(moment().add(1, 'weeks'))
  }

  handlePlanDateChange = (week) => {
    const { user: { currentUser } } = this.props;
    this.setState({
      planWeek: week
    });
    this.props.dispatch({
      type: 'staffWeekly/fetchWeeklyPlan',
      payload: {
        id: currentUser.id,
        planWeek: week.format('YYYY-wo'),
      }
    })
  };

  handleSummaryDateChange = (week) => {
    const { user: { currentUser } } = this.props;
    this.setState({
      summaryWeek: week
    });
    this.props.dispatch({
      type: 'staffWeekly/fetchWeeklySummary',
      payload: {
        id: currentUser.id,
        summaryWeek: week.format('YYYY-wo'),
      }
    })
  };

  render() {
    const {
      loading,
      user: { currentUser },
      staffWeekly: { weeklyPlan, weeklySummary }
    } = this.props;
    const { planWeek, summaryWeek } = this.state;
    const item = currentUser;
    const summaryData = [{
      title: '已完成任务内容',
      description: weeklySummary && weeklySummary.complete ? weeklySummary.complete : '无',
    }, {
      title: '目标完成综述',
      description: weeklySummary && weeklySummary.summary ? weeklySummary.summary : '无',
    }, {
      title: '目标完成阶段',
      description: weeklySummary && weeklySummary.stage ? weeklySummary.stage : '无',
    }];

    const planData = [{
      title: '计划任务内容',
      description: weeklyPlan && weeklyPlan.description ? weeklyPlan.description : '无',
    }, {
      title: '周工作目标',
      description: weeklyPlan && weeklyPlan.goal ? weeklyPlan.goal : '无',
    }, {
      title: '备注',
      description: weeklyPlan && weeklyPlan.remark ? weeklyPlan.remark : '无'
    }];

    return (
      <Card>
        <Row style={{padding: '5px', marginBottom: '10px'}} type="flex" justify="space-between" align="bottom">
          <Col span={18}>
            <Row>
              <Col span={6}>选择周总结</Col>
              <Col span={6}>选择周计划</Col>
            </Row>
            <Row>
              <Col span={6}>
                <WeekPicker
                  onChange={this.handleSummaryDateChange}
                  allowClear={false}
                  disabledDate={(current) => current > moment().endOf('week')}
                  value={summaryWeek}
                />
              </Col>
              <Col span={6}>
                <WeekPicker
                  onChange={this.handlePlanDateChange}
                  allowClear={false}
                  disabledDate={(current) => current > moment().add(1, 'weeks').endOf('week')}
                  value={planWeek}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <div style={{padding: '5px'}}>
          <List
            header={<div style={{textAlign: 'center'}}>{departments[item.department] + item.name + summaryWeek.format('YYYY-wo') + '总结'}</div>}
            style={{borderRadius: 0, borderColor: '#e8e8e8'}}
            bordered
            itemLayout="horizontal"
            dataSource={summaryData}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
          <Table
            size={'small'}
            rowKey={record => record.id}
            className={styles.noRadiusTable}
            bordered
            scroll={{ x: '100%' }}
            columns={this.summaryColumns}
            dataSource={weeklySummary.items || []}
            loading={loading}
            pagination={false}
          />
          <hr />
          <List
            header={<div style={{textAlign: 'center'}}>{departments[item.department] + item.name + planWeek.format('YYYY-wo') + '计划'}</div>}
            style={{borderRadius: 0, borderColor: '#e8e8e8'}}
            bordered
            itemLayout="horizontal"
            dataSource={planData}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
          <Table
            size={'small'}
            rowKey={record => record.id}
            className={styles.noRadiusTable}
            bordered
            scroll={{ x: '100%' }}
            columns={this.planColumns}
            dataSource={weeklyPlan.items || []}
            loading={loading}
            pagination={false}
          />
        </div>
      </Card>
    )
  }
}

export default WeeklyList
