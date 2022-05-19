import React from 'react';
import { Button, InputNumber, Row, Col, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import IntlMessages from "../../util/IntlMessages";
import DatePicker from '../override/DatePicker';
/**
 * @param {buildDrodown} buildChild
 */
const buildFilter = buildChild => ({
  filterDropdown: props => (
    <div style={{ padding: 8 }}>
      <Space>
        <Button
          onClick={() => {
            props.setSelectedKeys([]);
            props.clearFilters();
          }}
          size='small'
          style={{ width: 90 }}
        >
          {<IntlMessages id='buttons.reset' />}
        </Button>
        <Button
          type='primary'
          onClick={() => props.confirm()}
          icon={<SearchOutlined />}
          size='small'
          style={{ width: 90 }}
        >
          {<IntlMessages id='buttons.search' />}
        </Button>
      </Space>
      <div style={{ marginTop: 8 }}>{buildChild(props)}</div>
    </div>
  ),
});
/**
 *
 * @param {import('antd/lib/table/interface').FilterDropdownProps} props
 */
const timeRange = ({ selectedKeys, setSelectedKeys }) => (
  <DatePicker.RangePicker
    defaultPickerValue={dayjs()}
    value={selectedKeys.map(v => (v ? dayjs(v) : undefined))}
    onChange={moments => {
      if (!moments) return;
      setSelectedKeys(moments.map(d => d.startOf('day').valueOf()));
    }}
  />
);
/**
 *
 * @param {import('antd/lib/table/interface').FilterDropdownProps} props
 */
const timePicker = ({ selectedKeys, setSelectedKeys }) => (<DatePicker
    defaultPickerValue={dayjs()}
    value={(selectedKeys[0] ? dayjs(selectedKeys[0]) : undefined)}
    onChange={moment => {
      if (!moment) return;
      setSelectedKeys([moment.startOf('day').valueOf()]);
    }}
  />
);
/**
 *
 * @param {import('antd/lib/table/interface').FilterDropdownProps} props
 */
const numRnage = ({ selectedKeys, setSelectedKeys }) => (
  <Row>
    <Col>
      <InputNumber
        value={selectedKeys[0] ?? null}
        placeholder={<IntlMessages id='formTip.min' />}
        onChange={v => setSelectedKeys([v, selectedKeys[1]])}
      />
    </Col>
    <Col span={1} />
    <Col>
      <InputNumber
        value={selectedKeys[1] ?? null}
        placeholder={<IntlMessages id='formTip.max' />}
        onChange={v => setSelectedKeys([selectedKeys[0], v])}
      />
    </Col>
  </Row>
);
const buildTimeRangeFilter = () => buildFilter(timeRange);
const buildTimePickerFilter = () => buildFilter(timePicker);
const buildNumRangeFiter = () => buildFilter(numRnage);

export { buildFilter, buildTimeRangeFilter, buildTimePickerFilter, buildNumRangeFiter };
/**
 *  @callback buildDrodown
 * @param {import('antd/lib/table/interface').FilterDropdownProps} props
 */
