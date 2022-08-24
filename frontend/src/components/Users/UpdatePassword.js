import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  updatePasswordAction,
  resetUserAction,
} from '../../redux/slices/users/usersSlices';
import { useEffect } from 'react';

// Form schema
const formSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
});

export default function UpdatePassword() {
  const history = useHistory();
  const dispatch = useDispatch();

  const { userAuth, loading, appErr, serverErr, isUpdated } = useSelector(
    (state) => state.users
  );

  // formik
  const formik = useFormik({
    initialValues: {
      password: '',
    },

    onSubmit: (values) => {
      const { _id: _userId } = userAuth;
      const { password } = values;

      dispatch(updatePasswordAction({ _userId, password }));
    },

    validationSchema: formSchema,
  });

  // useEffect(() => {
  //   if (isUpdated) {
  //     history.push('/categories');
  //     dispatch(resetCategoryAction());
  //   }
  // }, [isUpdated]);

  useEffect(() => {
    if (isUpdated) {
      history.push(`/profile/${userAuth?._id}`);
      dispatch(resetUserAction());
    }
  }, [isUpdated]);

  return (
    <div className="min-h-screen bg-gray-700  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
          Change your password
        </h2>
      </div>

      {(appErr || serverErr) && (
        <div className="mt-3 text-center text-red-500 text-lg">
          {appErr || serverErr}
        </div>
      )}

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="flex items-center pl-6 mb-6 border border-gray-50 bg-white rounded-full">
              <span className="inline-block pr-3 border-r border-gray-50">
                <svg
                  className="w-5 h-5"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.6243 13.5625C15.3939 13.5625 15.2077 13.7581 15.2077 14V16.4517C15.2077 18.2573 14.0443 20.125 12.0973 20.125H5.42975C3.56848 20.125 1.87435 18.3741 1.87435 16.4517V10.5H15.6243C15.8547 10.5 16.041 10.3044 16.041 10.0625C16.041 9.82058 15.8547 9.625 15.6243 9.625H15.2077V5.95175C15.2077 2.39183 12.8635 0 9.37435 0H7.70768C4.21855 0 1.87435 2.39183 1.87435 5.95175V9.625H1.45768C1.22728 9.625 1.04102 9.82058 1.04102 10.0625V16.4517C1.04102 18.8322 3.13268 21 5.42975 21H12.0972C14.3089 21 16.0409 19.0023 16.0409 16.4517V14C16.041 13.7581 15.8547 13.5625 15.6243 13.5625ZM2.70768 5.95175C2.70768 2.86783 4.67022 0.875 7.70768 0.875H9.37435C12.4119 0.875 14.3743 2.86783 14.3743 5.95175V9.625H2.70768V5.95175Z"
                    fill="black"
                  ></path>
                  <path
                    d="M18.8815 9.3711C18.7482 9.17377 18.4878 9.12827 18.3003 9.26701L8.58655 16.4919L6.75235 14.5655C6.58942 14.3944 6.32608 14.3944 6.16322 14.5655C6.00028 14.7366 6.00028 15.0131 6.16322 15.1842L8.24655 17.3717C8.32695 17.4561 8.43362 17.4999 8.54115 17.4999C8.62488 17.4999 8.70868 17.4732 8.78282 17.4194L18.7828 9.98185C18.9703 9.84143 19.0141 9.56843 18.8815 9.3711Z"
                    fill="black"
                  ></path>
                </svg>
              </span>
              {/* Password */}

              <input
                className="w-full border-gray-300 border-2 pr-6 pl-4 py-4 font-bold placeholder-gray-300 rounded-r-full focus:outline-none"
                type="password"
                placeholder=" Password"
                value={formik.values.password}
                onChange={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
              />
            </div>

            {/* Err msg */}
            <div className="text-red-400 mb-2">
              {formik.touched.password && formik.errors.password}
            </div>

            <div>
              {/* Submit btn */}
              {loading ? (
                <button
                  disabled
                  type="submit"
                  className="inline-flex bg-gray-700 justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <span>Loading please wait...</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex bg-indigo-700 justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-200  hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <span>Update Password</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
