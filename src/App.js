import { useState } from "react";
import axios from "axios";
import ExportDropdown from "./ExportDropdown";
import { DataMaster } from "./DataMaster";
import {
  FormControlLabel,
  FormGroup,
  FormControl,
  Checkbox,
  FormLabel,
} from "@material-ui/core";

export default function App() {
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [stateMaster, setStateMaster] = useState(DataMaster);

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
      column: stateMaster
        .filter((master) => master.active)
        .map((master) => master.header),
      data: fullData.map((item) => {
        return stateMaster
          .filter((master) => master.active)
          .map((master) => item[master.value]);
      }),
    };

    const dataExcel = fullData.map((item) => {
      const objectData = {};
      stateMaster
        .filter((master) => master.active)
        .map((master) => {
          objectData[master.header] = item[master.value];
          return master;
        });
      return objectData;
    });

    console.log(dataExcel);

    return { dataExcel, dataCSV };
  };

  const getPeopleNoExport = async () => {
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
  };

  const handleMasterChange = (event) => {
    let copyMaster = [...stateMaster];

    copyMaster = copyMaster.map((master) => {
      if (event.target.name === master.value)
        return Object.assign({}, master, { active: event.target.checked });
      return master;
    });

    setStateMaster(copyMaster);
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
      <button onClick={getPeopleNoExport}>Get People</button>
      <div>
        <FormControl component="fieldset">
          <FormLabel>Set Master Data</FormLabel>
          <FormGroup>
            {stateMaster.map((master) => (
              <FormControlLabel
                key={master.value}
                label={master.header}
                control={
                  <Checkbox
                    checked={master.active}
                    name={master.value}
                    onChange={handleMasterChange}
                  />
                }
              />
            ))}
          </FormGroup>
        </FormControl>
      </div>
      <table>
        <thead>
          <tr>
            {stateMaster.map(
              (master, index) =>
                master.active && <td key={index}>{master.header}</td>
            )}
          </tr>
        </thead>
        <tbody>
          {people.map((item, index) => (
            <tr key={index}>
              {stateMaster.map(
                (master, index) =>
                  master.active && (
                    <td key={`${item[master.value]}-${index}`}>
                      {item[master.value]}
                    </td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
