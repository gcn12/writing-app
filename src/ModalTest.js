import {
    Menu,
    MenuList,
    MenuButton,
    MenuItem,
    MenuLink,
  } from "@reach/menu-button";
  import "@reach/menu-button/styles.css";

const ModalTest = () => {
    return(
        <Menu>
        <MenuButton>Actions</MenuButton>
        <MenuList>
            <MenuItem onSelect={()=> null}>Download</MenuItem>
            <MenuLink to="view">View</MenuLink>
        </MenuList>
    </Menu>
    )
}

export default ModalTest