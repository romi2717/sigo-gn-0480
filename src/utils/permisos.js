
const permisosRoles = {
  Comandante: 7,
  Oficial: 6,
  Analista: 4
};

export function tienePermiso(rolUsuario, accionRequerida) {
  const permisos = permisosRoles[rolUsuario] || 0;

  return (permisos & accionRequerida) === accionRequerida;
}
