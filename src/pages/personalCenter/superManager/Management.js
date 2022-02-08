import React, { useEffect, useState } from 'react';
import { Table, Input, InputNumber, Select, Form, Typography, message, Tag } from 'antd';
import new_axios from '../../../server/api/axios';
import url from '../../../server/api/url';

//修改信息的表单
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = title === '状态' ? <InputNumber max={1} min={0}/> : title === '身份' ?<Input disabled/>:<Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
let degree = '';
let account = '';
let identity = '';
let college = '';
let grade = '';
let name = '';

const EditableTable = () => {
  const [form] = Form.useForm();                                        //表单对象
  const [data, setData] = useState([]);                                 //数据源
  const [id,setId] = useState(-1);                                      //选中的数据id
  const [total,setTotal] = useState(0);
  const [editingKey, setEditingKey] = useState('');                     //正在修改的数据
  const { Option } = Select;

  const isEditing = (record) => record.account === editingKey;
  
  useEffect( ()=>{
      new_axios({
          method:'GET',
          url:`${url}/api/v1/setting/user/get-list?limit=10&page=1`
      }).then( data => {
          if(data.data.code === '200' ){
            setData(data.data.data.data);
            setTotal(data.data.data.total)
          }
      } ).catch( e => {
          console.log(e.response);
      } )
  }, [])

  //发送筛选请求
  const searchDetailInfo = (page) => {
    let URL=`${url}/api/v1/setting/user/get-list?limit=10&page=${page}`;
    if(account)     URL+=`&account=${account}`
    if(identity)    URL+=`&identity=${identity}`
    if(college)     URL+=`&college=${college}`
    if(grade)       URL+=`&grade=${grade}`
    if(degree)      URL+=`&degree=${degree}`
    if(name)        URL+=`&name=${name}`  
    new_axios({
      method:'GET',
      url:URL,
    }).then( data => {
        if(data.data.code === '200' ){
          setData(data.data.data.data);
          setTotal(data.data.data.total);
        }
    } ).catch( e => {
      if(e.response){
        message.info(e.response.data.msg)
      }
      else{
        message.info('网络错误，获取失败')
      }
    })
  }

  //身份筛选
  const handleChangeIdentity = (value) => {
    if( value !== 'unlimited' ){
      identity = value;
    }
    else identity = '';
    searchDetailInfo(1);
  }

  //学院筛选
  const handleChangeCollege = (value) => {
    if( value !== 'unlimited' ){
      college=value;
    }
    else college = '';
    searchDetailInfo(1);
  }

  //学位筛选
  const handleChangeDegree = (value) => {
    if( value !== 'unlimited' ){
      degree = value;
    }
    else degree = '';
    searchDetailInfo(1);
  }

  //年级筛选
  const handleChangeGrade = (value) => {
    if( value !== 'unlimited' ){
      grade = value;
    }
    else grade = '';
    searchDetailInfo(1);
  }

  //姓名查找
  const searchName = (value) => {
    name=value;
    searchDetailInfo(1);
  }

  //学号查找
  const searchAccount = (value) => {
    console.log(value);
    account=value;
    searchDetailInfo(1);
  }

  //编辑
  const edit = (record) => {
      setId(record.id);
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.account);
  };

  //取消编辑
  const cancel = () => {
    setEditingKey('');
  };

  //页数变化
  const pageChange = page => {
    setEditingKey('');
    searchDetailInfo(page);
  }
  //编辑完成保存信息并发送请求
  const save = async (account) => {
      console.log(account)
    try {
      const row = await form.validateFields();
      new_axios({
        method:'PUT',
        url:`${url}/api/v1/setting/user/update-info/${id}`,
        data:{
            "account":row.account,
            "name":row.name,
            "email":row.email,
            "telephone":row.telephone,
            "college":row.college,
            "degree":row.degree,
            "grade":row.grade,
            "enable":row.enable    // enable的值为1或者0
        }
      }).then( data => {
          if( data.data.code === '200' ){
              message.info(data.data.msg);
              setTimeout( ()=>{ window.location.reload() } ,300)
          }
      } ).catch( e => {
          message.error(e.response.data.msg);
      } )
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: '10%',
      editable: true,
    },
    {
      title: '学号/工号',
      dataIndex: 'account',
    //   width: '15%',
      editable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: '15%',
      editable: true,
    },
    {
        title: '电话号码',
        dataIndex: 'telephone',
        // width: '15%',
        editable: true,
    },
    {
        title: '学院',
        dataIndex: 'college',
        // width: '18%',
        editable: true,
    },
    {
        title: '身份',
        dataIndex: 'identity',
        width: '8%',
        editable: true,
        render:item => {
          let color = item === 'student' ? 'green' : 'geekblue'
          return (
            <Tag color={color}>{item}</Tag>
          ) 
        }
    },
    {
        title: '学位',
        dataIndex: 'degree',
        width: '8%',
        editable: true,
    },
    {
        title: '年级',
        dataIndex: 'grade',
        width: '8%',
        editable: true,
    },
    {
        title: '状态',
        dataIndex: 'enable',
        width: '5%',
        editable: true,
        render:item => {
          return(
            item === true ?<Tag color='green'>正常</Tag>:<Tag color="red">禁用</Tag>
          )
        }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.account)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </Typography.Link>
              <a onClick={ cancel }>取消</a>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div>
      <h2>用户列表</h2>
      <p style={{ color:'red' }}>请勿轻易修改用户的学号、邮箱和电话信息，修改前请通知用户</p>
      <p>（注：用户身份暂时无法更改，状态表示用户账号是否能使用，修改状态时，1表示正常，0表示禁用）</p>
      <span>筛选条件：  </span>
      <Select size='large' style={{ width: 120,marginRight:'30px' }} onChange={handleChangeIdentity} placeholder='身份'>
        <Option value="unlimited">不限</Option>
        <Option value="student">student</Option>
        <Option value="teacher">teacher</Option>
      </Select>
      <Select  size='large' style={{ width: 200,marginRight:'30px' }} onChange={handleChangeCollege} placeholder='学院'>
        <Option value="unlimited">不限</Option>
        <Option value="计算机科学与工程学院">计算机科学与工程学院</Option>
        <Option value="软件学院">软件学院</Option>
      </Select>
      <Select size='large' style={{ width: 120,marginRight:'30px' }} onChange={handleChangeDegree} placeholder='学位'>
        <Option value="unlimited">不限</Option>
        <Option value="本科生">本科生</Option>
        <Option value="研究生">研究生</Option>
      </Select>
      <Select size='large' style={{ width: 120,marginRight:'30px' }} onChange={handleChangeGrade} placeholder='年级'>
        <Option value="unlimited">不限</Option>
        <Option value="2018级">2018级</Option>
        <Option value="2019级">2019级</Option>
        <Option value="2020级">2020级</Option>
        <Option value="2021级">2021级</Option>
        <Option value="2022级">2022级</Option>
      </Select>
      <div style={{marginBottom:'10px'}}></div>
      <Input.Search 
      size='large' 
      style={{width:'350px',marginRight:'30px'}} 
      placeholder='姓名'
      onSearch={searchName}
      />
      <Input.Search 
      size='large' 
      style={{width:'350px',marginRight:'30px'}} 
      placeholder='学号'
      onSearch={searchAccount}
      />
      <Form form={form} component={false}>
        
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          rowKey='account'
          columns={mergedColumns}
          pagination={{
            onChange: pageChange,
            total:total,
            pageSize:10
          }}
        />
      </Form>
    </div>  
    
  );
};
export default EditableTable;