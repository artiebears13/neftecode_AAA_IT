import {parse} from "papaparse";

export const CsvTable = ({fileText, filename, handleDownload}) => {
    try {
        // Resolve the Promise to get the CSV data

        // Parse CSV data
        console.log("file")
        const csvData = parse(fileText).data;
        console.log('csvData ', csvData);

        // Extract first five lines or less if file is shorter
        // const header = csvData[0];
        const header = ['ID', 'Результат'];
        const dataRows = csvData.slice(1, 5);

        // Convert to table format
        const table = (
            <div className="table-container">
                <div className="table-header">
                    <h3 className="text-center">Результат</h3>
                    <div className="table-header__download">
                        <code>{filename}</code>
                        <button className="btn" onClick={handleDownload}><i
                            className="fa-solid fa-download"></i></button>
                    </div>
                </div>
                <table className="table table-striped" style={{backgroundColor: "transparent"}}>
                    <thead>
                    <tr>
                        {header.map((cell, cellIndex) => (
                            <th key={cellIndex} scope="col">{cell}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>{/* Table body */}
                    {dataRows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <th scope="row">
                                {row[0]}
                            </th>
                            <td>{row[1]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );

        return table;
    } catch (error) {
        console.error('Error parsing CSV data:', error);
        return null; // Return null if an error occurs
    }
};
