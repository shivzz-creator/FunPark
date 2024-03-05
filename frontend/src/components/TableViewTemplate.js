// Inside TableViewTemplate.js
import React from 'react';
import { StyledTableCell, StyledTableRow } from './styles';
import { Table, TableBody, TableContainer, TableHead, TablePagination } from '@mui/material';

const TableViewTemplate = ({ columns, rows }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    return (
        <>
            <TableContainer >
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <StyledTableRow>
                            {columns.map((column, index) => (
                                <StyledTableCell
                                    key={index}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, fontWeight: column.id === 'title' ? 'bold' : 'normal' }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column, index) => {
                                        const value = row[column.id];
                                        return (
                                            <StyledTableCell
                                                key={index}
                                                align={column.align}
                                                style={{
                                                    fontWeight: column.id === 'title' ? 'bold' : 'normal',
                                                }}
                                            >
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </StyledTableCell>
                                        );
                                    })}
                                </StyledTableRow>
                            ))}
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
    );
};

export default TableViewTemplate;
