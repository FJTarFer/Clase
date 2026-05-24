const express = require('express');
const path = require('path');
const connection = require('./db');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/html', express.static(path.join(__dirname, 'html')));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'admin_dashboard.html'));
});

app.get('/user_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'user_dashboard.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

app.get('/login_admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login_admin.html'));
});

app.get('/registre', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'registre.html'));
});

app.get('/gestioProductes', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'gestioProductes.html'));
});

app.get('/formulari_plat', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'formulari_plat.html'));
});

app.get('/alta_pedido', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'alta_pedido.html'));
});

app.get('/llista_usuaris', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'llista_usuaris.html'));
});

app.get('/llista_comandas', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'llista_comandas.html'));
});

app.get('/editar_comanda', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'editar_comanda.html'));
});

app.get('/carta_client', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'carta_client.html'));
});

app.get('/alergenos', (req, res) => {
    const sql = 'SELECT id, alergeno as nombre, descripcion FROM alergenos WHERE activo = 1 ORDER BY alergeno';
    
    connection.query(sql, (err, results) => {
        if (err) {
            const alergenosEstaticos = [
                { id: 1, nombre: 'Gluten', descripcion: 'Cereales que contienen gluten' },
                { id: 2, nombre: 'Lácteos', descripcion: 'Leche y productos lácteos' },
                { id: 3, nombre: 'Huevos', descripcion: 'Huevos y productos derivados' },
                { id: 4, nombre: 'Pescado', descripcion: 'Pescado y productos derivados' },
                { id: 5, nombre: 'Cacahuetes', descripcion: 'Cacahuetes y productos derivados' }
            ];
            return res.json(alergenosEstaticos);
        }
        res.json(results);
    });
});

