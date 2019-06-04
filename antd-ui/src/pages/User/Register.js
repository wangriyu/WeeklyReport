import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { departments } from '../../utils/variable';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Popover,
  Progress,
} from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;

const passwordStatusMap = {
  ok: (
    <div className={ styles.success }>
      <FormattedMessage id="validation.password.strength.strong"/>
    </div>
  ),
  pass: (
    <div className={ styles.warning }>
      <FormattedMessage id="validation.password.strength.medium"/>
    </div>
  ),
  poor: (
    <div className={ styles.error }>
      <FormattedMessage id="validation.password.strength.short"/>
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register, submitting: loading.effects['register/submit'],
}))
@Form.create()
class Register extends Component {
  state = {
    confirmDirty: false,
    visible: false,
    help: '',
  };

  componentDidUpdate () {
    const { form, register, dispatch } = this.props;
    const account = form.getFieldValue('nickname');
    if (register.status === 'ok') {
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            joinDate: values['joinDate'].format('YYYY-MM-DD'),
            department: values['department'] || 'default'
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }), visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={ styles[`progress-${passwordStatus}`] }>
        <Progress
          status={ passwordProgressMap[passwordStatus] }
          className={ styles.progress }
          strokeWidth={ 6 }
          percent={ value.length * 10 > 100 ? 100 : value.length * 10 }
          showInfo={ false }
        />
      </div>
    ) : null;
  };

  render () {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const {
      help,
      visible,
    } = this.state;
    return (
      <div className={ styles.main }>
        <h3>
          <FormattedMessage id="app.register.register"/>
        </h3>
        <Form onSubmit={ this.handleSubmit }>
          <FormItem>
            { getFieldDecorator('nickname', {
              rules: [{
                required: true, message: formatMessage({ id: 'validation.nickname.required' }),
              }, {
                max: 15, message: formatMessage({ id: 'validation.nickname.overflow' }),
              }],
            })(<Input size="large" placeholder={ formatMessage({ id: 'form.nickname.placeholder' }) }/>) }
          </FormItem>
          <FormItem help={ help }>
            <Popover
              getPopupContainer={ node => node.parentNode }
              content={ <div style={ { padding: '4px 0' } }>
                { passwordStatusMap[this.getPasswordStatus()] }
                { this.renderPasswordProgress() }
                <div style={ { marginTop: 10 } }>
                  <FormattedMessage id="validation.password.strength.msg"/>
                </div>
              </div> }
              overlayStyle={ { width: 240 } }
              placement="right"
              visible={ visible }
            >
              { getFieldDecorator('password', {
                rules: [{
                  validator: this.checkPassword,
                }],
              })(<Input
                size="large"
                type="password"
                placeholder={ formatMessage({ id: 'form.password.placeholder' }) }
              />) }
            </Popover>
          </FormItem>
          <FormItem>
            { getFieldDecorator('confirm', {
              rules: [{
                required: true, message: formatMessage({ id: 'validation.confirm-password.required' }),
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input
                size="large"
                type="password"
                onBlur={this.handleConfirmBlur}
                placeholder={ formatMessage({ id: 'form.confirm-password.placeholder' }) }
              />
            )}
          </FormItem>
          <Form.Item style={ { marginBottom: 0 } }>
            <FormItem style={ { display: 'inline-block' } }>
              { getFieldDecorator('name', {
                rules: [{
                  required: true, message: formatMessage({ id: 'validation.name.required' }),
                }],
              })(<Input size="large" placeholder={ formatMessage({ id: 'form.name.placeholder' }) }/>) }
            </FormItem>
            <FormItem style={ { display: 'inline-block', marginLeft: '5px' } }>
              { getFieldDecorator('joinDate', {
                rules: [{
                  type: 'object',
                  required: true,
                  message: formatMessage({ id: 'validation.joinDate.required' }),
                }],
              })(<DatePicker size="large" placeholder={ formatMessage({ id: 'form.joinDate.placeholder' }) }/>) }
            </FormItem>
          </Form.Item>
          <FormItem>
            { getFieldDecorator('mobile', {
              rules: [{
                required: true, message: formatMessage({ id: 'validation.phone-number.required' }),
              }, {
                pattern: /^\d{11}$/, message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
              }],
            })(<Input
              size="large"
              placeholder={ formatMessage({ id: 'form.phone-number.placeholder' }) }
            />) }
          </FormItem>
          <FormItem>
            { getFieldDecorator('mail', {
              rules: [{
                required: true, message: formatMessage({ id: 'validation.email.required' }),
              }, {
                type: 'email', message: formatMessage({ id: 'validation.email.wrong-format' }),
              }],
            })(<Input size="large" placeholder={ formatMessage({ id: 'form.email.placeholder' }) }/>) }
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('department', {})
              (
                <Select placeholder={formatMessage({ id: 'form.department.placeholder' })}>
                  {
                    Object.keys(departments).map(k => (
                      <Option value={k} key={k}>{departments[k]}</Option>
                    ))
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={ submitting }
              className={ styles.submit }
              type="primary"
              htmlType="submit">
              <FormattedMessage id="app.register.register"/>
            </Button>
            <Link className={ styles.login } to="/User/Login">
              <FormattedMessage id="app.register.sign-in"/>
            </Link>
          </FormItem>
        </Form>
      </div>);
  }
}

export default Register;
