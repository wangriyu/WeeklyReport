import React, { Component } from 'react';
import { connect }          from 'dva';
import { Card }             from 'antd';
import moment               from 'moment';
import MonthlyPanel         from '../MonthlyPanel';

@connect(({ monthly, user, loading }) => ({
  monthly,
  user,
  loading: loading.models.monthly,
}))
class MonthlyWork extends Component {
  state = {
    startDate: '',
    endDate: '',
  };

  componentDidMount() {
    this.handleDateChange(
      moment().startOf('month').format('YYYYMMDD'),
      moment().format('YYYYMMDD')
    );
  }

  handleDateChange = (start, end) => {
    const { dispatch, user: { currentUser } } = this.props;
    const { department, id } = currentUser;

    this.setState({
      startDate: start,
      endDate: end,
    });
    switch (department) {
      case 'afterSale':
        dispatch({
          type: 'monthly/fetchAfterSaleMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'develop':
        dispatch({
          type: 'monthly/fetchDevelopMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'finance':
        dispatch({
          type: 'monthly/fetchFinanceMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'marketing':
        dispatch({
          type: 'monthly/fetchMarketingMonthlyByID',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'office':
        dispatch({
          type: 'monthly/fetchOfficeMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'product':
        dispatch({
          type: 'monthly/fetchProductMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      case 'techSupport':
        dispatch({
          type: 'monthly/fetchTechSupportMonthly',
          payload: {
            start,
            end,
            id,
          },
        });
        break;
      default:
    }
  };

  render() {
    const {
      monthly: { list },
      user: { currentUser },
      loading,
    } = this.props;
    const { startDate, endDate } = this.state;
    const department = currentUser && currentUser.department ? currentUser.department : 'default';
    const PanelProps = {
      item: currentUser,
      list,
      loading,
      startDate,
      endDate,
      department,
      handleDateChange: this.handleDateChange,
    };

    return (
      <Card>
        <MonthlyPanel {...PanelProps} />
      </Card>
    );
  }
}

export default MonthlyWork;
