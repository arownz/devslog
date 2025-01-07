import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message } from 'antd';
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';

const UsersManage = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); // For handling image upload

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost/devslog/server/admin_get_users.php', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error === 'Unauthorized') {
        console.error('Unauthorized access');
        message.error('You are not authorized to view this page');
        return;
      }
      if (Array.isArray(data)) {
        setUsers(
          data.map((user) => ({
            ...user,
            profile_image: user.profile_image
              ? `data:image/png;base64,${user.profile_image}`
              : null,
          }))
        );
      } else {
        console.error('Received data is not an array:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
      setUsers([]);
    }
  };

  const showModal = (user = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
      setFileList([]);
    }
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      if (fileList.length > 0) {
        formData.append('profile_image', fileList[0].originFileObj);
      }
      if (editingUser) {
        updateUser(formData);
      } else {
        createUser(formData);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    setFileList([]);
  };

  const createUser = async (formData) => {
    try {
      const response = await fetch('http://localhost/devslog/server/admin_create_user.php', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json(); // Parse JSON response
      if (data.success) {
        message.success('User created successfully');
        fetchUsers();
        setIsModalVisible(false);
      } else {
        message.error(data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Failed to create user');
    }
  };
  
  const updateUser = async (formData) => {
    try {
      formData.append('id', editingUser.id); // Include user ID for updating
      const response = await fetch('http://localhost/devslog/server/admin_update_user.php', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json(); // Parse JSON response
      if (data.success) {
        message.success('User updated successfully');
        fetchUsers();
        setIsModalVisible(false);
      } else {
        message.error(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Failed to update user');
    }
  };
  

  const deleteUser = async (id) => {
    try {
      const response = await fetch('http://localhost/devslog/server/admin_delete_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        message.success('User deleted successfully');
        fetchUsers();
      } else {
        message.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Profile Image', key: 'profile_image', render: (_, record) => (
      record.profile_image ? <img src={record.profile_image} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%' }} /> : 'No Image'
    ) },
    { title: 'Created At', dataIndex: 'created_at', key: 'created_at' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => deleteUser(record.id)} danger />
        </>
      ),
    },
  ];

  return (
    <div className="pt-20 px-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16 }}>
        Add New User
      </Button>
      <Table columns={columns} dataSource={users} rowKey="id" />
      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: !editingUser }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Profile Image">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersManage;
