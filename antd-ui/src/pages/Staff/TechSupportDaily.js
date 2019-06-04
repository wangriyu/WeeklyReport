import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, Button, Row, Col } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ staffDaily, loading }) => ({
  staffDaily,
  loading: loading.models.staffDaily
}))
@Form.create()
class TechSupportDaily extends Component {
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
        type: 'staffDaily/addTechSupportDaily',
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
          <FormItem label={'办公室物品摆放整齐'}>
            {
              getFieldDecorator('workItem1', {
                rules: [{
                  required: true,
                  message: '选择物品摆放完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'办公环境卫生整洁'}>
            {
              getFieldDecorator('workItem2', {
                rules: [{
                  required: true,
                  message: '选择卫生完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'例行晨会'}>
            {
              getFieldDecorator('workItem3', {
                rules: [{
                  required: true,
                  message: '选择晨会完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'技术方案资料及时备案'}>
            {
              getFieldDecorator('workItem4', {
                rules: [{
                  required: true,
                  message: '选择技术方案资料完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'按照既定流程制定方案'}>
            {
              getFieldDecorator('workItem5', {
                rules: [{
                  required: true,
                  message: '选择流程制定方案完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'今日事今日毕'}>
            {
              getFieldDecorator('workItem6', {
                rules: [{
                  required: true,
                  message: '选择今日工作完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'下班前断电、熄灯'}>
            {
              getFieldDecorator('workItem7', {
                rules: [{
                  required: true,
                  message: '选择断电熄灯完成情况',
                }]
              })(
                this.renderSelect()
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
      </Card>
    )
  }
}

export default TechSupportDaily
