import React, { useEffect, useState } from 'react'
import { StyledTableCell, StyledTableRow } from './styles';
import { Table, TableBody, TableContainer, TableHead, TablePagination } from '@mui/material';





const TableTemplate = ({ buttonHaver: ButtonHaver, columns, rows, flag }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [zoneValue, setzoneValue] = useState([]);
    useEffect(() => {
        for (let i = 0; i < rows.length; i++) {
            zoneValue.push(rows[i].sclassName);
        }
    }, [])

    const changeHandler = (event, index) => {
        console.log(event.target.value);
        var newarr = zoneValue;
        newarr[index] = event.target.value;
        console.log(newarr[index]);
        setzoneValue(newarr);
    }

    const handleSave = () => {

    }
    return (
        <>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <StyledTableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                            <StyledTableCell align="center">
                                Actions
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, indexr) => {


                                return (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];

                                            return (
                                                <>
                                                    {
                                                        (column.id !== "editZone") ?
                                                            (<StyledTableCell key={column.id} align={column.align}>
                                                                {
                                                                    column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value
                                                                }
                                                            </StyledTableCell>) :
                                                            (<StyledTableCell key={column.id} align={column.align}>
                                                                {
                                                                    <select
                                                                        onChange={event => changeHandler(event, indexr)}>
                                                                        <option value={zoneValue[indexr]}>Select zone</option>
                                                                        {value.map((classItem, index) => (
                                                                            <option key={index} value={classItem} >
                                                                                {classItem}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                }
                                                            </StyledTableCell>)
                                                    }
                                                </>
                                            );
                                        })}
                                        <StyledTableCell>
                                            {/* {flag && (
                                                <button onClick={handleSave}>
                                                    saveZone
                                                </button>
                                            )} */}
                                            <ButtonHaver row={row} />
                                        </StyledTableCell>
                                        {/* <StyledTableCell align="center">
                                            
                                        </StyledTableCell> */}
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 5));
                    setPage(0);
                }}
            />
        </>
    )
}

export default TableTemplate