import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Select, Button, Row, Col } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ daily }) => ({ daily }))
@Form.create()
class FinanceDaily extends Component {
  state = {
    date: moment().format('YYYY-MM-DD'),
  };

  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { date } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      const data = fieldsValue;
      data.date = date;
      dispatch({
        type: 'daily/addFinanceDaily',
        payload: data,
      });
    });
  };

  renderSelect = keyNum => {
    const keys = ['合格:√', '不合格:×', '未上班:○', '出差:☐', '其他:▽'];
    return (
      <Select placeholder="选择完成项">
        {keys.slice(0, keyNum).map((text, index) => (
          <Option value={index + 1} key={index + 1}>
            {text}
          </Option>
        ))}
      </Select>
    );
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
          <FormItem label="工作计划">
            {getFieldDecorator('workItem1', {
              rules: [
                {
                  required: true,
                  message: '选择工作计划完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="临时工作">
            {getFieldDecorator('workItem2', {
              rules: [
                {
                  required: true,
                  message: '选择临时工作完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="办公室卫生清洁无死角">
            {getFieldDecorator('workItem3', {
              rules: [
                {
                  required: true,
                  message: '选择办公室卫生清洁完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="办公物品分类整齐摆放">
            {getFieldDecorator('workItem4', {
              rules: [
                {
                  required: true,
                  message: '选择办公物品分类完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="明日计划">
            {getFieldDecorator('workItem5', {
              rules: [
                {
                  required: true,
                  message: '选择明日计划完成情况',
                },
              ],
            })(this.renderSelect())}
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
    );
  }
}

export default FinanceDaily;
