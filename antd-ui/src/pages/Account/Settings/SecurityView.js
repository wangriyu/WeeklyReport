import React, { Component }                from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  Button, Input, Form, Popover, Progress,
} from 'antd';
import styles                              from './BaseView.less';
import { connect }                         from 'dva';

const FormItem = Form.Item;
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

@connect(({ user, loading }) => ({
  user: user,
  loading: loading.models.user
}))
@Form.create()
class SecurityView extends Component {
  state = {
    confirmDirty: false,
    help: '',
    visible: false,
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPass');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPass');
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

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPass')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    const oldPass = this.props.form.getFieldValue('oldPass');

    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else if (value === oldPass) {
      this.setState({
        help: formatMessage({ id: 'validation.password.same-as-old' }),
        visible: !!value,
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

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      dispatch({
        type: 'user/changePass',
        payload: fieldsValue
      })
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { help, visible } = this.state;

    return (
      <div className={styles.baseView}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label={'原密码'}>
              {
                getFieldDecorator('oldPass', {
                  rules: [{
                    required: true,
                    message: formatMessage({ id: 'validation.phone-number.required' }),
                  }],
                })(
                  <Input size="large" type="password" placeholder={ formatMessage({ id: 'form.change-password.placeholder' }) }/>
                )
              }
            </FormItem>
            <FormItem help={ help } label={'新密码'}>
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
                visible={ visible }>
                {
                  getFieldDecorator('newPass', {
                    rules: [{
                      validator: this.checkPassword,
                    }],
                  })(
                    <Input
                      size="large"
                      type="password"
                      placeholder={ formatMessage({ id: 'form.change-password.placeholder' }) }
                    />
                  )
                }
              </Popover>
            </FormItem>
            <FormItem label={'确认密码'}>
              {
                getFieldDecorator('confirm', {
                  rules: [{
                    required: true,
                    message: formatMessage({ id: 'validation.confirm-password.required' }),
                  }, {
                    validator: this.checkConfirm,
                  }],
                })(
                  <Input
                    size="large"
                    type="password"
                    placeholder={ formatMessage({ id: 'form.confirm-password.placeholder' }) }
                    onBlur={this.handleConfirmBlur}
                  />
                )
              }
            </FormItem>
            <Button type="primary" onClick={this.handleSubmit}>
              <FormattedMessage
                id="app.settings.password.update"
                defaultMessage="Change PassWord"
              />
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default SecurityView;
