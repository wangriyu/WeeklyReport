import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, Button, Row, Col } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ leaderDaily, loading }) => ({
  leaderDaily,
  loading: loading.models.leaderDaily
}))
@Form.create()
class MarketingDaily extends Component {
  state = {
    date: moment().format('YYYY-MM-DD')
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      fieldsValue['date'] = this.state.date;
      dispatch({
        type: 'leaderDaily/addMarketingDaily',
        payload: fieldsValue
      })
    });
  };

  renderSelect = (keyNum) => {
    let keys = ['合格:√', '不合格:×', '未上班:○', '出差:☐', '其他:▽'];
    return (
      <Select placeholder='选择完成项'>
        {
          keys.slice(0, keyNum).map((text, index) => <Option value={index+1} key={index+1}>{text}</Option>)
        }
      </Select>
    )
  };

  render() {
    const { form } = this.props;
    const { date } = this.state;
    const { getFieldDecorator } = form;
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

    return (
      <Card>
        <Row type="flex" align="middle">
          <Col span={6} offset={4}>
            <h3>{date}</h3>
          </Col>
        </Row>
        <Form {...formItemLayout}>
          <FormItem label={'卫生'}>
            {
              getFieldDecorator('hygiene', {
                rules: [{
                  required: true,
                  message: '选择卫生完成情况',
                }]
              })(
                this.renderSelect(4)
              )
            }
          </FormItem>
          <FormItem label={'晨会'}>
            {
              getFieldDecorator('meeting', {
                rules: [{
                  required: true,
                  message: '选择晨会完成情况',
                }]
              })(
                this.renderSelect(4)
              )
            }
          </FormItem>
          <FormItem label={'工作'}>
            {
              getFieldDecorator('work', {
                rules: [{
                  required: true,
                  message: '选择工作完成情况',
                }]
              })(
                this.renderSelect(4)
              )
            }
          </FormItem>
          <Row>
            <Col span={6} offset={4}>
              <Button type="primary" onClick={this.handleSubmit}>
                提交
              </Button>
            </Col>
          </Row>
        </Form>
        <Row style={{color: '#aaa', marginTop: '16px'}}>
          <Col span={12} offset={4}>
            <strong>
              检查标准：
            </strong>
            <div>1.卫生：工位、窗台摆放有序，干净整洁；地面清洁；</div>
            <div>2.晨会：是否定时召开，准时参加；</div>
            <div>3.工作：是否满足每天3个有质量沟通，客户档案是否及时归档</div>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default MarketingDaily
