import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Form, Table, Modal, Input, DatePicker, Select, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import DropOption from '@/components/DropOption';
import { departments } from '../../utils/variable';
import styles from './TableList.less';

const departmentKeys = Object.keys(departments);
const FormItem = Form.Item;
const { Option } = Select;

const UpdateForm = Form.create()(props => {
  const {
    modalVisible,
    evtType,
    record,
    form,
    handleUpdate,
    handleCreate,
    handleModalVisible,
  } = props;
  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const values = fieldsValue;
      values.joinDate = fieldsValue.joinDate.format('YYYY-MM-DD');
      if (evtType === 'create') {
        handleCreate(values);
      } else if (evtType === 'update') {
        values.id = record.id;
        handleUpdate(values);
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    handleModalVisible();
  };

  const modalOpts = {
    width: '800px',
    title: '修改信息',
    maskClosable: false,
    okText: '提交',
    visible: modalVisible,
    onOk: handleOk,
    onCancel: handleCancel,
    wrapClassName: 'vertical-center-modal',
  };

  return (
    <Modal {...modalOpts}>
      <Form {...formItemLayout}>
        <FormItem label="账户名">
          {form.getFieldDecorator('nickname', {
            initialValue: record.nickname,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.nickname.required' }),
              },
              {
                max: 15,
                message: formatMessage({ id: 'validation.nickname.overflow' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'form.nickname.placeholder' })} />)}
        </FormItem>
        {evtType === 'create' ? (
          <FormItem label="密码">
            {form.getFieldDecorator('password', {
              initialValue: '123456',
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
                {
                  min: 6,
                  message: formatMessage({ id: 'validation.password.strength.msg' }),
                },
              ],
            })(<Input placeholder={formatMessage({ id: 'form.password.placeholder' })} />)}
          </FormItem>
        ) : null}
        <Form.Item label="姓名" style={{ marginBottom: 0 }}>
          <FormItem style={{ display: 'inline-block' }}>
            {form.getFieldDecorator('name', {
              initialValue: record.name,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.name.required' }),
                },
              ],
            })(<Input placeholder={formatMessage({ id: 'form.name.placeholder' })} />)}
          </FormItem>
          <FormItem style={{ display: 'inline-block', marginLeft: '5px' }}>
            {form.getFieldDecorator('joinDate', {
              initialValue: !record.joinDate ? null : moment(record.joinDate, 'YYYY-MM-DD'),
              rules: [
                {
                  type: 'object',
                  required: true,
                  message: formatMessage({ id: 'validation.joinDate.required' }),
                },
              ],
            })(<DatePicker placeholder={formatMessage({ id: 'form.joinDate.placeholder' })} />)}
          </FormItem>
        </Form.Item>
        <FormItem label="手机">
          {form.getFieldDecorator('mobile', {
            initialValue: record.mobile,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.phone-number.required' }),
              },
              {
                pattern: /^\d{11}$/,
                message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'form.phone-number.placeholder' })} />)}
        </FormItem>
        <FormItem label="邮箱">
          {form.getFieldDecorator('mail', {
            initialValue: record.mail,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.email.required' }),
              },
              {
                type: 'email',
                message: formatMessage({ id: 'validation.email.wrong-format' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'form.email.placeholder' })} />)}
        </FormItem>
        <FormItem label="部门">
          {form.getFieldDecorator('department', {
            initialValue: record.department || 'default',
          })(
            <Select placeholder={formatMessage({ id: 'form.department.placeholder' })}>
              {Object.keys(departments).map(k => (
                <Option value={k} key={k}>
                  {departments[k]}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="权限">
          {form.getFieldDecorator('role', {
            initialValue: record.role || 'staff',
          })(
            <Select placeholder={formatMessage({ id: 'form.role.placeholder' })}>
              <Option value="staff" key="staff">
                员工
              </Option>
              <Option value="leader" key="leader">
                主管
              </Option>
              <Option value="boss" key="boss">
                总工
              </Option>
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ staff, loading }) => ({
  staff,
  loading: loading.models.staff,
}))
@Form.create()
class ManageStaff extends PureComponent {
  state = {
    selectedRowKeys: [],
    modalVisible: false,
    record: {},
    evtType: '',
    pagination: {
      current: 1,
      pageSize: 10,
    },
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '账户名',
      dataIndex: 'nickname',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      render: text => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '部门',
      dataIndex: 'department',
      filters: [
        {
          text: departments[departmentKeys[0]],
          value: departmentKeys[0],
        },
        {
          text: departments[departmentKeys[1]],
          value: departmentKeys[1],
        },
        {
          text: departments[departmentKeys[2]],
          value: departmentKeys[2],
        },
        {
          text: departments[departmentKeys[3]],
          value: departmentKeys[3],
        },
        {
          text: departments[departmentKeys[4]],
          value: departmentKeys[4],
        },
        {
          text: departments[departmentKeys[5]],
          value: departmentKeys[5],
        },
        {
          text: departments[departmentKeys[6]],
          value: departmentKeys[6],
        },
        {
          text: departments[departmentKeys[7]],
          value: departmentKeys[7],
        },
      ],
      render: text => departments[text],
      onFilter: (value, record) => record.department.indexOf(value) === 0,
    },
    {
      title: '电话',
      dataIndex: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'mail',
    },
    {
      title: '权限',
      dataIndex: 'role',
      filterMultiple: false,
      filters: [
        {
          text: '员工',
          value: 'staff',
        },
        {
          text: '主管',
          value: 'leader',
        },
        {
          text: '总工',
          value: 'boss',
        },
      ],
      onFilter: (value, record) => record.role.indexOf(value) === 0,
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <DropOption
          onMenuClick={e => this.handleSingleMenuClick(record, e)}
          menuOptions={[{ key: '1', name: '修改信息' }, { key: '2', name: '删除记录' }]}
        />
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'staff/fetchStaffList',
    });
  }

  handleSingleMenuClick = (record, e) => {
    const { dispatch } = this.props;
    if (e.key === '1') {
      this.setState({ record, modalVisible: true, evtType: 'update' });
    } else if (e.key === '2') {
      dispatch({
        type: 'staff/deleteStaff',
        payload: {
          ids: [record.id],
        },
      });
    }
  };

  handleStandardTableChange = pagination => {
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    };

    this.setState({ pagination: params });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleMultiMenuClick = (selectedRowKeys, e) => {
    const { dispatch } = this.props;
    if (e.key === '1') {
      dispatch({
        type: 'staff/deleteStaff',
        payload: {
          ids: selectedRowKeys,
        },
      });
    }
  };

  handleModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible, record: {} });
  };

  handleUpdate = payload => {
    const { dispatch } = this.props;

    this.setState({ modalVisible: !this.state.modalVisible, record: {} });
    dispatch({
      type: 'staff/updateStaff',
      payload,
    });
  };

  handleCreate = payload => {
    const { dispatch } = this.props;

    this.setState({ modalVisible: !this.state.modalVisible, record: {} });
    dispatch({
      type: 'staff/createStaff',
      payload,
    });
  };

  render() {
    const {
      staff: { list },
      loading,
    } = this.props;
    const { selectedRowKeys, modalVisible, record, evtType, pagination } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '50'],
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      total: list && list.length ? list.length : 0,
      ...pagination,
    };
    const modalProps = {
      evtType,
      record,
      modalVisible,
      handleUpdate: this.handleUpdate,
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <Card bordered={false}>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <DropOption
              disabled={!hasSelected}
              buttonStyle={{ margin: '0 16px 0 0' }}
              onMenuClick={e => this.handleMultiMenuClick(selectedRowKeys, e)}
              menuOptions={[{ key: '1', name: '批量删除' }]}
            />
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </div>
          <Button
            type="primary"
            onClick={() => this.setState({ modalVisible: true, evtType: 'create' })}
          >
            新建
          </Button>
        </div>
        <Table
          rowKey={data => data.id}
          rowSelection={rowSelection}
          className={styles.table}
          bordered
          scroll={{ x: '100%' }}
          columns={this.columns}
          dataSource={list}
          pagination={paginationProps}
          loading={loading}
          onChange={this.handleStandardTableChange}
        />
        <UpdateForm {...modalProps} />
      </Card>
    );
  }
}

export default ManageStaff;
