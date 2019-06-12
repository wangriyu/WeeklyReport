import React from 'react';
import { Button, Card, Form, Input, Table } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

const WeeklySummary = props => {
  const { week, list, form, loading, enableSummaryModal, deleteItem, addWeekSummary } = props;

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
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <a href="javascript:" onClick={() => deleteItem(record)}>
          删除
        </a>
      ),
    },
  ];

  const handleSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      addWeekSummary(fieldsValue);
    });
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{week}总结</span>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </div>
      }
    >
      <Form>
        <FormItem label="已完成任务内容">
          {form.getFieldDecorator('complete', {})(
            <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
          )}
        </FormItem>
        <FormItem label="本周目标完成综述">
          {form.getFieldDecorator('summary', {})(
            <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
          )}
        </FormItem>
        <FormItem label="任务目标完成阶段">
          {form.getFieldDecorator('stage', {})(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
      </Form>
      <hr style={{ borderColor: '#fff' }} />
      <Button type="primary" style={{ marginBottom: '10px' }} onClick={enableSummaryModal}>
        添加工作总结
      </Button>
      <Table
        rowKey={record => record.id}
        bordered
        scroll={{ x: '100%' }}
        columns={summaryColumns}
        dataSource={list}
        loading={loading}
        pagination={false}
      />
    </Card>
  );
};

export default Form.create()(WeeklySummary);
