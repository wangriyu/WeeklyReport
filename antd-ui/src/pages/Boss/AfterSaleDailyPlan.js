import React, { Component } from 'react';
import { connect } from 'dva';
import { Badge, Card, Table } from 'antd';
import DailyModal from './DailyModal';
import moment from 'moment';

@connect(({ afterSaleDaily, loading }) => ({
  afterSaleDaily,
  loading: loading.models.afterSaleDaily
}))
class AfterSaleDailyPlan extends Component {
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
    title: '自检记录', dataIndex: 'id', width: 100,
  }, {
    title: '物品摆放整齐', dataIndex: 'workItem1', render: (text) => this.renderBadge(text)
  }, {
    title: '环境卫生整洁', dataIndex: 'workItem2', render: (text) => this.renderBadge(text)
  }, {
    title: '例行晨会', dataIndex: 'workItem3', render: (text) => this.renderBadge(text)
  }, {
    title: '售后工作是否按时汇报工作情况', dataIndex: 'workItem4', render: (text) => this.renderBadge(text)
  }, {
    title: '施工工艺符合规范', dataIndex: 'workItem5', render: (text) => this.renderBadge(text)
  }, {
    title: '工作设备、工具处于正常状态', dataIndex: 'workItem6', render: (text) => this.renderBadge(text)
  }, {
    title: '文件、记录完整', dataIndex: 'workItem7', render: (text) => this.renderBadge(text)
  }, {
    title: '记录工作记录', dataIndex: 'workItem8', render: (text) => this.renderBadge(text)
  }];

  componentDidMount() {
    this.props.dispatch({
      type: 'afterSaleDaily/fetchList',
      payload: {
        department: 'afterSale'
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
      type: 'afterSaleDaily/fetchModalList',
      payload: {
        id,
        start,
        end,
      },
    })
  };

  render() {
    const {
      afterSaleDaily: { list, modalList },
      loading,
    } = this.props;
    const { modalVisible, record, startDate, endDate } = this.state;
    const modalProps = {
      modalWidth: '800px',
      item: record,
      startDate,
      endDate,
      department: '售后部',
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

export default AfterSaleDailyPlan
