import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Select, Button, Row, Col } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ daily }) => ({ daily }))
@Form.create()
class ProductDaily extends Component {
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
        type: 'daily/addProductDaily',
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
          <FormItem label="生产现场是否清洁">
            {getFieldDecorator('workItem1', {
              rules: [
                {
                  required: true,
                  message: '选择生产现场清洁完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="物料摆放是否整齐">
            {getFieldDecorator('workItem2', {
              rules: [
                {
                  required: true,
                  message: '选择物料摆放完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="是否按规定工艺流程生产">
            {getFieldDecorator('workItem3', {
              rules: [
                {
                  required: true,
                  message: '选择工艺流程生产规范完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="是否记录每日的工作内容">
            {getFieldDecorator('workItem4', {
              rules: [
                {
                  required: true,
                  message: '选择每日的工作内容记录完成情况',
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

export default ProductDaily;
