import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Popup from '../../../components/Popup';
import { BlueButton } from '../../../components/buttonStyles';
import { useDispatch, useSelector } from 'react-redux';
// import bg from '../../assets/bg3.jpeg';
import { addStuff } from '../../../redux/userRelated/userHandle';

const InventoryRequest = () => {
    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [number, setNumber] = useState("");

    const dispatch = useDispatch();
    const { status, currentUser, error } = useSelector(state => state.user);
    //  console.log("currentUserInInventoryRequestpage",currentUser);

    const user = currentUser._id
    const school = currentUser._id
    const address = "Inventory";

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        itemName,
        category,
        quantity,
        price,
        school,
        number
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address)); // Update with your Redux action
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false);
            setShowPopup(true);
            setMessage("Done Successfully");
        } else if (error) {
            setLoader(false);
            setShowPopup(true);
            setMessage("Network Error");
        }
    }, [status, error]);
    // backgroundImage: `url(${bg})`,
    return (
        <div style={{ backgroundSize: 'cover', minHeight: '100vh' }}>
            <Box
                sx={{
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        maxWidth: 550,
                        px: 3,
                        py: '100px',
                        width: '100%'
                    }}
                >
                    <div >
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            <Typography variant="h4">Inventory Request </Typography>
                        </Stack>
                        <form onSubmit={submitHandler}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Item Name"
                                    type="text"
                                    value={itemName}
                                    onChange={(event) => setItemName(event.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Category"
                                    type="text"
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={(event) => setQuantity(event.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    value={price}
                                    onChange={(event) => setPrice(event.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Mobile Number"
                                    type="number"
                                    value={number}
                                    onChange={(event) => setNumber(event.target.value)}
                                    required
                                />
                            </Stack>
                            <BlueButton
                                fullWidth
                                size="large"
                                sx={{ mt: 3 }}
                                variant="contained"
                                type="submit"
                                disabled={loader}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Submit Request"}
                            </BlueButton>
                        </form>
                    </div>
                </Box>
            </Box>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default InventoryRequest;
