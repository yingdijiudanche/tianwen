import React from 'react';
import { Table, Card, Select } from 'antd';
import dayjs from 'dayjs';

import api from '../../../api/inout';
import useListPage from '../../../hook/useListPage';
import useSearchColumn from '../../../hook/useSearchColumn';
import IntlMessages from "../../../util/IntlMessages";
import { buildFilter, buildTimeRangeFilter } from '../../../components/Table/tableHelp';

const Status = {
  0: 'normal',
  1: 'abnormal',
  2: 'error',
};

const InoutType = {
  0: 'driver',
  1: 'visitor',
  2: 'other',
}

/**@return {import('../../../components/tableHelp').buildDrodown} */
const buildEventSelect =
  () =>
    ({ selectedKeys, setSelectedKeys, confirm }) => {
      return (
        <Select
          options={[{ label: "IN", value: "IN" }, { label: "OUT", value: "OUT" }]}
          style={{ width: '100%' }}
          value={selectedKeys}
          onSelect={v => {
            setSelectedKeys([v]);
            confirm();
          }}
          placeholder='Click to select'
        />
      );
    };

/**@return {import('../../../components/tableHelp').buildDrodown} */
const buildStatusSelect =
  () =>
    ({ selectedKeys, setSelectedKeys, confirm }) => {
      return (
        <Select
          options={[{ label: "normal", value: "0" }, { label: "abnormal", value: "1" }, { label: "error", value: "2" }]}
          style={{ width: '100%' }}
          value={selectedKeys}
          onSelect={v => {
            setSelectedKeys([v]);
            confirm();
          }}
          placeholder='Click to select'
        />
      );
    };

/**@return {import('../../../components/tableHelp').buildDrodown} */
const buildTypeSelect =
  () =>
    ({ selectedKeys, setSelectedKeys, confirm }) => {
      return (
        <Select
          options={[{ label: "driver", value: "0" }, { label: "visitor", value: "1" }, { label: "other", value: "2" }]}
          style={{ width: '100%' }}
          value={selectedKeys}
          onSelect={v => {
            setSelectedKeys([v]);
            confirm();
          }}
          placeholder='Click to select'
        />
      );
    };

const Inout = () => {
  const { dataState, handleTableChange, cachedParams } = useListPage(api);

  /**@type {import('antd/lib/table').ColumnsType} */
  const columns = [
    {
      title: <IntlMessages id='inout.event' />,
      dataIndex: 'event',
      key: '~event',
      filteredValue: cachedParams['~event'],
      ...buildFilter(buildEventSelect()),
    },
    {
      title: <IntlMessages id='inout.status' />,
      dataIndex: 'status',
      key: 'status',
      render: t => Status[t],
      filteredValue: cachedParams['status'],
      ...buildFilter(buildStatusSelect()),
    },
    {
      title: <IntlMessages id='inout.type' />,
      dataIndex: 'type',
      key: 'type',
      render: t => InoutType[t],
      filteredValue: cachedParams['type'],
      ...buildFilter(buildTypeSelect()),
    },
    {
      title: <IntlMessages id='inout.licenceNumber' />,
      dataIndex: 'licenceNumber',
      key: '~licenceNumber',
      filteredValue: cachedParams['~licenceNumber'],
      ...useSearchColumn('licenceNumber'),
    },
    {
      title: <IntlMessages id='inout.msg' />,
      dataIndex: 'msg',
      key: '~msg',
      filteredValue: cachedParams['~msg'],
      ...useSearchColumn('msg'),
    },
    {
      title: <IntlMessages id='inout.scanningTime' />,
      dataIndex: 'scanningTime',
      key: '#scanningTime',
      sorter: true,
      sortOrder: cachedParams["sort"]?.scanningTime,
      render: t => dayjs(t).format('YYYY-MM-DD HH:mm'),
      filteredValue: cachedParams['#scanningTime'],
      ...buildTimeRangeFilter(),
    },
    {
      title: <IntlMessages id='inout.passingTime' />,
      dataIndex: 'passingTime',
      key: '#passingTime',
      sorter: true,
      sortOrder: cachedParams["sort"]?.passingTime,
      render: t => dayjs(t).format('YYYY-MM-DD HH:mm'),
      filteredValue: cachedParams['#passingTime'],
      ...buildTimeRangeFilter(),
    },
    {
      title: <IntlMessages id='inout.driver' />,
      dataIndex: 'permit',
      render: permit => {
        if (permit && permit.type === 1) {
          return permit.admin.driverName
        }
      }
    },
  ];

  return <Card title={<IntlMessages id='table.list' values={{ menu: 'In Out' }} />}>
    <Table
      {...dataState}
      className="gx-table-responsive"
      columns={columns}
      rowKey='_id'
      onChange={handleTableChange}
    />
  </Card>
}

export default Inout;