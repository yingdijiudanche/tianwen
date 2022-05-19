import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { message, Form, Input, Button, Card, Select, DatePicker, Switch, Row, Col, Divider } from 'antd';
import { injectIntl } from "react-intl";
import {
  PlusOutlined,
  MinusCircleOutlined
} from "@ant-design/icons";

import api from '../../api/driver';
import adminApi from '../../api/admin';

const Item = Form.Item;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { span: 8, offset: 4 },
};
const mr4 = { marginRight: "4%" };
const span20 = { span: 20 };

const Modify = ({ location, history, intl }) => {
  const { editData } = location.state || {};
  const [adminOptions, setAdminOptions] = useState([]);
  const [classDisabled, setClassDisabled] = useState(false);
  const isEdit = editData !== undefined;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit) {
      const data = {
        ...editData,
        authDate: dayjs(editData.authDate),
        leaveRecord: editData.leaveRecord && editData.leaveRecord.map(item => {
          return {
            leaveDate: dayjs(item.leaveDate)
          }
        })
      }
      form.setFieldsValue(data);
    }

    adminApi
      .getDriverOptions(isEdit ? editData.adminId : 'n')
      .then(res => setAdminOptions(res));
    //eslint-disable-next-line
  }, []);

  const onTypeChange = e => {
    if (e !== 1 && e !== 2) {
      setClassDisabled(true);
      form.setFieldsValue({
        class: false
      });
    } else {
      setClassDisabled(false);
    }
  }

  const onFinish = async values => {
    let res = isEdit ? await api.edit(editData._id, values) : await api.add(values);
    if (res.code) return message.error(res.msg);
    message.success(res.msg);
    history.goBack();
  };

  return <Card className="gx-card" title={intl.formatMessage({ id: 'driver.form' }, { control: isEdit ? "Edit" : "Create" })}>
    <Form {...layout} form={form} name='driver' onFinish={onFinish} autoComplete="off">
      <Item label={intl.formatMessage({ id: 'driver.nameEN' })} name='nameEN' rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item label={intl.formatMessage({ id: 'driver.nameCH' })} name='nameCH' rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item label={intl.formatMessage({ id: 'driver.email' })} name='email' rules={[{ required: true }]}>
        <Input type="email" />
      </Item>
      <Item label={intl.formatMessage({ id: 'driver.staffID' })} name='staffID'>
        <Input />
      </Item>
      <Item label={intl.formatMessage({ id: 'driver.authDate' })} name='authDate' rules={[{ required: true }]}>
        <DatePicker />
      </Item>
      <Item label={intl.formatMessage({ id: 'driver.type' })} name='type' rules={[{ required: true }]}>
        <Select options={[{ label: 'Private Car', value: 1 }, { label: 'Light Goods Vehicle (Permitted gross vehicle weight not exceeding 5.5 tonnes)', value: 2 }, { label: 'Medium Goods Vehicle', value: 18 }, { label: 'Heavy Goods Vehicle', value: 19 }, { label: 'Special Purpose Vehicle', value: 21 }]} onChange={onTypeChange} />
      </Item>
      <Item label={intl.formatMessage({ id: 'driver.admin' })} name='adminId' rules={[{ required: true }]}>
        <Select options={adminOptions} />
      </Item>
      <Item label={intl.formatMessage({ id: 'driver.automaticTransmission' })} name='class' valuePropName='checked' initialValue={false}>
        <Switch checkedChildren='Yes' unCheckedChildren='No' disabled={classDisabled} />
      </Item>
      <Divider orientation="left">{intl.formatMessage({ id: 'driver.leaveRecord' })}</Divider>
      <Form.List name="leaveRecord">
        {(fields, { add, remove }) => {
          return (
            <Card>
              {buildLeaveRecordItems(fields, add, remove)}
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


function buildLeaveRecordItems(fields, add, remove, key) {
  return (
    <Row key={key}>
      {fields.map((field, i) => (
        <Col span={4} style={mr4} key={field.key}>
          <Row>
            <Col span={span20.span}>
              <Item
                name={[field.name, "leaveDate"]}
                fieldKey={[field.fieldKey, "leaveDate"]}
                wrapperCol={span20}
                rules={[{ required: true, message: "Please input leave's.", }]}
              >
                <DatePicker />
              </Item>
            </Col>
            {i === 0 ? null : (<Col span={3}>
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