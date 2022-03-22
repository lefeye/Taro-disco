import { Button, Space, Table, message, Drawer, Tree, Popover,Tabs, Checkbox, Input, Select,Modal } from 'antd';
import React, { useEffect,useState } from 'react';
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import new_axios from '../../../server/api/axios';
import url from '../../../server/api/url';
import './RoleManagement.css'

let new_name = '',new_remark = '',role = 0;
const RoleManagement = () => {
  const [roleList,setRoleList] = useState([]);                    //存放全部角色
  const [visible,setVisible] =useState(false);                    //抽屉Drawer可视化
  const [personalList,setPersonalList] = useState([]);            //存放默认值树选项（角色拥有的权限）
  const [trees,setTrees] = useState([]);                          //树选择列表
  const [state,setState] = useState(false);                       //修改hook状态
  const [id,setId] = useState(0);                                 //当前角色id
  const [menuList,setMenuList] = useState([]);                    //存放菜单列表
  const [permenuList,setPerMenuList] = useState([]);              //存放默认值多选框选项（角色拥有的可视菜单）
  let submitData=[];                                              //需要提交的权限列表数据
  let submitMenu=[];                                              //需要提交的菜单列表数据
  const [total,setTotal] = useState(0);
  const [title,setTitle] = useState('');
  const [rolename,setRoleName] = useState('');
  const [remark,setRemark] = useState('');
  let flagTree=false;
  let flagCheck=false;
  const { TabPane } = Tabs;
  const { Option } = Select;
  const confirm = Modal.confirm;
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
      render: (_,record)=>
      <Space>
        <Button onClick={ () => { drawerView(record.id,record.name) } }>编辑</Button>
        {
          record.id!==1?
          <Popover 
          content={<Button onClick={ () => { deleteRole(record.id) }}type='primary' style={{ width:'100%' }}>确定</Button>} 
          title="请确认" 
          trigger="click">
            <Button className='deleteButton'>删除</Button>
          </Popover>
          :
          <Button className='deleteButton' disabled>删除</Button>
        }
      </Space>
      
    },
  ];

  //获取角色列表
  useEffect(() => {
    new_axios({
      method:'GET',
      url:url+'/api/v1/policy/get-all-roles?limit=10&page=1'
    }).then( res => {

      if(res.data.code === '200'){
        
        setRoleList(res.data.data.data)
        setTotal(res.data.data.total);
        
      }
      else{
        message.error(res.data.msg)
      }
    } ).catch( e => {
      console.log(e);
    } )
  },[state])

  const compare = (arr,str) => {
    if(!arr.length)return null;
    else{
      for(let i = 0;i < arr.length; i++){
        if(arr[i].title===str){
          return i;
        }
      }
    }
    return null;
  }

  //获取权限列表
  useEffect( () => {
    new_axios({
        method:'GET',
        url:url+'/api/v1/policy/get-all-authorities'
    }).then( res => {
      if(res.data.code==='200'){
        let tree=[];
        res.data.data.forEach( item => {
          if(compare(tree,item.api_group)===null){
            tree.push({
              title:item.api_group,
              key:item.api_group,
              children:[{
                title:item.description,
                key:item.path,
                method:item.method,
                children:[]
              }]
            })
          }
          else{
            let i=compare(tree,item.api_group);
            tree[i].children.push({title:item.description,key:item.path,method:item.method,children:[]})
          }
        } )
        setTrees(tree);
        // setOptions(autList);
      }
      else{
        message.error(res.data.msg);
      }
    } ).catch( e => {
      console.log(e);
    })
} ,[])

  //获取全部菜单
  useEffect( () => {
    new_axios({
      method:'GET',
      url:url+'/api/v1/policy/get-all-menus'
    }).then( res => {
      if(res.data.code === '200'){
        const data=[];
        res.data.data.forEach( item => {
          data.push({value:item.path,label:item.description})
        } )
        setMenuList(data);
      }
      else{
        message.error(res.data.msg)
      }
    } ).catch( e => {
      console.log(e);
    } )
  } ,[])

  //角色已有的权限和菜单
  const owned = currentId => {
    //获取当前操作角色的权限列表
    const a = 
      new_axios({
        method:'GET',
        url:url+`/api/v1/policy/get-authorities-by-role?roleId=${currentId}`
      }).then( res => {
        if(res.data.code==='200'){
          const perAuth= []
          setPersonalList([]);
          if(res.data.data){
            res.data.data.forEach( item => {
            perAuth.push(item.path);
          } )
          setPersonalList(perAuth)
          }
        }
        else{
          message.error(res.data.msg);
        }
      } ).catch( e => {
        console.log(e);
      })
    
    
    //获取当前操作角色的可视菜单列表
    const b = 
      new_axios({
        method:'GET',
        url:url+`/api/v1/policy/get-menus-by-role?roleId=${currentId}`
      }).then( res => {
        if(res.data.code==='200'){
          const perMenu= []
          setPerMenuList([]);
          if(res.data.data){
            res.data.data.forEach( item => {
            perMenu.push(item.path);
          } )
          setPerMenuList(perMenu)
          }
        }
        else{
          message.error(res.data.msg);
        }
      } ).catch( e => {
        console.log(e);
      })
    
    Promise.all([a,b]).then( () => {
      setVisible(true)
    } )
  }
  //编辑角色权限和可视的菜单
  const drawerView = (currentId,name) => {
    if(id!==currentId){
      const title = '权限列表(' + name + ')';
      setTitle(title);
      setId(currentId);
      owned(currentId);
    }
    else{
      setVisible(true);
    }
  }

  //删除角色
  const deleteRole = id => {
    new_axios({
      method:"DELETE",
      url:url+'/api/v1/policy/delete-role',
      data:{
        role_id:id
      }
    }).then( res => {
      if(res.data.code ==='200'){
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

  //关闭抽屉
  const onClose = () => {
    setVisible(false);
  };

  //权限更改
  const authChange = ( data, node ) => {
    if(node.checkedNodes){
      flagTree=true;
      const data=[];
      node.checkedNodes.forEach( item => {
        if(item.method){
          data.push({path:item.key,method:item.method})
        }
        
      })
      submitData=data;
    }
  } 

  //菜单更改
  const menuChange = (value) => {
    const data=[];
    console.log(value.length)
    if(value.length>0){
      flagCheck=true;
      for(let i=0;i<value.length;i++){
        for(let j=0;j<menuList.length;j++){
          if(value[i]===menuList[j].value){
            data.push({path:menuList[j].value,description:menuList[j].label })
            break;
          }
        }
      }
      submitMenu=data;
    }
  }
  //提交更改的权限和菜单
  const submit = () => {
    if(flagTree){
      new_axios({
        method:'POST',
        url:url+'/api/v1/policy/update-authority',
        data:{
          role_id:id,
          authority_info:submitData
        }
      }).then( res => {
        if(res.data.code ==='200'){
          message.info(res.data.msg);
          owned(id);
        }
        else{
          message.error(res.data.msg);
        }
      } ).catch( e => {
        console.log(e);
      } )
    }
    if(flagCheck){
      new_axios({
        method:'POST',
        url:url+'/api/v1/policy/update-menu',
        data:{
          role_id:id,
          menu_info:submitMenu
        }
      }).then( res => {
        if(res.data.code ==='200'){
          message.info(res.data.msg);
          owned(id);
        }
        else{
          message.error(res.data.msg);
        }
      } ).catch( e => {
        console.log(e);
      } )
    }
  }

  //页数变化
  const pageChange = page => {
    new_axios({
      method:'GET',
      url:url+`/api/v1/policy/get-all-roles?limit=10&page=${page}`
    }).then( res => {
      if(res.data.code === '200'){
        setRoleList(res.data.data.data)
      }
      else{
        message.error(res.data.msg)
      }
    } ).catch( e => {
      console.log(e);
    } )
  }

  //角色名称
  const changeRoleName = e =>{
      setRoleName(e.target.value);
  }

  //角色备注
  const changeRemark = e => {
      setRemark(e.target.value);
  }

  //提交新增的角色
  const handleSubmitRole = () => {
    if(!rolename||!remark){
        message.warn('角色信息未填入，请确认')
    }
    else{
        console.log(rolename,remark);
        new_axios({
            method:'POST',
            url:url+'/api/v1/policy/add-role',
            data:{
                name:rolename,
                remark:remark
            }
        }).then( res => {
            if(res.data.code === '200'){
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
}
  const contentIn = (
      <div >
          <Space direction='vertical'>
              <Input placeholder='角色名称' allowClear onChange={changeRoleName}/>
              <Input placeholder='备注' allowClear onChange={changeRemark}/>
              <Button type='primary' style={{ float:'right' }} onClick={handleSubmitRole}>确认</Button>
          </Space>
      </div>
  )

  //改变选中的角色
  const handlechange = value => {
    role=value;
  }
  
  const Options=(
    <Select style={{ width:'150px' }} onChange={handlechange} placeholder='选择需要修改的角色' >
        {
            roleList.map( item => 
                <Option value={item.id} key={item.id} >{ item.name } </Option> )
        }
    </Select>
  )
  //编辑角色信息
  const editRole = () => {
    Modal.destroyAll();
    confirm({
        content:
        <div>
            <Space direction='vertical'>
                {Options}
                <Input 
                placeholder='新名称'
                onChange={ e=>{ new_name = e.target.value } }
                ></Input>
                <Input 
                placeholder='备注'
                onChange={ e=>{ new_remark = e.target.value } }
                ></Input>
            </Space>
        </div>,
        onOk() {
            if(!new_name||!new_remark){
                message.warn('角色信息未填入，请确认')
            }
            else{
                new_axios({
                    method:'PUT',
                    url:url+'/api/v1/policy/update-role',
                    data:{
                        id:role,
                        name:new_name,
                        remark:new_remark
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
        onCancel() {
            console.log('Cancel');
        },
        okText: "确认",
        closable:true,
        cancelText: "取消"
    });
  }
  return (
    <div className='roleTable'>
      <div className='pop' >
        <Space>
          <Popover placement="bottomLeft"  trigger="hover" content={contentIn} >
            <Button type='primary'icon={<PlusOutlined />}>添加角色</Button>
          </Popover>
          <Button type='primary'icon={<EditOutlined />} onClick={editRole} >编辑角色</Button>
        </Space>
        
      </div>
      
      <Table 
      columns={columns} 
      dataSource={roleList} 
      rowKey= { record => record.id }
      pagination={{
        onChange: pageChange,
        total:total,
        pageSize:10
      }}/>
      <Drawer 
      destroyOnClose
      closable
      title={title} 
      placement="right" 
      onClose={onClose} 
      visible={visible}
      extra={ <Button type="primary" onClick={submit}>提交</Button> } 
      >
        <Tabs defaultActiveKey="1" style={{ marginTop:-20 }} >
          <TabPane tab="权限列表" key="1">
            <Tree 
            checkable
            defaultExpandAll
            onCheck={ authChange }
            defaultCheckedKeys={personalList}
            treeData={trees}
            ></Tree>
          </TabPane>
          <TabPane tab="菜单列表" key="2">
            <Checkbox.Group 
            options={menuList} 
            style={{ display:'flex',flexDirection:'column' }} 
            defaultValue={permenuList}
            onChange={menuChange}></Checkbox.Group>
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  )
}
export default RoleManagement;