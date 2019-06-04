import React, { Component } from 'react';
import { connect }          from 'dva';
import { Card }             from 'antd';
import MarketingDaily       from './MarketingDaily';
import TechSupoortDaily     from './TechSupportDaily';
import AfterSaleDaily       from './AfterSaleDaily';
import DevelopDaily         from './DevelopDaily';
import ProductDaily         from './ProductDaily';
import OfficeDaily          from './OfficeDaily';
import FinanceDaily         from './FinanceDaily';

@connect(({ leaderDaily, user }) => ({ leaderDaily, user }))
class DailyWork extends Component {
  renderBody = (department) => {
    switch(department) {
      case 'marketing':
        return <MarketingDaily />;
      case 'techSupport':
        return <TechSupoortDaily />;
      case 'afterSale':
        return <AfterSaleDaily />;
      case 'develop':
        return <DevelopDaily />;
      case 'product':
        return <ProductDaily />;
      case 'office':
        return <OfficeDaily />;
      case 'finance':
        return <FinanceDaily />;
      default:
        return <Card>Not found</Card>
    }
  };

  render() {
    const { user } = this.props;

    return this.renderBody(user.currentUser.department)
  }
}

export default DailyWork
