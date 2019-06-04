import React from 'react';
import {
  Button, Card, Form, Input, Table,
} from 'antd';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

const WeeklyPlan = Form.create()(props => {
  const { week, list, form, loading, enablePlanModal, addWeekPlan, deleteItem } = props;

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
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => <a href="javascript:" onClick={() => deleteItem(record)}>删除</a>
    }
  ];

  const handleSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      addWeekPlan(fieldsValue)
    });
  };

  return (
    <Card
      title={
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span>{week}计划</span>
          <Button type='primary' onClick={handleSubmit}>提交</Button>
        </div>
      }>
      <Form>
        <FormItem label={'任务内容'}>
          {
            form.getFieldDecorator('description', {})(
              <TextArea autosize={{minRows: 2, maxRows: 6}} />
            )
          }
        </FormItem>
        <FormItem label={'本周工作目标'}>
          {
            form.getFieldDecorator('goal', {})(
              <TextArea autosize={{minRows: 2, maxRows: 6}} />
            )
          }
        </FormItem>
        <FormItem label={'备注'}>
          {
            form.getFieldDecorator('remark', {})(
              <TextArea autosize={{minRows: 2, maxRows: 6}} />
            )
          }
        </FormItem>
      </Form>
      <hr style={{borderColor: '#fff'}}/>
      <Button type='primary' style={{marginBottom: '10px'}} onClick={enablePlanModal}>
        添加工作计划
      </Button>
      <Table
        rowKey={record => record.id}
        bordered
        scroll={{ x: '100%' }}
        columns={planColumns}
        dataSource={list}
        loading={loading}
        pagination={false}
      />
    </Card>
  )
});

export default Form.create()(WeeklyPlan);
