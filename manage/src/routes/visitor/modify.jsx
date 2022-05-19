import React, { useState, useEffect } from "react";
import { message, Form, Input, Button, Select, Card, DatePicker, Divider, Row, Col, TimePicker } from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined
} from "@ant-design/icons";
import { injectIntl } from "react-intl";
import dayjs from 'dayjs';

import api from '../../api/visitor';
import contractingBusinessDeptApi from '../../api/contractingBusinessDept';

const Item = Form.Item;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { span: 8, offset: 4 },
};
const mr4 = { marginRight: "4%" };
const span10 = { span: 10 };
const span24 = { span: 24 };

const Modify = ({ location, history, intl }) => {
  const { editData } = location.state || {};
  const [deptOptions, setDeptOptions] = useState([]);

  const isEdit = editData !== undefined;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit) {
      const data = {
        ...editData,
        visitDate: dayjs(editData.visitDate),
        timeEst: editData.timeEst.map(dayjs),
      }
      form.setFieldsValue(data);
    }
    contractingBusinessDeptApi
      .getOptions()
      .then(res => setDeptOptions(res))
    //eslint-disable-next-line
  }, []);

  const onFinish = async values => {
    let data = values;
    let res = isEdit ? await api.edit(editData._id, data) : await api.add(data);
    if (res.code) return message.error(res.msg);
    message.success(res.msg);
    history.goBack();
  };

  return <Card className="gx-card" title={intl.formatMessage({ id: 'visitor.form' }, { control: isEdit ? "Edit" : "Create" })}>
    <Form form={form}
      {...layout}
      name='visitor'
      onFinish={onFinish}
      autoComplete="off"
    >
      <Item label={intl.formatMessage({ id: 'visitor.companyName' })} name='companyName' rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item label={intl.formatMessage({ id: 'visitor.fullName' })} name='fullName' rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item label={intl.formatMessage({ id: 'visitor.admissionNoticeEmail' })} name='admissionNoticeEmail' rules={[{ required: true }]}>
        <Input type="email" />
      </Item>
      <Item label={intl.formatMessage({ id: 'visitor.contactPerson' })} name='contactPerson' rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item label={intl.formatMessage({ id: 'visitor.contactingDepartment' })} name='contactingDepartmentId' rules={[{ required: true }]}>
        <Select options={deptOptions} />
      </Item>
      <Item label={intl.formatMessage({ id: 'visitor.visitDate' })} name='visitDate' rules={[{ required: true }]}>
        <DatePicker format="YYYY-MM-DD" />
      </Item>
      <Item label={intl.formatMessage({ id: 'visitor.timeEst' })} name='timeEst' rules={[{ required: true }]}>
        <TimePicker.RangePicker placeholder={[intl.formatMessage({ id: 'visitor.arrvialTime' }), intl.formatMessage({ id: 'visitor.departureTime' })]} />
      </Item>
      <Divider orientation="left">{intl.formatMessage({ id: 'visitor.carPlateNos' })}</Divider>
      <Form.List name="carPlateNos" initialValue={[{ licenceNumber: '', email: '' }]}>
        {(fields, { add, remove }) => {
          return (
            <Card>
              {buildLicenceItems(fields, add, remove)}
            </Card>
          );
        }}
      </Form.List>
      <Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          {intl.formatMessage({ id: 'buttons.submit' })}
        </Button>
      </Item>
    </Form>
  </Card>
}

function buildLicenceItems(fields, add, remove, key) {
  return (
    <Row key={key}>
      {fields.map((field, i) => (
        <Col span={10} style={mr4} key={field.key}>
          <Row>
            <Col span={span10.span}>
              <Item
                name={[field.name, "licenceNumber"]}
                fieldKey={[field.fieldKey, "licenceNumber"]}
                wrapperCol={span24}
                rules={[{ required: true, message: "Please input number's.", }]}
              >
                <Input placeholder="licence number" />
              </Item>
            </Col>
            <Col span={span10.span}>
              <Item
                name={[field.name, "email"]}
                fieldKey={[field.fieldKey, "email"]}
                wrapperCol={span24}
                rules={[{ required: true, message: "Please input email's.", }]}
              >
                <Input placeholder="email" type="email" />
              </Item>
            </Col>
            {i === 0 ? null : (<Col span={4}>
              <Button danger type="text" onClick={() => remove(field.name)}>
                <MinusCircleOutlined />
              </Button>
            </Col>)}
          </Row>
        </Col>
      ))}
      <Col span={2}>
        <Button block icon={<PlusOutlined />} onClick={() => add()} />
      </Col>
    </Row>
  );
}

export default injectIntl(Modify);