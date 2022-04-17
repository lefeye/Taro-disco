import React, { useState, useEffect } from 'react'
import url from '../../../server/api/url';
import store from '../../../redux/store';
import axios from 'axios';
import { Table, Button, message, Tabs } from 'antd';
import './AllApply.css'
export default function AllApply() {
  const account = useState(store.getState().userInfo.account);
  const [refresh, setRefresh] = useState(true);
  const [applyInfo, setApplyInfo] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { TabPane } = Tabs;
  const callback = (key) => {
    console.log(key);
  }
  // const [selectionType, setSelectionType] = useState('checkbox');
  useEffect(() => {
    const URL = url + "/getApply"
    axios({
      method: 'get',
      url: URL,
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem('token')
      }
    })
      .then(response => {
        console.log(response)
        const data = response.data.todo;
        console.log(data)
        setApplyInfo(data);
      })
      .catch(function (error) {
        console.log(1)
        console.log(error);
      });
    setRefresh(true)
  }, [refresh])

  const columns = [
    {
      title: '姓名',
      dataIndex: 'user_name',
    },
    {
      title: '学号',
      dataIndex: 'account',
    },
    {
      title: '团队信息',
      dataIndex: 'description',
    },
    {
      title: '预约时间',
      dataIndex: 'reserve_date',
    },
  ];

  const dataWaitForCheck = [];
  const dataChecked = [];
  const dataRefused = [];
  if (applyInfo) {
    applyInfo.forEach((item, index) => {
      let newItem = {
        'key': index,
        ...item
      }
      item.status == '0' ?
        dataWaitForCheck.push(newItem)
        : item.status == '1' ?
          dataChecked.push(newItem) :
          dataRefused.push(newItem);
    })
  }


  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  const agreeApply = () => {
    const URL = url + '/allowApply';
    let finish = false;
    selectedRowKeys.forEach(item => {
      console.log(applyInfo[item])
      axios({
        method: "POST",
        url: URL,
        data: {
          "account": applyInfo[item].account,
          "lab_name": applyInfo[item].lab_name,
          "reserve_date": applyInfo[item].reserve_date
        },
        headers: {
          "Authorization": "Bearer " + sessionStorage.getItem('token')
        }
      })
        .then(response => {
          console.log(response.data)
          if (response.data.status == 'BS2025') {
            finish = true
          }
          else finish = false
        })
        .catch(error => {
          finish = false
          console.log(error);
        });
    })
    if (finish) {
      message.success('已同意勾选的所有申请')
    } else {
      message.error('未通过全部勾选申请')
    }
    setRefresh(false)
  }
  const refuseApply = () => {
    console.log('1')
    const URL = url + '/refuseApply';
    let finish = false
    selectedRowKeys.forEach(item => {
      axios({
        method: 'POST',
        url: URL,
        data: {
          "account": applyInfo[item].account,
          "lab_name": applyInfo[item].lab_name,
          "reserve_date": applyInfo[item].reserve_date
        },
        headers: {
          "Authorization": "Bearer " + sessionStorage.getItem('token')
        }
      })
        .then(response => {
          if (response.data.status == 'BS2026') {
            finish = true
          }
          else finish = false
        })
        .catch((error) => {
          finish = false
          console.log(error);
        });
    })
    if (finish) {
      message.success('已全部拒绝申请')
    } else {
      message.error('未全部拒绝申请')
    }
    setRefresh(false)
  }
  return (
    <div>

      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="待审核" key="1">
          <Table rowSelection={rowSelection} columns={columns} dataSource={dataWaitForCheck} />
          <Button onClick={agreeApply} type='primary' className='buttonA'>同意申请</Button>
          <Button onClick={refuseApply}>拒绝申请</Button>
        </TabPane>
        <TabPane tab="审核通过" key="2">
          <Table columns={columns} dataSource={dataChecked} />
        </TabPane>
        <TabPane tab="审核拒绝" key="3">
          <Table columns={columns} dataSource={dataRefused} />
        </TabPane>
      </Tabs>
    </div>
  )
}
