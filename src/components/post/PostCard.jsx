import PropTypes from 'prop-types';

PostCard.propTypes = {
  image: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default function PostCard({ image, time, author, title }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={image || "https://placehold.co/600x400"}
        className="w-full h-48 object-cover"
        alt={title}
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-4">
          <span className="text-green-700">{time}</span> by <span className="font-bold">{author}</span>
        </p>
        <a href="#" className="text-green-600 font-semibold hover:underline">Read Post</a>
      </div>
    </article>
  );
}
