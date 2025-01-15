import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Image } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../post/AddPost.module.css';

const PostsManage = () => {
  const [posts, setPosts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost/devslog/server/admin_get_posts.php', {
        credentials: 'include'
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
        setPosts(data);
      } else {
        console.error('Received data is not an array:', data);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error('Failed to fetch posts');
      setPosts([]);
    }
  };

  const showEditModal = (post) => {
    setEditingPost(post);
    form.setFieldsValue({
      title: post.title,
      content: post.content,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPost(null);
    form.resetFields();
  };

  const handleUpdate = async (values) => {
    try {
      const formData = new FormData();
      formData.append('id', editingPost.id);
      formData.append('title', values.title);
      formData.append('content', values.content);
      if (values.thumbnail) {
        formData.append('thumbnail', values.thumbnail);
      }

      const response = await fetch('http://localhost/devslog/server/admin_update_post.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        message.success('Post updated successfully');
        setIsModalVisible(false);
        fetchPosts();
      } else {
        message.error('Failed to update post: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      message.error('Failed to update post');
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch('http://localhost/devslog/server/admin_delete_post.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId }),
        credentials: 'include',
      });
  
      const responseText = await response.text(); // Get raw response text
      console.log('Response Text:', responseText); // Debug log
  
      // Attempt to parse the response as JSON.
      const data = JSON.parse(responseText);
  
      if (data.success) {
        message.success('Post deleted successfully');
        fetchPosts(); // Refresh posts after deletion.
      } else {
        message.error('Failed to delete post: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      message.error('Failed to delete post: ' + error.message);
    }
  };
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 130,
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (content) => {
        const truncatedContent = content.length > 100 ? content.substring(0, 80) + '...' : content;
        return (
          <div title={content}>{truncatedContent}</div>
        );
      },
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (thumbnail) => (
        <Image
          src={`data:image/jpeg;base64,${thumbnail}`}
          alt="Thumbnail"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: 100,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 150,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
        </>
      ),
    },
  ];


  return (
    <div className="pt-20 px-4"> {/* Added padding-top and padding-x */}
      <h1 className="text-2xl font-bold mb-4">Manage Posts</h1>
      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        scroll={{ x: 'max-content' }} // Enable horizontal scroll
      />

      <Modal
        title="Edit Post"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true }]}>
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
          <Form.Item name="thumbnail" label="Thumbnail">
            <Input type="file" accept="image/*" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Post
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostsManage;
