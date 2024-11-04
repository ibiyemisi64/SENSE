import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import CollectionsIcon from '@mui/icons-material/Collections';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Toolbar.css'

function Toolbar() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (

    <List
    className="list-group"
    >
      <ListItemButton>
        <ListItemText primary="Current Status: Available" className="toolbarFont" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary="Edit" className="toolbarFont" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <CollectionsIcon />
        </ListItemIcon>
        <ListItemText primary="Template Gallery" className="toolbarFont"/>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <VisibilityIcon />
        </ListItemIcon>
        <ListItemText primary="Preview" className="toolbarFont"/>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <LinkIcon />
        </ListItemIcon>
        <ListItemText primary="Image Link" className="toolbarFont"/>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" className="toolbarFont"/>
      </ListItemButton>
    </List>
  );
}

export default Toolbar;