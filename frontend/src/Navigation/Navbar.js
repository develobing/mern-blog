import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PublicNavbar from './Public/PublicNavbar';
import PrivateNavbar from './Private/PrivateNavbar';
import AdminNavbar from './Admin/AdminNavbar';
import AccountVerificationAlert from './Alerts/AccountVerificationAlert';
import AccountVerificationSentEmail from './Alerts/AccountVerificationSentEmail';

const Navbar = () => {
  const { userAuth, isSentVerifyToken } = useSelector((state) => state.users);
  const { _id, isAccountVerified, isAdmin } = userAuth || {};
  const [isAlertOpen, setIsAlertOpen] = useState(true);

  useEffect(() => {
    if (isSentVerifyToken) setTimeout(() => setIsAlertOpen(false), 3000);
  }, [isSentVerifyToken]);

  useEffect(() => {
    if (_id) setIsAlertOpen(true);
  }, [_id]);

  return (
    <div>
      {!userAuth ? (
        <PublicNavbar />
      ) : isAdmin ? (
        <AdminNavbar />
      ) : (
        <PrivateNavbar />
      )}

      {userAuth && !isAccountVerified && isAlertOpen ? (
        !isSentVerifyToken ? (
          <AccountVerificationAlert />
        ) : (
          <AccountVerificationSentEmail />
        )
      ) : null}
    </div>
  );
};

export default Navbar;
