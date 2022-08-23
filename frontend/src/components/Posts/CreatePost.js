import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import {
  createPostAction,
  resetPostAction,
} from '../../redux/slices/posts/postSlices';
import CategoryDropdown from '../Categories/CategoryDropdown';
import Dropzone from 'react-dropzone';

// Form schema
const formSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  image: Yup.mixed(),
});

//css for dropzone
const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  border-color:'red'
  transition: border 0.24s ease-in-out;
`;

export default function CreatePost() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userAuth } = useSelector((state) => state.users);
  const { loading, appErr, serverErr, isUpdated } = useSelector(
    (state) => state.post
  );

  // formik
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      image: null,
    },

    onSubmit: (values) => {
      const post = {
        ...values,
        user: userAuth?._id,
      };

      // dispatch create post action
      dispatch(createPostAction(post));
    },

    validationSchema: formSchema,
  });

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
            Create Post
          </h2>

          <div className="mt-2 text-center text-sm text-gray-600">
            <p className="font-medium text-green-600 hover:text-indigo-500">
              Share your ideas to the word. Your post must be free from
              profanity
            </p>
          </div>

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
                  {/* Title */}
                  <input
                    id="title"
                    name="title"
                    type="title"
                    autoComplete="title"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formik.values.title}
                    onChange={formik.handleChange('title')}
                    onBlur={formik.handleBlur('title')}
                  />
                </div>
                {/* Err msg */}
                <div className="text-red-500">
                  {formik.touched?.title && formik.errors?.title}
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
                error={formik.errors?.category}
                touched={formik.touched?.category}
              />

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                {/* Description */}
                <textarea
                  id="description"
                  rows="5"
                  cols="10"
                  className="rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
                  type="text"
                  value={formik.values.description}
                  onChange={formik.handleChange('description')}
                  onBlur={formik.handleBlur('description')}
                ></textarea>
                {/* Err msg */}
                <div className="text-red-500">
                  {formik.touched?.description && formik.errors?.description}
                </div>
              </div>

              {/* Image component */}
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image
              </label>

              <Container className="container bg-gray-600">
                <Dropzone
                  onBlur={formik.handleBlur('image')}
                  accept="image/jpeg, image/png"
                  onDrop={(acceptedFiles) => {
                    formik.setFieldValue('image', acceptedFiles[0]);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div className="container">
                      <div
                        {...getRootProps({
                          className: 'dropzone',
                          onDrop: (event) => event.stopPropagation(),
                        })}
                      >
                        <input {...getInputProps()} />
                        <p className="text-gray-300 text-lg cursor-pointer hover:text-gray-500">
                          Click here to select image
                        </p>
                      </div>
                    </div>
                  )}
                </Dropzone>
              </Container>

              <div>
                {/* Submit btn */}
                {loading ? (
                  <button
                    disabled
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
                    Create
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
