import { useState } from "react";
import axios from "axios";
import ExportDropdown from "./ExportDropdown";

export default function App() {
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const getPeople = async () => {
    setIsLoading(true);
    let nextPage = true;
    let page = 1;
    const fullData = [];
    while (nextPage) {
      const response = await axios.get(
        `https://swapi.dev/api/people?page=${page}`
      );
      fullData.push(...response.data.results);
      if (response.data.next === null) nextPage = false;
      else page++;
    }
    setPeople(fullData);
    setIsLoading(false);
    const dataCSV = {
      column: ["name", "gender"],
      data: fullData.map((item) => [item.name, item.gender]),
    };

    const dataExcel = fullData.map((item) => ({
      Name: item.name,
      Gender: item.gender,
    }));

    return { dataExcel, dataCSV };
  };

  return (
    <div className="App">
      <ExportDropdown
        label="People"
        callback={getPeople}
        filename="people"
        loading={isLoading}
        exportDropdown={{
          val: showDropdown,
          set: () => setShowDropdown(!showDropdown),
        }}
      />
      <button onClick={getPeople}>Get People</button>
      <ul>
        {people?.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
