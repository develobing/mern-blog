import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import Moment from 'react-moment';
import { useEffect } from 'react';
import {
  fetchPostCommentsAction,
  deleteCommentAction,
  resetCommentAction,
} from '../../redux/slices/comments/commentSlices';
import { fetchPostDetailsAction } from '../../redux/slices/posts/postSlices';
import Loading from '../../utils/Loading';

export default function CommentsList({ postId }) {
  const dispatch = useDispatch();
  const { userAuth } = useSelector((state) => state.users);
  const { comments, loading, appErr, serverErr, isUpdated } = useSelector(
    (state) => state.comment
  );

  const handleDelete = (comment) => {
    const { _id } = comment;
    const isDelete = window.confirm(
      `Are you sure you want to delete this comment?`
    );
    if (isDelete) {
      dispatch(deleteCommentAction(_id));
    }
  };

  useEffect(() => {
    if (postId) dispatch(fetchPostCommentsAction(postId));
  }, [postId]);

  useEffect(() => {
    if (isUpdated) {
      renewComments();
    }
  }, [isUpdated]);

  const renewComments = () => {
    dispatch(resetCommentAction());
    dispatch(fetchPostDetailsAction(postId));
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : appErr || serverErr ? (
        <div className="text-center">
          <div className=" text-red-400 text-xl">{appErr || serverErr}</div>
        </div>
      ) : null}

      <ul className="divide-y bg-gray-700 w-96 divide-gray-200 p-3 mt-5">
        <div className="text-gray-400"> - Comments</div>

        <>
          {comments?.map((comment) => (
            <li className="py-4 w-full" key={comment?._id}>
              <div className="flex space-x-3">
                {/* user Image */}
                <img
                  className="h-6 w-6 rounded-full"
                  src={comment?.user?.profilePhoto}
                  alt=""
                />

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link to={`/profile/${comment?.user?._id}`}>
                      <h3 className="text-sm font-medium text-green-400">
                        {comment?.user?.firstName} {comment?.user?.lastName}
                      </h3>
                    </Link>

                    <p className="text-bold text-yellow-500 text-base ml-5">
                      <Moment fromNow ago>
                        {comment?.createdAt}
                      </Moment>{' '}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {comment?.description}
                  </p>
                  {/* Check if is the same user created this comment */}

                  {/* Show delete and update btn if created user */}
                  {userAuth?._id === comment?.user?._id && (
                    <p className="flex">
                      <Link
                        className="p-3"
                        to={`/update-comment/${comment?._id}`}
                      >
                        {/* Edit Icon */}
                        <PencilAltIcon className="h-5 mt-3 text-yellow-300" />
                      </Link>
                      {/* Delete icon */}
                      <button
                        className="ml-3"
                        onClick={() => handleDelete(comment)}
                      >
                        <TrashIcon className="h-5 mt-3 text-red-600" />
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </>
      </ul>
    </div>
  );
}
