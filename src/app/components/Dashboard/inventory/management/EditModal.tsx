
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type Resource = {
  id: number,
  name: string,
  type: string,
  quantity: number,
  unit: string,
  lowThreshold: number
}

type EditModalProps = {
  open: boolean,
  handleClose: () => void
  mode: 'add' | 'edit';
  activeResource: Resource | null;
  onSubmit: (resource: Resource) => void;
}

const EditModal: React.FC<EditModalProps> = ({ open, handleClose, mode, activeResource,onSubmit }) => {
  const [formData, setFormData] = React.useState({
    id: activeResource?.id || Date.now(),
    name: activeResource?.name || '',
    type: activeResource?.type || '',
    quantity: activeResource?.quantity || 0,
    unit: activeResource?.unit || '',
    lowThreshold: activeResource?.lowThreshold || 0,
  })
  React.useEffect(() => {
    if (mode === 'edit' && activeResource) {
      setFormData(activeResource);
    } else {
      setFormData({
        id: Date.now(),
        name: '',
        type: '',
        quantity: 0,
        unit: '',
        lowThreshold: 0,
      });
    }
  }, [mode, activeResource]);

  const handleSubmit = () => {
    onSubmit(formData);
    handleClose();
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'lowThreshold' ? Number(value) :value
    }))
  }
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {mode === 'edit' ? 'Edit Resource' : 'Add New Resource'}
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          select
          fullWidth
          margin="normal"
          label="Category"
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <MenuItem value="Equipment">Equipment</MenuItem>
          <MenuItem value="Consumable">Consumable</MenuItem>
          <MenuItem value="Medication">Medication</MenuItem>
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          type="number"
          label="Quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          type="number"
          label="Low Stock Threshold"
          name="lowThreshold"
          value={formData.lowThreshold}
          onChange={handleChange}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#3BA1AF', color: 'white' }}>
            {mode === 'edit' ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default EditModal