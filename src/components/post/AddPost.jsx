import { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import styles from './AddPost.module.css';

export default function AddPost({ onClose }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            const response = await fetch('http://localhost/devslog/server/create_post.php', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const responseText = await response.text();
            console.log('Raw server response:', responseText);

            try {
                const data = JSON.parse(responseText);
                console.log('Parsed server response:', data);

                if (data.success) {
                    console.log('Post created successfully');
                    onClose();
                } else {
                    console.error('Failed to create post:', data.message);
                }
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError);
                console.error('Raw response:', responseText);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Post</h3>
                    <form onSubmit={handleSubmit} className="mt-2 text-left">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Title
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="title"
                                type="text"
                                placeholder="Enter post title"
                                maxLength={250}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnail">
                                Thumbnail Image
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbnail(e.target.files[0])}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                Content
                            </label>
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
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Add Post
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

AddPost.propTypes = {
    onClose: PropTypes.func.isRequired,
};

