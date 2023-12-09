import React, { useEffect, useState } from 'react'
import { StyledTableCell, StyledTableRow } from './styles';
import { Table, TableBody, TableContainer, TableHead, TablePagination } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateStudentFields } from '../redux/studentRelated/studentHandle';



const TableTemplate = ({ buttonHaver: ButtonHaver, columns, rows, flag }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [zoneValue, setzoneValue] = useState([]);
    const [indexValue, setindexValue] = useState(0);

    const dispatch = useDispatch();
    // const [rows2, setRows] = useState(rows);

    useEffect(() => {
        for (let i = 0; i < rows.length; i++) {
            zoneValue.push(rows[i].sclassName);
        }
    }, [])

    // console.log(rows);
    const changeHandler = (event, index) => {
        // console.log(event.target.value);
        var newarr = zoneValue;
        newarr[index] = event.target.value;
        // console.log(newarr[index]);
        setzoneValue(newarr);
        setindexValue(index);
    }


    const handleSave = (e, index) => {
        // e.preventDefault();
        dispatch(updateStudentFields(rows[index].id, { sclassName: zoneValue[index] }, "updateStudentZone"))
          .then(() => {
              // Reload the page when the save is successful
              window.location.reload();
          });
    }
    return (
        <>
            <TableContainer sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',

            }}>
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
                    <TableBody >
                        {rows
                             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, indexr) => {
                                return (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <StyledTableCell key={column.id} align={column.align}>
                                                    {column.id === 'isChecked' ? (
                                                        <input type="checkbox" checked={value} readOnly />
                                                    ) : column.id === 'editZone' ? (
                                                        <select onChange={event => changeHandler(event, indexr)}>
                                                            <option value={zoneValue[indexr]}>Select zone</option>
                                                            {value.map((classItem, index) => (
                                                                <option key={index} value={classItem}>
                                                                    {classItem}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                    {column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value}
                                                                </span>
                                                    )}
                                                </StyledTableCell>
                                            );
                                        })}
                                        <StyledTableCell>
                                            {flag && (
                                                <button onClick={event => handleSave(event, indexr)}>
                                                    saveZone
                                                </button>
                                            )}
                                            <ButtonHaver row={row} />
                                        </StyledTableCell>
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
                    setRowsPerPage(parseInt(event.target.value, 100));
                    setPage(0);
                }}
            />
        </>
    )
}

export default TableTemplate