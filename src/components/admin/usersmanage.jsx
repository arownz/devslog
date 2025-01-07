import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const UsersManage = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

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
        // Redirect to login page or show unauthorized message
        return;
      }
      if (Array.isArray(data)) {
        setUsers(data);
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
    }
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingUser) {
        updateUser(values);
      } else {
        createUser(values);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const createUser = async (values) => {
    try {
      const response = await fetch('http://localhost/devslog/server/admin_create_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        message.success('User created successfully');
        fetchUsers();
        setIsModalVisible(false);
      } else {
        message.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Failed to create user');
    }
  };

  const updateUser = async (values) => {
    try {
      const response = await fetch('http://localhost/devslog/server/admin_update_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, id: editingUser.id }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        message.success('User updated successfully');
        fetchUsers();
        setIsModalVisible(false);
      } else {
        message.error('Failed to update user');
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
    <div className="pt-20 px-4"> {/* Added padding-top and padding-x */}
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
        </Form>
      </Modal>
    </div>
  );
};

export default UsersManage;