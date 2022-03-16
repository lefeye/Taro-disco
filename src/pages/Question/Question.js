import { Button, Space, Table, message, Drawer, Tree, Popover,Tabs, Checkbox, Modal, Select, Input } from 'antd';
import React, { useEffect,useState } from 'react';
import new_axios from '../../server/api/axios';
import url from '../../server/api/url';
import { PlusOutlined } from '@ant-design/icons'
import './Question.css';

//选中的比赛id，标题和内容
let id = 0;                             
let title = '';
let content = '';

const Notice = () => {
  const { Option } = Select;
  const [visible,setVisible] = useState(false)
  const [contestList,setContestList] = useState([]);
  useEffect( () => {
    new_axios({
      method:'GET',
      url:url+'/api/v1/setting/contest/get-list'
    }).then( res => {
      if(res.data.code === '200'){
        const arr = [];
        res.data.data.data.forEach( item => {
          arr.unshift(item);
        } )
        setContestList(arr);
      }
      else{
        message.error(res.data.msg);
      }
    } ).catch( e => {
      console.log(e);
    } )
  } ,[])

  const contestChange = value => {
    id = value === undefined ? 0 : value;
  }
  const options = (
    <Select style={{ width:'200px' }} placeholder='选择对应比赛' onChange={ contestChange } allowClear>
      {
        contestList.map( item => 
            <Option value={item.id} key={item.id} >{ item.title } </Option> )
      }
    </Select>
  )

  const openModal = () => {
    setVisible(true);
  }

  const handleChangeTitle = e => {
    title = e.target.value;
    console.log(title);
  }

  const handleChangeContent = e => {
    content = e.target.value;
    console.log(content);
  }

  const submit = () => {
    if(!title || !content){
      message.error('公告标题或公告内容未填写，请填写完毕再提交');
    }
    else{
      new_axios({
        method:'POST',
        url:url+'/api/v1/announcement/publish',
        data:{
          contest_id:id,
          title:title,
          content:content
        }
      }).then( res => {
        if(res.data.code === '200') {
          message.info(res.data.msg);
        }
        else{
          message.error(res.data.msg)
        }
      } )
      setVisible(false);
    }
  }
  return (
    <div>
      <Button icon={<PlusOutlined />} onClick={ openModal }>发布公告</Button>
      <Modal
      title='发布公告'
      okText='提交'
      destroyOnClose
      onOk={ submit }
      cancelText='取消'
      onCancel={ () => { setVisible(false) } }
      visible={visible}
      >
        <Space direction='vertical'>
            <span>注：选项为为对应的比赛发布的公告，可以不选，即发布常规公告</span>
            {options}
            <Input placeholder='标题' onChange={ handleChangeTitle }></Input>
            <Input.TextArea placeholder='内容' onChange={ handleChangeContent }></Input.TextArea>
        </Space>
      </Modal>
    </div>
  )
}

export default Notice;