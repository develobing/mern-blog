import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/users/usersSlices';
import categoryReducer from '../slices/category/categorySlices';
import postReducer from '../slices/posts/postSlices';
import commentReducer from '../slices/comments/commentSlices';
import sendEmailReducer from '../slices/email/emailSlices';

const store = configureStore({
  reducer: {
    users: usersReducer,
    category: categoryReducer,
    post: postReducer,
    comment: commentReducer,
    email: sendEmailReducer,
  },
});

export default store;
