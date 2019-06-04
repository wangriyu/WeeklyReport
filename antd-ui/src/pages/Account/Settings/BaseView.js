import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Button, DatePicker } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import moment from 'moment';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user
}))
@Form.create()
class BaseView extends Component {
  getViewDom = ref => {
    this.view = ref;
  };

  handleSubmit = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      fieldsValue['joinDate'] = fieldsValue.joinDate.format('YYYY-MM-DD');
      dispatch({
        type: 'user/changeInfo',
        payload: fieldsValue
      })
    })
  };

  render() {
    const { form, currentUser } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label={'账户名'}>
              {
                form.getFieldDecorator('nickname', {
                  initialValue: currentUser['nickname'],
                  rules: [{
                    required: true,
                    message: formatMessage({ id: 'validation.nickname.required' }),
                  }, {
                    max: 15,
                    message: formatMessage({ id: 'validation.nickname.overflow' }),
                  }],
                })(
                  <Input size="large" placeholder={ formatMessage({ id: 'form.nickname.placeholder' }) }/>
                )
              }
            </FormItem>
            <Form.Item label={'姓名'} style={ { marginBottom: 0 } }>
              <FormItem style={ { display: 'inline-block' } }>
                {
                  form.getFieldDecorator('name', {
                    initialValue: currentUser['name'],
                    rules: [{
                      required: true,
                      message: formatMessage({ id: 'validation.name.required' }),
                    }],
                  })(
                    <Input size="large" placeholder={ formatMessage({ id: 'form.name.placeholder' }) }/>
                  )
                }
              </FormItem>
              <FormItem style={ { display: 'inline-block', marginLeft: '5px' } }>
                {
                  form.getFieldDecorator('joinDate', {
                    initialValue: moment(currentUser['joinDate'], 'YYYY-MM-DD'),
                    rules: [{
                      type: 'object',
                      required: true,
                      message: formatMessage({ id: 'validation.joinDate.required' }),
                    }],
                  })(
                    <DatePicker size="large" placeholder={ formatMessage({ id: 'form.joinDate.placeholder' }) }/>
                  )
                }
              </FormItem>
            </Form.Item>
            <FormItem label={'手机'}>
              {
                form.getFieldDecorator('mobile', {
                  initialValue: currentUser['mobile'],
                  rules: [{
                    required: true,
                    message: formatMessage({ id: 'validation.phone-number.required' }),
                  }, {
                    pattern: /^\d{11}$/,
                    message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                  }],
                })(
                  <Input size="large" placeholder={ formatMessage({ id: 'form.phone-number.placeholder' }) }/>
                )
              }
            </FormItem>
            <FormItem label={'邮箱'}>
              {
                form.getFieldDecorator('mail', {
                  initialValue: currentUser['mail'],
                  rules: [{
                    required: true,
                    message: formatMessage({ id: 'validation.email.required' }),
                  }, {
                    type: 'email',
                    message: formatMessage({ id: 'validation.email.wrong-format' }),
                  }],
                })(
                  <Input size="large" placeholder={ formatMessage({ id: 'form.email.placeholder' }) }/>
                )
              }
            </FormItem>
            <Button type="primary" onClick={this.handleSubmit}>
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default BaseView;
