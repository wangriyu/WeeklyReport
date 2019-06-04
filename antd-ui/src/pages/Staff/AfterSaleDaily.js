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
class AfterSaleDaily extends Component {
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
        type: 'staffDaily/addAfterSaleDaily',
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
          <FormItem label={'物品摆放整齐'}>
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
          <FormItem label={'环境卫生整洁'}>
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
          <FormItem label={'售后工作是否按时汇报工作情况'}>
            {
              getFieldDecorator('workItem4', {
                rules: [{
                  required: true,
                  message: '选择按时汇报工作完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'施工工艺符合规范'}>
            {
              getFieldDecorator('workItem5', {
                rules: [{
                  required: true,
                  message: '选择施工工艺规范完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'工作设备、工具处于正常状态'}>
            {
              getFieldDecorator('workItem6', {
                rules: [{
                  required: true,
                  message: '选择工作设备、工具状态检查完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'文件、记录完整'}>
            {
              getFieldDecorator('workItem7', {
                rules: [{
                  required: true,
                  message: '选择文件、记录检查完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'记录工作记录'}>
            {
              getFieldDecorator('workItem8', {
                rules: [{
                  required: true,
                  message: '选择工作记录完成情况',
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

export default AfterSaleDaily
