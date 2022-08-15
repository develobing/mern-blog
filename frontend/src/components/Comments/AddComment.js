export default function AddComment() {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* Form start here */}
      <form className="mt-1 flex max-w-sm m-auto">
        {/* Description */}
        <input
          type="text"
          name="text"
          id="text"
          className="shadow-sm focus:ring-indigo-500  mr-2 focus:border-indigo-500 block w-full p-2 border-1 sm:text-sm border-gray-300 rounded-md"
          placeholder="Add New comment"
        />
        {/* submit btn */}
        <button
          type="submit"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>

      <div className="text-red-400 mb-2 mt-2">
        {/* {formik.touched.description && formik.errors.description} */}errors
        here
      </div>
    </div>
  );
}
