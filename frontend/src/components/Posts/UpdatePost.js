import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useHistory, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import CategoryDropdown from '../Categories/CategoryDropdown';
import {
  fetchPostDetailsAction,
  updatePostAction,
  resetPostAction,
} from '../../redux/slices/posts/postSlices';

const formSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
});

export default function UpdatePost(props) {
  const { match, computedMatch } = props;
  const _id = match ? match.params?._id : computedMatch.params?._id;

  const history = useHistory();
  const dispatch = useDispatch();
  const { post, loading, appErr, serverErr, isUpdated } = useSelector(
    (state) => state.post
  );
  const { userAuth } = useSelector((state) => state.users);

  // formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: post?.title || '',
      description: post?.description || '',
      category: post?.category || '',
    },

    onSubmit: (values) => {
      const editedPost = {
        _id: post?._id,
        title: values?.title,
        description: values?.description,
        category: values?.category,
      };

      // dispatch create post action
      dispatch(updatePostAction(editedPost));
    },

    validationSchema: formSchema,
  });

  useEffect(() => {
    // If not the owner of the post, redirect to the post list page
    if (post?._id && userAuth._id !== post?.user?._id) history.push('/posts');
  }, [post]);

  useEffect(() => {
    dispatch(fetchPostDetailsAction(_id));
  }, [_id, dispatch]);

  useEffect(() => {
    if (isUpdated) {
      history.push('/posts');
      dispatch(resetPostAction());
    }
  }, [isUpdated]);

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Are you sure you want to edit this post?
            <div className="mt-4 text-green-300">{post?.title}</div>
          </h2>

          {/* display error message */}
          {appErr || serverErr ? (
            <div className="text-red-500 font-semibold mb-4">
              {appErr || serverErr}
            </div>
          ) : null}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <div className="mt-1">
                  <input
                    id="title"
                    name="title"
                    type="title"
                    autoComplete="title"
                    onBlur={formik.handleBlur('title')}
                    value={formik.values.title}
                    onChange={formik.handleChange('title')}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="text-red-500">
                  {formik.touched.title && formik.errors.title}
                </div>
              </div>

              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <CategoryDropdown
                value={formik.values.category}
                onChange={formik.setFieldValue}
                onBlur={formik.setFieldTouched}
                error={formik.errors.category}
                touched={formik.touched.category}
              />

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  rows="5"
                  cols="10"
                  onBlur={formik.handleBlur('description')}
                  value={formik.values.description}
                  onChange={formik.handleChange('description')}
                  className="rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
                  type="text"
                ></textarea>
                <div className="text-red-500">
                  {formik.touched.description && formik.errors.description}
                </div>
              </div>

              <div>
                {loading ? (
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Loading please wait...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
