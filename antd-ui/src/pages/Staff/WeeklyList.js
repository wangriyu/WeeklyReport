import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';
import WeeklyPanel from '../WeeklyPanel';

@connect(({ staffWeekly, user, loading }) => ({
  staffWeekly,
  user,
  loading: loading.models.staffWeekly,
}))
class WeeklyList extends Component {
  state = {
    summaryWeek: moment(),
    planWeek: moment().add(1, 'weeks'),
  };

  componentDidMount() {
    this.handleSummaryDateChange(moment());
    this.handlePlanDateChange(moment().add(1, 'weeks'));
  }

  handlePlanDateChange = week => {
    const {
      user: { currentUser },
      dispatch,
    } = this.props;
    this.setState({
      planWeek: week,
    });
    dispatch({
      type: 'staffWeekly/fetchWeeklyPlan',
      payload: {
        id: currentUser.id,
        planWeek: week.format('YYYY-wo'),
      },
    });
  };

  handleSummaryDateChange = week => {
    const {
      user: { currentUser },
      dispatch,
    } = this.props;
    this.setState({
      summaryWeek: week,
    });
    dispatch({
      type: 'staffWeekly/fetchWeeklySummary',
      payload: {
        id: currentUser.id,
        summaryWeek: week.format('YYYY-wo'),
      },
    });
  };

  render() {
    const {
      loading,
      user: { currentUser },
      staffWeekly: { weeklyPlan, weeklySummary },
    } = this.props;
    const { planWeek, summaryWeek } = this.state;
    const weeklyPanelProps = {
      item: currentUser,
      weeklyPlan,
      weeklySummary,
      loading,
      planWeek,
      summaryWeek,
      handlePlanDateChange: this.handlePlanDateChange,
      handleSummaryDateChange: this.handleSummaryDateChange,
    };

    return (
      <Card>
        <WeeklyPanel {...weeklyPanelProps} />
      </Card>
    );
  }
}

export default WeeklyList;
