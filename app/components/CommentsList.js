import React from 'react';
const PropTypes = React.PropTypes;

const CommentsList = (props) => (
	<div className="comments-list">
		{props.comments}
	</div>
);


CommentsList.propTypes = {
	comments: PropTypes.array.isRequired
};

export default CommentsList;