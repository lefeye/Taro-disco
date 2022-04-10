import { Button, Space, Table, message, Modal, Select, Input } from 'antd';
import React, { useEffect,useState } from 'react';
import new_axios from '../../../server/api/axios';
import url from '../../../server/api/url';
import { PlusOutlined } from '@ant-design/icons'

//选中的比赛id，标题和内容
let id = 0;                             
let title = '';
let content = '';
const Notice = () => {
  const { Option } = Select;
  const [visible,setVisible] = useState(false);
  const [noticeList,setNoticeList] = useState([]);
  const [total,setTotal] = useState(0);
  const [contestList,setContestList] = useState([]);
  const [state,setState] = useState(false);
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

  useEffect( () => {
      new_axios({
          method:'GET',
          url:url+'/api/v1/announcement/get-all-announcements?limit=10&page=1'
      }).then( res => {
          if(res.data.code === '200'){
            setNoticeList(res.data.data.data);
            setTotal(res.data.data.total);
          }
      } )
  }, [state] )

  const modifyNotice = target => {
        let new_title = target.title;
        let new_content = target.content;
      Modal.confirm({
        title:'您正在查看/修改公告!',
        content:
            <div>
                <Space direction='vertical'>
                    <Input 
                    placeholder='标题'
                    defaultValue={target.title}
                    onChange={ e=>{ new_title = e.target.value } }
                    ></Input>
                    <Input.TextArea 
                    style={{ width:'300px',minHeight:'100px'}}
                    placeholder='内容'
                    defaultValue={target.content}
                    onChange={ e=>{ new_content = e.target.value } }
                    ></Input.TextArea>
                </Space>
            </div>,
            onOk() {
                if(!new_title||!new_content){
                    message.warn('公告信息未填入，请确认')
                }
                else{
                    new_axios({
                        method:'PUT',
                        url:url+'/api/v1/announcement/update',
                        data:{
                            id:target.id,
                            contest_id:target.contest_id,
                            title:new_title,
                            content:new_content
                        }
                    }).then( res => {
                        if(res.data.code==='200'){
                            message.info(res.data.msg);
                            setState(!state);
                        }
                        else{
                            message.error(res.data.msg);
                        }
                    } ).catch( e => {
                        console.log(e);
                    } )
                }
                
            },
            okText: "确认",
            closable:true,
            cancelText: "取消"
        });
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '发布时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
        title: '上次修改时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
      },
    {
      title: '操作',
      key: 'action',
      render: (_,record)=>
      <Space>
        <Button onClick={ () => { modifyNotice(record) } }>详情</Button>
      </Space>
      
    },
  ];

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
  }

  const handleChangeContent = e => {
    content = e.target.value;
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
          setState(!state);
        }
        else{
          message.error(res.data.msg)
        }
      } )
      setVisible(false);
    }
  }

  //页数变化
  const pageChange = page => {
    new_axios({
      method:'GET',
      url:url+`/api/v1/announcement/get-all-announcements?limit=10&page=${page}`
    }).then( res => {
      if(res.data.code === '200'){
        setNoticeList(res.data.data.data)
      }
      else{
        message.error(res.data.msg)
      }
    } ).catch( e => {
      console.log(e);
    } )
  }

  return (
    <div>
      <Button 
      icon={<PlusOutlined />} 
      style={{ margin:'10px 0' }}
      type='primary' 
      onClick={ openModal }>发布公告</Button>

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

      <Table 
      style={{ fontWeight:'bold' }}
      columns={columns} 
      dataSource={noticeList} 
      rowKey= { record => record.id }
      pagination={{
        onChange: pageChange,
        total:total,
        pageSize:10
      }}/>  
    </div>
  )
}

export default Notice;