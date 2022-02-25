import { Form, Input, Button, Space, message, Card, Empty,Spin,notification,Modal,Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined,LoadingOutlined,UploadOutlined } from '@ant-design/icons';
import url from '../../../server/api/url';
import new_axios from '../../../server/api/axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
const MyTeamStyle = {
    margin:'0 auto',
    width:'80%',
    marginTop:'20px'
}
notification.config({
  maxCount:1
})
const MyTeam = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading,setLoading] = useState(true);
  const [state,setState] = useState(1);
  const [teamInfo,setTeamInfo] = useState([]);
  const [visible,setVisible] = useState(false);
  const [list,setList] = useState([]);
  const [title,setTitle] = useState('');

  //展开内容
  const viewModal = contest => {
    console.log(contest)
    setList(contest);
    setTitle(contest.contest.title);
    setVisible(true);
  }

  //点击查看比赛按钮
  const contestList = team => {
    new_axios({
      method:'GET',
      url:url+`/api/v1/contest/team/get-list?team_id=${team.id}`
    }).then( res => {
      const data1=[];
      if( res.data.code === '200' ){
        if(res.data.data.length===0){
          message.info('暂无参加的比赛')
        }
        else{
          res.data.data.map( item =>{
            console.log(item)
            
            data1.unshift(
              <a onClick={ ()=>{viewModal(item)} } key={item.id}>《{item.contest.title}》</a>
            )
          } )
          notification.open({
            message: <p>团队<span style={{fontWeight:'bold'}}>《{team.name}》</span>参加的比赛：</p>,
            duration:10,
            description:
              <div>
                <Space >
                  {data1}
                </Space>
              </div>,
          });
        }
      }
      else{
        message.error(res.data.msg);
      }
    } ).catch( e => {
      console.log(e);
    } )
    
  }

  //文件的参数
  const props = {

    name: 'file',
    headers: {
      'X-Requested-With':null,
      Authorization:'Bearer '+sessionStorage.getItem('token'),
    },
    maxCount:1,
    onChange(info) {
        console.log(info.file)
      if (info.file.status === 'done') {
          if(info.file.response){
            if(info.file.response.code==='200'){
                message.success(`${info.file.name} 文件上传成功`);
            }
            else{
                message.error(info.file.response.msg)
            }
          }
        else{
            message.error(`${info.file.name} 文件上传失败`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
};

  //获取已创建的队伍信息
  useEffect( () => {
    new_axios({
      url:url+'/api/v1/team/join',
      method:'GET',
    }).then( data => {
      if(data.data.code === '200' ){
        setLoading(false);
        const infomation = data.data.data;
        if(infomation !== null ){
          const every = [];
          infomation.map( item => {
            //如果是合法队伍就加入数组
            if( item.team.status === 'valid' ){
              const eteam = item.team;
              every.unshift(
                <Card 
                title={<h4>{eteam.name}</h4>} 
                style={{marginBottom:'10px'}} 
                hoverable
                key={eteam.id}
                extra={<Space align='center'>
                  <span>身份：{sessionStorage.getItem('account') === eteam.leader ? '队长' : '队员'}</span>
                    <Button onClick={ () => { contestList(eteam) } } >查看团队参赛情况</Button>
                  </Space>}
                >
                  <Space>
                    <h4>队长：{ eteam.leader }</h4>
                    <h4>联系方式：{ eteam.email }</h4>
                    <h4>人数：{ eteam.number }</h4>
                  </Space><br/>
                  <h4>宣言：{ eteam.declaration }</h4>
                </Card>
              )
            }
            
          } )
          setTeamInfo( every )
        }
        
      }
    } ).catch(  e => {
      message.error(e.response.data.msg);
    } )
  },[] )

  //提交创建队伍信息
  const onFinish = values => {
    new_axios({
        url:url+'/api/v1/team',
        method:'POST',
        data:{
            name:values.teamName,
            number:values.members.length+1,
            declaration:values.declaration,
            email:values.email == null ? sessionStorage.getItem('email'):values.email,
            members:values.members
        }
    }).then( data => {
        if( data.data.code === '200' ){
          message.info(data.data.msg);
          setState(1);
        }
        else {
          message.error(data.data.msg);
        }
        
    } ).catch( e => {
        message.error(e.response.data.msg);
    } )
  };

  //创建队伍
  const foundTeam = (
    <div>
      <Button type="primary" onClick={()=>{setState(1)}}>返回</Button>
      <p>注：请先在线下与队友沟通好再创建，创建后队员只能选择加入或者无视，无法拒绝</p>
      <Form form={form} onFinish={onFinish} autoComplete="off"  >
        <Form.Item name="teamName" label="队伍名字" rules={[{ required: true, message: '队名不能为空' }]}>
          <Input placeholder='你说什么都队'/>
        </Form.Item>
        <Form.Item name="declaration" label="队伍宣言" rules={[{ required: true, message: '写点东西啦' }]}>
          <Input placeholder='随便写点东西'/>
        </Form.Item>
        <Form.Item name="email" label="联系方式" rules={[{ type:'email' }]}>
          <Input placeholder='邮箱，不填默为您的邮箱'/>
        </Form.Item>
        <Form.List name="members"  >
          {(fields, { add, remove }) => (
            <>
              {fields.map(field => (
                <Space key={field.key} align="baseline">
                  <Form.Item
                  {...field}
                  label="学号"
                  name={[field.name, 'account']}
                  rules={[{ required: true, message: '学号未输入' }]}
                  >
                      <Input/>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="姓名"
                    name={[field.name, 'name']}
                    rules={[{ required: true, message: '姓名未输入' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="邮箱"
                    name={[field.name, 'email']}
                    rules={[{ required: true, message: '邮箱格式不正确', type:'email' }]}
                  >
                    <Input />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => {remove(field.name)}} />
                </Space>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加队员
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
    
  )

  return (
    <div style={MyTeamStyle}>
      
      {
        //判断是否要创建队伍的状态
        state === 1 ?
        <div>
          <Button type='primary'onClick={() => { setState(2) }}>创建团队</Button>
          {
            //判断团队数量
            loading ? <Spin indicator={ <LoadingOutlined /> } size='large' tip='加载中' style={{ marginLeft:'45%' } }></Spin> :
            teamInfo.length === 0 ? <Empty description='暂无团队' /> :  teamInfo
          }
        </div>
        : foundTeam
      }
      <Modal
      visible={visible}
      footer={null}
      keyboard
      maskClosable
      onCancel={()=>{setVisible(false)}}
      >
        <p>比赛题目：
          <Button type='link'
          onClick={ () =>{ history.push('/home/detail'); sessionStorage.setItem('compId', `${list.contest.id}`);notification.destroy() } }>
          {title}
          </Button>
        </p>
        <Space>
          <p>作品链接：{list.work_link?list.work_link:'暂未提交作品'}</p>
          <div>
            <Upload {...props}
            // action={`${url}/api/v1/contest/submit?signup_id=${list.contest.id}`}
            >
            <Button icon={<UploadOutlined />}>点击上传文件</Button>
            </Upload>
          </div>
        </Space>
        
        <p>评分：{list.score}</p>
        <p>评语：{list.comment?list.comment:'暂无评语'}</p>
      </Modal>
      
    </div>
    
  );
};

export default MyTeam;