import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import queryString from 'query-string';
import {
  sendEmailAction,
  resetEmailAction,
} from '../../redux/slices/email/emailSlices';
import { useHistory } from 'react-router-dom';

// Form schema
const formSchema = Yup.object().shape({
  to: Yup.string().email('Email is invalid').required('Email is required'),
  subject: Yup.string().required('Subject name is required'),
  message: Yup.string().required('Message name is required'),
});

export default function SendEmail({ location }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { emailSent, loading, serverErr, appErr, isUpdated } = useSelector(
    (state) => state.email
  );

  const query = queryString.parse(location?.search);
  const { _userId, email } = query;
  // if (typeof email !== 'string') history.push('/');

  // formik
  const formik = useFormik({
    initialValues: {
      to: email,
      subject: '',
      message: '',
    },

    onSubmit: (values) => {
      // dispatch send email action
      dispatch(sendEmailAction(values));
    },

    validationSchema: formSchema,
  });

  useEffect(() => {
    if (isUpdated) {
      if (_userId) history.push(`/profile/${_userId}`);
      else history.push('/');

      dispatch(resetEmailAction());
    }
  }, [isUpdated]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
          Send Mesage
          {/* Email title */}
          {/* <span className="text-green-300">email title</span> */}
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          {/* Display err here */}
          {(appErr || serverErr) && (
            <span className="text-red-500">{appErr || serverErr}</span>
          )}
        </p>

        <div className="mt-2 text-center text-sm text-gray-600">
          {emailSent && <div>Sent</div>}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="to"
                className="block text-sm font-medium text-gray-700"
              >
                Recipient Email
              </label>
              {/* Email to */}
              <div className="mt-1">
                <input
                  disabled
                  id="to"
                  name="to"
                  type="to"
                  autoComplete="to"
                  className="appearance-none block w-full px-3 py-2 border bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formik.values.to}
                  onChange={formik.handleChange('to')}
                  onBlur={formik.handleBlur('to')}
                />
              </div>
              {/* Err msg */}
              <div className="text-red-500">
                {formik.touched.to && formik.errors.to}
              </div>
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <div className="mt-1">
                {/* Subject */}
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  autoComplete="subject"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formik.values.subject}
                  onChange={formik.handleChange('subject')}
                  onBlur={formik.handleBlur('subject')}
                />
              </div>
              {/* err msg */}
              <div className="text-red-500">
                {formik.touched.subject && formik.errors.subject}
              </div>
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              {/* email message */}
              <textarea
                id="message"
                rows="5"
                cols="10"
                className="rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
                type="text"
                value={formik.values.message}
                onChange={formik.handleChange('message')}
                onBlur={formik.handleBlur('message')}
              ></textarea>
              {/* err here */}
              <div className="text-red-500">
                {formik.touched.message && formik.errors.message}
              </div>
            </div>
            {/* Submit btn */}
            <div>
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
                  Send
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
