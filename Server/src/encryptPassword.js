const bcrypt = require('bcrypt');

const plainPassword = "prueba1234567"; // La contraseña en texto plano
bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
    if (err) throw err;
    console.log(hashedPassword); // Imprime la contraseña encriptada en la consola
});
