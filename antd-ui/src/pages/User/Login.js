import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Alert } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  renderMessage = content => (<Alert style={ { marginBottom: 24 } } message={ content } type="error" showIcon/>);

  render () {
    const { login, submitting } = this.props;
    return (<div className={ styles.main }>
        <Login
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}>
          {
            (login.status === 'error' || login.status === 'failed') && !submitting && this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))
          }
          <UserName
            name="nickname"
            placeholder={ `${formatMessage({ id: 'app.login.nickname' })}: guest` }
            rules={[{
              required: true, message: formatMessage({ id: 'validation.nickname.required' }),
            }]}
          />
          <Password
            name="password"
            placeholder={ `${formatMessage({ id: 'app.login.password' })}: guest` }
            rules={ [{
              required: true, message: formatMessage({ id: 'validation.password.required' }),
            }] }
            onPressEnter={e => {
              e.preventDefault();
              this.loginForm.validateFields(this.handleSubmit);
            }}
          />
          <Submit loading={ submitting }>
            <FormattedMessage id="app.login.login"/>
          </Submit>
          <div className={ styles.other }>
            <Link className={ styles.register } to="/user/register">
              <FormattedMessage id="app.login.signup"/>
            </Link>
          </div>
        </Login>
      </div>);
  }
}

export default LoginPage;
