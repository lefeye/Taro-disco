import { Form, Input, Button, Space, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';

const MyTeam = () => {
  const [form] = Form.useForm();

  const onFinish = values => {
    console.log('Received values of form:', values);
  };

  const handleChange = () => {
    form.setFieldsValue({ sights: [] });
  };

  return (
    <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.Item name="teamName" label="队名" rules={[{ required: true, message: '队名不能为空' }]}>
        <Input placeholder='你说什么都队'/>
      </Form.Item>
      <Form.Item name="declaration" label="队伍宣言" rules={[{ required: true, message: '写点东西啦' }]}>
        <Input placeholder='随便写点东西'/>
      </Form.Item>
      <Form.Item name="email" label="联系方式" rules={[{type:'email' }]}>
        <Input placeholder='不填默认队长邮箱'/>
      </Form.Item>
      <Form.List name="members">
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

                <MinusCircleOutlined onClick={() => {console.log(fields);remove(field.name)}} />
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
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MyTeam;