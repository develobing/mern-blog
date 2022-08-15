import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchCategoriesAction } from '../../redux/slices/category/categorySlices';

const CategoryDropdown = (props) => {
  const dispatch = useDispatch();
  const { categories, loading, appErr, serverErr } = useSelector(
    (state) => state.category
  );
  const [initialValue, setInitialValue] = useState({ label: '', value: '' });

  const allCategories = categories?.map((category) => {
    return {
      label: category?.title,
      value: category?._id,
    };
  });

  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  useEffect(() => {
    if (categories?.length > 0) {
      const targetCategory = categories?.find(
        (category) => category?.title === props?.value
      );

      setInitialValue({
        label: targetCategory?.title,
        value: targetCategory?._id,
      });
    }
  }, [categories, props]);

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
          value={initialValue}
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
