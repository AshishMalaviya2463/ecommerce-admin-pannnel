import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Formik, Form, useFormik } from 'formik';
import * as yup from 'yup';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const Product = () => {

  const [openDlg, setOpenDlg] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState([]);
  const [params, setParams] = useState();
  const [update, setUpdate] = useState(false);

  const handleClickOpen = () => {
    setOpenDlg(true);
    formik.resetForm()
  };

  const handleClose = () => {
    setOpenDlg(false);
  };

  let schema = yup.object().shape({
    name: yup.string().required("Please Enter Name"),
    price: yup.number().required("Please Enter Price"),
    quantity: yup.number().required("Please Enter Quantity"),
    color: yup.string().required("Please Enter Color"),
  })

  const loadData = () => {
    let localD = JSON.parse(localStorage.getItem('products'));
    if (localD !== null) {
      setData(localD);
    }
  }


  const addData = (value) => {
    let localData = JSON.parse(localStorage.getItem("products"));
    value = {
      id: Math.floor(Math.random() * 1000),
      ...value
    }

    if (localData === null) {
      localStorage.setItem('products', JSON.stringify([value]))
    } else {
      localData.push(value);
      localStorage.setItem('products', JSON.stringify(localData))
    }

    loadData();
  }

  const updData = (val) => {
    let localD = JSON.parse(localStorage.getItem('products'));

    localD.map((data) => {
      if (data.id === val.id) {
        data.name = val.name;
        data.price = val.price;
        data.quantity = val.quantity;
        data.color = val.color;
      }
    })

    localStorage.setItem('products', JSON.stringify(localD));
    loadData();
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      quantity: '',
      color: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      update ? updData(values) : addData(values);
    },
    enableReinitialize: true,
  });

  const { handleSubmit, handleBlur, errors, touched, handleChange, values } = formik;


  const handleDelete = () => {
    let localData = JSON.parse(localStorage.getItem('products'));
    let fData = localData.filter((d) => d.id !== params.id);
    localStorage.setItem('products', JSON.stringify(fData));
    setData(fData);

    handleAlertClose();
    loadData();
  }

  const columns = [
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'price', headerName: 'Price', width: 130 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    { field: 'color', headerName: 'color', width: 130 },
    {
      field: 'action', headerName: 'Action',
      renderCell: (params) => (
        <>
          <IconButton aria-label="delete" onClick={() => {
            setUpdate(true);
            handleClickOpen();
            formik.setValues(params.row);
          }}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => {
            setOpen(true);
            setParams(params);
          }}>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];



  useEffect(() => {
    loadData();
  }, [])


  const handleAlertClose = () => {
    setOpen(false);
  };

  return (
    <>
      <h1>Products</h1>
      <div>
        <Button variant="outlined" onClick={() => {
          setUpdate(false);
          handleClickOpen();
        }} sx={{ marginBottom: '20px' }}>
          Add Products
        </Button>
        <Dialog fullWidth open={openDlg} onClose={handleClose}>
          <DialogTitle> {update ? 'Update Products' : 'Add Products'}</DialogTitle>
          <Formik values={formik}>
            <Form onSubmit={handleSubmit}>
              <DialogContent>
                <TextField
                  value={values.name}
                  margin="dense"
                  name="name"
                  label="Add Products Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.name && touched.name ? <p className="error">{errors.name}</p> : ''}
                <TextField
                  value={values.price}
                  margin="dense"
                  name="price"
                  label="Add Price"
                  type="number"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.price && touched.price ? <p className="error">{errors.price}</p> : ''}

                <TextField
                  value={values.quantity}
                  margin="dense"
                  name="quantity"
                  label="Add Quantity"
                  type="number"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.quantity && touched.quantity ? <p className="error">{errors.quantity}</p> : ''}

                <TextField
                  value={values.color}
                  margin="dense"
                  name="color"
                  label="Add Color"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.color && touched.color ? <p className="error">{errors.color}</p> : ''}

              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {
                  update ? <Button onClick={() => {
                    handleClose();
                  }} type='submit'>Update</Button>
                    : <Button onClick={handleClose} type='submit'>Submit</Button>
                }
              </DialogActions>
            </Form>
          </Formik>
        </Dialog>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Sure ! You Want to Delete ?'}
        </DialogTitle>
        <DialogContent>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertClose}>No</Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Product
