import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Badge } from 'antd';
import DailyModal from './DailyModal';
import moment from 'moment';
import { departments }    from '../../utils/variable';

@connect(({ leaderMonthly, user, loading }) => ({
  user,
  leaderMonthly,
  loading: loading.models.leaderMonthly
}))
class MonthlyWork extends Component {
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

  getModalColumns = (department) => {
    switch(department) {
      case 'marketing':
        return [
          {
            title: '日期',
            dataIndex: 'id',
          }, {
            title: '卫生',
            dataIndex: 'hygiene',
            render: (text) => this.renderBadge(text),
          }, {
            title: '晨会',
            dataIndex: 'meeting',
            render: (text) => this.renderBadge(text),
          }, {
            title: '工作',
            dataIndex: 'work',
            render: (text) => this.renderBadge(text),
          }
        ];
      case 'techSupport':
        return [
          {
            title: '日期',
            dataIndex: 'id',
          }, {
            title: '办公室物品摆放整齐',
            dataIndex: 'workItem1',
            render: (text) => this.renderBadge(text),
          }, {
            title: '办公环境卫生整洁',
            dataIndex: 'workItem2',
            render: (text) => this.renderBadge(text),
          }, {
            title: '例行晨会',
            dataIndex: 'workItem3',
            render: (text) => this.renderBadge(text),
          }, {
            title: '技术方案资料及时备案',
            dataIndex: 'workItem4',
            render: (text) => this.renderBadge(text),
          }, {
            title: '按照既定流程制定方案',
            dataIndex: 'workItem5',
            render: (text) => this.renderBadge(text),
          }, {
            title: '今日事今日毕',
            dataIndex: 'workItem6',
            render: (text) => this.renderBadge(text),
          }, {
            title: '下班前断电、熄灯',
            dataIndex: 'workItem7',
            render: (text) => this.renderBadge(text),
          }
        ];
      case 'afterSale':
        return [
          {
            title: '日期',
            dataIndex: 'id',
          }, {
            title: '物品摆放整齐',
            dataIndex: 'workItem1',
            render: (text) => this.renderBadge(text),
          }, {
            title: '环境卫生整洁',
            dataIndex: 'workItem2',
            render: (text) => this.renderBadge(text),
          }, {
            title: '例行晨会',
            dataIndex: 'workItem3',
            render: (text) => this.renderBadge(text),
          }, {
            title: '售后工作是否按时汇报工作情况',
            dataIndex: 'workItem4',
            render: (text) => this.renderBadge(text),
          }, {
            title: '施工工艺符合规范',
            dataIndex: 'workItem5',
            render: (text) => this.renderBadge(text),
          }, {
            title: '工作设备、工具处于正常状态',
            dataIndex: 'workItem6',
            render: (text) => this.renderBadge(text),
          }, {
            title: '文件、记录完整',
            dataIndex: 'workItem7',
            render: (text) => this.renderBadge(text),
          }, {
            title: '记录工作记录',
            dataIndex: 'workItem8',
            render: (text) => this.renderBadge(text),
          }
        ];
      case 'develop':
        return [
          {
            title: '日期',
            dataIndex: 'id',
          }, {
            title: '室内环境',
            dataIndex: 'workItem1',
            render: (text) => this.renderBadge(text),
          }, {
            title: '桌面环境',
            dataIndex: 'workItem2',
            render: (text) => this.renderBadge(text),
          }, {
            title: '文件摆放',
            dataIndex: 'workItem3',
            render: (text) => this.renderBadge(text),
          }, {
            title: '投入工作时间',
            dataIndex: 'workItem4',
            render: (text) => this.renderBadge(text),
          }, {
            title: '完成工作后的场所整理',
            dataIndex: 'workItem5',
            render: (text) => this.renderBadge(text),
          }, {
            title: '工作时场所整理',
            dataIndex: 'workItem6',
            render: (text) => this.renderBadge(text),
          }, {
            title: '日工作目标完成情况',
            dataIndex: 'workItem7',
            render: (text) => this.renderBadge(text),
          }
        ];
      case 'product':
        return [
          {
            title: '日期',
            dataIndex: 'id',
          }, {
            title: '生产现场是否清洁',
            dataIndex: 'workItem1',
            render: (text) => this.renderBadge(text),
          }, {
            title: '物料摆放是否整齐',
            dataIndex: 'workItem2',
            render: (text) => this.renderBadge(text),
          }, {
            title: '是否按规定工艺流程生产',
            dataIndex: 'workItem3',
            render: (text) => this.renderBadge(text),
          }, {
            title: '是否记录每日的工作内容',
            dataIndex: 'workItem4',
            render: (text) => this.renderBadge(text),
          }
        ];
      case 'office':
        return [
          {
            title: '日期',
            dataIndex: 'id',
          }, {
            title: '办公室环境卫生情况',
            dataIndex: 'workItem1',
            render: (text) => this.renderBadge(text),
          }, {
            title: '对各部门协助情况',
            dataIndex: 'workItem2',
            render: (text) => this.renderBadge(text),
          }, {
            title: '文件是否及时整理归档',
            dataIndex: 'workItem3',
            render: (text) => this.renderBadge(text),
          }, {
            title: '日计划、日总结',
            dataIndex: 'workItem4',
            render: (text) => this.renderBadge(text),
          }, {
            title: '周计划、周总结',
            dataIndex: 'workItem5',
            render: (text) => this.renderBadge(text),
          }, {
            title: '月计划、月总结',
            dataIndex: 'workItem6',
            render: (text) => this.renderBadge(text),
          }
        ];
      case 'finance':
        return [
          {
            title: '日期',
            dataIndex: 'id',
          }, {
            title: '工作计划',
            dataIndex: 'workItem1',
            render: (text) => this.renderBadge(text),
          }, {
            title: '临时工作',
            dataIndex: 'workItem2',
            render: (text) => this.renderBadge(text),
          }, {
            title: '办公室卫生清洁无死角',
            dataIndex: 'workItem3',
            render: (text) => this.renderBadge(text),
          }, {
            title: '办公物品分类整齐摆放',
            dataIndex: 'workItem4',
            render: (text) => this.renderBadge(text),
          }, {
            title: '明日计划',
            dataIndex: 'workItem5',
            render: (text) => this.renderBadge(text),
          }
        ];
      default:
        return [{
          title: '日期',
          dataIndex: 'id',
        },]
    }
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

  componentDidMount() {
    this.props.dispatch({
      type: 'leaderMonthly/fetch',
      payload: {
        role: 'staff,leader'
      }
    });
  }

  enableModal = (record) => {
    this.setState({record, modalVisible: true})
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
      type: 'leaderMonthly/fetchModalList',
      payload: {
        start: start,
        end: end,
        id: id
      },
    })
  };

  render() {
    const {
      leaderMonthly: { list, modalList },
      user: { currentUser },
      loading,
    } = this.props;
    const { modalVisible, record, startDate, endDate } = this.state;
    const modalProps = {
      item: record,
      startDate,
      endDate,
      columns: this.getModalColumns(currentUser.department),
      modalVisible,
      department: departments[currentUser.department],
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

export default MonthlyWork
