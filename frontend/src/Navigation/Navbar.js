import React from 'react';
import { useSelector } from 'react-redux';
import PublicNavbar from './Public/PublicNavbar';
import PrivateNavbar from './Private/PrivateNavbar';
import AdminNavbar from './Admin/AdminNavbar';

const Navbar = () => {
  const { userAuth } = useSelector((state) => state.users);
  const isAdmin = userAuth?.isAdmin;

  return (
    <div>
      {!userAuth ? (
        <PublicNavbar />
      ) : isAdmin ? (
        <AdminNavbar />
      ) : (
        <PrivateNavbar />
      )}
    </div>
  );
};

export default Navbar;