app.get('/productos', (req, res) => {
    const sql = `
        SELECT p.*, 
               GROUP_CONCAT(DISTINCT a.alergeno) as alergenos_nombres,
               GROUP_CONCAT(DISTINCT a.id) as alergenos_ids
        FROM productos p
        LEFT JOIN producto_alergenos pa ON p.id = pa.producto_id
        LEFT JOIN alergenos a ON pa.alergeno_id = a.id
        WHERE p.activo = 1
        GROUP BY p.id
        ORDER BY p.tipo, p.nombre
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener productos' });
        }

        const productos = results.map(producto => {
            const alergenosArray = [];
            if (producto.alergenos_nombres) {
                const nombres = producto.alergenos_nombres.split(',');
                const ids = producto.alergenos_ids ? producto.alergenos_ids.split(',') : [];
                
                nombres.forEach((nombre, index) => {
                    alergenosArray.push({
                        id: ids[index] || null,
                        nombre: nombre.trim()
                    });
                });
            }

            return {
                id: producto.id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                tipo: producto.tipo,
                imagen: producto.imagen,
                activo: producto.activo,
                alergenos: alergenosArray
            };
        });

        res.json(productos);
    });
});

app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio, tipo, imagen, alergenos } = req.body;
    
    if (!nombre || !precio || !tipo) {
        return res.status(400).json({ error: 'Nombre, precio y tipo son obligatorios' });
    }
    
    const sqlProducto = `
        INSERT INTO productos (nombre, descripcion, precio, tipo, imagen) 
        VALUES (?, ?, ?, ?, ?)
    `;
    
    connection.query(sqlProducto, [nombre, descripcion, precio, tipo, imagen], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear producto' });
        }
        
        const productoId = result.insertId;
        
        if (alergenos && Array.isArray(alergenos) && alergenos.length > 0) {
            const valores = alergenos.map(alergenoId => [productoId, alergenoId]);
            const sqlAlergenos = 'INSERT INTO producto_alergenos (producto_id, alergeno_id) VALUES ?';
            
            connection.query(sqlAlergenos, [valores], (err) => {
                if (err) {
                }
                res.json({ 
                    success: true, 
                    id: productoId,
                    message: 'Producto creado con alérgenos'
                });
            });
        } else {
            res.json({ 
                success: true, 
                id: productoId,
                message: 'Producto creado sin alérgenos'
            });
        }
    });
});

app.post('/usuarios/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Falten dades obligatòries' });
    }

    const sql = 'SELECT id, nom, email, rol FROM usuario WHERE email = ? AND password = ?';
    connection.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar sessió' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Email o contrasenya incorrectes' });
        }

        const usuario = results[0];

        const expires = new Date(Date.now() + 60 * 60 * 1000);
        res.cookie('session', JSON.stringify({
            id: usuario.id,
            nom: usuario.nom,
            email: usuario.email,
            rol: usuario.rol
        }), { expires, httpOnly: true });

        res.json({
            success: true,
            usuario: {
                id: usuario.id,
                nom: usuario.nom,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    });
});

app.post('/usuarios/registro', (req, res) => {
    const { nom, cognoms, email, password, rol } = req.body;

    if (!nom || !cognoms || !email || !password || !rol) {
        return res.status(400).json({ error: 'Falten dades obligatòries' });
    }

    const emailRegex = /^[\w-.]+@[\w-]+\.[a-z]{2,7}$/i;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Format d\'email invàlid' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'La contrasenya ha de tenir almenys 8 caràcters, una majúscula i un número' });
    }

    const validRoles = ['alumne', 'personal', 'admin'];
    if (!validRoles.includes(rol)) {
        return res.status(400).json({ error: 'Rol no vàlid' });
    }

    const checkSql = 'SELECT id FROM usuario WHERE email = ?';
    connection.query(checkSql, [email], (err, checkResults) => {
        if (err) {
            return res.status(500).json({ error: 'Error al verificar l\'email' });
        }

        if (checkResults.length > 0) {
            return res.status(400).json({ error: 'Aquest correu electrònic ja està registrat' });
        }

        const insertSql = 'INSERT INTO usuario (nom, cognoms, email, password, rol) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertSql, [nom, cognoms, email, password, rol], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al crear usuari' });
            }
            res.status(201).json({
                success: true,
                mensaje: 'Usuari creat correctament',
                id: result.insertId
            });
        });
    });
});

app.get('/usuarios/sesion', (req, res) => {
    try {
        if (!req.cookies.session) {
            return res.json({ activa: false });
        }

        const session = JSON.parse(req.cookies.session);
        res.json({
            activa: true,
            id: session.id,
            nom: session.nom,
            email: session.email,
            rol: session.rol
        });
    } catch (error) {
        res.json({ activa: false });
    }
});

app.post('/usuarios/logout', (req, res) => {
    res.clearCookie('session');
    res.json({ success: true, mensaje: 'Sessió tancada correctament' });
});

app.get('/productos/:tipo', (req, res) => {
    const tipo = req.params.tipo;
    const tiposValidos = ['plat', 'beguda', 'snack', 'brioixeria'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({ error: 'Tipo de producto no válido' });
    }

    const sql = 'SELECT * FROM productos WHERE tipo = ? AND activo = 1 ORDER BY nombre';

    connection.query(sql, [tipo], (err, results) => {
        if (err) {
            return res.status(500).json({ error: `Error al obtener productos de tipo ${tipo}` });
        }

        const productos = results.map(producto => {
            try {
                return {
                    ...producto,
                    alergenos: producto.alergenos ? JSON.parse(producto.alergenos) : []
                };
            } catch (parseError) {
                return {
                    ...producto,
                    alergenos: []
                };
            }
        });

        res.json(productos);
    });
});

app.get('/producto/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID de producto no válido' });
    }

    const sql = 'SELECT * FROM productos WHERE id = ? AND activo = 1';

    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el producto' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const producto = results[0];
        try {
            producto.alergenos = producto.alergenos ? JSON.parse(producto.alergenos) : [];
        } catch (parseError) {
            producto.alergenos = [];
        }

        res.json(producto);
    });
});

app.get('/producto/:id/salsas', (req, res) => {
    const id = parseInt(req.params.id);

    const sql = `
        SELECT s.* FROM salsas s
        JOIN producto_salsas ps ON s.id = ps.salsa_id
        WHERE ps.producto_id = ? AND s.activo = 1
    `;

    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener salsas' });
        }
        res.json(results);
    });
});

app.get('/salsas', (req, res) => {
    const sql = 'SELECT * FROM salsas WHERE activo = 1';
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener salsas' });
        }
        res.json(results);
    });
});

app.post('/comandas/clientes', (req, res) => {
    const { id_usuario, productos, total, estado } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ error: 'La comanda debe contener al menos un producto' });
    }

    if (!total || isNaN(total) || total <= 0) {
        return res.status(400).json({ error: 'Total no válido' });
    }

    const sql = `
        INSERT INTO comandes_clientes (id_usuario, productos, total, estado) 
        VALUES (?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [
            id_usuario || null,
            JSON.stringify(productos),
            parseFloat(total).toFixed(2),
            estado || 'pendent'
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar la comanda' });
            }

            res.status(201).json({
                success: true,
                mensaje: 'Comanda creada correctamente',
                id: result.insertId,
                total: total
            });
        }
    );
});

