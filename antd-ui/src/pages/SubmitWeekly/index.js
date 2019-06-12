import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal } from 'antd';
import WeeklySummary from './WeeklySummary';
import WeeklyPlan from './WeeklyPlan';

const FormItem = Form.Item;
const { TextArea } = Input;

const FormModal = Form.create()(props => {
  const { form, modalType, modalVisible, handleAddItem, handleModalVisible } = props;

  const handleSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAddItem(fieldsValue);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    handleModalVisible();
  };

  const modalOpts = {
    width: '800px',
    title: modalType === 'plan' ? '周计划' : '周总结',
    maskClosable: false,
    visible: modalVisible,
    okText: '提交',
    onOk: handleSubmit,
    onCancel: handleCancel,
    wrapClassName: 'vertical-center-modal',
  };

  return (
    <Modal {...modalOpts}>
      <Form>
        <FormItem label="工作内容描述">
          {form.getFieldDecorator('description', {})(
            <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
          )}
        </FormItem>
        {modalType === 'plan' ? (
          <FormItem label="目标">
            {form.getFieldDecorator('goal', {})(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        ) : (
          <FormItem label="结果">
            {form.getFieldDecorator('result', {})(
              <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>
        )}
      </Form>
    </Modal>
  );
});

@connect(({ weekly, loading }) => ({
  weekly,
  loading: loading.models.weekly,
}))
class SubmitWeekly extends Component {
  state = {
    planList: [],
    summaryList: [],
    planWeek: moment()
      .add(1, 'weeks')
      .format('YYYY-wo'),
    summaryWeek: moment().format('YYYY-wo'),
    modalVisible: false,
    modalType: '',
  };

  enableSummaryModal = () => {
    this.setState({
      modalVisible: true,
      modalType: 'summary',
    });
  };

  enablePlanModal = () => {
    this.setState({
      modalVisible: true,
      modalType: 'plan',
    });
  };

  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  handleAddItem = payload => {
    const { modalType, summaryList, planList } = this.state;
    if (modalType === 'summary') {
      const last = summaryList.length - 1 < 0 ? 0 : summaryList.length - 1;
      summaryList.push({
        id: summaryList[last] ? summaryList[last].id + 1 : 1,
        description: payload.description,
        result: payload.result,
      });
    } else {
      const last = planList.length - 1 < 0 ? 0 : planList.length - 1;
      planList.push({
        id: planList[last] ? planList[last].id + 1 : 1,
        description: payload.description,
        goal: payload.goal,
      });
    }
    this.handleModalVisible();
  };

  deleteItem = record => {
    const { modalType, summaryList, planList } = this.state;
    if (modalType === 'summary') {
      summaryList.splice(summaryList.findIndex(item => item.id === record.id), 1);
      this.setState({ summaryList });
    } else {
      planList.splice(planList.findIndex(item => item.id === record.id), 1);
      this.setState({ planList });
    }
  };

  addWeeklySummary = data => {
    const { dispatch } = this.props;
    const { summaryWeek, summaryList } = this.state;

    dispatch({
      type: 'weekly/addWeeklySummary',
      payload: {
        ...data,
        week: summaryWeek,
        items: summaryList,
      },
    });
    this.setState({
      summaryList: [],
    });
  };

  addWeeklyPlan = data => {
    const { dispatch } = this.props;
    const { planWeek, planList } = this.state;

    dispatch({
      type: 'weekly/addWeeklyPlan',
      payload: {
        ...data,
        week: planWeek,
        items: planList,
      },
    });
    this.setState({
      planList: [],
    });
  };

  render() {
    const { loading } = this.props;
    const { planList, summaryList, planWeek, summaryWeek, modalVisible, modalType } = this.state;
    const planProps = {
      list: planList,
      week: planWeek,
      loading,
      deleteItem: this.deleteItem,
      addWeekPlan: this.addWeeklyPlan,
      enablePlanModal: this.enablePlanModal,
    };
    const summaryProps = {
      list: summaryList,
      week: summaryWeek,
      loading,
      deleteItem: this.deleteItem,
      addWeekSummary: this.addWeeklySummary,
      enableSummaryModal: this.enableSummaryModal,
    };
    const modalProps = {
      modalVisible,
      modalType,
      handleAddItem: this.handleAddItem,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <div>
        <WeeklySummary {...summaryProps} />
        <div style={{ height: '16px' }} />
        <WeeklyPlan {...planProps} />
        <FormModal {...modalProps} />
      </div>
    );
  }
}

export default SubmitWeekly;
