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


