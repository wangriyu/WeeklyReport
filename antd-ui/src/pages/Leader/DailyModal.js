import React from 'react';
import { Modal } from 'antd';
import MonthlyPanel from '../MonthlyPanel';

const DailyModal = props => {
  const {
    item,
    list,
    loading,
    startDate,
    endDate,
    department,
    modalVisible,
    handleModalVisible,
    handleDateChange,
  } = props;

  const modalOpts = {
    width: '800px',
    title: item.name,
    footer: null,
    maskClosable: false,
    visible: modalVisible,
    onCancel: handleModalVisible,
    wrapClassName: 'vertical-center-modal',
  };

  const PanelProps = {
    item,
    list,
    loading,
    startDate,
    endDate,
    department,
    handleDateChange,
  };

  return (
    <Modal {...modalOpts}>
      <MonthlyPanel {...PanelProps} />
    </Modal>
  );
};

export default DailyModal;
