import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import html2canvas from 'html2canvas';
import { Card, DatePicker, Table, Button } from 'antd';
import styles from './TableList.less';

const { RangePicker, MonthPicker } = DatePicker;

@connect(({ monthly, loading }) => ({
  monthly,
  loading: loading.models.monthly,
}))
class MarketingDaily extends PureComponent {
  state = {
    columns: [],
    startDate: null,
    endDate: null,
    month: '',
  };

  componentDidMount() {
    this.handleDateChange(
      moment()
        .startOf('month')
        .format('YYYYMMDD'),
      moment().format('YYYYMMDD'),
      moment().format('YYYYMM')
    );
  }

  renderBadge = text => {
    switch (text) {
      case 1:
        return <span style={{ fontSize: '8px' }}>√</span>;
      case 2:
        return <span style={{ fontSize: '8px' }}>×</span>;
      case 3:
        return <span style={{ fontSize: '8px' }}>○</span>;
      case 4:
        return <span style={{ fontSize: '8px' }}>☐</span>;
      case 5:
        return <span style={{ fontSize: '8px' }}>▽</span>;
      default:
        return null;
    }
  };

  handleDateChange = (start, end, month) => {
    const { dispatch } = this.props;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ];
    const startDate = moment(start, 'YYYYMMDD');
    const endDate = moment(end, 'YYYYMMDD');
    while (startDate.isSameOrBefore(endDate)) {
      const index = startDate.format('YYYYMMDD');
      columns.push({
        title: index,
        dataIndex: index,
        children: [
          {
            title: '卫生',
            dataIndex: `hygiene_${index}`,
            render: text => this.renderBadge(text),
          },
          {
            title: '晨会',
            dataIndex: `meeting_${index}`,
            render: text => this.renderBadge(text),
          },
          {
            title: '工作',
            dataIndex: `work_${index}`,
            render: text => this.renderBadge(text),
          },
        ],
      });
      startDate.add(1, 'days');
    }
    this.setState({
      startDate: start,
      endDate: end,
      month: month || `${start}-${end}`,
      columns,
    });
    dispatch({
      type: 'monthly/fetchMarketingMonthly',
      payload: {
        start,
        end,
      },
    });
  };

  handleMonthPick = (date, dateString) => {
    if (date) {
      const start = date.startOf('month').format('YYYYMMDD');
      let end = date.endOf('month').format('YYYYMMDD');
      const now = moment();
      if (now.isBetween(start, end)) {
        end = now.format('YYYYMMDD');
      }
      this.handleDateChange(start, end, dateString);
    }
  };

  handleRangePick = date => {
    if (date[0] && date[1]) {
      const start = date[0].format('YYYYMMDD');
      const end = date[1].format('YYYYMMDD');
      this.handleDateChange(start, end);
    }
  };

  exportTable = () => {
    const { startDate, endDate } = this.state;

    html2canvas(document.getElementById('marketing-monthly-table')).then(function(canvas) {
      const aElement = document.createElement('a');
      aElement.setAttribute('href', canvas.toDataURL('image/png', 1.0));
      aElement.setAttribute('download', `营销部月报-${startDate}-${endDate}.png`);
      document.body.insertAdjacentElement('beforeend', aElement);
      aElement.click();
    });
  };

  render() {
    const {
      monthly: { list },
      loading,
    } = this.props;
    const { columns, startDate, endDate, month } = this.state;

    return (
      <Card bordered={false}>
        <div
          style={{
            padding: '5px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <RangePicker
              size="small"
              allowClear={false}
              format="YYYYMMDD"
              disabledDate={current => current > moment().endOf('day')}
              value={
                !startDate || !endDate
                  ? null
                  : [moment(startDate, 'YYYYMMDD'), moment(endDate, 'YYYYMMDD')]
              }
              onChange={this.handleRangePick}
            />
            <MonthPicker
              size="small"
              allowClear={false}
              style={{ marginLeft: '10px' }}
              format="YYYYMM"
              value={!startDate || !endDate ? null : moment(startDate, 'YYYYMM')}
              disabledDate={current => current > moment().endOf('month')}
              onChange={this.handleMonthPick}
              placeholder="选择月份"
            />
          </div>
          <Button size="small" type="primary" onClick={this.exportTable}>
            导出
          </Button>
        </div>
        <div id="marketing-monthly-table" style={{ padding: '5px' }}>
          <Table
            title={() => <div style={{ textAlign: 'center' }}>营销部 {month} 月报</div>}
            size="small"
            rowKey={record => record.id}
            className={styles.smallTable}
            bordered
            scroll={{ x: '100%' }}
            columns={columns}
            dataSource={list}
            loading={loading}
            pagination={false}
          />
        </div>
      </Card>
    );
  }
}

export default MarketingDaily;
