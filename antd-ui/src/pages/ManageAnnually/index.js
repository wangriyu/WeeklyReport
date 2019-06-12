import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Badge, Input, Popconfirm, Form, Divider, Button } from 'antd';
import AnnuallyModal from './AnnuallyModal';

const { TextArea } = Input;
const EditableContext = React.createContext();

const ExpandedRowRender = props => {
  const { list, loading, enableUpdateItem, deleteItem } = props;
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '项目名称',
      dataIndex: 'title',
    },
    {
      title: '紧急程度',
      dataIndex: 'priority',
      render: text => {
        switch (text) {
          case 1:
            return <Badge color="#efefef" text="-" />;
          case 2:
            return <Badge color="green" text="低" />;
          case 3:
            return <Badge color="blue" text="中" />;
          case 4:
            return <Badge color="red" text="高" />;
          default:
            return null;
        }
      },
    },
    {
      title: '计划完成时间',
      dataIndex: 'deadline',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '负责人',
      dataIndex: 'leader',
    },
    {
      title: '项目进度',
      dataIndex: 'progress',
    },
    {
      title: '验收结果',
      dataIndex: 'result',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <span style={{ fontSize: '12px' }}>
          <a onClick={() => enableUpdateItem(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => deleteItem(record)}>删除</a>
        </span>
      ),
    },
  ];

  return (
    <Table
      rowKey={record => record.id}
      bordered
      loading={loading}
      scroll={{ x: '100%' }}
      columns={columns}
      dataSource={list}
      pagination={false}
    />
  );
};

class EditableCell extends React.Component {
  getInput = () => {
    return <TextArea autosize={{ minRows: 2, maxRows: 6 }} />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const { editing, dataIndex, title, record, children, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

@connect(({ annually, loading }) => ({
  annually,
  loading: loading.models.annually,
}))
@Form.create()
class ManageAnnually extends Component {
  state = {
    record: {},
    evtType: '',
    modalVisible: false,
    expandedRowKey: [],
    editingKey: '',
    pid: 0,
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 30,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 30,
    },
    {
      title: '总体目标',
      dataIndex: 'goal',
      editable: true,
    },
    {
      title: '年度计划',
      dataIndex: 'plan',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <a
                  href="javascript:;"
                  onClick={() => this.save(form, record.id)}
                  style={{ marginRight: 8 }}
                >
                  保存
                </a>
              )}
            </EditableContext.Consumer>
            <Popconfirm title="取消操作?" onConfirm={() => this.cancel(record.id)}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <span style={{ fontSize: '12px' }}>
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
              编辑
            </a>
            <Divider type="vertical" />
            <a
              disabled={editingKey !== ''}
              onClick={() =>
                this.setState({
                  modalVisible: true,
                  evtType: 'createItem',
                  record: {},
                  pid: record.id,
                })
              }
            >
              添加任务
            </a>
          </span>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'annually/fetchPlanList',
    });
  }

  isEditing = record => record.id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save = (form, id) => {
    const { dispatch } = this.props;

    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      this.setState({ editingKey: '' });
      dispatch({
        type: 'annually/updatePlan',
        payload: {
          id,
          ...row,
        },
      });
    });
  };

  edit = key => {
    this.setState({ editingKey: key });
  };

  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      record: {},
      pid: 0,
    });
  };

  onExpandedTable = (expanded, record) => {
    const { dispatch } = this.props;

    if (expanded) {
      dispatch({
        type: 'annually/fetchWorkList',
        payload: {
          id: record.id,
        },
      });
    }
  };

  handleCreatePlan = payload => {
    const { dispatch } = this.props;

    this.setState({ modalVisible: !this.state.modalVisible });
    dispatch({
      type: 'annually/createPlan',
      payload,
    });
  };

  handleCreateItem = payload => {
    const { dispatch } = this.props;
    const { pid, expandedRowKey, modalVisible } = this.state;
    this.setState({ modalVisible: !modalVisible });
    dispatch({
      type: 'annually/createItem',
      payload: {
        params: {
          ...payload,
          pid,
        },
        expand: pid === expandedRowKey[0],
      },
    });
  };

  handleUpdateItem = (pid, payload) => {
    const { dispatch } = this.props;
    this.setState({ modalVisible: !this.state.modalVisible });
    dispatch({
      type: 'annually/updateItem',
      payload: {
        params: payload,
        pid,
      },
    });
  };

  enableUpdateItem = record => {
    this.setState({
      modalVisible: true,
      evtType: 'updateItem',
      record,
    });
  };

  deleteItem = record => {
    const { dispatch } = this.props;

    dispatch({
      type: 'annually/deleteItem',
      payload: {
        id: record.id,
        pid: record.pid,
      },
    });
  };

  render() {
    const {
      annually: { planList, workList },
      loading,
      form,
    } = this.props;
    const { expandedRowKey, evtType, modalVisible, record } = this.state;
    const expandedTableProps = {
      list: workList,
      loading,
      enableUpdateItem: this.enableUpdateItem,
      deleteItem: this.deleteItem,
    };
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: data => ({
          record: data,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(data),
        }),
      };
    });
    const modalProps = {
      evtType,
      record,
      modalVisible,
      handleUpdateItem: this.handleUpdateItem,
      handleCreateItem: this.handleCreateItem,
      handleCreatePlan: this.handleCreatePlan,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Card>
        <div style={{ marginBottom: '10px' }}>
          <Button
            type="primary"
            onClick={() => this.setState({ modalVisible: true, evtType: 'createPlan' })}
          >
            新建
          </Button>
        </div>
        <EditableContext.Provider value={form}>
          <Table
            components={components}
            rowKey={data => data.id}
            bordered
            scroll={{ x: '100%' }}
            columns={columns}
            dataSource={planList}
            loading={loading}
            pagination={false}
            expandedRowRender={() => <ExpandedRowRender {...expandedTableProps} />}
            onExpand={this.onExpandedTable}
            expandedRowKeys={expandedRowKey}
            onExpandedRowsChange={key => this.setState({ expandedRowKey: key.slice(-1) })}
          />
        </EditableContext.Provider>
        <AnnuallyModal {...modalProps} />
      </Card>
    );
  }
}

export default ManageAnnually;
