import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button } from 'antd';
import Link from 'umi/link';
import Result from '@/components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/user/login">
      <Button size="large">
        <FormattedMessage id="app.register-result.back-home" />
      </Button>
    </Link>
  </div>
);

const RegisterResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        <FormattedMessage
          id="app.register-result.msg"
          values={{ account: location.state ? location.state.account : 'account' }}
        />
      </div>
    }
    description={formatMessage({ id: 'app.register-result.activation' })}
    actions={actions}
    style={{ marginTop: 56 }}
  />
);

export default RegisterResult;
