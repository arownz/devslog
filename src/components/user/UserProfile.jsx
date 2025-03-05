import { useState, useEffect } from 'react';
import { message, Upload, Form, Input, Button, Modal, Tabs } from 'antd';
import { UploadOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import Header from '../Header';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../post/AddPost.module.css';

const { TabPane } = Tabs;

export function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost/devslog/server/get_user_profile.php', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw response:', data); // Debug log

      if (data.success && data.user) {
        // Verify profile image data
        if (data.user.profile_image) {
          console.log('Profile image data exists:',
            data.user.profile_image.substring(0, 50) + '...');
        } else {
          console.log('No profile image data');
        }

        setUserData(data.user);
      } else {
        message.error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error('Error fetching profile');
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch('http://localhost/devslog/server/get_user_posts.php', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setUserPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleUpdate = async (values) => {
    const formData = new FormData();

    // Handle basic fields
    if (values.username) formData.append('username', values.username);
    if (values.email) formData.append('email', values.email);

    // Handle file upload
    if (values.profile_image?.fileList?.[0]?.originFileObj) {
      formData.append('profile_image', values.profile_image.fileList[0].originFileObj);
    }

    try {
      const response = await fetch('http://localhost/devslog/server/update_user_profile.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        message.success('Profile updated successfully');
        setIsEditing(false);
        fetchUserProfile();
      } else {
        message.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error updating profile');
    }
  };

  const handlePasswordUpdate = async (values) => {
    const formData = new FormData();
    formData.append('current_password', values.currentPassword);
    formData.append('new_password', values.newPassword);

    try {
      const response = await fetch('http://localhost/devslog/server/update_user_profile.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        message.success(data.message);
        setShowPasswordModal(false);
        passwordForm.resetFields();
      } else {
        message.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error sending password update request');
    }
  };

  const showEditPostModal = (post) => {
    console.log('Editing post:', post); // Debug log
    setEditingPost(post);
    editForm.setFieldsValue({
      title: post.title,
      content: post.content
    });
    setIsEditModalVisible(true);
  };

  const handleEditPost = async (values) => {
    try {
      const formData = new FormData();
      formData.append('id', editingPost.id);
      formData.append('title', values.title);
      formData.append('content', content); // Use the content state instead of values.content

      if (values.thumbnail?.fileList?.[0]?.originFileObj) {
        formData.append('thumbnail', values.thumbnail.fileList[0].originFileObj);
      }

      console.log('Sending update request for post:', editingPost.id); // Debug log

      const response = await fetch('http://localhost/devslog/server/update_user_post.php', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Important for session cookies
      });

      const data = await response.json();
      console.log('Update response:', data); // Debug log

      if (data.success) {
        message.success('Post updated successfully');
        setIsEditModalVisible(false);
        setEditingPost(null);
        editForm.resetFields();
        fetchUserPosts(); // Refresh posts list
      } else {
        message.error(data.message || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      message.error('Error updating post');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch('http://localhost/devslog/server/delete_user_post.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: postId }),
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        message.success('Post deleted successfully');
        fetchUserPosts();
      } else {
        message.error(data.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error deleting post');
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <Tabs defaultActiveKey="profile">
            <TabPane tab="Profile" key="profile">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
                {!isEditing && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                      {userData?.profile_image ? (
                        <img
                          src={userData.profile_image}
                          alt={`${userData.username}'s profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log("Original image source:", userData.profile_image); // Debug
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%23999" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <UserOutlined className="text-4xl text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">{userData.username}</h2>
                      <p className="text-gray-600">{userData.email}</p>
                      <p className="text-sm text-gray-500">
                        Joined {new Date(userData.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">Total Posts</p>
                      <p className="text-2xl font-bold">{userData.post_count}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">Total Comments</p>
                      <p className="text-2xl font-bold">{userData.comment_count}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    username: userData?.username,
                    email: userData?.email,
                  }}
                  onFinish={handleUpdate}
                >
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="profile_image"
                    label="Profile Image"
                  >
                    <Upload
                      maxCount={1}
                      beforeUpload={() => false}
                      accept="image/*"
                      listType="picture-card"
                      showUploadList={true}
                    >
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>

                  <div className="flex justify-between">
                    <Button onClick={() => setShowPasswordModal(true)} type="link">
                      Change Password
                    </Button>
                    <div className="space-x-4">
                      <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button type="primary" htmlType="submit" className="bg-green-600">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </TabPane>
            <TabPane tab="My Posts" key="posts">
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{post.title}</h3>
                        <div className="flex items-center space-x-4 mt-2">
                          {post.thumbnail && (
                            <img
                              src={`data:image/jpeg;base64,${post.thumbnail}`}
                              alt="Post thumbnail"
                              className="w-24 h-24 object-cover rounded"
                            />
                          )}
                          <div
                            className="text-gray-600 line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Posted on {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          type="primary"
                          onClick={() => showEditPostModal(post)}
                          className="bg-blue-500"
                        >
                          Edit
                        </Button>
                        <Button
                          danger
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>

      <Modal
        title="Change Password"
        open={showPasswordModal}
        onCancel={() => setShowPasswordModal(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordUpdate}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please input your current password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: 'Please input your new password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setShowPasswordModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-green-600">
              Update Password
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Edit Post"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingPost(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        {editingPost && (
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditPost}
            initialValues={{
              title: editingPost.title,
              content: editingPost.content
            }}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please input post title!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true, message: 'Please input post content!' }]}
            >
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className={styles.resizeEditor}
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                    { 'indent': '-1' }, { 'indent': '+1' }],
                    ['link', 'image', 'video'],
                    ['clean'],
                    ['code-block']
                  ],
                  clipboard: {
                    matchVisual: false,
                  }
                }}
                formats={[
                  'header', 'font', 'size',
                  'bold', 'italic', 'underline', 'strike', 'blockquote',
                  'list', 'bullet', 'indent',
                  'link', 'image', 'video',
                  'code-block'
                ]}
              />
            </Form.Item>

            <Form.Item
              name="thumbnail"
              label="Thumbnail"
            >
              <Upload
                maxCount={1}
                beforeUpload={() => false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
            </Form.Item>

            <Form.Item className="text-right">
              <Button type="default" onClick={() => setIsEditModalVisible(false)} className="mr-2">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" className="bg-blue-500">
                Update Post
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}