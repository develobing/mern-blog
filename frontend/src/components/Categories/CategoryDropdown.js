import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchCategoriesAction } from '../../redux/slices/category/categorySlices';

const CategoryDropdown = (props) => {
  const dispatch = useDispatch();
  const { categories, loading, appErr, serverErr } = useSelector(
    (state) => state.category
  );
  const allCategories = categories?.map((category) => {
    return {
      label: category?.title,
      value: category?._id,
    };
  });

  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  const handleChange = (value) => {
    const { label } = value;

    props?.onChange('category', label);
  };

  const handleBlur = () => {
    props?.onBlur('category', true);
  };

  return (
    <div>
      {loading ? (
        <h3 className="text-base text-green-600">Loading...</h3>
      ) : (
        <Select
          id="category"
          options={allCategories}
          onChange={handleChange}
          onBlur={handleBlur}
          value={props?.value?.label}
        />
      )}

      {/* Display Error */}
      {props?.touched && props?.error && (
        <h3 className="text-base text-red-600">{props?.error}</h3>
      )}
    </div>
  );
};

export default CategoryDropdown;
