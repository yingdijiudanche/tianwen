import React, { useEffect, useState } from 'react';
import { Card, Radio, Form, Button, message } from 'antd';
import styled from "styled-components"
import { injectIntl } from "react-intl";

import api from '../../api/spare'

const Item = Form.Item;

const Expand = styled.div`
    flex:1;
    margin: 24px;
    &>div+div{
        margin-top:15px;
    }
`
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { span: 8, offset: 1 },
};

const Spare = ({ location, history, intl }) => {
  const { permitId } = location.state;
  const [plainOptions, setPlainOptions] = useState([]);
  const [ln, setLN] = useState();
  useEffect(() => {
    api.getAll().then(res => {
      setPlainOptions(res.map(m => {
        return { label: m.licenceNumber, value: `${m.licenceNumber},${m._id}`, disabled: m.spareUsed };
      }))
    })
  }, [])

  const [form] = Form.useForm();

  const onChange = e => {
    setLN(e.target.value);
  }

  const onFinish = async () => {
    let res = await api.add({
      permitId,
      licenceNumber: ln.split(',')[0],
      vehicleId: ln.split(',')[1]
    })
    if (res.code) return message.error(res.msg);
    message.success('Successfully');
    history.goBack()
  }
  return (
    <Card className="gx-card" title={intl.formatMessage({ id: 'booking.sqareCard' })}>
      <Form {...layout} form={form} name='spare' onFinish={onFinish}>
        <Expand>
          <Radio.Group options={plainOptions} onChange={onChange} value={ln} />
        </Expand>
        <Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {intl.formatMessage({ id: 'buttons.submit' })}
          </Button>
        </Item>
      </Form>
    </Card>
  );
}

export default injectIntl(Spare);