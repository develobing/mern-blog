import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  EmojiSadIcon,
  UploadIcon,
  UserIcon,
} from '@heroicons/react/outline';
import DateFormatter from '../../utils/DateFormatter';
import {
  fetchProfileAction,
  followUserAction,
  unfollowUserAction,
  resetUserAction,
} from '../../redux/slices/users/usersSlices';
import { MailIcon, EyeIcon } from '@heroicons/react/solid';
import Loading from '../../utils/Loading';

export default function Profile(props) {
  const { match, computedMatch } = props;
  const _id = match ? match.params?._id : computedMatch.params?._id;

  const dispatch = useDispatch();
  const { userAuth, profile, loading, appErr, serverErr, isUpdated } =
    useSelector((state) => state.users);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (isUpdated) {
      dispatch(resetUserAction());
      fetchProfile();
    }
  }, [isUpdated]);

  const fetchProfile = () => {
    dispatch(fetchProfileAction(_id));
  };

  const isLoginUser = userAuth?._id === _id;

  return (
    <>
      <div className="h-screen flex overflow-hidden bg-white">
        {/* Static sidebar for desktop */}

        {/* Display err here */}
        {loading && <Loading />}
        {appErr || serverErr ? (
          <div className="flex items-center justify-center min-w-0 flex-1 bg-gray-300">
            <div className="text-red-500 text-2xl">
              {appErr ? appErr : serverErr}
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
            <div className="flex-1 relative z-0 flex overflow-hidden">
              <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
                <article>
                  {/* Profile header */}
                  <div>
                    <div>
                      <img
                        className="h-32 w-full object-cover lg:h-64"
                        src={profile?.profilePhoto}
                        alt={profile?.fullName}
                      />
                    </div>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                        <div className="flex -mt-20">
                          <img
                            className="h-24 w-24 rounded-full  ring-4 ring-white sm:h-32 sm:w-32"
                            src={profile?.profilePhoto}
                            alt={profile?.fullName}
                          />
                        </div>
                        <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                          <div className="flex flex-col 2xl:block mt-10 min-w-0 flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 ">
                              {profile?.fullName}{' '}
                              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                {profile?.role}
                              </span>
                              {/* Display if verified or not */}
                              {profile?.isAccountVerified ? (
                                <span className="inline-flex ml-2 items-center px-3 py-0.5  rounded-lg text-sm font-medium bg-green-600 text-gray-300">
                                  Account Verified
                                </span>
                              ) : (
                                <span className="inline-flex ml-2 items-center px-3 py-0.5  rounded-lg text-sm font-medium bg-red-600 text-gray-300">
                                  Unverified Account
                                </span>
                              )}
                            </h1>
                            <p className="m-3 text-lg">
                              Date Joined:
                              <DateFormatter date={profile?.createdAt} />{' '}
                            </p>
                            <p className="text-green-400 mt-2 mb-2">
                              {profile?.posts?.length} posts
                              <br />
                              {profile?.followers?.length} followers
                              <br />
                              {profile?.following?.length} following
                            </p>
                            {/* Who view my profile */}
                            <div className="flex items-center  mb-2">
                              <EyeIcon className="h-5 w-5 " />
                              <div className="pl-2">
                                {profile?.viewedBy?.length}{' '}
                                <span className="text-indigo-400 cursor-pointer hover:underline">
                                  users
                                  <br />
                                  viewed your profile
                                </span>
                              </div>
                            </div>

                            {/* is login user */}
                            {/* Upload profile photo */}
                            {userAuth?._id === profile?._id && (
                              <Link
                                to="/upload-profile-photo"
                                className="inline-flex justify-center w-48 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                              >
                                <UploadIcon
                                  className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span>Upload Photo</span>
                              </Link>
                            )}
                          </div>

                          <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                            {/* // Hide follow button from the same */}

                            {userAuth?._id !== profile?._id && (
                              <div>
                                {profile?.followers?.includes(userAuth?._id) ? (
                                  <button
                                    onClick={() =>
                                      dispatch(unfollowUserAction(profile?._id))
                                    }
                                    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                  >
                                    <EmojiSadIcon
                                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span>Unfollow</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      dispatch(followUserAction(profile?._id))
                                    }
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                  >
                                    <HeartIcon
                                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span>Follow </span>
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Update Profile */}
                            {userAuth?._id === profile?._id && (
                              <Link
                                to={`/update-profile`}
                                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                              >
                                <UserIcon
                                  className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span>Update Profile</span>
                              </Link>
                            )}

                            {/* Send Mail */}
                            <Link
                              to={`/send-email?_userId=${profile?._id}&email=${profile?.email}`}
                              className="inline-flex justify-center bg-indigo-900 px-4 py-2 border border-yellow-700 shadow-sm text-sm font-medium rounded-md text-gray-700  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                              <MailIcon
                                className="-ml-1 mr-2 h-5 w-5 text-gray-200"
                                aria-hidden="true"
                              />
                              <span className="text-base mr-2  text-bold text-yellow-500">
                                Send Message
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 truncate">
                          {profile?.lastName}
                        </h1>
                      </div>
                    </div>
                  </div>
                  {/* Tabs */}
                  <div className="mt-6 sm:mt-2 2xl:mt-5">
                    <div className="border-b border-red-900">
                      <div className="max-w-5xl mx-auto "></div>
                    </div>
                  </div>
                  <div className="flex justify-center place-items-start flex-wrap  md:mb-0">
                    <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
                      <h1 className="text-center text-xl border-gray-500 mb-2 border-b-2">
                        Who viewed my profile : 9
                      </h1>

                      {/* Who view my post */}
                      <ul className="">
                        <Link>
                          <div className="flex mb-2 items-center space-x-4 lg:space-x-6">
                            <img
                              className="w-16 h-16 rounded-full lg:w-20 lg:h-20"
                              // src={user.profilePhoto}
                              // alt={user?._id}
                            />
                            <div className="font-medium text-lg leading-6 space-y-1">
                              <h3>
                                {/* {user?.firstName} {user?.lastName} */}Name
                              </h3>
                              <p className="text-indigo-600">
                                {/* {user.accountType} */} Account Type
                              </p>
                            </div>
                          </div>
                        </Link>
                      </ul>
                    </div>

                    {/* All my Post */}
                    <div className="w-full md:w-2/3 px-4 mb-4 md:mb-0">
                      <h1 className="text-center text-xl border-gray-500 mb-2 border-b-2">
                        My Post - {profile?.posts?.length}
                      </h1>
                      {/* Loop here */}

                      {profile?.posts.length <= 0 ? (
                        <div className="text-center text-gray-500">No Post</div>
                      ) : (
                        profile?.posts.map((post) => (
                          <div
                            className="flex flex-wrap  -mx-3 mt-3 lg:mb-6"
                            key={post?._id}
                          >
                            <div className="mb-2   w-full lg:w-1/4 px-3">
                              <Link to={`/posts/${post?._id}`}>
                                <img
                                  className="object-cover h-40 rounded"
                                  src={post?.image}
                                  alt="poster"
                                />
                              </Link>
                            </div>
                            <div className="w-full lg:w-3/4 px-3">
                              <Link
                                to={`/posts/${post?._id}`}
                                className="hover:underline"
                              >
                                <h3 className="mb-1 text-2xl text-green-400 font-bold font-heading">
                                  {/* {capitalizeWord(post?.title)} */}
                                  {post?.title}
                                </h3>
                              </Link>
                              <p className="text-gray-600 truncate">
                                {post?.description}
                              </p>
                              {/* Read more */}
                              <Link
                                className="text-indigo-500 hover:underline"
                                to={`/posts/${post?._id}`}
                              >
                                Read more
                              </Link>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </article>
              </main>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
