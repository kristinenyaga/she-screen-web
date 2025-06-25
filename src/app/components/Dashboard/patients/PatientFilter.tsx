const PatientFilter = () => {
  return (
    <div className="w-[90%] bg-white my-6 font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or phone"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none border-gray-200 text-sm"
        />

        <select className="w-full px-4 py-3 border rounded-lg focus:outline-none border-gray-200 text-sm">
          <option value="">All Risk Levels</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select className="w-full px-4 py-3 border rounded-lg focus:outline-none border-gray-200 text-sm">
          <option value="">All Statuses</option>
          <option value="Screened">Screened</option>
          <option value="Referred">Referred</option>
          <option value="Unreachable">Unreachable</option>
        </select>
      </div>
    </div>
  );
};

export default PatientFilter;