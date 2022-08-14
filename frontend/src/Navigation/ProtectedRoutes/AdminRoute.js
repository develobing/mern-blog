import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ component: Component, ...props }) => {
  const { userAuth } = useSelector((state) => state.users);

  return (
    <Route
      {...props}
      render={() =>
        userAuth?.isAdmin ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default AdminRoute;
