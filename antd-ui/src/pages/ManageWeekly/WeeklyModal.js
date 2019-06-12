import React from 'react';
import { Modal } from 'antd';
import { departments } from '../../utils/variable';
import WeeklyPanel from '../WeeklyPanel';

const WeeklyModal = props => {
  const {
    item,
    weeklyPlan,
    weeklySummary,
    modalWidth,
    loading,
    modalVisible,
    planWeek,
    summaryWeek,
    handleUpdate,
    handleModalVisible,
    handlePlanDateChange,
    handleSummaryDateChange,
  } = props;
  const modalOpts = {
    width: modalWidth || '980px',
    title: (
      <div>
        <span>{item.name}</span> - <span>{departments[item.department]}</span>
      </div>
    ),
    footer: null,
    maskClosable: false,
    visible: modalVisible,
    onOk: handleUpdate,
    onCancel: handleModalVisible,
    wrapClassName: 'vertical-center-modal',
  };

  const weeklyPanelProps = {
    item,
    weeklyPlan,
    weeklySummary,
    loading,
    planWeek,
    summaryWeek,
    handlePlanDateChange,
    handleSummaryDateChange,
  };

  return (
    <Modal {...modalOpts}>
      <WeeklyPanel {...weeklyPanelProps} />
    </Modal>
  );
};

export default WeeklyModal;
