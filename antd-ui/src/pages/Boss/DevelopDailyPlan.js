import React, { Component } from 'react';
import { connect } from 'dva';
import { Badge, Card, Table } from 'antd';
import DailyModal from './DailyModal';
import moment from 'moment';

@connect(({ developDaily, loading }) => ({
  developDaily,
  loading: loading.models.developDaily
}))
class DevelopDailyPlan extends Component {
  state = {
    record: {},
    startDate: null,
    endDate: null,
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
    title: '自检记录',
    dataIndex: 'id',
    width: 100,
  }, {
    title: '工作环境',
    dataIndex: 'workEnvironment',
    children: [{
      title: '室内环境',
      dataIndex: 'workItem1',
      render: (text) => this.renderBadge(text)
    }, {
      title: '桌面环境',
      dataIndex: 'workItem2',
      render: (text) => this.renderBadge(text)
    }, {
      title: '文件摆放',
      dataIndex: 'workItem3',
      render: (text) => this.renderBadge(text)
    }]
  }, {
    title: '工作态度',
    dataIndex: 'workAttitude',
    children: [{
      title: '投入工作时间',
      dataIndex: 'workItem4',
      render: (text) => this.renderBadge(text)
    }]
  }, {
    title: '工作习惯',
    dataIndex: 'workHabit',
    children: [{
      title: '完成工作后的场所整理',
      dataIndex: 'workItem5',
      render: (text) => this.renderBadge(text)
    }, {
      title: '工作时场所整理',
      dataIndex: 'workItem6',
      render: (text) => this.renderBadge(text)
    }]
  }, {
    title: '工作量',
    dataIndex: 'workLoad',
    children: [{
      title: '日工作目标完成情况',
      dataIndex: 'workItem7',
      render: (text) => this.renderBadge(text)
    }]
  }];

  componentDidMount() {
    this.props.dispatch({
      type: 'developDaily/fetchList',
      payload: {
        department: 'develop'
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
      type: 'developDaily/fetchModalList',
      payload: {
        id,
        start,
        end,
      },
    })
  };

  render() {
    const {
      developDaily: { list, modalList },
      loading,
    } = this.props;
    const { modalVisible, record, startDate, endDate } = this.state;
    const modalProps = {
      modalWidth: '800px',
      item: record,
      startDate,
      endDate,
      columns: this.modalColumns,
      department: '研发部',
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

export default DevelopDailyPlan
