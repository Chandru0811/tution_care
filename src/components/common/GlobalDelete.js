import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Dialog, DialogActions, DialogTitle, Slide } from "@mui/material";
import api from "../../config/URL";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function GlobalDelete({
  path,
  onDeleteSuccess,
  onOpen,
  handleCenterChanged
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // useEffect(() => {
  //   if (deleteDialogOpen && typeof onOpen === "function") {
  //     console.log("Dialog opened, calling onOpen");
  //     onOpen(); // Only call onOpen when dialog is open
  //   }
  // }, [deleteDialogOpen, onOpen]);

  // Handle dialog open
  const handleOpenDialog = () => {
    setDeleteDialogOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    if (typeof onOpen === "function") onOpen();
    setDeleteDialogOpen(false);
    document.body.style.overflow = "";
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(path);
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        toast.success(response.data.message);
        console.log("response.data.message",response.data.message)
        onDeleteSuccess();
        if(handleCenterChanged){
          handleCenterChanged()
        }
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.warning(error?.response?.data?.message);
      }
    } finally {
      handleCloseDialog(); // Close the dialog after deletion
    }
  };

  return (
    <>
      <p
        className="text-start mb-0 menuitem-style"
        style={{ whiteSpace: "nowrap", width: "100%" }}
        onClick={handleOpenDialog} // Open dialog
      >
        Delete
      </p>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog} // Close dialog and reset scroll
        TransitionComponent={Transition} // Add Transition Component
        keepMounted // Keep mounted for smoother transitions
        sx={{
          "& .MuiDialog-paper": {
            margin: "0 auto",
            top: "10%",
            position: "absolute",
          },
        }}
      >
        <DialogTitle>Are you sure you want to delete this record?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outline-secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="danger">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default GlobalDelete;
