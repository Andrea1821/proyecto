require('dotenv').config();
const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();

// Middlewaresapp.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configurar carpeta de archivos estáticos (public)
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MySQL usando Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

// Verificar la conexión a la base de datos
sequelize.authenticate()
    .then(() => console.log('Conectado a MySQL'))
    .catch(err => console.error('Error de conexión a MySQL:', err.message));

// Definir el modelo de Usuario
const User = sequelize.define('Usuarios', {
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo_electronico: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Usuarios',
    timestamps: false,
});

// Definir el modelo de Rol
const Role = sequelize.define('Roles', {
    rol_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Roles',
    timestamps: false,
});

// Sincronizar el modelo con la base de datos
sequelize.sync()
    .then(() => console.log('Modelos sincronizados'))
    .catch(err => console.error('Error sincronizando modelos:', err.message));

// Importar y usar el módulo de autenticación
try {
    const authRoutes = require('./auth')(sequelize);
    app.use('/api', authRoutes);
    console.log('Rutas de autenticación cargadas correctamente.');
} catch (err) {
    console.error('Error al cargar las rutas de autenticación:', err.message);
}

// Rutas para vistas HTML
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'login-register.html'));
    } catch (err) {
        console.error('Error al enviar el archivo HTML de login-register:', err.message);
        res.status(500).send('Error del servidor al cargar la página de login/register.');
    }
});

// Ruta de prueba
app.get('/productos', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'productos.html'));
    } catch (err) {
        console.error('Error al enviar el archivo HTML de productos:', err.message);
        res.status(500).send('Error del servidor al cargar la página de productos.');
    }
});

// Ruta para la página de inicio (después del registro/login)
app.get('/inicio', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'index.html'));
    } catch (err) {
        console.error('Error al enviar el archivo HTML de inicio:', err.message);
        res.status(500).send('Error del servidor al cargar la página de inicio.');
    }
});

// Rutas adicionales para las vistas HTML creadas previamente
app.get('/shop', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'shop.html'));
    } catch (err) {
        console.error('Error al enviar el archivo HTML de shop:', err.message);
        res.status(500).send('Error del servidor al cargar la página de tienda.');
    }
});

app.get('/accounts', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'accounts.html'));
    } catch (err) {
        console.error('Error al enviar el archivo HTML de accounts:', err.message);
        res.status(500).send('Error del servidor al cargar la página de cuentas.');
    }
});

app.get('/compare', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'compare.html'));
    } catch (err) {
        console.error('Error al enviar el archivo HTML de compare:', err.message);
        res.status(500).send('Error del servidor al cargar la página de comparación.');
    }
});

app.get('/whishlist', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'whishlist.html'));
    } catch (err) {
        console.error('Error al enviar el archivo HTML de whishlist:', err.message);
        res.status(500).send('Error del servidor al cargar la página de lista de deseos.');
    }
});

app.get('/cart', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'cart.html'));
    } catch (err) {
        console.error('Error al enviar el archivo HTML de cart:', err.message);
        res.status(500).send('Error del servidor al cargar la página del carrito.');
    }
});

app.get('/checkout', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'checkout.html'));
    } catch (err) {
        console.error('Error al enviar el archivo HTML de checkout:', err.message);
        res.status(500).send('Error del servidor al cargar la página de pago.');
    }
});


// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
