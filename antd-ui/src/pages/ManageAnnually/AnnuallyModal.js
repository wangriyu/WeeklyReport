import React from 'react';
import { Input, Modal, Form, InputNumber, Select, DatePicker } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const AnnuallyModal = props => {
  const {
    modalVisible,
    evtType,
    record,
    form,
    handleUpdateItem,
    handleCreateItem,
    handleCreatePlan,
    handleModalVisible,
  } = props;
  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const data = fieldsValue;
      switch (evtType) {
        case 'createPlan':
          data.title = `${fieldsValue.title}`;
          handleCreatePlan(data);
          break;
        case 'createItem':
          handleCreateItem(data);
          break;
        case 'updateItem':
          data.id = record.id;
          handleUpdateItem(record.pid, data);
          break;
        default:
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    handleModalVisible();
  };

  const modalOpts = {
    width: '800px',
    title: evtType === 'createPlan' ? '添加年排单计划' : '工作项内容',
    maskClosable: false,
    okText: '提交',
    visible: modalVisible,
    onOk: handleOk,
    onCancel: handleCancel,
    wrapClassName: 'vertical-center-modal',
  };

  return (
    <Modal {...modalOpts}>
      {evtType === 'createPlan' ? (
        <Form {...formItemLayout}>
          <FormItem label="年份">
            {form.getFieldDecorator('title', {
              initialValue: +moment().format('YYYY'),
              rules: [
                {
                  required: true,
                  message: '请选择年份',
                },
              ],
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="总体目标">
            {form.getFieldDecorator('goal', {})(
              <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="总体目标" />
            )}
          </FormItem>
          <FormItem label="年度计划">
            {form.getFieldDecorator('plan', {})(
              <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="年度工作计划" />
            )}
          </FormItem>
        </Form>
      ) : (
        <Form {...formItemLayout}>
          <FormItem label="项目名称">
            {form.getFieldDecorator('title', {
              initialValue: record.title || '',
              rules: [
                {
                  required: true,
                  message: '请填写项目名称',
                },
              ],
            })(<Input placeholder="输入项目名称" />)}
          </FormItem>
          <FormItem label="紧急程度">
            {form.getFieldDecorator('priority', {
              initialValue: record.priority || 0,
            })(
              <Select placeholder="选择优先级">
                <Option value={1} key={1}>
                  普通
                </Option>
                <Option value={2} key={2}>
                  低
                </Option>
                <Option value={3} key={3}>
                  中
                </Option>
                <Option value={4} key={4}>
                  高
                </Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="计划完成时间">
            {form.getFieldDecorator('deadline', {
              initialValue: !record.deadline
                ? null
                : moment(record.deadline, 'YYYY-MM-DD HH:mm:ss'),
            })(<DatePicker showTime placeholder="截止时间" />)}
          </FormItem>
          <FormItem label="负责人">
            {form.getFieldDecorator('leader', {
              initialValue: record.leader || '',
            })(<Input placeholder="输入项目负责人" />)}
          </FormItem>
          <FormItem label="项目进度">
            {form.getFieldDecorator('progress', {
              initialValue: record.progress || '',
            })(<Input placeholder="输入项目进度" />)}
          </FormItem>
          <FormItem label="验收结果">
            {form.getFieldDecorator('result', {
              initialValue: record.result || '',
            })(<TextArea autosize={{ minRows: 1, maxRows: 5 }} placeholder="输入验收结果" />)}
          </FormItem>
        </Form>
      )}
    </Modal>
  );
};

export default Form.create()(AnnuallyModal);
