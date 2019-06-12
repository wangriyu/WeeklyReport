import React from 'react';
import moment from 'moment';
import { DatePicker, Table, Row, Col, List, Button } from 'antd';
import html2canvas from 'html2canvas';
import { departments } from '../../utils/variable';
import styles from './index.less';

const { WeekPicker } = DatePicker;

const WeeklyPanel = props => {
  const {
    item,
    weeklyPlan,
    weeklySummary,
    loading,
    planWeek,
    summaryWeek,
    handlePlanDateChange,
    handleSummaryDateChange,
  } = props;

  const planColumns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '工作计划描述',
      dataIndex: 'description',
    },
    {
      title: '完成目标',
      dataIndex: 'goal',
    },
  ];

  const summaryColumns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '工作内容描述',
      dataIndex: 'description',
    },
    {
      title: '结果',
      dataIndex: 'result',
    },
  ];

  const summaryData = [
    {
      title: '已完成任务内容',
      description: weeklySummary.complete || '无',
    },
    {
      title: '目标完成综述',
      description: weeklySummary.summary || '无',
    },
    {
      title: '目标完成阶段',
      description: weeklySummary.stage || '无',
    },
  ];

  const planData = [
    {
      title: '计划任务内容',
      description: weeklyPlan.description || '无',
    },
    {
      title: '周工作目标',
      description: weeklyPlan.goal || '无',
    },
    {
      title: '备注',
      description: weeklyPlan.remark || '无',
    },
  ];

  const exportTable = () => {
    html2canvas(document.getElementById('weekly-report')).then(function(canvas) {
      const aElement = document.createElement('a');
      aElement.setAttribute('href', canvas.toDataURL('image/png', 1.0));
      aElement.setAttribute(
        'download',
        `${departments[item.department]}${item.name}${summaryWeek.format('YYYY-wo')}报.png`
      );
      document.body.insertAdjacentElement('beforeend', aElement);
      aElement.click();
    });
  };

  return (
    <div>
      <Row
        style={{ padding: '5px', marginBottom: '10px' }}
        type="flex"
        justify="space-between"
        align="bottom"
      >
        <Col span={18}>
          <Row>
            <Col span={6}>选择周总结</Col>
            <Col span={6}>选择周计划</Col>
          </Row>
          <Row>
            <Col span={6}>
              <WeekPicker
                onChange={handleSummaryDateChange}
                allowClear={false}
                disabledDate={current => current > moment().endOf('week')}
                value={summaryWeek}
              />
            </Col>
            <Col span={6}>
              <WeekPicker
                onChange={handlePlanDateChange}
                allowClear={false}
                disabledDate={current =>
                  current >
                  moment()
                    .add(1, 'weeks')
                    .endOf('week')
                }
                value={planWeek}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Button type="primary" onClick={exportTable}>
            导出
          </Button>
        </Col>
      </Row>
      <div style={{ padding: '5px' }} id="weekly-report">
        <List
          header={
            <div style={{ textAlign: 'center' }}>
              {departments[item.department]}
              {item.name}
              {summaryWeek.format('YYYY-wo')}总结
            </div>
          }
          style={{ borderRadius: 0, borderColor: '#e8e8e8' }}
          bordered
          itemLayout="horizontal"
          dataSource={summaryData}
          renderItem={data => (
            <List.Item>
              <List.Item.Meta title={data.title} description={data.description} />
            </List.Item>
          )}
        />
        <Table
          size="small"
          rowKey={record => record.id}
          className={styles.noRadiusTable}
          bordered
          scroll={{ x: '100%' }}
          columns={summaryColumns}
          dataSource={weeklySummary.items || []}
          loading={loading}
          pagination={false}
        />
        <hr />
        <List
          header={
            <div style={{ textAlign: 'center' }}>
              {departments[item.department]}
              {item.name}
              {planWeek.format('YYYY-wo')}计划
            </div>
          }
          style={{ borderRadius: 0, borderColor: '#e8e8e8' }}
          bordered
          itemLayout="horizontal"
          dataSource={planData}
          renderItem={data => (
            <List.Item>
              <List.Item.Meta title={data.title} description={data.description} />
            </List.Item>
          )}
        />
        <Table
          size="small"
          rowKey={record => record.id}
          className={styles.noRadiusTable}
          bordered
          scroll={{ x: '100%' }}
          columns={planColumns}
          dataSource={weeklyPlan.items || []}
          loading={loading}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default WeeklyPanel;
