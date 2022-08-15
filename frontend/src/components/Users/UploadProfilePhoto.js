import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UploadIcon } from '@heroicons/react/outline';
import {
  refreshTokenAction,
  uploadProfilePhotoAction,
  resetUserAction,
} from '../../redux/slices/users/usersSlices';
import Loading from '../../utils/Loading';

// Css for dropzone
const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

// Form schema
const formSchema = Yup.object({
  image: Yup.mixed().required('Image is required'),
});

export default function UploadProfilePhoto() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userAuth, loading, appErr, serverErr, isUpdated } = useSelector(
    (state) => state.users
  );
  const [profilePhoto, setProfilePhoto] = useState(userAuth?.profilePhoto);

  // formik
  const formik = useFormik({
    initialValues: {
      image: null,
    },

    onSubmit: (values) => {
      dispatch(uploadProfilePhotoAction(values?.image));
    },

    validationSchema: formSchema,
  });

  const previewImage = (selectedFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      setProfilePhoto(reader.result);
    };
  };

  useEffect(() => {
    if (isUpdated) {
      history.push(`/profile/${userAuth?._id}`);
      dispatch(refreshTokenAction());
      dispatch(resetUserAction());
    }
  }, [isUpdated]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
          Upload profile photo
        </h2>

        {/* Display err here */}
        {loading && <Loading />}
        {(appErr || serverErr) && (
          <div className="text-red-500 text-center">{appErr || serverErr}</div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <img className="w-full" src={profilePhoto} alt="profilePhoto" />

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Image container here thus Dropzone */}
            <Container className="container bg-gray-700">
              <Dropzone
                onBlur={formik.handleBlur('image')}
                accept="image/jpeg, image/png"
                onDrop={(acceptedFiles) => {
                  formik.setFieldValue('image', acceptedFiles[0]);
                  previewImage(acceptedFiles[0]);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="container">
                    <div
                      {...getRootProps({
                        className: 'dropzone',
                        onDrop: (event) => event.stopPropagation(),
                      })}
                    >
                      <input {...getInputProps()} />
                      <p className="text-gray-300 text-lg cursor-pointer hover:text-gray-500">
                        Click here to select image
                      </p>
                    </div>
                  </div>
                )}
              </Dropzone>
            </Container>

            <div className="text-red-500">
              {formik.touched.image && formik.errors.image}
            </div>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF minimum size 400kb uploaded only 1 image
            </p>

            <div>
              <button
                type="submit"
                className="inline-flex justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <UploadIcon
                  className="-ml-1 mr-2 h-5  text-gray-400"
                  aria-hidden="true"
                />
                <span>Upload Photo</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
