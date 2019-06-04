import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Badge } from 'antd';
import DailyModal from './DailyModal';
import styles from './TableList.less';
import moment from 'moment';

@connect(({ officeDaily, loading }) => ({
  officeDaily,
  loading: loading.models.officeDaily
}))
class OfficeDailyPlan extends Component {
  state = {
    record: {},
    startDate: null,
    endDate: null,
    modalVisible: false,
  };

  renderBadge = (text) => {
    switch (text) {
      case 1:
        return (<Badge color="green" text="√"/>);
      case 2:
        return (<Badge color="red" text="×"/>);
      case 3:
        return (<Badge color="grey" text="○"/>);
      case 4:
        return (<Badge color="blue" text="☐"/>);
      case 5:
        return (<Badge color="#efefef" text="▽"/>);
    }
  };

  modalColumns = [{
    title: '自检记录', dataIndex: 'id', width: 100,
  }, {
    title: '办公室环境卫生情况', dataIndex: 'workItem1', render: (text) => this.renderBadge(text),
  }, {
    title: '对各部门协助情况', dataIndex: 'workItem2', render: (text) => this.renderBadge(text),
  }, {
    title: '文件是否及时整理归档', dataIndex: 'workItem3', render: (text) => this.renderBadge(text),
  }, {
    title: '日计划、日总结', dataIndex: 'workItem4', render: (text) => this.renderBadge(text),
  }, {
    title: '周计划、周总结', dataIndex: 'workItem5', render: (text) => this.renderBadge(text),
  }, {
    title: '月计划、月总结', dataIndex: 'workItem6', render: (text) => this.renderBadge(text),
  }];

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
      <a href="javascript:" onClick={() => this.enableModal(record)}>查看日报</a>
    )
  }];

  componentDidMount() {
    this.props.dispatch({
      type: 'officeDaily/fetchList',
      payload: {
        department: 'office'
      }
    });
  }

  enableModal = (record) => {
    this.setState({record, modalVisible: true});
    this.handleDateChange(record.id, moment().startOf('month').format('YYYYMMDD'), moment().format('YYYYMMDD'))
  };

  handleModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible })
  };

  handleDateChange = (id, start, end) => {
    const { dispatch } = this.props;
    this.setState({
      startDate: start,
      endDate: end,
    });
    dispatch({
      type: 'officeDaily/fetchModalList',
      payload: {
        id,
        start,
        end,
      },
    })
  };

  render() {
    const {
      officeDaily: { list, modalList },
      loading,
    } = this.props;
    const { modalVisible, record, startDate, endDate } = this.state;
    const modalProps = {
      modalWidth: '800px',
      item: record,
      startDate,
      endDate,
      department: '综合办公室',
      columns: this.modalColumns,
      modalVisible,
      loading,
      list: modalList,
      handleModalVisible: this.handleModalVisible,
      handleDateChange: this.handleDateChange,
    };

    return (
      <Card bordered={false}>
        <Table
          size="small"
          rowKey={record => record.id}
          bordered
          scroll={{ x: '100%' }}
          columns={this.columns}
          dataSource={list}
          pagination={false}
          loading={loading}
        />
        <DailyModal {...modalProps} />
      </Card>
    )
  }
}

export default OfficeDailyPlan
