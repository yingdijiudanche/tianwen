import React, { useState, useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import IntlMessages from "../util/IntlMessages";
/** 封装表格内的文本搜索功能 返回columns配置对象*/
export default function useSearchColumn(title, cusStyle = {}, getter) {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef();
  const handleClear = (clear, confirm) => {
    setSearchText('');
    clear();
    // confirm();
  };
  const handleSearch = (v, confirm) => {
    setSearchText(v);
    confirm();
  };

  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <IntlMessages id='placeholder.search' values={{ title }}>
          {(txt) => (
            <Input
              placeholder={txt}
              value={selectedKeys}
              ref={inputRef}
              onChange={e => setSelectedKeys(e.target.value)}
              onPressEnter={() => handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block', ...cusStyle }}
            />
          )}
        </IntlMessages>

        <Space>
          <Button onClick={() => handleClear(clearFilters, confirm)} size='small' style={{ width: 90 }}>
            {<IntlMessages id='buttons.reset' />}
          </Button>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            {<IntlMessages id='buttons.search' />}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => inputRef.current.select());
      }
    },
    render: text =>
      searchText ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={(getter ? getter(text) : text) ?? ''}
        />
      ) : getter ? (
        getter(text)
      ) : (
        text
      ),
  };
}
