import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';
import DailyModal from './DailyModal';
import StaffList from './StaffList';

@connect(({ monthly, staff, loading }) => ({
  monthly,
  staff,
  loadingStaff: loading.models.staff,
  loading: loading.models.monthly,
}))
class AfterSaleDaily extends Component {
  state = {
    record: {},
    startDate: null,
    endDate: null,
    modalVisible: false,
  };

  selfDepartment = 'afterSale';

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'staff/fetchStaffList',
      payload: {
        department: this.selfDepartment,
      },
    });
  }

  enableModal = record => {
    this.setState({ record, modalVisible: true });
    this.handleDateChange(
      record.id,
      moment()
        .startOf('month')
        .format('YYYYMMDD'),
      moment().format('YYYYMMDD')
    );
  };

  handleModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  handleDateChange = (start, end, id) => {
    const { dispatch } = this.props;
    this.setState({
      startDate: start,
      endDate: end,
    });
    dispatch({
      type: 'monthly/fetchAfterSaleMonthly',
      payload: {
        id,
        start,
        end,
      },
    });
  };

  render() {
    const { staff, monthly, loading, loadingStaff } = this.props;
    const { modalVisible, record, startDate, endDate } = this.state;
    const modalProps = {
      modalWidth: '800px',
      item: record,
      startDate,
      endDate,
      department: this.selfDepartment,
      modalVisible,
      loading,
      list: monthly.list,
      handleModalVisible: this.handleModalVisible,
      handleDateChange: this.handleDateChange,
    };

    return (
      <Card bordered={false}>
        <StaffList list={staff.list} loading={loadingStaff} enableModal={this.enableModal} />
        <DailyModal {...modalProps} />
      </Card>
    );
  }
}

export default AfterSaleDaily;
