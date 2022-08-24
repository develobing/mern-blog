import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  passwordResetAction,
  resetUserAction,
} from '../../redux/slices/users/usersSlices';
import { useEffect } from 'react';
import { LockClosedIcon } from '@heroicons/react/solid';
import { toast } from 'react-toastify';

// Form schema
const formSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
});

const ResetPassword = (props) => {
  const { match, computedMatch } = props;
  const passwordToken = match
    ? match.params?.passwordToken
    : computedMatch.params?.passwordToken;

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
      dispatch(
        passwordResetAction({
          token: passwordToken,
          password: values?.password,
        })
      );
    },

    validationSchema: formSchema,
  });

  useEffect(() => {
    if (isUpdated) {
      toast.info(
        'Your password has been updated.\nPlease try logging in with a new password.'
      );
      history.push(`/profile/${userAuth?._id}`);
      dispatch(resetUserAction());
    }
  }, [isUpdated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              Reset your password if you have forgotten
            </a>
          </p>
        </div>

        {(appErr || serverErr) && (
          <div className="text-red-400">{appErr || serverErr}</div>
        )}

        <form className="mt-3 space-y-6" onSubmit={formik.handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <label htmlFor="email-address" className="sr-only">
              Enter Your New Password
            </label>
            <input
              type="password"
              autoComplete="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="New Password"
              value={formik.values.password}
              onChange={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
            />

            {/* Err msg */}
            <div className="text-red-400 mb-2">
              {formik.touched.password && formik.errors.password}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Try login again
              </Link>
            </div>
          </div>

          <div>
            {loading ? (
              <button
                disabled
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-gray-200 group-hover:text-gray-200"
                    aria-hidden="true"
                  />
                </span>
                Loading please wait...
              </button>
            ) : (
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Reset password
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
