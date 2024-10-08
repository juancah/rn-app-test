const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Leer el token del header
  const token = req.header("x-auth-token");

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ message: "No hay token, permiso denegado" });
  }

  // Validar el token
  try {
    const decoded = jwt.verify(token, "secretTokenKey"); // Cambia "secretTokenKey" por tu clave secreta
    req.user = decoded.user;
    next(); // Pasar al siguiente middleware o controlador
  } catch (err) {
    res.status(401).json({ message: "Token no válido" });
  }
};
