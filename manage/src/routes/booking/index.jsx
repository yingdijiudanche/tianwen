import React, { useEffect, useState } from 'react';
import { Table, Card, Select } from 'antd';
import {
  ReconciliationOutlined,
} from "@ant-design/icons";
import dayjs from 'dayjs';

import api from '../../api/permit';
import adminApi from '../../api/admin';
import useListPage from '../../hook/useListPage';
import { buildFilter, buildTimeRangeFilter } from '../../components/Table/tableHelp';
import useSearchColumn from '../../hook/useSearchColumn';
import IntlMessages from "../../util/IntlMessages";
import { StyledLink } from '../../components/styled/operateBtns';

const PermitStatus = {
  0: 'WaitForCheck', // 等待Checking
  1: 'Checking', // 当前状态可check in
  2: 'Waiting', // 等待取车/入場(Permit為 Visitor時)
  3: 'WaitForOut', // 用户已填写当前电量与里程数
  4: 'Outing', // 已出场
  // 5: 'In', //车辆已入场(Visitor時)
  6: 'Done', //已完成
  7: 'Abnormal', //當車輛超出Permit active to未入場還車，狀態則爲異常
  8: 'Expired', //已過期
};

/**@return {import('../../../components/tableHelp').buildDrodown} */
const buildStatusSelect =
  () =>
    ({ selectedKeys, setSelectedKeys, confirm }) => {
      return (
        <Select
          options={[{ label: "WaitForCheck", value: "0" }, { label: "Checking", value: "1" }, { label: "Waiting", value: "2" }, { label: "WaitForOut", value: "3" }, { label: "Outing", value: "4" }, { label: "Done", value: "6" }, { label: "Abnormal", value: "7" }, { label: "Expired", value: "8" }]}
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
const buildAdminSelect =
  defo =>
    ({ selectedKeys, setSelectedKeys, confirm }) => {
      return (
        <Select
          options={defo}
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

const Booking = () => {
  const { dataState, handleTableChange, cachedParams } = useListPage(api);
  const [adminOptions, setAdminOptions] = useState([]);
  useEffect(() => {
    adminApi
      .getOptions()
      .then(res => setAdminOptions(res))
  }, [])
  console.log(cachedParams["sort"])
  /**@type {import('antd/lib/table').ColumnsType} */
  const columns = [
    {
      title: <IntlMessages id='table.operation' />,
      dataIndex: 'sort',
      key: 'operation',
      render: (_, data) => {
        return (
          <div style={{ display: 'flex' }}>
            {(!data.vehicleId && (data.status === 0 || data.status === 1)) ? (
              <StyledLink
                to={{ pathname: "spare", state: { permitId: data._id } }}
              >
                <ReconciliationOutlined />
              </StyledLink>
            ) : null}
          </div>
        );
      },
    },
    {
      title: <IntlMessages id='vehicle.licenceNumber' />,
      dataIndex: 'licenceNumber',
      key: '~licenceNumber',

      filteredValue: cachedParams['~licenceNumber'],
      ...useSearchColumn('licenceNumber'),
    },
    {
      title: <IntlMessages id='admin.name' />,
      dataIndex: ['admin', 'name'],
      key: 'adminId',
      // render: v => <Tag>{v}</Tag>,
      filteredValue: cachedParams.adminId,
      ...buildFilter(buildAdminSelect(adminOptions)),
    },
    {
      title: <IntlMessages id='booking.carType' />,
      dataIndex: ['booking', 'carType'],
    },
    {
      title: <IntlMessages id='booking.purpose' />,
      dataIndex: ['booking', 'purpose'],
    },
    {
      title: <IntlMessages id='booking.timeFrom' />,
      dataIndex: ['booking', 'timeFrom'],
      key: '#timeFrom',
      render: (timeFrom) => dayjs(timeFrom).format('YYYY-MM-DD HH:mm'),
      filteredValue: cachedParams['#timeFrom'],
      ...buildTimeRangeFilter(),
    },
    {
      title: <IntlMessages id='booking.timeTo' />,
      dataIndex: ['booking', 'timeTo'],
      key: '#timeTo',
      render: (timeTo) => dayjs(timeTo).format('YYYY-MM-DD HH:mm'),
      filteredValue: cachedParams['#timeTo'],
      ...buildTimeRangeFilter(),
    },
    {
      title: <IntlMessages id='vehicle.status' />,
      dataIndex: ['status'],
      render: v => PermitStatus[v],
      filteredValue: cachedParams['status'],
      ...buildFilter(buildStatusSelect()),
    },
    {
      title: <IntlMessages id='booking.passenger' />,
      dataIndex: ['booking', 'passenger'],
    },
    {
      title: <IntlMessages id='booking.beforSOC' />,
      dataIndex: ['booking', 'beforSOC'],
    },
    {
      title: <IntlMessages id='booking.afterSOC' />,
      dataIndex: ['booking', 'afterSOC'],
    },
    {
      title: <IntlMessages id='booking.beforTotalMileage' />,
      dataIndex: ['booking', 'beforTotalMileage'],
    },
    {
      title: <IntlMessages id='booking.afterTotalMileage' />,
      dataIndex: ['booking', 'afterTotalMileage'],
    },
    {
      title: <IntlMessages id='booking.remark' />,
      dataIndex: ['booking', 'remark'],
    }
  ];

  return <Card title={<IntlMessages id='table.list' values={{ menu: 'Booking' }} />}>
    <Table
      {...dataState}
      className="gx-table-responsive"
      columns={columns}
      rowKey='_id'
      onChange={handleTableChange}
    />
  </Card>
}

export default Booking;