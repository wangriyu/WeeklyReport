import React       from 'react';
import moment      from 'moment';
import {
  Modal, DatePicker, Table, Button,
}                  from 'antd';
import html2canvas from 'html2canvas';

const { RangePicker, MonthPicker } = DatePicker;

const DailyModal = (props) => {
  const { item, list, loading, modalVisible, columns, startDate, endDate, department, handleModalVisible, handleDateChange } = props;
  const modalOpts = {
    width: '800px',
    title: item.name,
    footer: null,
    maskClosable: false,
    visible: modalVisible,
    onCancel: handleModalVisible,
    wrapClassName: 'vertical-center-modal',
  };

  const handleMonthPick = (date) => {
    if (date) {
      let start = date.startOf('month').format('YYYYMMDD');
      let end = date.endOf('month').format('YYYYMMDD');
      let now = moment();
      if (now.isBetween(start, end)) {
        end = now.format('YYYYMMDD')
      }
      handleDateChange(item.id, start, end)
    }
  };

  const handleRangePick = (date) => {
    if (date[0] && date[1]) {
      let start = date[0].format('YYYYMMDD'), end = date[1].format('YYYYMMDD');
      handleDateChange(item.id, start, end)
    }
  };

  const exportTable = () => {
    html2canvas(document.getElementById('monthly-table')).then(function(canvas) {
      let aElement=document.createElement('a');
      aElement.setAttribute('href', canvas.toDataURL('image/png', 1.0));
      aElement.setAttribute('download', `${department}${item.name}月报-${startDate}-${endDate}.png`);
      document.body.insertAdjacentElement('beforeend', aElement);
      aElement.click();
    });
  };

  return (
    <Modal {...modalOpts}>
      <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <RangePicker
            size={'small'}
            allowClear={false}
            format={'YYYYMMDD'}
            disabledDate={(current) => current > moment().endOf('day')}
            value={!startDate || !endDate ? null : [moment(startDate, 'YYYYMMDD'), moment(endDate, 'YYYYMMDD')]}
            onChange={handleRangePick}
          />
          <MonthPicker
            size={'small'}
            allowClear={false}
            style={{marginLeft: '10px'}}
            format={'YYYYMM'}
            value={!startDate || !endDate ? null : moment(startDate, 'YYYYMM')}
            disabledDate={(current) => current > moment().endOf('month')}
            onChange={handleMonthPick}
            placeholder="选择月份"
          />
        </div>
        <Button size='small' type='primary' onClick={exportTable}>导出</Button>
      </div>
      <Table
        title={() => <div style={{textAlign: 'center'}}>{department}{item.name}自检记录表</div>}
        id='monthly-table'
        rowKey={record => record.id}
        bordered
        scroll={{ x: '100%' }}
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={false}
      />
    </Modal>
  )
};

export default DailyModal;
