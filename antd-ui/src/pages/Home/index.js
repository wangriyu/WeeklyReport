import React, { Component } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { Card } from 'antd';

@connect(({ user }) => ({
  user
}))

class Home extends Component {
  render() {
    const { user } = this.props;
    return (
      <Card>
        <FormattedMessage
          id="app.home.introduce"
        />
      </Card>
    )
  }
}

export default Home
