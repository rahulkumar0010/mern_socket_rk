import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ITEM_HEIGHT = 20;

const MoreMenu = ({
  anchorEl,
  handleClick,
  handleClose,
  options,
  optionHandler,
}) => {
  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={anchorEl ? "long-menu" : undefined}
        aria-expanded={anchorEl ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon style={{ color: "#aebac1" }} />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={anchorEl}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            // selected={option === "None"}
            onClick={optionHandler}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default MoreMenu;
