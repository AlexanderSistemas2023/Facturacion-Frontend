import Swal from 'sweetalert2';

export const showAlertError = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonText: 'Aceptar',
  });
};

export const showAlertInfo = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: "info",
    confirmButtonText: 'Aceptar',
  });
};


export const showAlertExito = (title, text) => {
  Swal.fire({
    title,
    text,
    timer: 3000,
    icon: 'success',
    confirmButtonText: 'Aceptar',
  });
};


export const showConfirmAlert = async (title, html) => {
  const result = await Swal.fire({
    title,
    html,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
    reverseButtons: true, 
  });

  return result.isConfirmed; 
};
