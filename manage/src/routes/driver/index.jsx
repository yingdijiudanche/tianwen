import React from 'react';
import { Table, Card } from 'antd';
import dayjs from 'dayjs';

import api from '../../api/driver';
import useListPage from '../../hook/useListPage';
import useSearchColumn from '../../hook/useSearchColumn';
import IntlMessages from "../../util/IntlMessages";
import { AddBtn, DangerBtn, ModifyBtn } from '../../components/styled/operateBtns';

const DriverType = {
  1: 'Private Car',//考2可加簽1
  2: 'Light Goods Vehicle',//考18可加簽2
  18: 'Medium Goods Vehicle',//考19可加簽2/18
  19: 'Heavy Goods Vehicle',
  21: 'Special Purpose Vehicle',
};

const Driver = () => {
  const { dataState, handleTableChange, deleOne, cachedParams } = useListPage(api);

  /**@type {import('antd/lib/table').ColumnsType} */
  const columns = [
    {
      title: <IntlMessages id='table.operation' />,
      dataIndex: 'sort',
      key: 'operation',
      render: (_, data) => {
        return (
          <div style={{ display: 'flex' }}>
            <ModifyBtn carry={{ editData: data }} />
            <DangerBtn onConfirm={deleOne(data._id)} />
          </div>
        );
      },
    },
    {
      title: <IntlMessages id='driver.nameEN' />,
      dataIndex: 'nameEN',
      key: '~nameEN',
      filteredValue: cachedParams['~nameEN'],
      ...useSearchColumn('nameEN'),
    },
    {
      title: <IntlMessages id='driver.nameCH' />,
      dataIndex: 'nameCH',
      key: '~nameCH',
      filteredValue: cachedParams['~nameCH'],
      ...useSearchColumn('nameCH'),
    },
    {
      title: <IntlMessages id='driver.email' />,
      dataIndex: 'email',
      key: '~email',
      filteredValue: cachedParams['~email'],
      ...useSearchColumn('email'),
    },
    {
      title: <IntlMessages id='driver.staffID' />,
      dataIndex: 'staffID',
      key: '~staffID',
    },
    {
      title: <IntlMessages id='driver.authDate' />,
      dataIndex: 'authDate',
      key: '~authDate',
      render: t => dayjs(t).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: <IntlMessages id='driver.type' />,
      dataIndex: 'type',
      key: '~type',
      render: t => DriverType[t]
    },
    {
      title: <IntlMessages id='driver.class' />,
      dataIndex: 'class',
      key: '~class',
      render: t => t ? "True" : "False"
    },
  ];

  return <Card title={<IntlMessages id='table.list' values={{ menu: 'Driver' }} />}>
    <AddBtn />
    <Table
      {...dataState}
      className="gx-table-responsive"
      columns={columns}
      rowKey='_id'
      onChange={handleTableChange}
    />
  </Card>
}

export default Driver;