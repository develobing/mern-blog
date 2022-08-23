import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthorsListHeader from './AuthorsListHeader';
import AuthorsListItem from './AuthorsListItem';
import {
  fetchUsersAction,
  resetUserAction,
} from '../../redux/slices/users/usersSlices';
import Loading from '../../utils/Loading';

const AuthorsList = () => {
  const dispatch = useDispatch();
  const { users, appErr, serverErr, loading, isUpdated } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsersAction());

    if (isUpdated) dispatch(resetUserAction());
  }, [isUpdated]);

  return (
    <>
      <section className="py-8 bg-gray-900 min-h-screen">
        <AuthorsListHeader />

        {loading && <Loading />}
        {(appErr || serverErr) && (
          <div className="text-center text-red-500 text-2xl">
            {appErr || serverErr}
          </div>
        )}

        <div className="container px-4 mx-auto">
          {users?.length <= 0 ? (
            <div className="flex justify-center items-center">
              <div className="w-full lg:w-3/12 flex px-4 mb-6 lg:mb-0">
                <p className="text-sm font-medium">No authors found</p>
              </div>
            </div>
          ) : (
            users?.map((user) => <AuthorsListItem user={user} key={user._id} />)
          )}
        </div>
      </section>
    </>
  );
};

export default AuthorsList;