app.get('/comandas/usuario/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID de usuario no válido' });
    }

    const sql = 'SELECT * FROM comandes_clientes WHERE id_usuario = ? ORDER BY fecha DESC LIMIT 5';

    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener comandas' });
        }

        const comandas = results.map(comanda => {
            try {
                return {
                    ...comanda,
                    productos: comanda.productos ? JSON.parse(comanda.productos) : []
                };
            } catch (parseError) {
                return {
                    ...comanda,
                    productos: []
                };
            }
        });

        res.json(comandas);
    });
});

app.get('/comandas/hoy', (req, res) => {
    const hoy = new Date().toISOString().split('T')[0];
    const sql = `
        SELECT COUNT(*) as count, SUM(total) as total 
        FROM comandes_clientes 
        WHERE DATE(fecha) = ? AND estado = 'completat'
    `;

    connection.query(sql, [hoy], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener estadísticas' });
        }

        res.json({
            count: results[0].count || 0,
            total: results[0].total || 0
        });
    });
});

app.get('/productos/estadisticas', (req, res) => {
    const sql = `
        SELECT 
            tipo,
            COUNT(*) as cantidad,
            MIN(precio) as precio_min,
            MAX(precio) as precio_max,
            AVG(precio) as precio_promedio
        FROM productos 
        WHERE activo = 1 
        GROUP BY tipo
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener estadísticas' });
        }

        res.json(results);
    });
});

app.get('/usuarios/activos', (req, res) => {
    const sql = 'SELECT COUNT(*) as count FROM usuario';

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener estadísticas' });
        }

        res.json({
            count: results[0].count || 0
        });
    });
});

app.get('/session', (req, res) => {
    if (!req.cookies.session) {
        return res.json({ activa: false });
    }

    try {
        const session = JSON.parse(req.cookies.session);
        res.json({
            activa: true,
            id: session.id,
            rol: session.rol
        });
    } catch (error) {
        res.json({ activa: false });
    }
});

app.get('/usuarios/lista', (req, res) => {
    const sql = 'SELECT id, nom, cognoms, email, rol FROM usuario';
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
        res.json(results);
    });
});

app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nom, cognoms, email, rol } = req.body;

    if (!nom || !cognoms || !email || !rol) {
        return res.status(400).json({ error: 'Falten dades obligatòries' });
    }

    const sql = 'UPDATE usuario SET nom = ?, cognoms = ?, email = ?, rol = ? WHERE id = ?';
    connection.query(sql, [nom, cognoms, email, rol, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar usuario' });
        }
        res.json({ success: true });
    });
});

app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM usuario WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar usuario' });
        }
        res.json({ success: true });
    });
});

app.patch('/usuarios/:id/estado', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    let activo = 1;
    if (estado === 'inactiu') activo = 0;

    const sql = 'UPDATE usuario SET activo = ? WHERE id = ?';
    connection.query(sql, [activo, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar estado' });
        }
        res.json({ success: true });
    });
});

app.get('/comandas/lista', (req, res) => {
    const sql = `
        SELECT 
            cc.id,
            cc.estado,
            cc.total,
            cc.productos,
            DATE(cc.fecha) as fecha,
            TIME(cc.fecha) as hora,
            u.nom as cliente_nombre
        FROM comandes_clientes cc
        LEFT JOIN usuario u ON cc.id_usuario = u.id
        ORDER BY cc.fecha DESC
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener comandas' });
        }
        if (!results || results.length === 0) {
            return res.json([]);
        }

        const comandas = results.map(comanda => {
            let productosArray = [];
            let productosTexto = '';
            
            if (comanda.productos) {
                if (comanda.productos.startsWith('[') || comanda.productos.startsWith('{')) {
                    try {
                        const parsed = JSON.parse(comanda.productos);
                        if (Array.isArray(parsed)) {
                            productosArray = parsed;
                            productosTexto = parsed.map(p => {
                                if (typeof p === 'object') {
                                    return `${p.cantidad || 1}x ${p.nombre || p.nom || 'Producte'}`;
                                }
                                return p;
                            }).join(', ');
                        } else {
                            productosArray = [parsed];
                            productosTexto = JSON.stringify(parsed);
                        }
                    } catch (e) {
                        productosTexto = comanda.productos;
                        productosArray = [{ nombre: comanda.productos, cantidad: 1 }];
                    }
                } else {
                    productosTexto = comanda.productos;
                    productosArray = [{ nombre: comanda.productos, cantidad: 1 }];
                }
            }
            let clienteNombre = 'Client no registrat';
            if (comanda.cliente_nombre) {
                clienteNombre = comanda.cliente_nombre;
            }
            
            return {
                id: comanda.id || 0,
                cliente_nombre: clienteNombre,
                productos: productosArray, 
                productos_texto: productosTexto, 
                total: parseFloat(comanda.total) || 0,
                estado: comanda.estado || 'pendent',
                fecha: comanda.fecha || '',
                hora: comanda.hora ? comanda.hora.substring(0, 5) : ''
            };
        });

        res.json(comandas);
    });
});

