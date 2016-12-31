import React from 'react';
const PropTypes = React.PropTypes;

const Comment = (props) => (
	<div className="single-comment">
		<div className="meta">
			<span className="name">{props.username}</span>
			<span className="time">{props.time}</span>
		</div>
		<p>{props.commentText}</p>
	</div>
);

Comment.propTypes = {
	commentText: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired,
	time: PropTypes.string
};

export default Comment;

