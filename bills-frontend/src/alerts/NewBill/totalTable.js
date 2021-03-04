import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 200,
    },
});

export default function TotalTable(props) {
    const classes = useStyles();
    const [quantity, setQuantity] = useState('0');
    const [amount, setAmount] = useState('0');

    useEffect(() => {
        var quantity_sum = 0;
        var amount_sum = 0;
        props.items.map((element) => {
            quantity_sum += Number(element['quantity']);
            amount_sum += Number(element['amount']);
        });
        setQuantity(quantity_sum.toString());
        setAmount(amount_sum.toString());
        props.updateTotalAmount(amount_sum, quantity_sum);
    }, [props.items]);

    return (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <TableContainer style={{ width: '500px' }} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center">Items</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="center">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                    <TableRow>
                        <TableCell component="th" align="center" scope="row">
                                Total : 
                        </TableCell>
                            <TableCell align="center">{props.items.length}</TableCell>
                            <TableCell align="center">{quantity}</TableCell>
                            <TableCell align="center">Rs. {amount}</TableCell>
                    </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}