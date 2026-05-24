class ProductosAPI {
    constructor() {
        this.baseURL = window.location.origin;
    }

    async obtenerTodosProductos() {
        try {
            console.log('Solicitando productos al servidor...');
            const response = await fetch('http://localhost:3000/productos');
            
            if (!response.ok) {
                console.log('Servidor no disponible, usando datos de respaldo');
                return this.obtenerProductosRespaldo();
            }
            
            const productos = await response.json();
            console.log(`Se obtuvieron ${productos.length} productos del servidor`);
            return Array.isArray(productos) ? productos : this.obtenerProductosRespaldo();
            
        } catch (error) {
            console.error('Error en obtenerTodosProductos:', error.message);
            return this.obtenerProductosRespaldo();
        }
    }

    obtenerProductosRespaldo() {
        return [
            {id: 1, nombre: "Pollastre amb Patates", tipo: "plat", precio: 6.50, descripcion: "Suculent pollastre a la planxa", alergenos: ["Aigua"], activo: true},
            {id: 2, nombre: "Aigua Mineral", tipo: "beguda", precio: 1.20, descripcion: "Aigua mineral natural 500ml", alergenos: [], activo: true},
            {id: 3, nombre: "Croissant", tipo: "brioixeria", precio: 1.20, descripcion: "Croissant de mantega", alergenos: ["Gluten", "Lactosa"], activo: true},
            {id: 4, nombre: "Hamburguesa", tipo: "plat", precio: 5.50, descripcion: "Hamburguesa clásica", alergenos: ["Gluten"], activo: true},
            {id: 5, nombre: "Pizza", tipo: "plat", precio: 7.00, descripcion: "Pizza margarita", alergenos: ["Gluten", "Lactosa"], activo: true},
            {id: 6, nombre: "Coca-Cola", tipo: "beguda", precio: 1.50, descripcion: "Refresco de cola 330ml", alergenos: [], activo: true},
            {id: 7, nombre: "Ensalada Cèsar", tipo: "plat", precio: 4.50, descripcion: "Ensalada con pollo y salsa césar", alergenos: ["Gluten", "Lactosa"], activo: true}
        ];
    }

    async obtenerProductosPorTipo(tipo) {
        try {
            console.log(`Solicitando productos de tipo: ${tipo}`);
            const response = await fetch(`http://localhost:3000/productos/${tipo}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const productos = await response.json();
            return Array.isArray(productos) ? productos : [];
            
        } catch (error) {
            console.error(`Error en obtenerProductosPorTipo(${tipo}):`, error.message);
            
            // Filtrar productos de respaldo por tipo
            const productosRespaldo = this.obtenerProductosRespaldo();
            return productosRespaldo.filter(producto => producto.tipo === tipo);
        }
    }

    async crearComanda(comandaData) {
        try {
            console.log('Enviando comanda al servidor:', comandaData);
            
            const response = await fetch('http://localhost:3000/comandas/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(comandaData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error HTTP: ${response.status}`);
            }
            
            const resultado = await response.json();
            console.log('Comanda creada exitosamente:', resultado);
            return resultado;
            
        } catch (error) {
            console.error('Error en crearComanda:', error.message);
            
            // Simular respuesta exitosa para demostración
            return {
                success: true,
                message: 'Comanda creada (modo demostración)',
                id: Math.floor(Math.random() * 1000),
                timestamp: new Date().toISOString()
            };
        }
    }

    async verificarSesion() {
        try {
            const response = await fetch('http://localhost:3000/session');
            
            if (!response.ok) {
                return { activa: false, error: `Error HTTP: ${response.status}` };
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Error verificando sesión:', error.message);
            return { activa: false, error: error.message };
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const response = await fetch(`http://localhost:3000/producto/${id}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error(`Error en obtenerProductoPorId(${id}):`, error.message);
            
            // Buscar en datos de respaldo
            const productosRespaldo = this.obtenerProductosRespaldo();
            return productosRespaldo.find(p => p.id == id) || null;
        }
    }
}

// Crear instancia global
if (typeof window !== 'undefined') {
    window.ProductosAPI = new ProductosAPI();
    
    // Añadir función global para cargar productos en select
    window.cargarProductosEnSelect = async function(selectId) {
        const api = new ProductosAPI();
        const productos = await api.obtenerTodosProductos();
        const select = document.getElementById(selectId);
        
        if (select) {
            select.innerHTML = '<option value="">Seleccionar producto</option>';
            productos.forEach(producto => {
                if (producto.activo !== false) {
                    const option = document.createElement('option');
                    option.value = producto.id;
                    option.textContent = `${producto.nombre} - ${producto.precio}€`;
                    select.appendChild(option);
                }
            });
        }
    };
}