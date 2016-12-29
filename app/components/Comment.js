import React from 'react';
const PropTypes = React.PropTypes;

const Comment = (props) => (
	<div className="single-comment">
		<p>{props.commentText}</p>
	</div>
);

Comment.propTypes = {
	commentText: PropTypes.string,
};

export default Comment;

