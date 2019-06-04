import React           from 'react';
import moment          from 'moment';
import {
  Modal, DatePicker, Table, Row, Col, List, Button,
}                      from 'antd';
import styles          from './WeeklyModal.less';
import html2canvas     from 'html2canvas';
import { departments } from '../../utils/variable';

const { WeekPicker } = DatePicker;

const WeeklyModal = (props) => {
  const { item, weeklyPlan, weeklySummary, modalWidth, loading, modalVisible, planWeek, summaryWeek, handleUpdate, handleModalVisible, handlePlanDateChange, handleSummaryDateChange } = props;
  const modalOpts = {
    width: modalWidth || '980px',
    title: <div><span>{item.name}</span> - <span>{departments[item.department]}</span></div>,
    footer: null,
    maskClosable: false,
    visible: modalVisible,
    onOk: handleUpdate,
    onCancel: handleModalVisible,
    wrapClassName: 'vertical-center-modal',
  };

  const planColumns = [
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

  const summaryColumns = [
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

  const summaryData = [{
    title: '已完成任务内容',
    description: weeklySummary.complete || '无',
  }, {
    title: '目标完成综述',
    description: weeklySummary.summary || '无',
  }, {
    title: '目标完成阶段',
    description: weeklySummary.stage || '无',
  }];

  const planData = [{
    title: '计划任务内容',
    description: weeklyPlan.description || '无',
  }, {
    title: '周工作目标',
    description: weeklyPlan.goal || '无',
  }, {
    title: '备注',
    description: weeklyPlan.remark || '无'
  }];

  const exportTable = () => {
    html2canvas(document.getElementById('weekly-report')).then(function(canvas) {
      let aElement=document.createElement('a');
      aElement.setAttribute('href', canvas.toDataURL('image/png', 1.0));
      aElement.setAttribute('download', `${departments[item.department]}${item.name}${summaryWeek.format('YYYY-wo')}报.png`);
      document.body.insertAdjacentElement('beforeend', aElement)
      aElement.click();
    });
  };

  return (
    <Modal {...modalOpts}>
      <Row style={{padding: '5px', marginBottom: '10px'}} type="flex" justify="space-between" align="bottom">
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
                disabledDate={(current) => current > moment().endOf('week')}
                value={summaryWeek}
              />
            </Col>
            <Col span={6}>
              <WeekPicker
                onChange={handlePlanDateChange}
                allowClear={false}
                disabledDate={(current) => current > moment().add(1, 'weeks').endOf('week')}
                value={planWeek}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Button type='primary' onClick={exportTable}>导出</Button>
        </Col>
      </Row>
      <div style={{padding: '5px'}} id='weekly-report'>
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
          columns={summaryColumns}
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
          columns={planColumns}
          dataSource={weeklyPlan.items || []}
          loading={loading}
          pagination={false}
        />
      </div>
    </Modal>
  )
};

export default WeeklyModal;
