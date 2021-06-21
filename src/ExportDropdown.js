import React, { useEffect } from "react";
import styled from "styled-components";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from "reactstrap";
import { CSVLink } from "react-csv";
import XLSX from "xlsx";
import ExportPDF from "./ExportPDF";
import "bootstrap/dist/css/bootstrap.min.css";

const exportLists = ["PDF", "CSV", "Excel"];

const CustomButtonDropdown = styled(ButtonDropdown)`
  background-color: #fbb12f;
  border: none;
  border-radius: 10px;
  outline: none;

  .button-dropdown__custom:focus {
    outline: none;
    box-shadow: none;
  }

  .button-dropdown__custom {
    color: #ffffff;
  }
`;

const ExportDropdown = (props) => {
  const { isLoading, exportDropdown, label, callback, filename } = props;
  const csvRef = React.useRef();
  const [csv, setcsv] = React.useState([]);

  useEffect(() => {
    return () => {
      setcsv([]);
    };
  }, []);

  const exportData = async (type) => {
    const { dataExcel, dataCSV } = await callback(type);
    if (type === "excel") {
      const ws = XLSX.utils.json_to_sheet(dataExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "People");
      return XLSX.writeFile(wb, `${filename}.xlsx`);
    } else if (type === "csv") {
      setcsv([dataCSV.column, ...dataCSV.data]);
      setTimeout(() => csvRef.current.link.click());
    } else if (type === "pdf") ExportPDF({ type, ...dataCSV, filename });
  };

  return (
    <>
      <CSVLink
        data={csv}
        className="d-none"
        filename={`${filename}.csv`}
        ref={csvRef}
      />

      <CustomButtonDropdown
        isOpen={isLoading ? false : exportDropdown.val}
        toggle={exportDropdown.set}
        color="primary"
      >
        <DropdownToggle
          color="transparent"
          className="button-dropdown__custom"
          caret
        >
          <div className="text d-none d-lg-block px-lg-3">
            {isLoading ? "Loading ..." : `EXPORT ${label} AS`}
          </div>
        </DropdownToggle>
        <DropdownMenu>
          {exportLists.map((type, index) => (
            <DropdownItem
              onClick={exportData.bind(this, type.toLowerCase())}
              key={index}
            >
              {type}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </CustomButtonDropdown>
    </>
  );
};

export default ExportDropdown;
