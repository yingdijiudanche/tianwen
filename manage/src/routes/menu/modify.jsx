import React, { useState, useEffect } from "react";
import { message, Form, Input, Button, Select, Card, Switch } from 'antd';
import { injectIntl } from "react-intl";

import api from '../../api/menu';

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
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const initMenus = async () => {
      let res = await api.options();
      if (res.code) return message.error(res.msg);
      setMenus(res.data);
    };
    initMenus();
    if (isEdit) {
      form.setFieldsValue(editData);
    }
    //eslint-disable-next-line
  }, []);

  const onFinish = async values => {
    if (!values.hidden) values.hidden = false;
    let res = isEdit ? await api.edit(editData._id, values) : await api.add(values);
    if (res.code) return message.error(res.msg);
    message.success(res.msg);
    history.goBack();
  };

  return <Card className="gx-card" title={intl.formatMessage({ id: 'menu.form' }, { control: isEdit ? "Edit" : "Create" })}>
    <Form {...layout} form={form} name='menu' onFinish={onFinish} autoComplete="off">
      <Item label={intl.formatMessage({ id: 'menu.pid' })} name='pid'>
        <Select placeholder={intl.formatMessage({ id: 'placeholder.selector' })} options={menus}>
        </Select>
      </Item>
      <Item label={intl.formatMessage({ id: 'menu.name' })} name='name' rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item label={intl.formatMessage({ id: 'menu.path' })} name='path' rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item label={intl.formatMessage({ id: 'menu.icon' })} name='icon'>
        <Input />
      </Item>
      <Item label={intl.formatMessage({ id: 'menu.sort' })} name='sort' rules={[{ required: true }]}>
        <Input type="number" />
      </Item>
      <Item label={intl.formatMessage({ id: 'menu.component' })} name='component'>
        <Input />
      </Item>
      <Item label={intl.formatMessage({ id: 'menu.hidden' })} name='hidden' valuePropName="checked">
        <Switch />
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