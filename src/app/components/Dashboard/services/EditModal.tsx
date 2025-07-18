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

type Service = {
  id: number,
  name: string,
  slug: string,
  category: 'screening' | 'vaccination' | string;
}

type ServiceCost = {
  id: number,
  service_id: number,
  base_cost: number,
  nhif_covered: boolean,
  out_of_pocket: number,
  insurance_copay_amount: number,
}

type EditModalProps = {
  open: boolean,
  handleClose: () => void,
  mode: 'add' | 'edit';
  activeCost: ServiceCost | null;
  services: Service[];
  onSubmit: (cost: ServiceCost) => void;
}

const EditServiceCostModal: React.FC<EditModalProps> = ({ open, handleClose, mode, activeCost, services, onSubmit }) => {
  const [formData, setFormData] = React.useState<ServiceCost>({
    id: Date.now(),
    service_id: services[0]?.id || 0,
    base_cost: 0,
    nhif_covered: false,
    out_of_pocket: 0,
    insurance_copay_amount: 0
  });

  React.useEffect(() => {
    if (mode === 'edit' && activeCost) {
      setFormData(activeCost);
    } else {
      setFormData({
        id: Date.now(),
        service_id: services[0]?.id || 0,
        base_cost: 0,
        nhif_covered: false,
        out_of_pocket: 0,
        insurance_copay_amount: 0
      });
    }
  }, [mode, activeCost, services]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'service_id' || name === 'base_cost' || name === 'out_of_pocket' || name === 'insurance_copay_amount' ? Number(value) : value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    handleClose();
  };

  console.log(activeCost)

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {mode === 'edit' ? 'Edit Service Cost' : 'Add New Service Cost'}
        </Typography>

        <TextField
          select
          fullWidth
          margin="normal"
          label="Service"
          name="service_id"
          value={formData.service_id}
          onChange={handleChange}
        >
          {services.map((service) => (
            <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          label="Base Cost"
          type="number"
          name="base_cost"
          value={formData.base_cost}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Out-of-Pocket Cost"
          type="number"
          name="out_of_pocket"
          value={formData.out_of_pocket}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Insurance Co-pay"
          type="number"
          name="insurance_copay_amount"
          value={formData.insurance_copay_amount}
          onChange={handleChange}
        />

        <Box mt={2}>
          <label>
            <input
              type="checkbox"
              name="nhif_covered"
              checked={formData.nhif_covered}
              onChange={handleChange}
            />{' '}
            NHIF Covered
          </label>
        </Box>

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

export default EditServiceCostModal;