app.delete('/comandas/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'DELETE FROM comandes_clientes WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar la comanda' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comanda no encontrada' });
        }
        
        res.json({ success: true });
    });
});

app.get('/comandas/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = `
        SELECT 
            cc.*,
            u.nom as cliente_nombre
        FROM comandes_clientes cc
        LEFT JOIN usuario u ON cc.id_usuario = u.id
        WHERE cc.id = ?
    `;
    
    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la comanda' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Comanda no encontrada' });
        }
        
        const comanda = results[0];
        
        try {
            comanda.productos = comanda.productos ? JSON.parse(comanda.productos) : [];
        } catch (e) {
            comanda.productos = [];
        }
        
        res.json(comanda);
    });
});

app.put('/comandas/:id', (req, res) => {
    const { id } = req.params;
    const { estado, productos, total } = req.body;
    
    const sql = `
        UPDATE comandes_clientes 
        SET estado = ?, productos = ?, total = ?
        WHERE id = ?
    `;
    
    connection.query(sql, [
        estado,
        JSON.stringify(productos),
        total,
        id
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar la comanda' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comanda no encontrada' });
        }
        
        res.json({ success: true });
    });
});

app.get('/plats-combinats', (req, res) => {
    const sql = 'SELECT id, nombre, descripcion, precio, activo FROM plats_combinats WHERE activo = 1 ORDER BY nombre';
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener platos combinados' });
        }
        res.json(results);
    });
});

app.get('/plats-combinats/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID no válido' });
    }

    const sql = 'SELECT id, nombre, descripcion, precio, activo FROM plats_combinats WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener plato' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }
        res.json(results[0]);
    });
});

app.post('/plats-combinats', (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    
    if (!nombre || !precio) {
        return res.status(400).json({ 
            error: 'El nombre y el precio son obligatorios' 
        });
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
        return res.status(400).json({ 
            error: 'El precio debe ser un número positivo' 
        });
    }

    const sql = 'INSERT INTO plats_combinats (nombre, descripcion, precio) VALUES (?, ?, ?)';
    
    connection.query(sql, [nombre, descripcion, precioNum], (err, result) => {
        if (err) {
            return res.status(500).json({ 
                error: 'Error al crear el plato combinado'
            });
        }
        
        res.status(201).json({ 
            success: true, 
            id: result.insertId,
            message: 'Plato combinado creado correctamente'
        });
    });
});

app.put('/plats-combinats/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, descripcion, precio, activo } = req.body;
    
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID no válido' });
    }

    if (!nombre || precio === undefined) {
        return res.status(400).json({ 
            error: 'El nombre y el precio son obligatorios' 
        });
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
        return res.status(400).json({ 
            error: 'El precio debe ser un número positivo' 
        });
    }

    const sql = 'UPDATE plats_combinats SET nombre = ?, descripcion = ?, precio = ?, activo = ? WHERE id = ?';
    
    connection.query(sql, [nombre, descripcion, precioNum, activo || 1, id], (err, result) => {
        if (err) {
            return res.status(500).json({ 
                error: 'Error al actualizar el plato'
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }
        
        res.json({ 
            success: true,
            message: 'Plato combinado actualizado correctamente'
        });
    });
});

app.delete('/plats-combinats/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID no válido' });
    }

    const sql = 'UPDATE plats_combinats SET activo = 0 WHERE id = ?';
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ 
                error: 'Error al eliminar el plato'
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }
        
        res.json({ 
            success: true,
            message: 'Plato combinado eliminado correctamente'
        });
    });
});

app.patch('/plats-combinats/:id/estado', (req, res) => {
    const id = parseInt(req.params.id);
    const { activo } = req.body;
    
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID no válido' });
    }

    if (activo === undefined) {
        return res.status(400).json({ error: 'El estado es obligatorio' });
    }

    const sql = 'UPDATE plats_combinats SET activo = ? WHERE id = ?';
    
    connection.query(sql, [activo ? 1 : 0, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cambiar estado' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }
        
        res.json({ 
            success: true,
            message: `Plato ${activo ? 'activado' : 'desactivado'} correctamente`
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});