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
class DevelopDaily extends Component {
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
        type: 'leaderDaily/addDevelopDaily',
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
          <FormItem label={'室内环境'}>
            {
              getFieldDecorator('workItem1', {
                rules: [{
                  required: true,
                  message: '选择室内环境完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'桌面环境'}>
            {
              getFieldDecorator('workItem2', {
                rules: [{
                  required: true,
                  message: '选择桌面环境完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'文件摆放'}>
            {
              getFieldDecorator('workItem3', {
                rules: [{
                  required: true,
                  message: '选择文件摆放完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'投入工作时间'}>
            {
              getFieldDecorator('workItem4', {
                rules: [{
                  required: true,
                  message: '选择投入工作时间完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'完成工作后的场所整理'}>
            {
              getFieldDecorator('workItem5', {
                rules: [{
                  required: true,
                  message: '选择工作完场所整理完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'工作时场所整理'}>
            {
              getFieldDecorator('workItem6', {
                rules: [{
                  required: true,
                  message: '选择工作时场所整理完成情况',
                }]
              })(
                this.renderSelect()
              )
            }
          </FormItem>
          <FormItem label={'日工作目标完成情况'}>
            {
              getFieldDecorator('workItem7', {
                rules: [{
                  required: true,
                  message: '选择日工作目标完成情况',
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
        <Row style={{color: '#aaa', marginTop: '16px'}}>
          <Col span={12} offset={4}>
            <strong>
              检查标准：
            </strong>
            <div>1、室内环境要求：地面整洁，窗台无灰尘，室内物品摆放有序、整齐；</div>
            <div>2、桌面环境要求：桌面无灰尘，无碎纸片等杂物；</div>
            <div>3、文件摆放要求：有序、整齐；</div>
            <div>4、工作态度要求：上班准时投入工作，下午下班离开前整理工位；</div>
            <div>5、工作习惯要求：工作时，工作现场有序、整洁，工作完成后现场整洁；</div>
            <div>6、工作量要求：按照周计划的日工作量统计；</div>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default DevelopDaily
