import React from 'react';
import { PlusOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import IntlMessages from "../../util/IntlMessages";

const StyledLink = styled(Link)`
  padding: 5px 12px;
  color: #038fde;
  &:hover {
    background-color: #6d6d6d0a;
    color: #009cfd;
  }
`;
/** @type {import('react-router-dom').Link} */
const BlockLink = styled(StyledLink)`
  display: inline-block;
  /* .ant-btn {
    margin-bottom: 20px;
  } */
`;

const AnchorBtn = styled.a`
  color: #038fde;
  padding: 5px 12px;
  &:hover {
    background-color: #6d6d6d0a;
    color: #009cfd;
  }
`;

function AddBtn({ state }) {
  return (
    <BlockLink to={{ pathname: 'modify', state }}>
      <Button type='primary' icon={<PlusOutlined />}>
        {<IntlMessages id='buttons.add' />}
      </Button>
    </BlockLink>
  );
}

/**
 * @param {object} props
 * @param {string} [props.pathname] 跳转目标页面 默认 ='modify'
 * @param {object} props.carry 跳转页面时携带的数据
 */
function ModifyBtn({ pathname = 'modify', carry, style }) {
  return (
    <StyledLink to={{ pathname, state: carry }} style={style}>
      <EditFilled />
    </StyledLink>
  );
}

/**
 * @param {object} props
 * @param {()=>void} props.onConfirm 弹窗确认回调函数
 */
function DangerBtn({ onConfirm, title = <IntlMessages id='deleConfirm.title' />}) {
  return (
    <Popconfirm
      title={title}
      okText={<IntlMessages id='deleConfirm.yes' />}
      cancelText={<IntlMessages id='deleConfirm.cancel' />}
      onConfirm={onConfirm}
    >
      <AnchorBtn>
        <DeleteFilled />
      </AnchorBtn>
    </Popconfirm>
  );
}
export { AddBtn, ModifyBtn, DangerBtn, AnchorBtn, StyledLink };
