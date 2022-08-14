import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  PlusCircleIcon,
  BookOpenIcon,
  TrashIcon,
} from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  resetCategoryAction,
} from '../../redux/slices/category/categorySlices';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Form schema
const formSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
});

const UpdateCategory = (props) => {
  const history = useHistory();
  const { match, computedMatch } = props;
  const _id = match ? match.params?._id : computedMatch.params?._id;

  const dispatch = useDispatch();
  const { category, loading, appErr, serverErr, isUpdated } = useSelector(
    (state) => state.category
  );

  // formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: category?.title || '',
    },

    onSubmit: (values) => {
      // dispatch update category action
      dispatch(updateCategoryAction({ ...values, _id }));
    },

    validationSchema: formSchema,
  });

  useEffect(() => {
    dispatch(fetchCategoryAction({ _id }));
  }, []);

  useEffect(() => {
    if (isUpdated) {
      history.push('/categories');
      dispatch(resetCategoryAction());
    }
  }, [isUpdated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <BookOpenIcon className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Update Category
          </h2>
          <div className="mt-2 text-center text-sm text-gray-600">
            <p className="font-medium text-indigo-600 hover:text-indigo-500">
              These are the categories user will select when creating a post
            </p>

            {/* display error message */}
            {appErr || serverErr ? (
              <div className="text-red-500 font-semibold mb-4">
                {appErr || serverErr}
              </div>
            ) : null}
          </div>
        </div>
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Name
              </label>
              {/* Title */}
              <input
                type="text"
                autoComplete="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center focus:z-10 sm:text-sm"
                placeholder="New Category"
                value={formik.values.title}
                onChange={formik.handleChange('title')}
                onBlur={formik.handleBlur('title')}
              />
              <div className="text-red-400 mb-2">
                {formik.touched.title && formik.errors.title}
              </div>
            </div>
          </div>

          <div>
            <div>
              {/* Submit */}
              {loading ? (
                <button
                  disabled
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <PlusCircleIcon
                      className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                  </span>
                  Loading please wait...
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <PlusCircleIcon
                        className="h-5 w-5 text-yellow-500 group-hover:text-yellow-400"
                        aria-hidden="true"
                      />
                    </span>
                    Update Category
                  </button>

                  <button
                    type="submit"
                    className="group mt-2 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => dispatch(deleteCategoryAction({ _id }))}
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <TrashIcon
                        className="h-5 w-5 text-red-500 group-hover:text-red-400"
                        aria-hidden="true"
                      />
                    </span>
                    Delete Category
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategory;
