'use strict';
import axios from 'axios';

const getAllComments = () => {
	return axios.get('/comments');
};

export default getAllComments;