import React from 'react';
const PropTypes = React.PropTypes;

const CommentsList = (props) => (
	<div className={'comments-list' + (!props.showPromptMsg ? ' name-prompt' : '')}>
		{ !props.showPromptMsg
		 ? <div className="prompt-msg">Enter your name below...</div>
		 : props.comments }
	</div>
);


CommentsList.propTypes = {
	comments: PropTypes.array.isRequired
};

export default CommentsList;