import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  passwordTokenAction,
  resetUserAction,
} from '../../redux/slices/users/usersSlices';
import { useEffect } from 'react';
import { LockClosedIcon } from '@heroicons/react/solid';
import { toast } from 'react-toastify';

// Form schema
const formSchema = Yup.object().shape({
  email: Yup.string().email('Email is invalid').required('Email is required'),
});

const ForgetPassword = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { loading, appErr, serverErr, isUpdated } = useSelector(
    (state) => state.users
  );

  // formik
  const formik = useFormik({
    initialValues: {
      email: '',
    },

    onSubmit: (values) => {
      dispatch(passwordTokenAction(values?.email));
    },

    validationSchema: formSchema,
  });

  useEffect(() => {
    if (isUpdated) {
      toast.info('Reset password token has sent.\nPlease check your email.');
      history.push(`/login`);
      dispatch(resetUserAction());
    }
  }, [isUpdated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forget Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              Please enter your email to reset your password
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
              Enter Your Email Address
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={formik.values.email}
              onChange={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
            />

            {/* Err msg */}
            <div className="text-red-400 mb-2">
              {formik.touched.email && formik.errors.email}
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
                Get a link to reset Password
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
