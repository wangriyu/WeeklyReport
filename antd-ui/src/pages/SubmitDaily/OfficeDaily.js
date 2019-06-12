import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Select, Button, Row, Col } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ daily }) => ({ daily }))
@Form.create()
class OfficeDaily extends Component {
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
        type: 'daily/addOfficeDaily',
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
          <FormItem label="办公室环境卫生情况">
            {getFieldDecorator('workItem1', {
              rules: [
                {
                  required: true,
                  message: '选择办公室环境卫生完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="对各部门协助情况">
            {getFieldDecorator('workItem2', {
              rules: [
                {
                  required: true,
                  message: '选择各部门协助完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="文件是否及时整理归档">
            {getFieldDecorator('workItem3', {
              rules: [
                {
                  required: true,
                  message: '选择文件整理归档完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="日计划、日总结">
            {getFieldDecorator('workItem4', {
              rules: [
                {
                  required: true,
                  message: '选择日计划、日总结完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="周计划、周总结">
            {getFieldDecorator('workItem5', {
              rules: [
                {
                  required: true,
                  message: '选择周计划、周总结完成情况',
                },
              ],
            })(this.renderSelect())}
          </FormItem>
          <FormItem label="月计划、月总结">
            {getFieldDecorator('workItem6', {
              rules: [
                {
                  required: true,
                  message: '选择月计划、月总结完成情况',
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

export default OfficeDaily;
