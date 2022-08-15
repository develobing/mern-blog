import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  fetchCommentAction,
  updateCommentAction,
  resetCommentAction,
} from '../../redux/slices/comments/commentSlices';
import Loading from '../../utils/Loading';

// Form schema
const formSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
});

export default function UpdateComment(props) {
  const { match, computedMatch } = props;
  const _id = match ? match.params?._id : computedMatch.params?._id;

  const history = useHistory();
  const dispatch = useDispatch();
  const { comment, loading, appErr, serverErr, isUpdated } = useSelector(
    (state) => state.comment
  );

  // formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: comment?.description || '',
    },

    onSubmit: (values) => {
      const data = {
        _id,
        description: values?.description,
      };

      // dispatch create post action
      dispatch(updateCommentAction(data));
    },

    validationSchema: formSchema,
  });

  useEffect(() => {
    dispatch(fetchCommentAction(_id));
  }, [_id, dispatch]);

  useEffect(() => {
    if (isUpdated) {
      history.push(`/posts/${comment?.post}`);
      dispatch(resetCommentAction());
    }
  }, [isUpdated]);

  return (
    <div className="flex justify-center items-center h-96  bg-gray-700 ">
      <div className="flex flex-col justify-center items-center">
        {loading && <Loading />}

        {/* Form start here */}
        <form
          className="mt-1 flex max-w-sm m-auto"
          onSubmit={formik.handleSubmit}
        >
          {/* Description */}
          <input
            type="text"
            name="text"
            id="text"
            className="shadow-sm focus:ring-indigo-500  mr-2 focus:border-indigo-500 block w-full p-2 border-1 sm:text-sm border-gray-300 rounded-md"
            placeholder="Update comment"
            value={formik.values.description}
            onChange={formik.handleChange('description')}
            onBlur={formik.handleBlur('description')}
          />
          {/* submit btn */}
          <button
            type="submit"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>

        {/* Error message */}
        {(appErr || serverErr) && (
          <div className="text-red-400 mb-2 mt-2">{appErr || serverErr}</div>
        )}

        <div className="text-red-400 mb-2 mt-2">
          {formik.touched.description && formik.errors.description}
        </div>
      </div>
    </div>
  );
}
