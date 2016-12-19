import React from 'react';
const PropTypes = React.PropTypes;

const Comment = (props) => (
	<div className="single-comment" key={props.key}>
		<p>{props.commentText}</p>
	</div>
);

Comment.propTypes = {
	commentText: PropTypes.string,
	key: PropTypes.number
};

export default Comment;

