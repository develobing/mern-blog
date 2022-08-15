/* This example requires Tailwind CSS v2.0+ */
import { useDispatch } from 'react-redux';
import { verifyTokenAction } from '../../redux/slices/users/usersSlices';
import { ExclamationIcon } from '@heroicons/react/solid';

export default function AccountVerificationAlertWarning() {
  const dispatch = useDispatch();

  const sendToken = () => {
    dispatch(verifyTokenAction());
  };

  return (
    <div className="bg-red-500 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon
            className="h-5 w-5 text-yellow-500"
            aria-hidden="true"
          />
        </div>

        <div className="ml-3">
          <p className="text-sm text-yellow-200">
            Your account is not verified.{' '}
            <button
              className="font-medium underline text-green-200 hover:text-yellow-600"
              onClick={sendToken}
            >
              Click this link to verify
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
