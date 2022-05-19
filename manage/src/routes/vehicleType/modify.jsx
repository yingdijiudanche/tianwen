import React, { useEffect } from "react";
import { message, Form, Input, Button, Card } from 'antd';
import { injectIntl } from "react-intl";

import api from '../../api/vehicleType';

const Item = Form.Item;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { span: 8, offset: 4 },
};

const Modify = ({ location, history, intl }) => {
  const { editData } = location.state || {};

  const isEdit = editData !== undefined;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(editData);
    }
    //eslint-disable-next-line
  }, []);

  const onFinish = async values => {
    let res = isEdit ? await api.edit(editData._id, values) : await api.add(values);
    if (res.code) return message.error(res.msg);
    message.success(res.msg);
    history.goBack();
  };

  return <Card className="gx-card" title={intl.formatMessage({ id: 'vehicleType.form' }, { control: isEdit ? "Edit" : "Create" })}>
    <Form {...layout} form={form} name='vehicleType' onFinish={onFinish} autoComplete="off">
      <Item label={intl.formatMessage({ id: 'vehicleType.type' })} name='type' rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item label={intl.formatMessage({ id: 'vehicleType.mileagePerMonth' })} name='mileagePerMonth'>
        <Input type="number" />
      </Item>
      <Item label={intl.formatMessage({ id: 'vehicleType.averageMileage' })} name='averageMileage'>
        <Input type="number" />
      </Item>
      <Item label={intl.formatMessage({ id: 'vehicleType.minMoneyPerKM' })} name='minMoneyPerKM'>
        <Input type="number" />
      </Item>
      <Item label={intl.formatMessage({ id: 'vehicleType.maxMoneyPerKM' })} name='maxMoneyPerKM'>
        <Input type="number" />
      </Item>
      <Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          {intl.formatMessage({ id: 'buttons.submit' })}
        </Button>
      </Item>
    </Form>
  </Card>
}

export default injectIntl(Modify);