interface FilterProps {
  filterText: string;
  setFilterText: (value: string) => void;
  riskFilter: string;
  setRiskFilter: (value: string) => void;
}

const PatientFilter = ({ filterText, setFilterText, riskFilter, setRiskFilter }: FilterProps) => {
  return (
    <div className="w-full bg-white my-6 font-poppins">
      <div className="grid grid-cols-1 text-base text-gray-700 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none border-gray-200"
        />
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none border-gray-200 text-base text-gray-700"
        >
          <option value="">All Risk Levels</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  );
};

export default PatientFilter;
