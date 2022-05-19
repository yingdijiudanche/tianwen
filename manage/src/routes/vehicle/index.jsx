import React from 'react';
import { Table, Card } from 'antd';
import dayjs from 'dayjs';

import api from '../../api/vehicle';
import useListPage from '../../hook/useListPage';
import useSearchColumn from '../../hook/useSearchColumn';
import IntlMessages from "../../util/IntlMessages";
import { AddBtn, DangerBtn, ModifyBtn } from '../../components/styled/operateBtns';

const Vehicle = () => {
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
      title: <IntlMessages id='vehicle.licenceNumber' />,
      dataIndex: 'licenceNumber',
      key: '~licenceNumber',
      sorter: true,
      sortOrder: cachedParams["sort"]?.licenceNumber,
      filteredValue: cachedParams['~licenceNumber'],
      ...useSearchColumn('licenceNumber'),
    },
    {
      title: <IntlMessages id='vehicle.chassisNumber' />,
      dataIndex: 'chassisNumber',
      key: '~chassisNumber',
      filteredValue: cachedParams['~chassisNumber'],
      ...useSearchColumn('chassisNumber'),
    },
    {
      title: <IntlMessages id='vehicle.department' />,
      dataIndex: 'department',
      key: '~department',
      filteredValue: cachedParams['~department'],
      ...useSearchColumn('department'),
    },
    {
      title: <IntlMessages id='vehicle.contractingBusinessDept' />,
      dataIndex: 'contractingBusinessDept',
      key: '~contractingBusinessDept',
    },
    {
      title: <IntlMessages id='vehicle.type' />,
      dataIndex: 'VRDBodyType',
      key: '~VRDBodyType',
    },
    {
      title: <IntlMessages id='vehicle.carModel' />,
      dataIndex: 'carModel',
      key: '~carModel',
    },
    {
      title: <IntlMessages id='vehicle.driverName' />,
      dataIndex: 'driverName',
      key: '~driverName',
    },
    {
      title: <IntlMessages id='vehicle.GPSUnitNo' />,
      dataIndex: 'GPSUnitNo',
      key: '~GPSUnitNo',
    },
    {
      title: <IntlMessages id='vehicle.projectNo' />,
      dataIndex: 'projectNo',
      key: '~projectNo',
    },
    {
      title: <IntlMessages id='vehicle.status' />,
      dataIndex: 'status',
      key: '~status',
    },
    {
      title: <IntlMessages id='vehicle.effDateFrom' />,
      dataIndex: 'effDateFrom',
      key: '~effDateFrom',
      sorter: true,
      sortOrder: cachedParams["sort"]?.effDateFrom,
      render: (effDateFrom) => dayjs(effDateFrom).format('YYYY-MM-DD'),
    },
    // {
    //   title: <IntlMessages id='vehicle.hidden' />,
    //   dataIndex: 'hidden',
    //   render: (hidden) => {
    //     return (
    //       <p>
    //         {hidden ? 'Yes': 'No'}
    //       </p>
    //     );
    //   },
    // },
  ];

  return <Card title={<IntlMessages id='table.list' values={{ menu: 'Vehicle' }} />}>
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

export default Vehicle;