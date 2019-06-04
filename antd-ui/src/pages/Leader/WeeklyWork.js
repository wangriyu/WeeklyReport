import React, { Component } from 'react';
import { connect }          from 'dva';
import {
  Input, Form, Modal,
} from 'antd';
import moment               from 'moment';
import WeeklySummary        from './WeeklySummary';
import WeeklyPlan           from './WeeklyPlan';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const FormModal = Form.create()(props => {
  const { form, modalType, modalVisible, handleAddItem, handleModalVisible } = props;

  const handleSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAddItem(fieldsValue)
    });
  };

  const handleCancel = () => {
    form.resetFields();
    handleModalVisible()
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
        <FormItem label={'工作内容描述'}>
          {
            form.getFieldDecorator('description', {})(
              <TextArea autosize={{minRows: 2, maxRows: 6}} />
            )
          }
        </FormItem>
        {
          modalType === 'plan' ? (
            <FormItem label={'目标'}>
              {
                form.getFieldDecorator('goal', {})(
                  <TextArea autosize={{minRows: 2, maxRows: 6}} />
                )
              }
            </FormItem>
          ) : (
            <FormItem label={'结果'}>
              {
                form.getFieldDecorator('result', {})(
                  <TextArea autosize={{minRows: 2, maxRows: 6}} />
                )
              }
            </FormItem>
          )
        }
      </Form>
    </Modal>
  )
});

@connect(({ leaderWeekly, loading }) => ({
  leaderWeekly,
  loading: loading.models.leaderWeekly
}))
class WeeklyWork extends Component {
  state = {
    planList: [],
    summaryList: [],
    planWeek: moment().add(1, 'weeks').format('YYYY-wo'),
    summaryWeek: moment().format('YYYY-wo'),
    modalVisible: false,
    modalType: ''
  };

  enableSummaryModal = () => {
    this.setState({
      modalVisible: true,
      modalType: 'summary'
    })
  };

  enablePlanModal = () => {
    this.setState({
      modalVisible: true,
      modalType: 'plan'
    })
  };

  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  };

  handleAddItem = (payload) => {
    const { modalType, summaryList, planList } = this.state;
    if (modalType === 'summary') {
      let last = summaryList.length - 1 < 0 ? 0 : summaryList.length - 1;
      summaryList.push({
        id: summaryList[last] ? summaryList[last].id + 1 : 1,
        description: payload.description,
        result: payload.result
      })
    } else {
      let last = planList.length - 1 < 0 ? 0 : planList.length - 1;
      planList.push({
        id: planList[last] ? planList[last].id + 1 : 1,
        description: payload.description,
        goal: payload.goal
      })
    }
    this.handleModalVisible()
  };

  deleteItem = (record) => {
    const { modalType, summaryList, planList } = this.state;
    if (modalType === 'summary') {
      summaryList.splice(summaryList.findIndex(item => item.id === record.id), 1)
      this.setState({ summaryList })
    } else {
      planList.splice(planList.findIndex(item => item.id === record.id), 1)
      this.setState({ planList })
    }
  };

  addWeeklySummary = (data) => {
    this.props.dispatch({
      type: 'leaderWeekly/addWeeklySummary',
      payload: {
        ...data,
        week: this.state.summaryWeek,
        items: this.state.summaryList
      }
    });
    this.setState({
      summaryList: []
    })
  };

  addWeeklyPlan = (data) => {
    this.props.dispatch({
      type: 'leaderWeekly/addWeeklyPlan',
      payload: {
        ...data,
        week: this.state.planWeek,
        items: this.state.planList
      }
    });
    this.setState({
      planList: []
    })
  };

  render() {
    const { leaderWeekly, loading } = this.props;
    const {
      planList,
      summaryList,
      planWeek,
      summaryWeek,
      modalVisible,
      modalType,
    } = this.state;
    const planProps = {
      list: planList,
      week: planWeek,
      loading: loading,
      deleteItem: this.deleteItem,
      addWeekPlan: this.addWeeklyPlan,
      enablePlanModal: this.enablePlanModal,
    };
    const summaryProps = {
      list: summaryList,
      week: summaryWeek,
      loading: loading,
      deleteItem: this.deleteItem,
      addWeekSummary: this.addWeeklySummary,
      enableSummaryModal: this.enableSummaryModal,
    };
    const modalProps = {
      modalVisible: modalVisible,
      modalType: modalType,
      handleAddItem: this.handleAddItem,
      handleModalVisible: this.handleModalVisible
    };

    return (
      <div>
        <WeeklySummary {...summaryProps} />
        <div style={{height: '16px'}} />
        <WeeklyPlan {...planProps} />
        <FormModal {...modalProps} />
      </div>
    )
  }
}

export default WeeklyWork
