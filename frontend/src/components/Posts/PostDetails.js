import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import {
  fetchPostDetailsAction,
  deletePostAction,
  resetPostAction,
} from '../../redux/slices/posts/postSlices';
import DateFormatter from '../../utils/DateFormatter';
import Loading from '../../utils/Loading';
import CommentsList from '../Comments/CommentsList';
import AddComment from '../Comments/AddComment';

const PostDetails = ({
  match: {
    params: { _id },
  },
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { post, loading, appErr, serverErr, isUpdated } = useSelector(
    (state) => state.post
  );
  const { userAuth } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchPostDetailsAction(_id));
  }, [_id, dispatch]);

  const handleDelete = (post) => {
    const { _id } = post;
    const isDelete = window.confirm(
      `Are you sure you want to delete this post?`
    );
    if (isDelete) {
      dispatch(deletePostAction(_id));
    }
  };

  useEffect(() => {
    if (isUpdated) {
      history.push('/posts');
      dispatch(resetPostAction());
    }
  }, [isUpdated]);

  return (
    <>
      <section className="py-20 2xl:py-40 bg-gray-800 overflow-hidden">
        {loading ? (
          <Loading />
        ) : appErr || serverErr ? (
          <div className="text-center">
            <div className=" text-red-400 text-xl">{appErr || serverErr}</div>
          </div>
        ) : null}

        <div className="container px-4 mx-auto">
          {/* Post Image */}
          <img
            className="mb-24 w-full h-auto object-cover"
            src={post?.image}
            alt=""
          />
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mt-7 mb-14 text-6xl 2xl:text-7xl text-white font-bold font-heading">
              {post?.title}
            </h2>

            {/* User */}
            <div className="inline-flex pt-14 mb-14 items-center border-t border-gray-500">
              <img
                className="mr-8 w-20 lg:w-24 h-20 lg:h-24 rounded-full"
                src={post?.user?.profilePhoto}
                alt=""
              />
              <div className="text-left">
                <h4 className="mb-1 text-2xl font-bold text-gray-50">
                  <span className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-orange-600">
                    {post?.user?.firstName} {post?.user?.lastName}
                  </span>
                </h4>
                <p className="text-gray-500">
                  <DateFormatter date={post?.createdAt} />
                </p>
              </div>
            </div>
            {/* Post description */}
            <div className="max-w-xl mx-auto">
              <p className="mb-6 text-left  text-xl text-gray-200">
                {post?.description}

                {/* Show delete and update btn if created user */}
                {userAuth?._id === post?.user?._id && (
                  <p className="flex">
                    <Link className="p-3" to={`/update-post/${post?._id}`}>
                      <PencilAltIcon className="h-8 mt-3 text-yellow-300" />
                    </Link>
                    <button className="ml-3" onClick={() => handleDelete(post)}>
                      <TrashIcon className="h-8 mt-3 text-red-600" />
                    </button>
                  </p>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Add comment Form component here */}
        {userAuth?._id && <AddComment postId={post?._id} />}

        <div className="flex justify-center  items-center">
          <CommentsList postId={post?._id} />
        </div>
      </section>
    </>
  );
};

export default PostDetails;
