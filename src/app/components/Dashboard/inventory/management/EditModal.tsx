import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';
const style = {
  position: 'absolute' as const,
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
  resource_type: string,
  classification: string,
  quantity: number,
  unit: string,
  lowThreshold: number
}

type EditModalProps = {
  open: boolean,
  handleClose: () => void,
  mode: 'add' | 'edit';
  activeResource: Resource | null;
  onSubmit: (resource: Resource) => void;
}

const EditModal: React.FC<EditModalProps> = ({ open, handleClose, mode, activeResource, onSubmit }) => {
  const [formData, setFormData] = React.useState<Resource>({
    id: activeResource?.id || Date.now(),
    name: activeResource?.name || '',
    resource_type: activeResource?.resource_type || '',
    classification: activeResource?.classification || '',
    quantity: activeResource?.quantity || 0,
    unit: activeResource?.unit || '',
    lowThreshold: activeResource?.lowThreshold || 0,
  });

  React.useEffect(() => {
    if (mode === 'edit' && activeResource) {
      setFormData(activeResource);
    } else {
      setFormData({
        id: Date.now(),
        name: '',
        resource_type: '',
        classification: '',
        quantity: 0,
        unit: '',
        lowThreshold: 0,
      });
    }
  }, [mode, activeResource]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: name === 'quantity' || name === 'lowThreshold' ? Number(value) : value
    }));
  };
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    onSubmit(formData);
    handleClose();
  };

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

        <FormControl fullWidth margin="normal">
          <InputLabel id="type-label">Resource Type</InputLabel>
          <Select
            labelId="type-label"
            name="resource_type"
            value={formData.resource_type}
            label="Resource Type"
            onChange={handleSelectChange}
          >
            <MenuItem value="CONSUMABLE">Consumable</MenuItem>
            <MenuItem value="REUSABLE">Reusable</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="classification-label">Classification</InputLabel>
          <Select
            labelId="classification-label"
            name="classification"
            value={formData.classification}
            label="Classification"
            onChange={handleSelectChange}
          >
            <MenuItem value="PHARMACOLOGICAL">Pharmacology</MenuItem>
            <MenuItem value="NON_PHARMACOLOGICAL">Non-Pharmacology</MenuItem>
          </Select>
        </FormControl>

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
  );
};

export default EditModal;
