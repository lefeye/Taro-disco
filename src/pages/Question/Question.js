import { Form, Input, Button, Space,Tag, Table, message,Drawer,Checkbox } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect,useState } from 'react';
import new_axios from '../../server/api/axios';
import url from '../../server/api/url';
import './Question.css'

const Role = () => {
  const [roleList,setRoleList] = useState([]);
  const [visible,setVisible] =useState(false);
  const [personalList,setPersonalList] = useState([]);
  const [options,setOptions] = useState([]);
  const autList = [];
  const columns = [
    {
      title: '角色id',
      dataIndex: 'id',
      key: 'id',
      render: text => <a>{text}</a>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '编辑角色权限',
      key: 'action',
      render: (_,record)=><Button onClick={ () => { drawerView(record.id) } }>编辑</Button>
      
    },
  ];

  useEffect(() => {
    new_axios({
      method:'GET',
      url:url+'/api/v1/policy/get-all-roles'
    }).then( res => {
      if(res.data.code === '200'){
        setRoleList(res.data.data)
        
      }
      else{
        message.error(res.data.msg)
      }
    } ).catch( e => {
      console.log(e);
    } )
  },[])

  useEffect( () => {
    new_axios({
        method:'GET',
        url:url+'/api/v1/policy/get-all-authorities'
    }).then( res => {
      if(res.data.code==='200'){
        res.data.data.forEach( item => {
          autList.push({label:item.description,value:item.path})
        } )
        console.log(autList)
        setOptions(autList);
      }
      else{
        message.error(res.data.msg);
      }
    } ).catch( e => {
      console.log(e);
    })
} ,[])

  const drawerView = id => {
    new_axios({
      method:'GET',
      url:url+`/api/v1/policy/get-authorities-by-role?roleId=${id}`
    }).then( res => {
      if(res.data.code==='200'){
        console.log(res.data.data);
        const per= []
        setPersonalList([]);
        if(res.data.data){
          res.data.data.forEach( item => {
          per.push(item.path);
        } )
        console.log(per)
        setPersonalList(per)
        }
        
        setVisible(true)
      }
      else{
        message.error(res.data.msg);
      }
    } ).catch( e => {
      console.log(e);
    })
  }
  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className='roleTable'>
      <Table columns={columns} dataSource={roleList} rowKey= { record => record.id }  />
      <Drawer title="权限列表" placement="right" onClose={onClose} visible={visible}extra={ <Button>提交</Button> } destroyOnClose>
        <Checkbox.Group options={options} defaultValue={personalList} style={{display:'flex',flexDirection:'column',}}></Checkbox.Group>
      </Drawer>
    </div>
  )
}
export default Role;