// LÓGICA DE CONVERSOR DE MONEDAS
// Variables y constantes de elementos del DOM
const data = {};
const input = document.getElementById("amountClp");
const select = document.getElementById("select");
const btn = document.getElementById("btn");
const result = document.getElementById("resultConv");
const errorElement = document.getElementById("error");

// Función para obtener valores de la API
const fetchCurrencyValues = async () => {
    try {
        const res = await Promise.all([fetch("https://mindicador.cl/api/dolar"), fetch("https://mindicador.cl/api/euro")]);

        const [valuesUSD, valuesEUR] = await Promise.all(res.map((r) => r.json()));

        // Asignar valores a las variables data de Dólar y Euro
        data.usd = valuesUSD.serie[0].valor;
        data.eur = valuesEUR.serie[0].valor;
    } catch (e) {
        console.error("Error al obtener los valores de conversión:", e);
        errorElement.innerHTML = "Se ha producido un error al obtener los valores de conversión.";
    }
};

// Función para convertir monedas y mostrar resultado en el DOM
const convertCurrency = () => {
    const amountCLP = parseFloat(input.value);
    if (isNaN(amountCLP) || amountCLP <= 0) {
        errorElement.textContent = "Por favor, ingresa un monto válido mayor a cero.";
        return;
    }
    // Limpiar el mensaje de error si el monto es válido
    errorElement.textContent = "";
    const selectedCurrency = select.value;
    let convertedAmount = 0;
    if (selectedCurrency === "usd") {
        convertedAmount = amountCLP / data.usd;
        result.textContent = `$${convertedAmount.toFixed(2)}`;
    } else if (selectedCurrency === "eur") {
        convertedAmount = amountCLP / data.eur;
        result.textContent = `€${convertedAmount.toFixed(2)}`;
    }
};

// Evento del botón para convertir monedas
btn.addEventListener("click", convertCurrency);

// Llamado a la función fetchCurrencyValues para obtener los valores de la API
fetchCurrencyValues();

// LÓGICA DE GRÁFICO DE DÓLAR Y EURO
// Función para obtener los valores de la API y renderizar el gráfico
const getGraphic = async () => {
    try {
        const res = await Promise.all([fetch("https://mindicador.cl/api/dolar"), fetch("https://mindicador.cl/api/euro")]);

        const [dataDolar, dataEuro] = await Promise.all(res.map((r) => r.json()));

        // Obtener los valores de los últimos 10 días
        const daysDolar = dataDolar.serie.slice(0, 10);
        const daysEuro = dataEuro.serie.slice(0, 10);

        // Obtener los valores y fechas de los últimos 10 días
        const valuesDolar = daysDolar.map((item) => item.valor);
        const valuesEuro = daysEuro.map((item) => item.valor);
        const dates = daysDolar.map((item) => item.fecha);

        // Gráfico
        const options = {
            series: [
                {
                    name: "Dólar",
                    data: valuesDolar,
                },
                {
                    name: "Euro",
                    data: valuesEuro,
                },
            ],
            chart: {
                height: 350,
                type: "line",
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            title: {
                text: "Valor del Dólar y Euro en los últimos 10 días",
                align: "left",
            },
            grid: {
                row: {
                    colors: ["#f3f3f3", "transparent"],
                    opacity: 0.5,
                },
            },
            xaxis: {
                categories: dates,
            },
        };
        // Instanciar el gráfico con ApexCharts
        const chart = new ApexCharts(document.querySelector("#chart"), options);

        // Renderizar el gráfico
        chart.render();
    } catch (error) {
        console.error("Error al obtener los valores de la API:", error);
        errorElement.innerHTML = "Se ha producido un error al obtener los valores.";
    }
};

// Llamado a la función getGraphic para renderizar el gráfico
getGraphic();
