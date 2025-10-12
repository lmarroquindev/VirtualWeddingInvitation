// ========================================================
// Vue App principal (vue-app.js)
// ========================================================

// Importa funciones del objeto Vue global
const { createApp, ref, onMounted } = Vue;

// Crea la aplicación Vue y la monta sobre #app-container
const app = createApp({
    setup() {
        // Estado reactivo para guardar los datos del API
        const dataList = ref([]);

        // Función que obtiene los datos desde el endpoint
        const fetchData = async () => {
            try {
                const response = await fetch('http://bodamarroquinrodriguezapi.runasp.net/api/Prueba');

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();

                // Mapeamos la respuesta
                dataList.value = data.map(item => ({
                    id: item.id,
                    nombre: item.nombre
                }));

                console.log('✅ Datos recibidos:', dataList.value);
            } catch (error) {
                console.error('❌ Error al obtener datos:', error);
            }
        };

        // Ejecutar fetch al montar la app
        onMounted(() => {
            console.log('🚀 App Vue montada, solicitando datos...');
            fetchData();
        });

        // Retorna el estado (por ahora solo dataList)
        return { dataList };
    }
});

// Montar Vue sobre el contenedor principal
app.mount('#app-container');
