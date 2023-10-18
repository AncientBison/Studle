import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

function InfoDialog(properties) {
  const { open, setOpen, title, content, mainTheme } = properties;

  return (
    <Dialog
      open={open}
      fullWidth
      onClose={() => setOpen(false)}
      sx={{
        width: '100%',
      }}
      PaperProps={{
        style: {
          backgroundColor: mainTheme.palette.popup.main,
          border: '2px solid ' + mainTheme.palette.popup.border,
        },
      }}
    >
      <DialogTitle
        sx={{ fontWeight: 'bold', color: mainTheme.palette.popup.contrastText }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ height: 'max(15em, max-content)' }}>
        {content}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          autoFocus
          sx={{
            textTransform: 'none',
          }}
          onClick={() => setOpen(false)}
        >
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { InfoDialog };
