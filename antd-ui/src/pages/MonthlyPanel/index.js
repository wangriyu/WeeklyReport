import React from 'react';
import moment from 'moment';
import html2canvas from 'html2canvas';
import { DatePicker, Table, Button, Badge } from 'antd';
import { departments } from '../../utils/variable';
import styles from './index.less';

const { RangePicker, MonthPicker } = DatePicker;

const MonthlyPanel = props => {
  const { item, list, loading, startDate, endDate, department, handleDateChange } = props;
  const departmentName = departments[department];

  const renderBadge = text => {
    switch (text) {
      case 1:
        return <Badge color='green' text='√' />;
      case 2:
        return <Badge color='red' text='×' />;
      case 3:
        return <Badge color='grey' text='○' />;
      case 4:
        return <Badge color='blue' text='☐' />;
      case 5:
        return <Badge color='#efefef' text='▽' />;
      default:
        return null;
    }
  };

  const getModalColumns = input => {
    switch (input) {
      case 'marketing':
        return [
          {
            title: '日期',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '卫生',
            dataIndex: 'hygiene',
            render: text => renderBadge(text),
          },
          {
            title: '晨会',
            dataIndex: 'meeting',
            render: text => renderBadge(text),
          },
          {
            title: '工作',
            dataIndex: 'work',
            render: text => renderBadge(text),
          },
        ];
      case 'techSupport':
        return [
          {
            title: '日期',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '办公室物品摆放整齐',
            dataIndex: 'workItem1',
            render: text => renderBadge(text),
          },
          {
            title: '办公环境卫生整洁',
            dataIndex: 'workItem2',
            render: text => renderBadge(text),
          },
          {
            title: '例行晨会',
            dataIndex: 'workItem3',
            render: text => renderBadge(text),
          },
          {
            title: '技术方案资料及时备案',
            dataIndex: 'workItem4',
            render: text => renderBadge(text),
          },
          {
            title: '按照既定流程制定方案',
            dataIndex: 'workItem5',
            render: text => renderBadge(text),
          },
          {
            title: '今日事今日毕',
            dataIndex: 'workItem6',
            render: text => renderBadge(text),
          },
          {
            title: '下班前断电、熄灯',
            dataIndex: 'workItem7',
            render: text => renderBadge(text),
          },
        ];
      case 'afterSale':
        return [
          {
            title: '日期',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '物品摆放整齐',
            dataIndex: 'workItem1',
            render: text => renderBadge(text),
          },
          {
            title: '环境卫生整洁',
            dataIndex: 'workItem2',
            render: text => renderBadge(text),
          },
          {
            title: '例行晨会',
            dataIndex: 'workItem3',
            render: text => renderBadge(text),
          },
          {
            title: '售后工作是否按时汇报工作情况',
            dataIndex: 'workItem4',
            width: 100,
            render: text => renderBadge(text),
          },
          {
            title: '施工工艺符合规范',
            dataIndex: 'workItem5',
            render: text => renderBadge(text),
          },
          {
            title: '工作设备、工具处于正常状态',
            dataIndex: 'workItem6',
            width: 100,
            render: text => renderBadge(text),
          },
          {
            title: '文件、记录完整',
            dataIndex: 'workItem7',
            render: text => renderBadge(text),
          },
          {
            title: '记录工作内容',
            dataIndex: 'workItem8',
            render: text => renderBadge(text),
          },
        ];
      case 'develop':
        return [
          {
            title: '日期',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '室内环境',
            dataIndex: 'workItem1',
            render: text => renderBadge(text),
          },
          {
            title: '桌面环境',
            dataIndex: 'workItem2',
            render: text => renderBadge(text),
          },
          {
            title: '文件摆放',
            dataIndex: 'workItem3',
            render: text => renderBadge(text),
          },
          {
            title: '投入工作时间',
            dataIndex: 'workItem4',
            render: text => renderBadge(text),
          },
          {
            title: '完成工作后的场所整理',
            dataIndex: 'workItem5',
            render: text => renderBadge(text),
          },
          {
            title: '工作时场所整理',
            dataIndex: 'workItem6',
            render: text => renderBadge(text),
          },
          {
            title: '日工作目标完成情况',
            dataIndex: 'workItem7',
            render: text => renderBadge(text),
          },
        ];
      case 'product':
        return [
          {
            title: '日期',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '生产现场是否清洁',
            dataIndex: 'workItem1',
            render: text => renderBadge(text),
          },
          {
            title: '物料摆放是否整齐',
            dataIndex: 'workItem2',
            render: text => renderBadge(text),
          },
          {
            title: '是否按规定工艺流程生产',
            dataIndex: 'workItem3',
            render: text => renderBadge(text),
          },
          {
            title: '是否记录每日的工作内容',
            dataIndex: 'workItem4',
            render: text => renderBadge(text),
          },
        ];
      case 'office':
        return [
          {
            title: '日期',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '办公室环境卫生情况',
            dataIndex: 'workItem1',
            render: text => renderBadge(text),
          },
          {
            title: '对各部门协助情况',
            dataIndex: 'workItem2',
            render: text => renderBadge(text),
          },
          {
            title: '文件是否及时整理归档',
            dataIndex: 'workItem3',
            render: text => renderBadge(text),
          },
          {
            title: '日计划、日总结',
            dataIndex: 'workItem4',
            render: text => renderBadge(text),
          },
          {
            title: '周计划、周总结',
            dataIndex: 'workItem5',
            render: text => renderBadge(text),
          },
          {
            title: '月计划、月总结',
            dataIndex: 'workItem6',
            render: text => renderBadge(text),
          },
        ];
      case 'finance':
        return [
          {
            title: '日期',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '工作计划',
            dataIndex: 'workItem1',
            render: text => renderBadge(text),
          },
          {
            title: '临时工作',
            dataIndex: 'workItem2',
            render: text => renderBadge(text),
          },
          {
            title: '办公室卫生清洁无死角',
            dataIndex: 'workItem3',
            render: text => renderBadge(text),
          },
          {
            title: '办公物品分类整齐摆放',
            dataIndex: 'workItem4',
            render: text => renderBadge(text),
          },
          {
            title: '明日计划',
            dataIndex: 'workItem5',
            render: text => renderBadge(text),
          },
        ];
      default:
        return [
          {
            title: '日期',
            dataIndex: 'id',
            width: 100,
          },
        ];
    }
  };

  const handleMonthPick = date => {
    if (date) {
      const start = date.startOf('month').format('YYYYMMDD');
      let end = date.endOf('month').format('YYYYMMDD');
      const now = moment();
      if (now.isBetween(start, end)) {
        end = now.format('YYYYMMDD');
      }
      handleDateChange(start, end, item.id);
    }
  };

  const handleRangePick = date => {
    if (date[0] && date[1]) {
      const start = date[0].format('YYYYMMDD');
      const end = date[1].format('YYYYMMDD');
      handleDateChange(start, end, item.id);
    }
  };

  const exportTable = () => {
    html2canvas(document.getElementById('monthly-table')).then(function(canvas) {
      const aElement = document.createElement('a');
      aElement.setAttribute('href', canvas.toDataURL('image/png', 1.0));
      aElement.setAttribute(
        'download',
        `${departmentName}${item.name}月报-${startDate}-${endDate}.png`
      );
      document.body.insertAdjacentElement('beforeend', aElement);
      aElement.click();
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <RangePicker
            size='small'
            allowClear={false}
            format='YYYYMMDD'
            disabledDate={current => current > moment().endOf('day')}
            value={
              !startDate || !endDate
                ? null
                : [moment(startDate, 'YYYYMMDD'), moment(endDate, 'YYYYMMDD')]
            }
            onChange={handleRangePick}
          />
          <MonthPicker
            size='small'
            allowClear={false}
            style={{ marginLeft: '10px' }}
            format='YYYYMM'
            value={!startDate || !endDate ? null : moment(startDate, 'YYYYMM')}
            disabledDate={current => current > moment().endOf('month')}
            onChange={handleMonthPick}
            placeholder='选择月份'
          />
        </div>
        <Button size='small' type='primary' onClick={exportTable}>
          导出
        </Button>
      </div>
      <Table
        title={() => (
          <div style={{ textAlign: 'center' }}>
            {departmentName}
            {item.name}自检记录表
          </div>
        )}
        id='monthly-table'
        rowKey={record => record.id}
        bordered
        size='small'
        className={styles.smallTable}
        scroll={{ x: '100%' }}
        columns={getModalColumns(department)}
        dataSource={list}
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default MonthlyPanel;
